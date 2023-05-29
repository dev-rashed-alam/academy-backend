const Course = require("../models/Course");
const { setCommonError } = require("../utilities/commonErrors");
const { allowedFileTypes } = require("../utilities/helpers");
const {
  removeDirectory,
  removeUploadedFile,
} = require("../utilities/removeUploadedFileOrFolder");
const { isCourseAlreadyPurchased } = require("./purchaseController");

const processUploadedFiles = async (files, customVideoInfos) => {
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
      if (allowedFileTypes.thumbnail.includes(item.mimetype)) {
        materials.images.push({
          url: process.env.APP_URL + pathName,
          name: item.originalname,
          filename: item.filename,
        });
      } else {
        materials.attachments.push({
          url: process.env.APP_URL + pathName,
          name: item.originalname,
          filename: item.filename,
        });
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
    let videoInfos = req.body?.videoInfos || [];
    const files = await processUploadedFiles(req.files, videoInfos);
    let postData = {
      ...req.body,
      courseRootPath: req.courseRootPath,
      thumbnail: files.thumbnail,
      materials: files.materials,
    };
    if (req.body.courseType === "custom") {
      postData.videos = files.videos;
      postData.totalVideos = files.videos?.length;
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
  ];
  next();
};

const generateCourseFilters = (req, res, next) => {
  const { search } = req.query;
  if (search) {
    req.filterQuery = {
      title: { $regex: search, $options: "i" },
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

const findAllCourses = async (req, res, next) => {
  try {
    res.status(200).json(res.data);
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const generateFilterFieldsForMyCourses = (req, res, next) => {
  const { loggedInUser } = req;
  const { search } = req.query;
  let query = { students: loggedInUser.id };
  if (search) {
    query = { ...query, title: { $regex: search, $options: "i" } };
  }
  req.filterQuery = query;
  next();
};

const findAllOfMyCourses = async (req, res, next) => {
  try {
    res.status(200).json(res.data);
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const findCourseById = async (req, res, next) => {
  try {
    const course = await Course.findOne(
      { _id: req.params.id },
      { __v: 0 }
    ).populate("categories", "name");
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
    let videoInfos = req.body?.videoInfos || [];
    const files = await processUploadedFiles(req.files, videoInfos);
    let postData = { ...req.body };
    if (files.thumbnail) {
      postData.thumbnail = files.thumbnail;
    }
    postData.categories = req.body.categoryId;
    await Course.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: postData,
        $push: {
          videos: { $each: files.videos },
          "materials.images": { $each: files.materials.images },
          "materials.attachments": { $each: files.materials.attachments },
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
    const course = await Course.findOneAndDelete({ _id: req.params.id });
    await removeDirectory(`courses/${course.courseRootPath}`);
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
    const course = await Course.findOne({ _id: req.params.id });
    const pathname = `courses/${course.courseRootPath}/videos`;
    await removeUploadedFile(filename, pathname);

    const modifiedVideos = course.videos.filter(
      (video) => video.filename !== filename
    );
    await Course.updateOne(
      { _id: req.params.id },
      { $set: { videos: modifiedVideos } }
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
    const course = await Course.findOne({ _id: req.params.id });
    const pathname = `courses/${course.courseRootPath}/materials`;
    await removeUploadedFile(filename, pathname);

    const modifiedMaterials = course.materials[materialType].filter(
      (material) => material.filename !== filename
    );

    await Course.updateOne(
      { _id: req.params.id },
      {
        $set: {
          materials: { ...course.materials, [materialType]: modifiedMaterials },
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
    let excludeFields = { ...req.excludeFields };
    if (isPurchased) {
      excludeFields = {};
    }
    const course = await Course.findOne(
      { _id: req.params.id },
      { __v: 0, ...excludeFields }
    ).populate("categories", "name");
    res.status(200).json({
      data: course,
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
  findAllOfMyCourses,
  generateCourseFilters,
};
