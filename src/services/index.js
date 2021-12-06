const productServices = require('./productServices');
const repository = require('../api/repository/index');
console.log('repo',repository);
module.exports = {
    productServices:productServices(repository)
}