"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

// [a,b] =>{'a':1,'b':1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(e => [e, 1]))
}

const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map(e => [e, 0]))
}

const removeUndefinedObject= (obj) =>{
  Object.keys(obj).forEach(k =>{
    if (obj[k] === null){
      delete obj[k]
    }
    else if(typeof obj[k] === 'object' && !Array.isArray(obj[k])){
      const response = removeUndefinedObject(obj[k])
      Object.keys(response).forEach(a =>{
        if(k[a] === null)
        delete k[a]
      })
    }
  })
  return obj
}
/* 
  const a = {
    c:{
      d:1,
      e:2,
    }
  }
*/

const updateNestedObjectParser = (obj)=>{
  const final ={}
  Object.keys(obj).forEach(k => {
    if(typeof obj[k] === 'object' && !Array.isArray(obj[k])){
      const response = updateNestedObjectParser(obj[k])
      Object.keys(response).forEach(a =>{
        final[`${k}.${a}`] = response[a]
      })
    }
    else{
      final[k] = obj[k]
    }
  })
  return final
}

const convertToObjectMongodb = id => Types.ObjectId(id);

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectMongodb
};
