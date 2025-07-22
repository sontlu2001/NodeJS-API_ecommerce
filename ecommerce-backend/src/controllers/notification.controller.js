"use strict";

const { SuccessResponse } = require("../core/success.response");
const { listNotiByUser } = require("../services/notification.service");

class NotificationController {
  listNotificationByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "List notifications by user successfully",
      metaData: await listNotiByUser(req.query),
    }).send(res);
  };
  
}

module.exports = new NotificationController();
