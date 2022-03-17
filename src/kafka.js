const { Kafka } = require("kafkajs");

const {KAFKA_HOST,KAFKA_PORT} = process.env
const broker = `${KAFKA_HOST}:${KAFKA_PORT}`

exports.kafka = new Kafka({
  clientId: "my-app",
  brokers: [broker],
});