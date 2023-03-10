const { check } = require("express-validator");

const addCourseValidator = [
  check("title").notEmpty().withMessage("Course title is required"),
  check("shortTitle").notEmpty().withMessage("Short title is required"),
  check("instructorName").notEmpty().withMessage("Instructor name is required"),
  check("courseDuration").notEmpty().withMessage("Duration is required"),
  check("coursePrice").notEmpty().withMessage("Course price is required"),
  check("categoryId").notEmpty().withMessage("Category id is required"),
  check("courseType").notEmpty().withMessage("Course upload type is required"),
  check("courseRequirements")
    .notEmpty()
    .withMessage("Course requirements is required"),
  check("courseFeatures").notEmpty().withMessage("Course features is required"),
  check("courseDescription")
    .notEmpty()
    .withMessage("Course description is required"),
];

module.exports = {
  addCourseValidator,
};