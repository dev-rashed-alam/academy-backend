const generateProfileReqBody = (req, res, next) => {
  req.body = { ...req.body, email: undefined, role: undefined };
  next();
};

const generateFilterFieldsForValidCoupons = (req, res, next) => {
  req.filterQuery = { expiryDate: { $gte: new Date() } };
  next();
};

module.exports = {
  generateProfileReqBody,
  generateFilterFieldsForValidCoupons,
};
