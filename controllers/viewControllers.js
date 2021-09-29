const Product = require(`${__dirname}/../models/productsModel.js`);
const User = require(`${__dirname}/../models/usersModel.js`);
const ErrorCreator = require(`${__dirname}/../utils/ErrorCreator.js`);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Defines strategy to use on login
passport.use(
	'login',
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ email: username });
			if (!user) done(null, false, { message: 'Incorrect user' });
			if (user.password != password)
				done(null, false, { message: 'Incorrect password' });
			done(null, user);
		} catch (err) {
			console.log(err);
			done(err);
		}
	})
);
//Defines strategy to use on signup
passport.use(
	'signup',
	new LocalStrategy(
		{ passReqToCallback: true },
		async (req, username, password, done) => {
			try {
				console.log('signup llegue');
				const user = await User.findOne({ email: username });
				if (user)
					done(null, false, {
						message: 'This user already exists',
					});
				const newUser = await User.create({
					name: req.body.name,
					lastName: req.body.lastName,
					email: req.body.username,
					alias: req.body.alias,
					age: req.body.age,
					password: req.body.password,
					passwordConfirmation: req.body.passwordConfirmation,
				});
				done(null, newUser);
			} catch (err) {
				console.log(err);
				done(err);
			}
		}
	)
);

////
passport.serializeUser((user, done) => {
	done(null, { id: user._id, name: user.name });
});

passport.deserializeUser(async (serializedUser, done) => {
	const user = await User.findById(serializedUser.id);
	done(null, user);
});
exports.login = (req, res, next) => {
	/* try {
		const { username: email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) throw new ErrorCreator('User does not exist', 401);

		if (user.password != password)
			throw new ErrorCreator('Wrong password', 401);
		req.session.isLogged = 'true';
		req.session.userEmail = user.email;
		req.session.userName = user.name;

		res.redirect(`/addProduct?message=Welcome ${user.name}`);
	} catch (err) {
		console.log(err);
		res.redirect(`/login?message=${err.msg}`);
	} */

	passport.authenticate('login', (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			res.redirect(`/login?message=${info.message}`);
		}
		req.logIn(user, (err) => {
			res.redirect('/addProduct');
		});
	})(req, res, next);
};
exports.signup = (req, res, next) => {
	passport.authenticate('signup', (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			res.redirect(`/signup?message=${info.message}`);
		}
		req.logIn(user, (err) => {
			res.redirect('/addProduct');
		});
	})(req, res, next);
};

exports.viewAllProducts = async (req, res, next) => {
	try {
		//Try to get all the products and send them if success
		let user = req.session.passport?.user.name || null;
		const filter = {
			name: req.query.name || /m*/,
			category: req.query.category || /m*/,
			price: {
				$lte: req.query.maxPrice || 9999999,
				$gte: req.query.minPrice || 0,
			},
			stock: {
				$lte: req.query.maxStock || 9999999,
				$gte: req.query.minStock || 0,
			},
		};

		const order = req.query.orderBy
			? JSON.parse(req.query.orderBy)
			: {};

		const products = await Product.find(filter).sort(order);

		let message;
		if (!products) {
			message = 'There are no products loaded';
		}
		res.render('products.ejs', {
			query: req.query,
			products,
			message,
			user,
		});
	} catch (err) {
		//Handle errors
		console.log(err);
		next(err);
	}
};

exports.viewAddProductForm = async (req, res, next) => {
	try {
		//Check if there is any message to send
		console.log(req.session);
		let user = req.session.passport.user.name;
		res.render('addProduct.ejs', { user });
	} catch (err) {
		next(err);
	}
};

exports.addProduct = async (req, res, next) => {
	try {
		//Write product

		const product = await Product.create(req.body);
		//If the function did not return a product, there was an error
		if (!product) throw new Error('Error writting in the DB');
		res.redirect('/addProduct');
	} catch (err) {
		next(err);
	}
};

exports.chatView = (req, res, next) => {
	res.render('chat.ejs');
};

exports.loginForm = (req, res, next) => {
	try {
		let message = req.query ? req.query.message : null;
		res.render('loginForm.ejs', { message, user: null });
	} catch (err) {
		console.log(err);
	}
};
exports.signUpForm = (req, res, next) => {
	try {
		console.log('asda');
		let message = req.query ? req.query.message : null;
		res.render('signUpForm.ejs', { message, user: null });
	} catch (err) {
		console.log(err);
	}
};
exports.isLogged = (req, res, next) => {
	console.log('asdas');
	if (req.session.passport && req.session.passport.user) {
		next();
	} else {
		console.log(req.session);
		const message = 'You must be logged to see this page';
		res.redirect(`/login?message=${message}`);
	}
};

exports.logout = (req, res, next) => {
	const user = req.session.passport.user.name;
	req.session.destroy();
	res.render('logout.ejs', { user });
};
