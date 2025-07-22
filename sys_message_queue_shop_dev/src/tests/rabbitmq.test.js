"use strict";

const {
  connectToRabbitMQ,
  connectToRabbitMQForTest,
} = require("../dbs/init.rabbit");


describe("RabbitMQ Connection Tests", () => {
  it("should connect to RabbitMQ and publish a test message", async () => {
    const result = await connectToRabbitMQForTest();
    expect(result).toBeUndefined();
  });
});