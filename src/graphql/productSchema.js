const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Product = require('../api/models/productsModel');
exports.ProductSchema = buildSchema(`
    type Query{
        products:[Product],
        product(id:String!):Product,
        hello:String
    }
    type Mutation {
        addProduct(input:ProductInput):Product
        updateProduct(_id:String!, data:ProductUpdate):Product

    }
    
    type Product{
        _id:String!
        name: String,
		category:String,
		stock:Int,
		price: Int,
		thumbnail:String,
    }
    input ProductInput{
       
        name: String!,
		category:String!,
		stock:Int!,
		price: Int!,
		thumbnail:String,
    }
    input ProductUpdate{
      name:String,
      category:String,
      stock:Int,
      price:Int,
      thumbnail:String
    }
    
    


`);

const getAllProducts = async () => {
  try {
    console.log('hi');
    const products = await Product.find({});
    return products;
  } catch (err) {
    return err;
  }
};

const getProduct = async (args) => {
  try {
    const product = await Product.findById(mongoose.Types.ObjectId(args.id));
    return product;
  } catch (err) {
    console.log('error!', err);
    return err;
  }
};

const addProduct = async ({ input }) => {
  try {
    const product = await Product.create(input);
    return product;
  } catch (err) {
    return err;
  }
};

const updateProduct = async (input)=>{
  try {
    const {_id,data}= input;
    console.log('la data',data);
    console.log('id',_id);
   const updatedProduct= await Product.findByIdAndUpdate(_id,JSON.parse(JSON.stringify(data)),{new:true});
    if(!updatedProduct) throw new Error('No product with that id');
    return updatedProduct;


  } catch (err) {
    console.log(err)
    return err;
  }
}
exports.ProductResolver = {
  hello: () => 'hi',
  product: getProduct,
  products: getAllProducts,
  addProduct: addProduct,
  updateProduct:updateProduct
};
