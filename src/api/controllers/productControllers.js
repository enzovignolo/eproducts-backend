const services = require('../../services/index');

const productControllers = (services)=>{
  const {productServices} = services;
  return {
    async getAllProducts(req,res,next){
      try {
        console.log('servicios',productServices)
        const products = await productServices.getAllProducts();
        res.status(200).json({products})
      } catch (err) {
        console.log(err);
        throw err;
      }

    },
    async getOneProduct(req,res,next){
      try {
        const product = await productServices.getOneProduct(req.params.id);
        res.status(200).json({product})
      } catch (err) {
        console.log(err);
        throw err;
      }

    },
    async createProduct(req,res,next){
      try {
        const product = await productServices.createProduct(req.body);
        res.status(201).json({product})
      } catch (err) {
        console.log(err);
        throw err;        
      }

    },async updateProduct(req,res,next){
      try {
        const product = await productServices.updateProduct(req.params.id,req.body);
        res.status(200).json({product})
      } catch (err) {
        console.log(err);
        throw err; 
      }

    },
    async deleteProduct(req,res,next){
      try {
        const product = await productServices.deleteProduct(req.params.id);
        res.status(203).json({status:'deleted'})
      } catch (err) {
        console.log(err);
        throw err; 
      }

    },
    async getFilteredProducts(req,res,next){
      try {
        const products = await productServices.getFilteredProducts(req.query);
        res.status(200).json({products})
      } catch (err) {
        console.log(err);
        throw err;
      }

    }
  }
}

module.exports = productControllers;
