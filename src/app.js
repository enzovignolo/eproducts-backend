const express = require('express');
const cors = require('cors');
const compression = require('compression');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { DB_URI } = require(`${__dirname}/config/enviroment`);
const ErrorCreator = require(`${__dirname}/utils/ErrorCreator.js`);
const errorController = require(`${__dirname}/api/controllers/errorController.js`);

const passport = require('passport');
/**
 * Load routes
 */
const productRoutes = require(`${__dirname}/api/routes/productRoutes`);
const cartRoutes = require(`${__dirname}/api/routes/cartRoutes`);
const authRoutes = require(`${__dirname}/api/routes/authRoutes`);
const viewRoutes = require(`${__dirname}/api/routes/viewRoutes`);
const userRoutes = require(`${__dirname}/api/routes/userRoutes`);

//Initializing the app

const app = express();

//Security middlewares
app.use(cors());
app.use(compression());
//Parse Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Session and cookies middlewares
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: DB_URI,
      autoRemove: 'disabled',
    }),
    secret: 'coder session',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 1000 * 10,
    },
    rolling: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Setting template engine
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
//Static files
app.use(express.static('public'));
//
//Routes
//Routes names are in Spanish in order to comply
//Coderhouse backend course requirements.
app.use('/api/v1/productos', productRoutes);
app.use('/api/v1/carritos', cartRoutes);
app.use('/api/v1/usuarios', userRoutes);
app.use('/api/v1/', authRoutes);
app.use('/', viewRoutes);
//This is for unkown routes ERROR 404
app.use('/*', (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} does not exist`);
  error.stCode = 404;

  next(new ErrorCreator(`Route ${req.originalUrl} does not exist`, 404));
});

//Error middleware
app.use((err, req, res, next) => {
  errorController.handleErrors(err, req, res, next);
});

module.exports = app;
