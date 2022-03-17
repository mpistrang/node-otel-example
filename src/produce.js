const { kafka } = require("./kafka.js");

const produce = async () => {
  const producer = kafka.producer();
  
  await producer.connect();

  const timestamp = Date.now()
  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Hello World!", timestamp}],
  });

  console.log(`Produced one message with timestamp ${timestamp}`)

  await producer.disconnect();
};


produce()