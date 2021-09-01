const { Schema, model } = require('mongoose');

const productSchema = Schema(
	{
		name: {
			type: String,
			required: [true, 'Products must have a name'],
		},
		category: {
			type: String,
		},
		stock: {
			type: Number,
			min: [0, 'Minimum value for stock is 0'],
		},
		price: {
			type: Number,
			min: [0, 'Minimum value for price is 0'],
		},
		thumbnail: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Product = model('Product', productSchema);

module.exports = Product;
