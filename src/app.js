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

module.exports = app;
