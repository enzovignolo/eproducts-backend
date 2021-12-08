const services = require('../../services/index');
const productControllers = require('./productControllers');

module.exports = {
    productControllers : productControllers(services)
}