const express = require('express')
const { createServer } = require('node:http')
const { Server } = require('socket.io')
const cors = require('cors')
const port = process.env.PORT || 2000

const app = express()
app.use(cors())
const server = createServer(app)
const io = new Server(server)

const RoomModel = require('./model/RoomModel')
const RoomController = require('./controller/roomController')

const roomModel = new RoomModel()
const roomController = new RoomController(roomModel, io)

io.on('connection', (socket) => {
  socket.on('JoinRoom', (data, callback) => {
    roomController.handleJoinRoom(socket, data, callback)
  })

  socket.on('Message', (data, callback) => {
    roomController.handleMessage(socket, data, callback)
  })

  socket.on('CodeChange', (data, callback) => {
    roomController.handleCodeChange(socket, data, callback)
  })

  socket.on('ChangeEditorLanguage', (data, callback) => {
    roomController.handleChangeEditorLanguage(socket, data, callback)
  })

  socket.on('ConfirmChangeEditorLanguage', (data, callback) => {
    roomController.handleConfirmChangeEditorLanguage(socket, data, callback)
  })

  socket.on('CloseRoom', () => {
    roomController.handleCloseRoom(socket)
  })

  socket.on('disconnect', () => {
    roomController.handleDisconnect(socket)
  })
})

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`)
})

module.exports = io
