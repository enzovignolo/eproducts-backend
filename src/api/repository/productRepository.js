const baseRepository = require('./baseRepository')
const filterBuilder = require('../../utils/filterBuilder');
const Product = require('../models/productsModel');
const productRepository =()=>({
   ...baseRepository,
   async getFiltered(queryObj){
    const {sortBy} = queryObj;

    //Build the filter from the query string

    
    const filter = filterBuilder(queryObj, [
        '_id',
        'name',
        'category',
        'price',
        'stock',
      ]);
   

    const data = await Product.find(filter).sort(sortBy);
    return data;

   }
})
  
module.exports = productRepository;