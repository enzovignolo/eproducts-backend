const fs = require('fs');
const http = require('http');
const https = require('https');
const app = require(`${__dirname}/app`);
const mongoose = require('mongoose');
const {Server} =require('socket.io');
const socketController = require(`${__dirname}/socket/socketController.js`)
const {
  loggerConsole,
  warnToFile,
  errorToFile,
} = require(`${__dirname}/logs/logger.js`);
const {
  PORT,
  DB_URI
} = require(`${__dirname}/config/enviroment.js`);

//Creates http server at port indicated on .env or 3000
const server = https.createServer(
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
      
      
      //DB connection and initizalization
      
const io = new Server(server);
io.on('connect',socketController);
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

process.on('SIGINT', () => {
  process.exit(0);
});

process.on('exit', (code) => {
  //console.log(`\nProceso terminado con código de salida:${code}`);
  loggerConsole.warn(`Proceso terminado con código de salida:${code}`);
  warnToFile.warn(`Proceso terminado con código de salida:${code}`);
});

