"use strict";

const { getSelectData, getUnSelectData } = require("../../utils");

const findAllDiscountCodeUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();
  return documents;
};

const findAllDiscountCodeSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return documents;
};

const checkDiscountExist = async ({ model, filter }) => {
  return await model.findOne(filter).lean();
};

module.exports = {
  findAllDiscountCodeUnSelect,
  findAllDiscountCodeSelect,
  checkDiscountExist,
};
