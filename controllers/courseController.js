const Course = require("../models/Course");
const { setCommonError } = require("../utilities/commonErrors");
const { allowedFileTypes } = require("../utilities/helpers");
const {
  removeDirectory,
  removeUploadedFile,
} = require("../utilities/removeUploadedFileOrFolder");

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
      thumbnail = pathName;
    }
    if (item.fieldname === "videos") {
      let videoInfo = await customVideoInfos.find(
        (info) => info.fileName === item.originalname
      );
      videos.push({
        url: pathName,
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
          url: pathName,
          name: item.originalname,
          filename: item.filename,
        });
      } else {
        materials.attachments.push({
          url: pathName,
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

const findAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}, { __v: 0 })
      .sort({ createdAt: -1 })
      .populate("categories", "name");
    res.status(200).json({
      data: courses,
      message: "successful",
    });
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

module.exports = {
  addNewCourse,
  findAllCourses,
  findCourseById,
  updateCourseById,
  deleteCourseById,
  deleteCourseVideoById,
  deleteCourseMaterialById,
};
