const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const port = process.env.PORT || 2000;


const app = express();
const server = createServer(app);
const io = new Server(server);
const users = {};
const roomToBroadCaster = {};
const socketToRoom = {};

/*
 * Removes disconnected user from arrays above
 *
 * @param {String} id Socket.Id of disconnected user
 *
 */
function removeDisconnectedID(id) {

    const roomID = socketToRoom[id];
    socketToRoom[id] = null;
    const newList = !users[roomID] ? []: users[roomID].filter(socket => socket !== id);
    users[roomID] = newList;
}

io.on('connection', (socket) => {
    
    socket.on('join collab', ({ userid, roomid }, callback) => {
        const { error, user } = addUser({ id: socket.id , name , roomid });
    
        if(error) return callback(error);
    
        socket.join(user.room);
    
        socket.emit('message', { user: 'admin', text: `Welcome to the room ${user.name}!`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    
        callback();
      });

    
    socket.on('disconnect', () => {
        
        const user = removeUser(socket.id);

        if(user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        }
        const collabId = roomToCollab[socketToRoom[socket.id]];
        removeDisconnectedID(socket.id);
        socket.to(collabId).emit("disconnectPeer", socket.id);
    })
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
