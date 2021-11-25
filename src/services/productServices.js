const Product = require('../api/models/productsModel');
const productServices = (productRepository)=>{
    return {
      async getAllProducts(){
        try {
            
          return await productRepository.getAllProducts(Product);
          //return products;
        } catch (err) {
          console.log(err);
          throw err;
        }
  
      },
      async getOneProduct(req,res,next){
        try {
          const product = await productRepository.getOneProduct(req.params.id);
          return product
        } catch (err) {
          console.log(err);
          throw err;
        }
  
      },
      async createProduct(req,res,next){
        try {
          const product = await productRepository.createProduct(req.body);
          return product;
        } catch (err) {
          console.log(err);
          throw err;        
        }
  
      },async updateProduct(req,res,next){
        try {
          const product = await productRepository.updateProduct(req.params.id,req.body);
          return product;
        } catch (err) {
          console.log(err);
          throw err; 
        }
  
      },
      async deleteProduct(req,res,next){
        try {
          const product = await productRepository.deleteProduct(req.params.id,req.body);
          return;
        } catch (err) {
          console.log(err);
          throw err; 
        }
  
      }
    }
  }

module.exports = productServices;