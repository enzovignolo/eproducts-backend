const dotenv = require('dotenv');

dotenv.config();

let PORT, DB_URI, SERVER_URL;
const FB_APP_ID = process.env.FB_APP_ID;
const FB_SECRET = process.env.FB_SECRET;
if (process.env.ENV == 'development' || !process.env.ENV) {
	SERVER_URL = process.env.SERVER_URL_dev;
	PORT = process.env.PORT_dev || 5000;
	DB_URI =
		process.env.DB_URI_dev || 'mongodb://localhost:27017/ecommerce';
} else if (process.env.ENV == 'production') {
	PORT = process.env.PORT_prod;
	DB_URI = process.env.DB_URI_prod;
	SERVER_URL = process.env.SERVER_URL_prod;
}
console.log(DB_URI);
module.exports = { PORT, DB_URI, SERVER_URL, FB_APP_ID, FB_SECRET };
