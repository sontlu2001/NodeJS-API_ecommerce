"use strict";

const { SuccessResponse } = require("../core/success.response");

class ProfileController {
  //admin
  profiles = async (req, res) => {
    new SuccessResponse({
      message: "Get all profiles success",
      metaData: [
        {
          user_id: "12345",
          username: "john_doe",
        },
        {
          user_id: "67890",
          username: "jane_doe",
        },
        {
          user_id: "11223",
          username: "admin_user",
        },
      ],
    }).send(res);
  };

  profile = async (req, res) => {
    new SuccessResponse({
      message: "Get profile success",
      metaData: {
        user_id: "12345",
        username: "john_doe",
      },
    }).send(res);
  };
}

module.exports = new ProfileController();
