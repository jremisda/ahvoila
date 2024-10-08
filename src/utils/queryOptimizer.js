const optimizeQuery = (query) => {
  // Remove unnecessary $and operators
  if (query.$and && query.$and.length === 1) {
    query = query.$and[0];
  }

  // Combine multiple $and operators
  if (query.$and) {
    query.$and = query.$and.reduce((acc, condition) => {
      if (condition.$and) {
        return [...acc, ...condition.$and];
      }
      return [...acc, condition];
    }, []);
  }

  // Convert $or with single element to direct query
  if (query.$or && query.$or.length === 1) {
    query = { ...query, ...query.$or[0] };
    delete query.$or;
  }

  return query;
};

module.exports = { optimizeQuery };