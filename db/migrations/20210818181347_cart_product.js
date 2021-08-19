exports.up = function (knex) {
	return knex.schema.createTable('cart_product', (table) => {
		table.increments('id');
		table
			.integer('cart_id')
			.unsigned()
			.references('id')
			.inTable('carts');
		table
			.integer('product_id')
			.unsigned()
			.references('id')
			.inTable('products');
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('cart_product');
};
