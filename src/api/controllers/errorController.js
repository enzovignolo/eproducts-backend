/**
 *
 * HERE ALL ERRORS WILL BE HANDLED IN A
 * CENTRALIZED WAY
 */
const sendError = (res, err) => {
  console.log(err);
  res.status(err.stCode).json({
    status: 'error',
    error: err.msg,
  });
};

exports.handleErrors = (err, req, res, next) => {
  console.log(err);
  if (err.name == 'CastError') {
    err.msg = `Invalid value for ${err.path}`;
    err.stCode = 400;
  } else {
    err.msg = err.msg || 'Something went wrong';
    err.stCode = err.stCode || 500;
  }
  sendError(res, err);
};
