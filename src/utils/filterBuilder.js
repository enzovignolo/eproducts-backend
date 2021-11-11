const filterBuilder = (queryObj, arrayFilter) => {
  let filter = {};
  Object.keys(queryObj).map((queryFilter) => {
    if (arrayFilter.includes(queryFilter)) {
      filter[queryFilter] = queryObj[queryFilter];
    }
  });
  return filter;
};

module.exports = filterBuilder;
