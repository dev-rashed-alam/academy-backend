const uploader = require("../../utilities/courseUploader");

const courseUpload = (req, res, next) => {
  const upload = uploader(req);

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

module.exports = courseUpload;
