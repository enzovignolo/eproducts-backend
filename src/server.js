const { Server } = require('socket.io');
const fs = require('fs');
const http = require('http');
const https = require('https');
const app = require(`${__dirname}/app`);
const wsController = require(`${__dirname}/controllers/wsControllers.js`);
const mongoose = require('mongoose');
const cluster = require('cluster');
const { sendSms } = require('./utils/notifications');
const numOfCpus = require('os').cpus().length;
const {
  loggerConsole,
  warnToFile,
  errorToFile,
} = require(`${__dirname}/logger.js`);
const {
  PORT,
  DB_URI,
  SERVER_MODE,
} = require(`${__dirname}/config/enviroment.js`);

//Creates http server at port indicated on .env or 3000
let server;
if (SERVER_MODE == 'CLUSTER') {
  if (cluster.isMaster) {
    /* console.log('Inicializando el servidor en modo cluster');
		console.log(`PID MASTER ${process.pid}`); */
    loggerConsole.info('Inicializando el servidor en modo cluster');
    loggerConsole.info(`PID MASTER ${process.pid}`);
    for (let i = 0; i < numOfCpus; i++) {
      cluster.fork();
    }
  } else {
    server = https.createServer(
      {
        key: fs.readFileSync('./certificates/eproducts_example.key'),
        cert: fs.readFileSync('./certificates/eproducts_example.crt'),
      },
      app
    );
    server.listen(PORT, () => {
      loggerConsole.info(
        `[OK] Server running on port ${PORT} , process id: ${process.pid}`
      );
      /* console.log(
				`[OK] Server running on port ${PORT} , process id: ${process.pid}`
			); */
    });
  }
} else {
  //console.log('Inicializando servidor modo hijo');
  loggerConsole.info('Inicializando servidor modo hijo');

  server = https.createServer(
    {
      key: fs.readFileSync('./certificates/eproducts_example.key'),
      cert: fs.readFileSync('./certificates/eproducts_example.crt'),
    },
    app
  );
  server.listen(process.env.PORT || PORT, () => {
    loggerConsole.info(`[OK] Server running on port ${PORT}`);
    /* console.log(`[OK] Server running on port ${PORT}`); */
  });
}

//DB connection and initizalization

(async () => {
  try {
    await mongoose.connect(DB_URI);
    loggerConsole.info('[OK] Database connected');
    //console.log('[OK] Database connected');
  } catch (err) {
    /* console.error('[ERROR]');
		console.log(err); */
    loggerConsole.warn('Error with the connection to the DB');
    warnToFile.warn('Error with the connection to the DB');
    loggerConsole.error(err.message);
    errorToFile.error(err.message);
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
        console.log(messageRcv);
        if (messageRcv.message == 'admin') await sendSms(messageRcv.user);
        await wsController.updateMessages(messageRcv);
        const messages = await wsController.getMessages();

        io.emit('new message', messages);
      } catch (err) {
        //console.log(err);
        loggerConsole.error(err.message);
        errorToFile.error(err.message);
      }
    });
  } catch (err) {
    //console.log(err);
    loggerConsole.error(err.message);
    errorToFile.error(err.message);
  }
});
process.on('SIGINT', () => {
  process.exit(0);
});

process.on('exit', (code) => {
  //console.log(`\nProceso terminado con código de salida:${code}`);
  loggerConsole.warn(`Proceso terminado con código de salida:${code}`);
  warnToFile.warn(`Proceso terminado con código de salida:${code}`);
});
