import { createServer } from "http";
import { AMQPClient } from "@cloudamqp/amqp-client";

const QUEUE_NAME = "logs";
let amqpChannel;
let amqpQueue;

async function setupChannel() {
  try {
    if (!amqpQueue) {
      console.log("Consumer channel started");
      const amqp = new AMQPClient(
        "amqp://consumer_sse:consumer@localhost:5672"
      );
      const conn = await amqp.connect();
      amqpChannel = await conn.channel();
      amqpQueue = await amqpChannel.queue(QUEUE_NAME);
    }
  } catch (error) {
    console.error("ERROR", error);
    error.connection.close();
    setTimeout(setupChannel, 1000); // will try to reconnect in 1s
  }
}

export const rabbitmqPromise = setupChannel();

export async function consumeMessagesOnce(req, res) {
  let msgpayload = [];
  await amqpQueue.subscribe({ noAck: true }, async (msg) => {
    if (msg === null) {
      console.log("there are no msgs");
    } else {
      const msgStr = msg.bodyToString();
      // console.log(`Received: ${msgStr}`);
      if (msgStr !== null) {
        msgpayload.push(msgStr);
      }
      msg.cancelConsumer();
    }
  });
  res.send({ payload: msgpayload });
}

// Generate SSE stream of real-time data
function generateData() {
  return `data: ${new Date().toISOString()}\n\n`;
}

// Create an HTTP server
const server = createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Send initial data to client
  res.write(generateData());

  // Send new data every second
  const intervalId = setInterval(() => {
    res.write(generateData());
  }, 1000);

  // Clean up interval when client disconnects
  req.on("close", () => {
    clearInterval(intervalId);
  });
});

await rabbitmqPromise;
// Start the HTTP server
server.listen(5000, () => {
  console.log("Server listening on port 5000");
});
