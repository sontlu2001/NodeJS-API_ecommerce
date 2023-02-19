const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())

// init DB

// init routers
app.get("/",(req,res,next)=>{
    return res.status(200).json({
        message:"Welcome project"
    })
})
//handling error

module.exports = app