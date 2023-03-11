const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { allowedFileTypes } = require("./helpers");

const uploader = (req) => {
  const uID = uuidv4();

  req.courseRootPath = uID;

  const subfolderPaths = {
    thumbnail: `courses/${uID}/thumbnails/`,
    videos: `courses/${uID}/videos/`,
    materials: `courses/${uID}/materials/`,
  };

  const UPLOADS_FOLDER = `${__dirname}/../public/uploads/`;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "thumbnail") {
        fs.mkdirSync(UPLOADS_FOLDER + subfolderPaths.thumbnail, {
          recursive: true,
        });
        cb(null, UPLOADS_FOLDER + subfolderPaths.thumbnail);
      } else if (file.fieldname === "videos") {
        fs.mkdirSync(UPLOADS_FOLDER + subfolderPaths.videos, {
          recursive: true,
        });
        cb(null, UPLOADS_FOLDER + subfolderPaths.videos);
      } else if (file.fieldname === "materials") {
        fs.mkdirSync(UPLOADS_FOLDER + subfolderPaths.materials, {
          recursive: true,
        });
        cb(null, UPLOADS_FOLDER + subfolderPaths.materials);
      }
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const filename =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("_") +
        "_" +
        Date.now();

      cb(null, filename + fileExt);
    },
  });

  const checkFileType = (file, cb, fileTypes, errorMsg) => {
    if (fileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(createError(errorMsg));
    }
  };

  return multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.fieldname === "thumbnail") {
        checkFileType(
          file,
          cb,
          allowedFileTypes.thumbnail,
          "Only image allowed"
        );
      } else if (file.fieldname === "videos") {
        checkFileType(file, cb, allowedFileTypes.videos, "Only videos allowed");
      } else if (file.fieldname === "materials") {
        checkFileType(
          file,
          cb,
          allowedFileTypes.materials,
          "Only image or pdf allowed"
        );
      }
    },
  });
};

module.exports = uploader;
