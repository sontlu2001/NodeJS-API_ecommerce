"use strict";

const mongoose = require("mongoose");
const {db:{host,name,port,username, password}} = require("../configs/config");
const connectString = `mongodb://${username}:${password}@${host}:${port}/${name}?authSource=admin`;
const { countConnect } = require("../helpers/check.connect");

class Database {
  constructor() {
    this.connect();
  }
  // connect
  connect(type = "mongodb") {
    if (1 === 1) {
      // mongoose.set("debug", true);
      // mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      
      .then((_) => {
        console.log(`Connect Mongodb Success`);
        // console.log("",host,name,port);
        // console.log(`Connect Mongodb Success countConnect::`, countConnect());
      })
      .catch((err) => console.log(`!!!Error Connect Mongodb`, err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
