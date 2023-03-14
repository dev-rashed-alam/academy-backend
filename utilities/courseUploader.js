const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { allowedFileTypes } = require("./helpers");

const uploader = (request) => {
  const uID = uuidv4();

  const processFolderPaths = (rootPath = uID) => {
    return {
      thumbnail: `courses/${rootPath}/thumbnails/`,
      videos: `courses/${rootPath}/videos/`,
      materials: `courses/${rootPath}/materials/`,
    };
  };

  const UPLOADS_FOLDER = `${__dirname}/../public/uploads/`;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const { courseSecret } = req.body;
      const subfolderPaths = processFolderPaths(courseSecret);
      request.courseRootPath = courseSecret || uID;
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
      req.courseSecret = req.body.courseSecret;
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
