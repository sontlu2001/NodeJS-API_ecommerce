const NotificationModel = require("../models/notification.model");

class Notification {
  async pushNotificationSystem({
    type = "Shop-001",
    receivedId = 0,
    senderId = 0,
    options = {},
  }) {
    let noti_content;

    if (type === "SHOP-001") {
      noti_content = `@@@ vừa mới thêm một sản phẩm`;
    } else if (type === "ORDER-002") {
      noti_content = `@@@ vừa mới cập nhật đơn hàng`;
    }

    const newNoti = await NotificationModel.create({
      noti_content: noti_content,
      noti_type: type,
      noti_senderId: senderId,
      noti_receiverId: receivedId,
      noti_options: options,
    });

    return newNoti;
  }

  async listNotiByUser({ userId = 1, type = "ALL", isRead = 0 }) {
    const match = {
      noti_receiverId: userId,
    };

    if (type !== "ALL") {
      match.noti_type = type;
    }

    return await NotificationModel.aggregate([
      { $match: match },
      {
        $project: {
          noti_type: 1,
          noti_senderId: 1,
          noti_content: {
            $concat: [
              {
                $substr: ["$noti_options.shop_name", 0, -1],
              },
              " vừa mới thêm một sản phẩm: ",
              {
                $substr: ["$noti_options.product_name", 0, -1],
              },
            ],
          },
          noti_options: 1,
          createAt: 1,
        },
      },
    ]);
  }
}

module.exports = new Notification();
