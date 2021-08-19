const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const productRoutes = require(`${__dirname}/routes/productRoutes`);
const cartRoutes = require(`${__dirname}/routes/cartRoutes`);
const authRoutes = require(`${__dirname}/routes/authRoutes`);
const viewRoutes = require(`${__dirname}/routes/viewRoutes`);

//

dotenv.config();
const app = express();

//Security middlewares
app.use(cors());
//Parse Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//
//Setting template engine

app.set('view engine', 'ejs');
//Static files
app.use(express.static('public'));
//
//Routes
//Routes names are in Spanish in order to comply
//Coderhouse backend course requirements.
app.use('/api/v1/productos', productRoutes);
app.use('/api/v1/carritos', cartRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/', viewRoutes);
//This is for unkown routes ERROR 404
app.use((req, res, next) => {
	const error = new Error(`Route ${req.originalUrl} does not exist`);
	error.stCode = 404;
	next(error);
});
//Error middleware
app.use((err, req, res, next) => {
	console.log(err);
	err.stCode = err.stCode || 500;
	err.stMessage =
		err.stCode == 500 ? 'Somethign went wrong' : err.message;
	res.status(err.stCode).json({
		status: 'error',
		error: err.stMessage,
	});
});

module.exports = app;
