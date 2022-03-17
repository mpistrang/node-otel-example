// tracing.js
"use strict";

const process = require('process');
const { Metadata, credentials } = require("@grpc/grpc-js");
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-grpc");

// Metadata is passed into to the tracer to provide both the dataset name and the API key required for Honeycomb.
//
// A dataset is basically a bucket where observability data goes.
// It's also a way to organize your data based on services or environments.
const metadata = new Metadata()
metadata.set('x-honeycomb-team', process.env.HONEYCOMB_API_KEY);
metadata.set('x-honeycomb-dataset', process.env.HONEYCOMB_DATASET);

// The Trace Exporter exports the data to Honeycomb and uses
// the previously-configured metadata and the Honeycomb endpoint.
const traceExporter = new OTLPTraceExporter({
  url: 'grpc://api.honeycomb.io:443/',
  credentials: credentials.createSsl(),
  metadata
});

// The service name is REQUIRED! It is a resource attribute, which means that it will be present on all observability data that your service generates.
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'node-otel-example',
  }),
  traceExporter,
  
  // Instrumentations allow you to add auto-instrumentation packages
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start()
  .then(() => console.log('Tracing initialized'))
  .catch((error) => console.log('Error initializing tracing', error));

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});