const { isValidObjectId } = require("mongoose");

const checkIsValidObjectId = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(404).json({
      errors: {
        common: {
          msg: "Not found!",
        },
      },
    });
  } else {
    next();
  }
};

module.exports = checkIsValidObjectId;
