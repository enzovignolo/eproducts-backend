const ErrorCreator = require(`${__dirname}/../utils/ErrorCreator.js`);
const User = require(`${__dirname}/../models/usersModel.js`);
const Cart = require(`${__dirname}/../models/cartsModel.js`);
const notifications = require(`${__dirname}/../utils/notifications.js`);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
passport.use(
  'loginApi',
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username });

      if (!user) {
        console.log('no user');
        return done(null, false, { message: 'Incorrect user' });
      }
      if (user.password != password) {
        console.log('hola');
        return done(null, false, { message: 'Incorrect password' });
      }
      done(null, user);
    } catch (err) {
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

//To have the user in the req obj
passport.serializeUser((user, done) => {
  done(null, { name: user.name, email: user.email });
});

passport.deserializeUser(async (serializedUser, done) => {
  const user = await User.findOne({ email: serializedUser.email });
  done(null, user);
});
exports.login = async (req, res, next) => {
  passport.authenticate('loginApi', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({ error: 'error' });
    }

    req.logIn(user, (err) => {
      return res.status(200).json({ email: user.email, id: user._id });
    });
  })(req, res, next);
};

exports.signup = async (req, res, next) => {
  passport.authenticate('signup', async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json({ err: 'Could not sign up' });
    }
    const newCart = await Cart.create({});
    const newUser = await User.findByIdAndUpdate(user.id, {
      cart: newCart._id,
    });
    await notifications.signUpEmail(newUser);
    req.logIn(user, async (err) => {
      return res.status(200).json({ status: 'success', user });
    });
  })(req, res, next);
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
      new ErrorCreator('You need admin privilegies to access this route', 403)
    );
  } else {
    next();
  }
};
