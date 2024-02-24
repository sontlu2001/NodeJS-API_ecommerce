require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();


// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// init DB
require("./dbs/init.mongodb");
const { checkOverLoad } = require("./helpers/check.connect.js");
// checkOverLoad();
// init routers
app.use("", require("./routes"));
//handling error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;  
  const response = {
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  }
  
  if (process.env.NODE_ENV === 'dev'){
    response.stack = error.stack
  }

  return res.status(statusCode).json(response);
});
module.exports = app;
