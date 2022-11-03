import express from "express";
import http from "http";
import WebSocket from "ws";

const server = express();
const httpServer = http.createServer(server);
const wsServer = new WebSocket.Server({ server: httpServer }); 

wsServer.on('connection', ws => {
  (ws as any).isAlive = true;

  ws.on('pong', () => {
    (ws as any).isAlive = true;
  })

  ws.on('message', msg => {

  });

  ws.send("Hewwo");
});

export const removeDeadClients = () => wsServer.clients.forEach(client => {
  if(!(client as any).isAlive) return client.terminate();

  (client as any).isAlive = false;
  client.ping(null, false);
});

export default server;
