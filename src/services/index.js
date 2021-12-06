const productServices = require('./productServices');
const repository = require('../api/repository/index');

module.exports = {
    productServices:productServices(repository)
}