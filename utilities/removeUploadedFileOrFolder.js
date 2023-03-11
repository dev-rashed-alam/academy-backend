const path = require("path");
const { unlink } = require("fs");
const fs = require("fs");

const removeUploadedFile = (fileName, pathName) => {
  unlink(
    path.join(__dirname, `../public/uploads/${pathName}/${fileName}`),
    (err) => {
      if (err) console.log(err);
    }
  );
};

const removeDirectory = (directoryName) => {
  fs.rmdir(
    path.join(__dirname, `../public/uploads/${directoryName}`),
    { recursive: true },
    (err) => {
      if (err) console.log(err);
    }
  );
};

module.exports = { removeUploadedFile, removeDirectory };
