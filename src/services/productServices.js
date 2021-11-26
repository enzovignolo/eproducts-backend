const Product = require('../api/models/productsModel');
const productServices =({productRepository})=>({

      async getAllProducts(){
        try {
          
          return await productRepository.getAll(Product);
          
        } catch (err) {
          console.log(err);
          throw err;
        }
  
      },
      async getOneProduct(id){
        try {
          const product = await productRepository.getById(Product,id);
          return product
        } catch (err) {
          console.log(err);
          throw err;
        }
  
      },
      async createProduct(data){
        try {
          const product = await productRepository.createData(Product,data);
          return product;
        } catch (err) {
          console.log(err);
          throw err;        
        }
  
      },
      async updateProduct(id,data){
        try {
          const product = await productRepository.updateById(Product,id,data);
          return product;
        } catch (err) {
          console.log(err);
          throw err; 
        }
  
      },
      async deleteProduct(id){
        try {
          const product = await productRepository.deleteById(Product,id);
          return;
        } catch (err) {
          console.log(err);
          throw err; 
        }
  
      },
      async getFilteredProducts(queryObj){
        try {
            const products = await productRepository.getFiltered(queryObj);
            return products;
        } catch (err) {
            
        }
      }
    })

    module.exports = productServices