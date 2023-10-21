const express = require('express')
const { createServer } = require('node:http')
const { Server } = require('socket.io')
const cors = require('cors')
const port = process.env.PORT || 2000

const app = express()
app.use(cors())
const server = createServer(app)
const io = new Server(server)
const roomIdToSocketId = {}
const socketToUserId = {}
const socketToRoom = {}
const roomIdToCode = {}
const roomIdToMessages = {}
const roomIdToLanguage = {}

function disconnectFromSocket (socketid) {
  const roomId = socketToRoom[socketid]
  socketToRoom[socketid] = null
  socketToUserId[socketid] = null
  const newArray = roomIdToSocketId[roomId] ? roomIdToSocketId[roomId].filter(socket2id => socket2id !== socketid) : null
  roomIdToSocketId[roomId] = newArray
}

io.on('connection', (socket) => {
  socket.on('JoinRoom', ({ userid, roomid }, callback) => {
    console.log(`user ${userid} joining room ${roomid}`)
    try {
      if (!roomIdToSocketId[roomid]) {
        // still waiting for match
        console.log('user waiting for match')
        const newUserList = [socket.id]
        roomIdToSocketId[roomid] = newUserList
        socketToUserId[socket.id] = userid
        socketToRoom[socket.id] = roomid
        roomIdToMessages[roomid] = []
        roomIdToCode[roomid] = 'Please choose a language to begin!\n'
        roomIdToLanguage[roomid] = ''
        callback()
      }
      const roomSockets = roomIdToSocketId[roomid]
      const filtered = roomSockets.filter(socket2id => socket2id !== socket.id)
      if (filtered.length > 0) {
        const socket1id = filtered[0]
        const filtered2 = roomSockets.filter(socket2id => socket2id === socket.id)
        if (filtered2.length === 0) {
          roomIdToSocketId[roomid].push(socket.id)
        }
        socketToRoom[socket.id] = roomid
        socketToUserId[socket.id] = userid
        console.log(roomIdToMessages[roomid])
        console.log(roomIdToCode[roomid])
        console.log(roomIdToLanguage[roomid])
        console.log('Match')
        io.to(socket1id).emit('MatchSuccess', { matchedUserId: userid, messages: roomIdToMessages[roomid], code: roomIdToCode[roomid], language: roomIdToLanguage[roomid] })
        io.to(socket.id).emit('MatchSuccess', { matchedUserId: socketToUserId[socket1id], messages: roomIdToMessages[roomid], code: roomIdToCode[roomid], language: roomIdToLanguage[roomid] })
        console.log(`Match Success between ${userid} and ${socketToUserId[socket1id]}`)
        callback()
      } else {
        callback()
      }
    } catch (error) {
      return callback(error)
    }
  })

  socket.on('Message', ({ message }, callback) => {
    try {
      console.log(socket.id)
      console.log(message)
      const roomId = socketToRoom[socket.id]
      roomIdToMessages[roomId].push(message)
      for (const index in roomIdToSocketId[roomId]) {
        console.log(index)
        const socket2id = roomIdToSocketId[roomId][index]
        console.log(socket2id)
        if (socket2id !== socket.id) {
          console.log('hi')
          io.to(socket2id).emit('Message', { message })
        }
      }
      callback()
    } catch (error) {
      return callback(error)
    }
  })

  socket.on('CodeChange', ({ code }, callback) => {
    try {
      console.log(socket.id)
      console.log(code)
      const roomId = socketToRoom[socket.id]
      roomIdToCode[roomId] = code
      for (const index in roomIdToSocketId[roomId]) {
        const socket2id = roomIdToSocketId[roomId][index]
        if (socket2id !== socket.id) {
          io.to(socket2id).emit('CodeChange', { code })
        }
      }
      callback()
    } catch (error) {
      return callback(error)
    }
  })

  socket.on('ChangeEditorLanguage', ({ language }, callback) => {
    try {
      console.log(socket.id)
      console.log(language)
      const roomId = socketToRoom[socket.id]
      for (const index in roomIdToSocketId[roomId]) {
        const socket2id = roomIdToSocketId[roomId][index]
        if (socket2id !== socket.id) {
          io.to(socket2id).emit('CheckChangeEditorLanguage', { language })
        }
      }
      callback()
    } catch (error) {
      return callback(error)
    }
  })

  socket.on('ConfirmChangeEditorLanguage', ({ agree, language }, callback) => {
    try {
      console.log(socket.id)
      const roomId = socketToRoom[socket.id]
      roomIdToLanguage[roomId] = language
      for (const index in roomIdToSocketId[roomId]) {
        const socket2id = roomIdToSocketId[roomId][index]
        if (socket2id !== socket.id) {
          io.to(socket2id).emit('ConfirmChangeEditorLanguage', { agree, language })
        }
      }
      callback()
    } catch (error) {
      return callback(error)
    }
  })

  socket.on('CloseRoom', async () => {
    console.log('disconnecting other peer')
    const roomId = socketToRoom[socket.id]
    let socket2idres = ''
    for (const index in roomIdToSocketId[roomId]) {
      const socket2id = roomIdToSocketId[roomId][index]
      if (socket2id !== socket.id) {
        socket2idres = socket2id
        io.to(socket2id).emit('DisconnectPeer')
      }
    }
    roomIdToMessages[roomId] = null
    roomIdToCode[roomId] = null
    roomIdToLanguage[roomId] = null
    disconnectFromSocket(socket.id)
    if (socket2idres !== '') {
      disconnectFromSocket(socket2idres)
    }
  })

  socket.on('disconnect', async () => {
    disconnectFromSocket(socket.id)
  })
})

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`)
})
