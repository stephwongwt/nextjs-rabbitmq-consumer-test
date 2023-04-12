import { AMQPClient } from "@cloudamqp/amqp-client";

const QUEUE_NAME = "logs";
let amqpQueue;

async function run() {
  try {
    if (!amqpQueue) {
      console.log("Producer started");
      const amqp = new AMQPClient("amqp://producer:producer@localhost:5672");
      const conn = await amqp.connect();
      const ch = await conn.channel();
      amqpQueue = await ch.queue(QUEUE_NAME);
      publishMsg();
      setInterval(publishMsg, 1000);
    }

    // await consumer.wait(); // will block until consumer is canceled or throw an error if server closed channel/connection
    // await conn.close();
  } catch (error) {
    console.error("ERROR", error);
    error.connection.close();
    setTimeout(run, 1000); // will try to reconnect in 1s
  }
}

async function publishMsg() {
  const today = new Date().toISOString();
  const msg = `Hello World, date time is ${today}!`;
  console.log("Sending: " + msg);
  await amqpQueue.publish(msg, { deliveryMode: 2 });
}

run();
