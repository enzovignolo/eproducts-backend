const mongoose = require('mongoose');
const Product = require('./../models/productsModel');
const { DB_URI } = require('./../config/enviroment.js');
const products = require('./productData.json');

(async () => {
	try {
		await mongoose.connect(DB_URI);
		await Product.insertMany(products);
		//await Product.deleteMany({});
		console.log('products added');
		process.exit(1);
	} catch (err) {
		console.log(err);
	}
})();
