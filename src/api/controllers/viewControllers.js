const Product = require('../models/productsModel');
const User = require('../models/usersModel');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const numOfCpus = require('os').cpus().length;
const {
  PORT,
  SERVER_URL,
  FB_APP_ID,
  FB_SECRET,
} = require('../../config/enviroment.js');
const getRandomCount = require('../../utils/getRandomCount.js');
const { fork } = require('child_process');
const {
  sendEthEmail,
  sendGmailEmail,
  sendSms,
} = require('../../utils/notifications.js');
//Defines local strategy to use on login
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
//Defines local strategy to use on signup
passport.use(
  'signup',
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      try {
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
//Defines facebook strategy to login

passport.use(
  'facebook',
  new FacebookStrategy(
    {
      clientID: FB_APP_ID,
      clientSecret: FB_SECRET,
      callbackURL: `${SERVER_URL}/auth/callback`,
      profileFields: ['id', 'displayName', 'email', 'picture.type(large)'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile) throw Error('Error login with facebook');

        if (
          !(await User.findOne({
            email: profile.emails[0].value,
          }))
        ) {
          const randomPass = Math.random().toString(36).slice(-8);
          await User.create({
            email: profile.emails[0].value,
            password: randomPass,
            passwordConfirmation: randomPass,
          });
        }

        done(null, profile);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
////
passport.serializeUser((user, done) => {
  done(null, { name: user.name, email: user.email });
});

passport.deserializeUser(async (serializedUser, done) => {
  const user = await User.findOne({ email: serializedUser.email });
  done(null, user);
});
exports.login = (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect(`/login?message=${info.message}`);
    }

    req.logIn(user, (err) => {
      return res.redirect('/addProduct');
    });
  })(req, res, next);
};

exports.fbAuth = (req, res, next) => {
  passport.authenticate('facebook', { scope: 'email' })(req, res, next);
};

exports.fbCallback = (req, res, next) => {
  try {
    passport.authenticate(
      'facebook',
      { failureRedirect: '/login?message=Facebook%20Error' },

      (err, profile) => {
        if (err) {
          throw err;
        }

        const user = {
          name: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value,
        };

        req.logIn(user, async (err) => {
          console.log(user);
          const mailHtml = `<h1>Bienvenido ${user.name}</h1> 
							<img src=${user.photo} />
							<h2>has iniciado sesion de manera correcta</h2>
						  <p>Fecha de inicio de sesión: ${new Date()}</p>`;
          const mailText =
            'Mail enviado automaticamente con Nodemailer+Ethereal';
          sendEthEmail('Login!', mailText, mailHtml);
          sendGmailEmail('Login!', mailText, mailHtml, user.email);

          return res.render('fbSuccess.ejs', { user });
        });
      }
    )(req, res, next);
  } catch (err) {
    console.log(err);
    return res.redirect('/login?message=Facebook%20Error');
  }
};

exports.signup = (req, res, next) => {
  passport.authenticate('signup', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect(`/signup?message=${info.message}`);
    }
    req.logIn(user, (err) => {
      return res.redirect('/addProduct');
    });
  })(req, res, next);
};

exports.viewAllProducts = async (req, res, next) => {
  try {
    //Try to get all the products and send them if success

    let user = req.session.passport?.user?.name || null;
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

    const order = req.query.orderBy ? JSON.parse(req.query.orderBy) : {};

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

    let user = req.session.passport.user;

    res.render('addProduct.ejs', { user: user.name, email: user.email });
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
    let message = req.query ? req.query.message : null;
    res.render('signUpForm.ejs', { message, user: null });
  } catch (err) {
    console.log(err);
  }
};
exports.isLogged = (req, res, next) => {
  console.log(req.session);
  if (req.session.passport && req.session.passport.user) {
    next();
  } else {
    const message = 'You must be logged to see this page';
    res.redirect(`/login?message=${message}`);
  }
};

exports.logout = (req, res, next) => {
  const user = req.session.passport.user.name;
  const mailHtml = `<h1>Adios! ${user}</h1> 
							<h2>has cerrado sesión de manera correcta</h2>
						  <p>Fecha de cierre de sesión: ${new Date()}</p>`;
  const mailText = 'Mail enviado automaticamente con Nodemailer+Ethereal';
  sendEthEmail('Logout!', mailText, mailHtml);
  req.session.destroy();
  res.render('logout.ejs', { user });
};
exports.getInfo = (req, res, next) => {
  const info = {
    'Sistema operativo': process.platform,
    'Numero de procesadores': numOfCpus,
    'Version de node': process.version,
    'Uso de memoria': process.memoryUsage().heapTotal,
    'Camino de ejecución': process.execPath,
    'Directorio actual': process.cwd(),
    'Process id': process.pid,
    Puerto: PORT,
  };

  res.render('info.ejs', { user: null, info });
};

exports.randoms = (req, res, next) => {
  const cant = req.query.cant || 1000;
  const randomCount = getRandomCount(cant);
  res.render('randoms.ejs', {
    user: null,
    randomCount,
  });

  //Commented forkChild for coderhouse challenge
  /* const forkedChild = fork(`${__dirname}/../utils/getRandomCount.js`, {
		env: { cant },
	});
	forkedChild.on('message', (count) => {
		randomCount = count.randomCount;

		res.render('randoms.ejs', {
			user: null,
			randomCount,
		});
	}); */
};
