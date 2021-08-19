exports.up = function (knex) {
	return knex.schema.createTable('products', (table) => {
		table.increments('id').primary();
		table.string('name').notNullable();
		table.float('price', 10).notNullable();
		table.integer('stock').notNullable();
		table.string('thumbnail');
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('products');
};
