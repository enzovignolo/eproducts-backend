const { Server } = require('socket.io');
const http = require('http');
const app = require(`${__dirname}/app`);
const wsController = require(`${__dirname}/controllers/wsControllers.js`);
const mongoose = require('mongoose');
const cluster = require('cluster');
const numOfCpus = require('os').cpus().length;
const {
	PORT,
	DB_URI,
	SERVER_MODE,
} = require(`${__dirname}/config/enviroment.js`);

//Creates http server at port indicated on .env or 3000
let server;

if (SERVER_MODE == 'CLUSTER') {
	if (cluster.isMaster) {
		console.log('Inicializando el servidor en modo cluster');
		console.log(`PID MASTER ${process.pid}`);
		for (let i = 0; i < numOfCpus; i++) {
			cluster.fork();
		}
	} else {
		server = http.createServer(app);
		server.listen(PORT, () => {
			console.log(
				`[OK] Server running on port ${PORT} , process id: ${process.pid}`
			);
		});
	}
} else {
	console.log('Inicializando servidor modo hijo');
	server = http.createServer(app);
	server.listen(PORT, () => {
		console.log(`[OK] Server running on port ${PORT}`);
	});
}

//DB connection and initizalization

(async () => {
	try {
		await mongoose.connect(DB_URI);
		console.log('[OK] Database connected');
	} catch (err) {
		console.error('[ERROR]');
		console.log(err);
	}
})();

//Initialized the websocket server
const io = new Server(server);

//On every connection event, we create a socket TCP
io.on('connection', async (socket) => {
	try {
		//We ask the controller for the updated table,
		//for the user that just connected
		const table = await wsController.getTable();
		const messages = await wsController.getMessages();
		//Notify the frontend the we have the updated table
		io.emit('update table', table);
		io.emit('new message', messages);
		//Here we indicates what to do with a 'update table' event
		socket.on('update table', async () => {
			try {
				//We look for the table that the front requested
				const table = await wsController.getTable();
				//Send the response of the event
				io.emit('update table', table);
			} catch (err) {
				console.log(err);
			}
		});
		socket.on('message sent', async (messageRcv) => {
			try {
				await wsController.updateMessages(messageRcv);
				const messages = await wsController.getMessages();

				io.emit('new message', messages);
			} catch (err) {
				console.log(err);
			}
		});
	} catch (err) {
		console.log(err);
	}
});
process.on('SIGINT', () => {
	process.exit(0);
});

process.on('exit', (code) => {
	console.log(`\nProceso terminado con código de salida:${code}`);
});
