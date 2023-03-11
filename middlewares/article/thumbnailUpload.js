const uploader = require("../../utilities/singleUploader");

const thumbnailUpload = (req, res, next) => {
  const upload = uploader(
    "article/thumbnails",
    ["image/jpeg", "image/jpg", "image/png"],
    1000000,
    "Only .jpeg, .jpg or .png format allowed"
  );

  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          thumbnail: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
};

module.exports = thumbnailUpload;
