import { AMQPClient } from "@cloudamqp/amqp-client";

const QUEUE_NAME = "logs";

async function logConsumer(payloadHandler) {
  try {
    console.log("Consumer channel started");
    const amqp = new AMQPClient("amqp://consumer_sse:consumer@localhost:5672");
    const conn = await amqp.connect();
    let amqpChannel = await conn.channel();
    let amqpQueue = await amqpChannel.queue(QUEUE_NAME);
    await amqpQueue.subscribe({ noAck: true }, (amqpmsg) => {
      payloadHandler(amqpmsg.bodyToString());
    });
  } catch (error) {
    console.error("ERROR", error);
    error.connection.close();
    setTimeout(logConsumer, 1000); // will try to reconnect in 1s
  }
}
export const StartLogsConsumer = logConsumer;
