require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();
const {v4: uuidv4} = require("uuid");
const myLogger = require("./loggers/mylogger.log.js");

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
app.use((req,res,next) => {
  const requestId = req.headers["x-request-id"] || uuidv4();
  req.requestId = requestId ? requestId : uuidv4();
  myLogger.log('input params', [
    req.path,
    {requestId: req.requestId},
    req.method === "POST" ? req.body : req.query,
  ])

  next();
})


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
  const resMessage = `${statusCode}:::${Date.now() - error.now}ms`

  const response = {
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  }
  
  // if (process.env.NODE_ENV === 'dev'){
  //   response.stack = error.stack
  // }
  myLogger.error(resMessage, [
    req.path,
    {requestId: req.requestId},
    {message: error.message},
  ]);
  return res.status(statusCode).json(response);
});
module.exports = app;
