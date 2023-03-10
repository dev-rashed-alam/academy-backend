const Course = require("../models/Course");
const { setCommonError } = require("../utilities/commonErrors");

const addNewCourse = async (req, res, next) => {
  try {
    const course = new Course(req.body);
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
    await Course.deleteOne({ _id: req.params.id });
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
