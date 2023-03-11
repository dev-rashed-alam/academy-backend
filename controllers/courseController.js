const Course = require("../models/Course");
const { setCommonError } = require("../utilities/commonErrors");
const { allowedFileTypes } = require("../utilities/helpers");
const { removeDirectory } = require("../utilities/removeUploadedFileOrFolder");

const processUploadedFiles = (files) => {
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
      videos.push({ url: pathName, name: item.originalname });
    }
    if (item.fieldname === "materials") {
      if (allowedFileTypes.thumbnail.includes(item.mimetype)) {
        materials.images.push({ url: pathName, name: item.originalname });
      } else {
        materials.attachments.push({ url: pathName, name: item.originalname });
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
    const files = processUploadedFiles(req.files);
    const course = new Course({
      ...req.body,
      courseRootPath: req.courseRootPath,
      videos: files.videos,
      materials: files.materials,
      thumbnail: files.thumbnail,
    });
    course.categories.push(req.body.categoryId);
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
    await Course.findOneAndUpdate({ _id: req.params.id }, { $set: req.body });
    res.status(200).json({
      message: "successful",
    });
  } catch (error) {
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

module.exports = {
  addNewCourse,
  findAllCourses,
  findCourseById,
  updateCourseById,
  deleteCourseById,
};
