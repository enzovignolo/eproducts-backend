const dotenv = require('dotenv');

dotenv.config();

let PORT, DB_URI;
if (process.env.ENV == 'development') {
	PORT = process.env.PORT_dev;
	DB_URI = process.env.DB_URI_dev;
} else if (process.env.ENV == 'production') {
	PORT = process.env.PORT_prod;
	DB_URI = process.env.DB_URI_prod;
}
console.log(DB_URI);
module.exports = { PORT, DB_URI };
