const setCommonError = (res, error, statusCode) => {
  return res.status(statusCode).json({
    errors: {
      common: {
        msg: error,
      },
    },
  });
};

module.exports = {
  setCommonError,
};
