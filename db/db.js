const knex = require('knex');
/**
 * This creates an instance for the configuration
 * to the DB
 */
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
