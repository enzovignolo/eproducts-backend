const { Schema, model } = require('mongoose');

const cartSchema = Schema(
	{
		products: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
	},
	{ timestamps: true }
);

const Cart = model('Cart', cartSchema);

module.exports = Cart;
