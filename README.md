# Node.js Otel Example

A Kafka consumer and producer writtin in Node.js that can be used as an example for getting OpenTelemetry for Javascript operating correctly.

The app has two entrypoints that can be run from the same docker image.  A consumer that attaches to Kafka and a producer that can be run manually to produce a single message at a time.

# Setup and Run

- `cp sample.env .env` and fill in the values for a Honeycomb dataset and API key
- Build and run Kafka and the Node.js consumer: `docker-compose up -d --build`
- Wait for the consumer to connect: `docker logs -f consumer`
- Produce a single message: `docker-compose run --rm consumer_producer node /app/src/produce.js`