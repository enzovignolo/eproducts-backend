const services = require('../../services/index');
const productControllers = require('./productControllers');
console.log('ossss',services)
module.exports = {
    productControllers : productControllers(services)
}