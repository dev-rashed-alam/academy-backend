const allowedFileTypes = {
  thumbnail: ["image/jpeg", "image/jpg", "image/png"],
  videos: [
    "video/x-flv",
    "video/mp4",
    "application/x-mpegURL",
    "video/MP2T",
    "video/3gpp",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-ms-wmv",
  ],
  materials: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
};

const removeEmptyValues = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
      delete obj[key];
    }
  });
  return obj;
};

module.exports = {
  allowedFileTypes,
  removeEmptyValues,
};
