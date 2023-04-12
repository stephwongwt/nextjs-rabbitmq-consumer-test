import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { StartLogsConsumer } from "./rabbitmq.js";

const app = express();

const PORT = 5000;

let clients = [];

function notifsHandler(request, response) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify(facts)}\n\n`;

  response.write(data);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response,
  };

  clients.push(newClient);

  request.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
}

function sendJsonPayloadToAll(jsonPayload) {
  clients.forEach((client) => {
    client.response.write(
      `data: ${JSON.stringify({ payload: jsonPayload })}\n\n`
    );
  });
}

async function startServer() {
  await StartLogsConsumer(sendJsonPayloadToAll);

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get("/status", (request, response) =>
    response.json({ clients: clients.length })
  );

  app.get("/notifs", notifsHandler);

  app.listen(PORT, () => {
    console.log(`Service listening at http://localhost:${PORT}`);
  });
}

startServer();
