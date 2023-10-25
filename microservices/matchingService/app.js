const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 4000
const axios = require('axios')
const { createServer } = require('node:http')
const { Server } = require('socket.io')

const MatchingService = require('./service/matching')

const matchingService = new MatchingService()

app.use(cors())
app.use(express.json())
const server = createServer(app)
const io = new Server(server)

const collabServiceUrl = 'http://collabservice:8000/room/'

io.on('connection', (socket) => {
  console.log(socket.id)
  socket.on('JoinQueue', async ({ userid, difficulty, languages }, callback) => {
    const secondAccount = matchingService.checkNewLocation(userid)
    console.log(secondAccount)
    if (secondAccount) {
      io.to(socket.id).emit('ErrorMatching', { errorMessage: 'Already in queue in another session' })
      callback()
    } else {
      if (matchingService.isEmpty(difficulty, languages)) {
        const user1id = userid
        console.log(`${user1id} Joining ${difficulty} Queue`)
        matchingService.joinQueue(difficulty, languages, user1id, socket.id)
        setTimeout(() => {
          if (!socket.disconnected) {
            io.to(socket.id).emit('ErrorMatching', { errorMessage: 'Connection Timeout! Please Rejoin Queue' })
            console.log(
            `Disconnecting from ${user1id} due to 30s passing and no match was found.`
            )
            socket.disconnect()
          }
        }, 30000)
        callback()
      } else {
        const user2id = userid
        const user = matchingService.popQueue(difficulty, languages)
        const user1id = user.userid
        const user1socket = user.socketid
        if (!user2id) {
          io.to(socket.id).emit('ErrorMatching', { errorMessage: 'Please Rejoin Queue' })
          callback()
        }
        console.log(`${user2id} joining room with ${user1id}`)
        if (user2id) {
          try {
            const matchingLanguages = matchingService.findMatchingLanguages(languages, user.languages)
            const result = await axios.post(collabServiceUrl + 'createroom', { user1id, user2id, matchingLanguages })
            io.to(socket.id).emit('MatchingSuccess', { matchedUserId: user1id, roomId: result.data.roomId, questionData: result.data.questionData, matchingLanguages })
            io.to(user1socket).emit('MatchingSuccess', { matchedUserId: user2id, roomId: result.data.roomId, questionData: result.data.questionData, matchingLanguages })
            callback()
          } catch (error) {
            io.to(user1socket).emit('ErrorMatching', { errorMessage: 'Please Rejoin Queue' })
            io.to(socket.id).emit('ErrorMatching', { errorMessage: 'Please Rejoin Queue' })
          }
        } else {
          io.to(user1socket).emit('ErrorMatching', { errorMessage: 'Please Rejoin Queue' })
          io.to(socket.id).emit('ErrorMatching', { errorMessage: 'Please Rejoin Queue' })
        }
      }
    }
  })

  socket.on('disconnect', async () => {
    console.log('Leaving Queue')
    matchingService.leaveQueue(socket.id)
  })
})

server.listen(port, () => console.log(`Express app running on port ${port}!`))

module.exports = io;