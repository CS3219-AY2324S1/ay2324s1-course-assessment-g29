const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const port = process.env.PORT || 2000;


  const app = express();
  const server = createServer(app);
  const io = new Server(server);
  const roomIdToSocketId = {};
  const socketToUserId = {};
  const socketToRoom = {};

function disconnectFromSocket(socketid) {
  const roomId = socketToRoom[socketid];
  socketToRoom[socketid] = null;
  socketToUserId[socketid] = null;
  const newArray = roomIdToSocketId[roomId]?roomIdToSocketId[roomId].filter(socket2id => socket2id !== socketid): null;
  roomIdToSocketId[roomId] = newArray;
}

io.on('connection', (socket) => {
    socket.on('JoinRoom', ({ userid, roomid }, callback) => {
      console.log(`user ${userid} joining room ${roomid}`)
      try {
        
        if (!roomIdToSocketId[roomid]) {
          //still waiting for match
          console.log("user waiting for match")
          const newUserList = [socket.id];
          roomIdToSocketId[roomid] = newUserList;
          socketToUserId[socket.id] = userid; 
          socketToRoom[socket.id] = roomid;
          callback();
          
        } 
        
        const roomSockets = roomIdToSocketId[roomid];
        const filtered = roomSockets.filter(socket2id => socket2id !== socket.id);
        if (filtered.length > 0) {
          const socket1id = roomIdToSocketId[roomid][0];
          roomIdToSocketId[roomid].push(socket.id);
          socketToRoom[socket.id] = roomid;
          socketToUserId[socket.id] = userid; 
          io.to(socket1id).emit('MatchSuccess', {matchedUserId: userid});
          io.to(socket.id).emit('MatchSuccess', {matchedUserId: socketToUserId[socket1id]});
          callback();
        } else {
          callback();
        }

      } catch (error) {
        return callback(error);
      }
    });

    socket.on('Message', ({ message }, callback) => {
      try {
        console.log(socket.id)
        console.log(message)
        const roomId = socketToRoom[socket.id];
        for (const index in roomIdToSocketId[roomId]) {
          const socket2id = roomIdToSocketId[roomId][index]
          if (socket2id != socket.id) {
            io.to(socket2id).emit('Message', {message});
          }
        }
        callback();
      } catch (error) {
        return callback(error);
      }
    });


    socket.on('disconnect', () => {
      console.log('disconnecting other peer')
      const roomId = socketToRoom[socket.id];
      for (const index in roomIdToSocketId[roomId]) {
        const socket2id = roomIdToSocketId[roomId][index]
        if (socket2id != socket.id) {
          io.to(socket2id).emit('DisconnectPeer');
        }
      }
      disconnectFromSocket(socket.id);
    })
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
