/**
 * Copyright 2023 ROU Technology
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';

const traceExporter = new ConsoleSpanExporter();

export const otelSDK = new NodeSDK({
  spanProcessor: new SimpleSpanProcessor(traceExporter),
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
});

async function shutdownSDK() {
  try {
    await otelSDK.shutdown();
    console.log('SDK shut down successfully');
  } catch (err) {
    console.log('Error shutting down SDK', err);
  }
}

// Call the shutdownSDK function when the process is about to exit
process.on('beforeExit', () => {
  shutdownSDK().finally(() => process.exit(0));
});
