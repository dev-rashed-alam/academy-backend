const doPagination = (model) => {
  return async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const { filterQuery = {}, chainMethods = [], excludeFields = {} } = req;
    const totalElements = await model.countDocuments(filterQuery).exec();
    const currentPage = page - 1;
    let query = model
      .find(filterQuery, { __v: 0, ...excludeFields })
      .limit(limit)
      .skip(currentPage * limit)
      .sort({ createdAt: -1 });

    for (const chainMethod of chainMethods) {
      query = query[chainMethod.methodName](
        chainMethod.path,
        chainMethod.value
      );
    }
    const results = await query.exec();

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
