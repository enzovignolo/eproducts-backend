const dotenv = require('dotenv');

dotenv.config();

let PORT, DB_URI;
if (process.env.ENV == 'development' || !process.env.ENV) {
	PORT = process.env.PORT_dev || 5000;
	DB_URI =
		process.env.DB_URI_dev || 'mongodb://localhost:27017/ecommerce';
} else if (process.env.ENV == 'production') {
	PORT = process.env.PORT_prod;
	DB_URI = process.env.DB_URI_prod;
}
console.log(DB_URI);
module.exports = { PORT, DB_URI };
