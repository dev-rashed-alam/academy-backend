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
} = require("../controllers/courseController");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  addCourseValidator,
  validationHandler,
  addNewCourse
);
router.get("/", authMiddleware, findAllCourses);
router.get("/:id", authMiddleware, findCourseById);
router.put("/:id", authMiddleware, updateCourseById);
router.delete("/:id", authMiddleware, deleteCourseById);

module.exports = router;
