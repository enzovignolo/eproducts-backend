class ErrorCreator extends Error {
	constructor(msg, stCode) {
		super();
		this.msg = msg;
		this.stCode = stCode;
	}
}

module.exports = ErrorCreator;
