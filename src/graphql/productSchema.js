const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Product = require(`${__dirname}/../models/productsModel.js`);
exports.ProductSchema = buildSchema(`
    type Query{
        products:[Product],
        product(id:String!):Product,
        hello:String
    }
    type Mutation {
        addProduct(input:ProductInput):Product

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

exports.ProductResolver = {
  hello: () => 'hi',
  product: getProduct,
  products: getAllProducts,
  addProduct: addProduct,
};
