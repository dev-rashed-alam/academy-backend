const doPagination = (model) => {
  return async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const { filterQuery = {} } = req;
    const totalElements = await model.countDocuments(filterQuery).exec();
    const currentPage = page - 1;
    const results = await model
      .find(filterQuery, { __v: 0 })
      .limit(limit)
      .skip(currentPage * limit)
      .sort({ createdAt: -1 })
      .exec();

    res.data = {
      currentPage: parseInt(page),
      totalElements,
      data: results,
      totalPages: Math.ceil(totalElements / limit),
    };
    next();
  };
};

module.exports = { doPagination };
