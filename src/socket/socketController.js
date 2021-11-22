
const { sendSms } = require('../utils/notifications');
const wsController = require(`${__dirname}/../api/controllers/wsControllers.js`);
const {
    loggerConsole,
    warnToFile,
    errorToFile,
  } = require(`${__dirname}/../logs/logger.js`);


//On every connection event, we create a socket TCP
const socketController =async (socket) => {
  try {
      console.log('eaaaaaaaa s econecto')
    //We ask the controller for the updated table,
    //for the user that just connected
    const table = await wsController.getTable();
    const messages = await wsController.getMessages();
    //Notify the frontend the we have the updated table
    socket.emit('update table', table);
    socket.emit('new message', messages);
    //Here we indicates what to do with a 'update table' event
    socket.on('update table', async () => {
      try {
        //We look for the table that the front requested
        const table = await wsController.getTable();
        //Send the response of the event
        socket.emit('update table', table);
      } catch (err) {
        console.log(err);
      }
    });
    socket.on('message sent', async (messageRcv) => {
      try {
        console.log('recibido',messageRcv);
        if (messageRcv.message == 'admin') await sendSms(messageRcv.user);
        await wsController.updateMessages(messageRcv);
        const messages = await wsController.getMessages();
        socket.emit('new message', messages);
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
};

module.exports = socketController;