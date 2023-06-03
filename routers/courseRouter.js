const express = require("express");
const authMiddleware = require("../middlewares/common/authMiddleware");
const { addCourseValidator } = require("../middlewares/course/courseValidator");
const validationHandler = require("../middlewares/common/validationHandler");
const {
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
  generateCourseFiltersByCategoryId,
} = require("../controllers/courseController");
const courseUpload = require("../middlewares/course/courseUpload");
const checkIsValidObjectId = require("../middlewares/common/checkIsValidObjectId");
const { doPagination } = require("../middlewares/common/paginationMiddleware");
const Course = require("../models/Course");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  courseUpload,
  addCourseValidator,
  validationHandler,
  addNewCourse
);
router.get(
  "/",
  authMiddleware,
  excludeFieldsFromList,
  generateCourseOptionalModelChain,
  generateCourseFilters,
  doPagination(Course),
  findAllCourses
);
router.get(
  "/by-category/:id",
  authMiddleware,
  excludeFieldsFromList,
  generateCourseOptionalModelChain,
  generateCourseFiltersByCategoryId,
  doPagination(Course),
  findAllCourses
);
router.get(
  "/my-courses",
  authMiddleware,
  excludeFieldsFromList,
  generateCourseOptionalModelChain,
  generateFilterFieldsForMyCourses,
  doPagination(Course),
  findAllOfMyCourses
);
router.get("/:id", authMiddleware, checkIsValidObjectId, findCourseById);
router.get(
  "/details/:id",
  authMiddleware,
  checkIsValidObjectId,
  excludeFieldsFromList,
  findCourseDetailsById
);

router.put(
  "/:id",
  authMiddleware,
  checkIsValidObjectId,
  courseUpload,
  updateCourseById
);

router.delete("/:id", authMiddleware, checkIsValidObjectId, deleteCourseById);

router.post(
  "/materials/remove/:id",
  authMiddleware,
  checkIsValidObjectId,
  deleteCourseMaterialById
);
router.post(
  "/videos/remove/:id",
  authMiddleware,
  checkIsValidObjectId,
  deleteCourseVideoById
);

module.exports = router;
