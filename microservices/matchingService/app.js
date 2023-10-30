const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 4000
const { createServer } = require('node:http')
const { Server } = require('socket.io')

const MatchingService = require('./model/matching')
const MatchingController = require('./controller/matchingController')

app.use(cors())
app.use(express.json())

const server = createServer(app)
const io = new Server(server)

const matchingService = new MatchingService()
const matchingController = new MatchingController(matchingService, io)

const collabServiceUrl = 'http://collabservice:8000/room/'

io.on('connection', (socket) => {
  console.log(socket.id)

  matchingController.handleJoinQueue(socket, collabServiceUrl)

  socket.on('disconnect', async () => {
    console.log('Leaving Queue')
    matchingController.handleDisconnect(socket)
  })
})

server.listen(port, () => console.log(`Express app running on port ${port}!`))

module.exports = io
