const path = require("path");
const { unlink } = require("fs");

const removeUploadedFile = (fileName, pathName) => {
  console.log(fileName, pathName);
  unlink(
    path.join(__dirname, `../public/uploads/${pathName}/${fileName}`),
    (err) => {
      if (err) console.log(err);
    }
  );
};

module.exports = removeUploadedFile;
