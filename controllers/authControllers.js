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
	console.log(req.headers.user);
	if (req.headers.user !== 'admin') {
		res.status(403).json({
			status: 'error',
			error: 'You need admin privilegies to acces this route',
		});
	} else {
		next();
	}
};
