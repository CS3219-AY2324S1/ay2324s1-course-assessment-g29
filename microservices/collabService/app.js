const express = require('express')
const { createServer } = require('node:http')
const { Server } = require('socket.io')
const cors = require('cors')
const port = process.env.PORT || 2000

const app = express()
app.use(cors())
const server = createServer(app)
const io = new Server(server)

const RoomModel = require('./src/model/RoomModel')
const CollabController = require('./src/controller/collabController')

const roomModel = new RoomModel()
const collabController = new CollabController(roomModel, io)

io.on('connection', (socket) => {
  socket.on('JoinRoom', (data, callback) => {
    collabController.handleJoinRoom(socket, data, callback)
  })

  socket.on('Message', (data, callback) => {
    collabController.handleMessage(socket, data, callback)
  })

  socket.on('CodeChange', (data, callback) => {
    collabController.handleCodeChange(socket, data, callback)
  })

  socket.on('ChangeEditorLanguage', (data, callback) => {
    collabController.handleChangeEditorLanguage(socket, data, callback)
  })

  socket.on('ConfirmChangeEditorLanguage', (data, callback) => {
    collabController.handleConfirmChangeEditorLanguage(socket, data, callback)
  })

  socket.on('ChangeQuestionData', (data, callback) => {
    collabController.handleChangeQuestionData(socket, data, callback)
  })

  socket.on('ConfirmChangeQuestion', (data, callback) => {
    collabController.handleConfirmChangeQuestionData(socket, data, callback)
  })

  socket.on('CloseRoom', (data, callback) => {
    console.log(data)
    collabController.handleCloseRoom(socket, data, callback)
  })

  socket.on('disconnect', () => {
    collabController.handleDisconnect(socket)
  })
})

server.listen(port, () => {
  console.log(`Collab Service running at http://localhost:${port}`)
})

module.exports = io
