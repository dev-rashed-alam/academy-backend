const express = require("express");
const authMiddleware = require("../middlewares/common/authMiddleware");
const {
  addCourseValidator,
  processCourseSecret,
} = require("../middlewares/course/courseValidator");
const validationHandler = require("../middlewares/common/validationHandler");
const {
  addNewCourse,
  findAllCourses,
  findCourseById,
  updateCourseById,
  deleteCourseById,
  deleteCourseVideoById,
  deleteCourseMaterialById,
} = require("../controllers/courseController");
const courseUpload = require("../middlewares/course/courseUpload");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  courseUpload,
  addCourseValidator,
  validationHandler,
  addNewCourse
);
router.get("/", authMiddleware, findAllCourses);
router.get("/:id", authMiddleware, findCourseById);
router.put("/:id", authMiddleware, courseUpload, updateCourseById);
router.delete("/:id", authMiddleware, deleteCourseById);

router.post("/materials/remove/:id", authMiddleware, deleteCourseMaterialById);
router.post("/videos/remove/:id", authMiddleware, deleteCourseVideoById);

module.exports = router;
