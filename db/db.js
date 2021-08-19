const knex = require('knex');

const db = knex({
	client: 'mysql',
	connection: {
		host: '127.0.0.1',
		user: 'enzo',
		password: '36469798Mysql!',
		database: 'eproducts',
	},
});

module.exports = db;
