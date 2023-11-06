const express = require("express");
const { ExpressPeerServer } = require("peer");

const app = express();

const http = require("http");

const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
	debug: true,
	path: "/peerjs",
});

app.use("/", peerServer);

peerServer.on("connection", (client) => {
  console.log(`New client connected: ${client.getId()}`);
});

// Assuming you have a 'peer' object created with PeerJS
peerServer.on("disconnect", (client) => {
  console.log(`Peer ${client.getId()} has disconnected`);
  // You can perform any necessary actions when the peer disconnects
});

peerServer.on("error", (error) => {
  console.log(`An error occurred: ${error}`);
  // Handle the error
});

server.listen(3003);
console.log(`Server is listening on port 3003 with path '/peerjs'`);
