exports.up = function (knex) {
	return knex.schema.createTable('messages', (table) => {
		table.increments('id').primary();
		table.string('user').notNullable();
		table.string('message').notNullable();
		table.string('date').notNullable();
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('cart_product');
};
