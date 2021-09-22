const ErrorCreator = require(`${__dirname}/../utils/ErrorCreator.js`);
const User = require(`${__dirname}/../models/usersModel.js`);
exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) throw new ErrorCreator(401, 'Wrong email');

		console.log(user.password);
		if (user.password != password)
			throw new ErrorCreator(401, 'Wrong password!');
		req.session.isLogged = 'true';
		req.session.user = user.email;
		next();
		//res.status(201).json({ status: 'logged!' });
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.isLogged = (req, res, next) => {
	/**
	 * Here we check if the user passed is logged
	 */
	//For now we only pass to the next middleware
	console.log(req.session);
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
