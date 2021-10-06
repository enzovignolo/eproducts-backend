const { Server } = require('socket.io');
const http = require('http');
const app = require(`${__dirname}/app`);
const wsController = require(`${__dirname}/controllers/wsControllers.js`);
const mongoose = require('mongoose');
const { PORT, DB_URI } = require(`${__dirname}/config/enviroment.js`);
//DB connection and initizalization

(async () => {
	try {
		console.log(DB_URI);
		await mongoose.connect(DB_URI);
		console.log('[OK] Database connected');
	} catch (err) {
		console.error('[ERROR]');
		console.log(err);
	}
})();

//Creates http server at port indicated on .env or 3000

const server = http.createServer(app);

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
server.listen(PORT, () => {
	console.log(`[OK] Server running on port ${PORT}`);
});
