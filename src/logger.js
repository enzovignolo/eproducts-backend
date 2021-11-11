const log4js = require('log4js');

log4js.configure({
	appenders: {
		default: { type: 'console' },
		fileError: { type: 'file', filename: 'error.log' },
		fileWarn: { type: 'file', filename: 'warn.log' },
	},
	categories: {
		default: { appenders: ['default'], level: 'info' },
		warn: { appenders: ['fileWarn'], level: 'warn' },
		error: { appenders: ['fileError'], level: 'error' },
	},
});

const loggerConsole = log4js.getLogger();
const errorToFile = log4js.getLogger('error');
const warnToFile = log4js.getLogger('warn');
module.exports = { loggerConsole, errorToFile, warnToFile };
