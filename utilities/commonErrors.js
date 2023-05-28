const setCommonError = (res, message, statusCode) => {
  return res.status(statusCode).json({
    errors: {
      common: {
        msg: message,
      },
    },
  });
};

module.exports = {
  setCommonError,
};
