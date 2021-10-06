const dotenv = require('dotenv');

dotenv.config();

let PORT, DB_URI, SERVER_URL;
let FB_APP_ID = process.env.FB_APP_ID;
let FB_SECRET = process.env.FB_SECRET;
if (process.argv.length > 2) {
	process.argv.forEach((value, index) => {
		const args = value.split('=');
		if (args[0] == 'PORT') PORT = args[1];
		if (args[0] == 'FB_APP_ID') FB_APP_ID = args[1];
		if (args[0] == 'FB_SECRET') FB_SECRET = args[1];
	});
}

if (process.env.ENV == 'development' || !process.env.ENV) {
	PORT = PORT || process.env.PORT_dev || 5000;
	SERVER_URL = `${process.env.SERVER_URL_dev}:${PORT}`;
	DB_URI =
		process.env.DB_URI_dev || 'mongodb://localhost:27017/ecommerce';
} else if (process.env.ENV == 'production') {
	PORT = PORT || process.env.PORT_prod;
	DB_URI = process.env.DB_URI_prod;
	SERVER_URL = `${process.env.SERVER_URL_dev}:${PORT}`;
}

module.exports = { PORT, DB_URI, SERVER_URL, FB_APP_ID, FB_SECRET };
