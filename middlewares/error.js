import ErrorHandler from "../utils/error.handler.js";

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // wrong mongodb id error called cast error

  if (err.name === "CastError") {
    const message = `Resource not found.    Invalid :${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;

    err = new ErrorHandler(message, 400);
  }

  // Wrong jwt error

  if (err.name === "jsonWebToenError") {
    const message = `json Web Token is invalid , try again`;
    err = new ErrorHandler(message, 400);
  }

  // jwt expire error

  if (err.name === "TokenExpireError") {
    const message = `json Web Token is Expire  , try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;
