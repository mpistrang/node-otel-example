require("./tracing.js");

const api = require("@opentelemetry/api");
const axios = require("axios");
const { kafka } = require("./kafka.js");

const tracer = api.trace.getTracer("message-consumer");

const processMessage = async ({ topic, partition, message }) => {
  // get any web page
  await axios.get(
    "https://docs.honeycomb.io/getting-data-in/opentelemetry/javascript/"
  );
  const { value, timestamp } = message;

  console.log({
    value: value.toString(),
    timestamp: timestamp.toString(),
  });
};

const processMessageWrapper = async (args) => {
  const span = tracer.startSpan("message received");
  const ctx = api.trace.setSpan(api.context.active(), span);
  await api.context.with(ctx, processMessage, undefined, args);
  span.end();
};

const consume = async () => {
  const consumer = kafka.consumer({ groupId: "test-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: processMessageWrapper,
  });
};

consume().then(console.log("All done consuming"));
