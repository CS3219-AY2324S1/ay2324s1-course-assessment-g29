const axios = require('axios')

class MatchingController {
  constructor (matchingModel, io) {
    this.matchingModel = matchingModel
    this.io = io
  }

  async handleJoinQueue (socket, collabServiceUrl) {
    socket.on('JoinQueue', async ({ userid, difficulty, languages }, callback) => {
      const secondAccount = this.matchingModel.checkNewLocation(userid)
      console.log(secondAccount)
      if (secondAccount) {
        this.io.to(socket.id).emit('ErrorMatching', { errorMessage: 'Already in queue in another session' })
        callback()
      } else {
        if (this.matchingModel.isEmpty(difficulty, languages)) {
          const user1id = userid
          console.log(`${user1id} Joining ${difficulty} Queue`)
          this.matchingModel.joinQueue(difficulty, languages, user1id, socket.id)
          setTimeout(() => {
            if (!socket.disconnected) {
              this.io.to(socket.id).emit('ErrorMatching', { errorMessage: 'Connection Timeout! Please Rejoin Queue' })
              console.log(`Disconnecting from ${user1id} due to 30s passing and no match was found.`)
              socket.disconnect()
            }
          }, 30000)
          callback()
        } else {
          const user2id = userid
          const user = this.matchingModel.popQueue(difficulty, languages)
          const user1id = user.userid
          const user1socket = user.socketid
          if (!user2id) {
            this.io.to(socket.id).emit('ErrorMatching', { errorMessage: 'Please Rejoin Queue' })
            callback()
          }
          console.log(`${user2id} joining room with ${user1id}`)
          if (user2id) {
            try {
              const matchingLanguages = this.matchingModel.findMatchingLanguages(languages, user.languages)
              const result = await axios.post(collabServiceUrl + 'createroom', { user1id, user2id, matchingLanguages })
              this.io.to(socket.id).emit('MatchingSuccess', { matchedUserId: user1id, roomId: result.data.roomId, questionData: result.data.questionData, matchingLanguages })
              this.io.to(user1socket).emit('MatchingSuccess', { matchedUserId: user2id, roomId: result.data.roomId, questionData: result.data.questionData, matchingLanguages })
              callback()
            } catch (error) {
              this.io.to(user1socket).emit('ErrorMatching', { errorMessage: 'Please Rejoin Queue' })
              this.io.to(socket.id).emit('ErrorMatching', { errorMessage: 'Please Rejoin Queue' })
            }
          } else {
            this.io.to(user1socket).emit('ErrorMatching', { errorMessage: 'Please Rejoin Queue' })
            this.io.to(socket.id).emit('ErrorMatching', { errorMessage: 'Please Rejoin Queue' })
          }
        }
      }
    })
  }

  handleDisconnect (socket) {
    console.log('Leaving Queue')
    this.matchingModel.leaveQueue(socket.id)
  }
}
module.exports = MatchingController
