const Course = require("../models/Course");
const Article = require("../models/Article");
const Category = require("../models/Category");
const { setCommonError } = require("../utilities/commonErrors");

const doGlobalSearch = async (req, res, next) => {
  try {
    const { search } = req.query;
    if (search) {
      const course = await Course.find(
        { title: { $regex: search, $options: "i" } },
        {
          __v: 0,
          courseRootPath: 0,
          videos: 0,
          materials: 0,
          playlistId: 0,
          youtubeVideos: 0,
        }
      ).populate("categories", "name");
      const category = await Category.find(
        { name: { $regex: search, $options: "i" } },
        { __v: 0 }
      );
      const article = await Article.find(
        { title: { $regex: search, $options: "i" } },
        { __v: 0 }
      );
      res.status(200).json({
        course,
        article,
        category,
      });
    } else {
      setCommonError(res, "Bad Request!", 400);
    }
  } catch (error) {
    setCommonError(res, error.message, error.status);
  }
};

module.exports = {
  doGlobalSearch,
};
