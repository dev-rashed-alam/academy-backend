const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortTitle: {
      type: String,
      required: true,
      trim: true,
    },
    instructorName: {
      type: String,
      required: true,
      trim: true,
    },
    courseDuration: {
      type: String,
      required: true,
      trim: true,
    },
    coursePrice: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
    },
    courseType: {
      type: String,
      required: true,
      trim: true,
      enum: ["youtube", "custom"],
    },
    courseRequirements: {
      type: String,
      required: true,
    },
    courseFeatures: {
      type: String,
      required: true,
    },
    courseRootPath: {
      type: String,
    },
    courseDescription: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
      },
    ],
    videos: {
      type: Array,
    },
    materials: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
