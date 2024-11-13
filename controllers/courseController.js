const Course = require("../models/Course");
const {setCommonError} = require("../utilities/commonErrors");
const {allowedFileTypes} = require("../utilities/helpers");
const {
    removeDirectory,
    removeUploadedFile,
} = require("../utilities/removeUploadedFileOrFolder");
const {isCourseAlreadyPurchased} = require("./purchaseController");
const Purchase = require("../models/Purchase")
const MCQ = require("../models/McqSchema");

const processUploadedFiles = async (files, customVideoInfos, materialInfos) => {
    let thumbnail = null;
    let videos = [];
    let materials = {
        images: [],
        attachments: [],
    };

    for (let item of files) {
        let pathName = item.path.split("/public/")[1];
        if (item.fieldname === "thumbnail") {
            thumbnail = process.env.APP_URL + pathName;
        }
        if (item.fieldname === "videos") {
            let videoInfo = await customVideoInfos.find(
                (info) => info.fileName === item.originalname
            );
            videos.push({
                url: process.env.APP_URL + pathName,
                name: item.originalname,
                filename: item.filename,
                title: videoInfo.title,
                description: videoInfo.description,
                uploadDate: new Date(),
            });
        }
        if (item.fieldname === "materials") {
            let materialInfo = await materialInfos.find(
                (info) => info.fileName === item.originalname
            );
            let newFile = {
                url: process.env.APP_URL + pathName,
                name: item.originalname,
                filename: item.filename,
                title: materialInfo.title,
                description: materialInfo.description,
                uploadDate: new Date(),
            }
            if (allowedFileTypes.thumbnail.includes(item.mimetype)) {
                materials.images.push(newFile);
            } else {
                materials.attachments.push(newFile);
            }
        }
    }

    return {
        thumbnail,
        videos,
        materials,
    };
};

const addNewCourse = async (req, res, next) => {
    try {
        let createdMCQs = []
        if (req.body?.mcqs) {
            createdMCQs = await MCQ.insertMany(JSON.parse(req.body.mcqs));
        }
        let videoInfos = req.body?.videoInfos || [];
        let materialInfos = req.body?.materialInfos || [];
        const files = await processUploadedFiles(req.files, videoInfos, materialInfos);
        let postData = {
            ...req.body,
            courseRootPath: req.courseRootPath,
            thumbnail: files.thumbnail,
            materials: files.materials,
            status: 'enable'
        };
        if (req.body?.mcqs) {
            delete postData.mcqs
        }
        if (req.body.courseType === "custom") {
            postData.videos = files.videos;
            postData.totalVideos = files.videos?.length;
        }
        if (createdMCQs.length > 0) {
            postData.mcqs = [...createdMCQs.map(mcq => mcq._id)]
        }
        const course = new Course(postData);
        course.categories = req.body.categoryId;
        await course.save();
        res.status(200).json({
            message: "successful",
        });
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
};

const generateCourseOptionalModelChain = (req, res, next) => {
    req.chainMethods = [
        {
            methodName: "populate",
            path: "categories",
            value: "name",
        },
        {
            methodName: "populate",
            path: "mcqs"
        },
    ];
    next();
};

const generateCourseFilters = (req, res, next) => {
    const {search} = req.query;
    let params = {}
    if (search) {
        params['title'] = {$regex: search, $options: "i"}
    }
    if(req.loggedInUser.role === 'student'){
        params['status'] = 'enable'
    }
    req.filterQuery = params
    next();
};

const generateCourseFiltersByCategoryId = (req, res, next) => {
    const {id} = req.params;
    if (id) {
        req.filterQuery = {
            categories: id,
        };
    }
    next();
};

const excludeFieldsFromList = (req, res, next) => {
    req.excludeFields = {
        courseRootPath: 0,
        videos: 0,
        materials: 0,
        playlistId: 0,
        youtubeVideos: 0,
    };
    next();
};

const roleWiseExcludeFields = (req, res, next) => {
    if (req.loggedInUser.role === 'student') {
        req.excludeFields = {
            courseRootPath: 0,
            videos: 0,
            materials: 0,
            playlistId: 0,
            youtubeVideos: 0,
        };
    }
    next();
};

const generateCourseIntro = (req) => {
    const {page = 1, limit = 10, search} = req.query;
    let filterQuery = {};
    if (search) {
        filterQuery.title = {$regex: search, $options: "i"};
    }
    const currentPage = page - 1;
    return Course.aggregate([
        {$match: filterQuery},
        {$limit: parseInt(limit)},
        {$skip: currentPage * limit},
        {
            $project: {
                customVideo: {$arrayElemAt: ["$videos", 0]},
                youtubeVideo: {$arrayElemAt: ["$youtubeVideos", 0]},
            },
        },
    ]).exec();
};

const mapCourseIntro = (courseIntros = [], dataset = []) => {
    return dataset.map((item) => {
        let selectedCourse = courseIntros.find((intro) =>
            intro._id.equals(item.id)
        );
        return {
            ...item._doc,
            courseIntro:
                item.courseType === "youtube"
                    ? selectedCourse?.youtubeVideo?.url || ""
                    : selectedCourse.customVideo.url || "",
            id: item.id,
            _id: undefined,
        };
    });
};

const findAllCourses = async (req, res, next) => {
    try {
        const courseIntros = await generateCourseIntro(req);
        let modifiedData = mapCourseIntro(courseIntros, res.data.data);
        res.status(200).json({...res.data, data: modifiedData});
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
};

const generateFilterFieldsForMyCourses = (req, res, next) => {
    const {loggedInUser} = req;
    const {search} = req.query;
    let query = {students: loggedInUser.id};
    if (search) {
        query = {...query, title: {$regex: search, $options: "i"}};
    }
    if(req.loggedInUser.role === 'student'){
        query['status'] = 'enable'
    }
    req.filterQuery = query;
    next();
};

const generateFilterFieldsForPopularCourses = (req, res, next) => {
    const {search} = req.query;
    let query = {students: {$exists: true, $not: {$size: 0}}};
    if (search) {
        query = {...query, title: {$regex: search, $options: "i"}};
    }
    if(req.loggedInUser.role === 'student'){
        query['status'] = 'enable'
    }
    req.filterQuery = query;
    next();
};

const generateFilterFieldsForTrendingCourses = async (req, res, next) => {

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const purchases = await Purchase.find({
        createdAt: {
            $gte: sevenDaysAgo,
            $lte: today
        }
    }).populate('courses', '_id');
    const courseIds = [];
    purchases.forEach(item => {
        courseIds.push(...item.courses.map(course => course._id));
    })

    const {search} = req.query;
    let query = {
        _id: {
            $in: courseIds
        }
    }
    if (search) {
        query = {...query, title: {$regex: search, $options: "i"}};
    }
    if(req.loggedInUser.role === 'student'){
        query['status'] = 'enable'
    }
    req.filterQuery = query;
    next();
};

const findCourseById = async (req, res, next) => {
    try {
        const course = await Course.findOne(
            {_id: req.params.id},
            {__v: 0}
        ).populate("categories", "name").populate("mcqs");
        res.status(200).json({
            data: course,
            message: "successful",
        });
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
};

const updateCourseById = async (req, res, next) => {
    try {
        let createdMCQs = []
        let postData = {...req.body};
        if (req.body?.mcqs) {
            createdMCQs = await MCQ.insertMany(JSON.parse(req.body.mcqs));
            delete postData.mcqs
        }
        let videoInfos = req.body?.videoInfos || [];
        let materialInfos = req.body?.materialInfos || [];
        const files = await processUploadedFiles(req.files, videoInfos, materialInfos);
        if (files.thumbnail) {
            postData.thumbnail = files.thumbnail;
        }
        postData.categories = req.body.categoryId;
        await Course.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set: postData,
                $push: {
                    videos: {$each: files.videos},
                    "materials.images": {$each: files.materials.images},
                    "materials.attachments": {$each: files.materials.attachments},
                    "mcqs": {$each: createdMCQs}
                },
            }
        );
        res.status(200).json({
            message: "successful",
        });
    } catch (error) {
        console.log(error);
        setCommonError(res, error.message, 500);
    }
};

const deleteCourseById = async (req, res, next) => {
    try {
        const course = await Course.findOneAndDelete({_id: req.params.id});
        removeDirectory(`courses/${course.courseRootPath}`);
        res.status(200).json({
            message: "successful",
        });
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
};

const deleteCourseVideoById = async (req, res, next) => {
    try {
        const filename = req.body.filename;
        const course = await Course.findOne({_id: req.params.id});
        const pathname = `courses/${course.courseRootPath}/videos`;
        removeUploadedFile(filename, pathname);

        const modifiedVideos = course.videos.filter(
            (video) => video.filename !== filename
        );
        await Course.updateOne(
            {_id: req.params.id},
            {$set: {videos: modifiedVideos}}
        );

        res.status(200).json({
            message: "successful",
        });
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
};

const deleteCourseMaterialById = async (req, res, next) => {
    try {
        const filename = req.body.filename;
        const materialType = req.body.materialType;
        const course = await Course.findOne({_id: req.params.id});
        const pathname = `courses/${course.courseRootPath}/materials`;
        removeUploadedFile(filename, pathname);

        const modifiedMaterials = course.materials[materialType].filter(
            (material) => material.filename !== filename
        );

        await Course.updateOne(
            {_id: req.params.id},
            {
                $set: {
                    materials: {...course.materials, [materialType]: modifiedMaterials},
                },
            }
        );

        res.status(200).json({
            message: "successful",
        });
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
};

const findCourseDetailsById = async (req, res, next) => {
    try {
        const isPurchased = await isCourseAlreadyPurchased(req, req.params.id);
        let excludeFields = {...req.excludeFields};
        delete excludeFields.videos;
        delete excludeFields.youtubeVideos;
        if (isPurchased) {
            excludeFields = {};
        }
        const course = await Course.findOne(
            {_id: req.params.id},
            {__v: 0, ...excludeFields}
        ).populate("categories", "name").populate("mcqs");
        res.status(200).json({
            data: {
                ...course._doc,
                courseIntro:
                    course.courseType === "youtube"
                        ? course.youtubeVideos?.[0]?.url
                        : course.videos?.[0]?.url || "",
                id: course.id,
                _id: undefined,
            },
            message: "successful",
        });
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
};

module.exports = {
    addNewCourse,
    findAllCourses,
    findCourseById,
    updateCourseById,
    deleteCourseById,
    deleteCourseVideoById,
    deleteCourseMaterialById,
    generateCourseOptionalModelChain,
    excludeFieldsFromList,
    findCourseDetailsById,
    generateFilterFieldsForMyCourses,
    generateCourseFilters,
    generateCourseFiltersByCategoryId,
    roleWiseExcludeFields,
    generateFilterFieldsForPopularCourses,
    generateFilterFieldsForTrendingCourses,
    generateCourseIntro,
    mapCourseIntro
};
