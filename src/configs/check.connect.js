"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;

// count Connect
const countConnect = () => {
  const numConnection = mongoose.connect.length;
  console.log(`Number of connections::${numConnection}`);
};

// check over load
const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connection.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections base on number of cores
    const maxConnections = numCores * 5;
    console.log(`Active connections:${numConnection}`);
    console.log(`Memory usage::${memoryUsage / 1024 / 1024}MB`);
    console.log("========================");

    if (numConnection > maxConnections) {
      console.log(`Connections overload detected!`);
      //   notify.send(...)
    }
  }, _SECONDS); //Monitor every 5 seconds
};
module.exports = {
  countConnect,
  checkOverLoad,
};
