require("./tracing.js");

const api = require("@opentelemetry/api");
const axios = require('axios');
const { kafka } = require("./kafka.js");

const tracer = api.trace.getTracer("message-consumer");

const consume = async () => {
  const consumer = kafka.consumer({ groupId: "test-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const span = tracer.startSpan("consume message");        
      // get any web page 
      await axios.get('https://docs.honeycomb.io/getting-data-in/opentelemetry/javascript/')
      const {value, timestamp} = message

      console.log({
        value: value.toString(),
        timestamp: timestamp.toString(),
      });      
      span.end()
    },
  });
};

consume().then(console.log("All done consuming"));
