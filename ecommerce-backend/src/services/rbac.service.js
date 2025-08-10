"use strict";

const { resource } = require("../app");
const resourceModel = require("../models/resource.model");
const roleModel = require("../models/role.model");

const createResource = async ({ 
  name = "", 
  slug = "", 
  description = "" 
}) => {
  try {
    const reource = await resourceModel.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });

    return reource;
  } catch (error) {
    console.error("Error creating resource:", error);
    return {
      error: true,
      message: error.message || "Error creating resource",
    };
  }
};

const resourceList = async () => {
  try {
    // check is admin

    //get list resource
    const resources = await resourceModel.aggregate([
      {
        $project: {
          _id: 0, 
          name: "$src_name",
          slug: "$src_slug",
          description: "$src_description",
          resource : "$_id",
          createdAt: 1,
        },
      },
    ]);

    return resources;
  } catch (error) {
    return []
  }
};

const createRole = async ({
  name = "",
  slug = "",
  status = "active",
  description = "",
  grants = [],
}) => {
  try {
    // check role exist

    // create role
    const role = await roleModel.create({
      rol_name: name,
      rol_slug: slug,
      rol_status: status,
      rol_description: description,
      rol_grants: grants,
    });

    return role;
  } catch (error) {
    return {  
      error: true,
      message: error.message || "Error creating role",
    };
  }
};

const roleList = async ({
  userId = 0,       
  limit = 20,
  offset = 0,
  search = "",
}) => {
  try {

    const roles = await roleModel.aggregate([
      {
        $unwind: '$rol_grants',
      },
      {
        $lookup: {
          from: "Resources",
          localField: "rol_grants.resource",
          foreignField: "_id",
          as: "resource",
        }
      },
      {
        $unwind: '$resource',
      },
      {
        $project: {
          role: '$rol_name',
          resource: '$resource.src_name',
          action: '$rol_grants.actions',
          attributes: '$rol_grants.attributes',
        }
      },
      {
         $unwind: '$action',
      }, 
      {
        $project: {
          _id: 0,
          role: 1,
          resource: 1,
          action: '$action',
          attributes: 1,
        }
      }
    ]);

    return roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return {
      error: true,
      message: error.message || "Error fetching roles",
    };
  }
};

module.exports = {
  createResource,
  resourceList,
  createRole,
  roleList,
};
