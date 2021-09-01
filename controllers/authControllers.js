const ErrorCreator = require(`${__dirname}/../utils/ErrorCreator.js`);
exports.login = (req, res, next) => {
	/* In the future, here will be the login
	 */
};

exports.isLogged = (req, res, next) => {
	/**
	 * Here we check if the user passed is logged
	 */
	//For now we only pass to the next middleware
	next();
};

exports.isAdmin = (req, res, next) => {
	/**
	 * Here we check if the user has the admin privilegies
	 */
	if (req.headers.user !== 'admin') {
		next(
			new ErrorCreator(
				'You need admin privilegies to access this route',
				403
			)
		);
	} else {
		next();
	}
};
