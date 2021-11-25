const ProductServices = require('./productServices');
const productRepository = require('../api/repository/productRepository');
module.exports = {
    productServices:new ProductServices(productRepository)
}