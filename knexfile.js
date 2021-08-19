// Update with your config settings.
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	development: {
		client: 'mysql',
		connection: {
			host: '127.0.0.1',
			user: 'enzo',
			password: '36469798Mysql!',
			database: 'eproducts',
		},
		migrations: {
			directory: `${__dirname}/db/migrations`,
		},
	},
};
