const axios = require('axios')
const AccessToken = require('twilio').jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant
const path = require('path')
const envPath = path.join(__dirname, '../../configs/.env')
require('dotenv').config({ path: envPath })
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioApiKey = process.env.TWILIO_API_KEY
const twilioApiSecret = process.env.TWILIO_API_SECRET

class CollabController {
  constructor (roomModel, io) {
    this.roomModel = roomModel
    this.io = io
  }

  handleJoinRoom (socket, { userid, roomid, questionData }, callback) {
    console.log(`user ${userid} joining room ${roomid}`)
    try {
      if (!this.roomModel.roomIdToSocketId[roomid]) {
        // still waiting for a match
        console.log('user waiting for a match')
        const newUserList = [socket.id]
        this.roomModel.roomIdToSocketId[roomid] = newUserList
        this.roomModel.socketToUserId[socket.id] = userid
        this.roomModel.socketToRoom[socket.id] = roomid
        this.roomModel.roomIdToMessages[roomid] = []
        this.roomModel.roomIdToCode[roomid] = 'Please choose a language to begin!\n'
        this.roomModel.roomIdToLanguage[roomid] = ''
        this.roomModel.roomIdToQuestionData[roomid] = questionData
        return
      }

      const roomSockets = this.roomModel.roomIdToSocketId[roomid]
      const filtered = roomSockets.filter(socket2id => socket2id !== socket.id)

      if (filtered.length > 0) {
        const socket1id = filtered[0]
        const filtered2 = roomSockets.filter(socket2id => socket2id === socket.id)

        if (filtered2.length === 0) {
          this.roomModel.roomIdToSocketId[roomid].push(socket.id)
        }

        this.roomModel.socketToRoom[socket.id] = roomid
        this.roomModel.socketToUserId[socket.id] = userid

        console.log(this.roomModel.roomIdToMessages[roomid])
        console.log(this.roomModel.roomIdToCode[roomid])
        console.log(this.roomModel.roomIdToLanguage[roomid])
        console.log(this.roomModel.roomIdToQuestionData[roomid])

        console.log('Match')

        // Create Video Grant
        const videoGrant = new VideoGrant({
          room: roomid
        })

        // Create an access token which we will sign and return to the client,
        // containing the grant we just created
        const token1 = new AccessToken(
          twilioAccountSid,
          twilioApiKey,
          twilioApiSecret,
          { identity: this.roomModel.socketToUserId[socket1id] }
        )
        token1.addGrant(videoGrant)

        const tokenString1 = token1.toJwt()
        // Serialize the token to a JWT string
        console.log(tokenString1)

        // Create an access token which we will sign and return to the client,
        // containing the grant we just created
        const token2 = new AccessToken(
          twilioAccountSid,
          twilioApiKey,
          twilioApiSecret,
          { identity: userid }
        )
        token2.addGrant(videoGrant)

        const tokenString2 = token2.toJwt()
        // Serialize the token to a JWT string
        console.log(tokenString2)

        this.io.to(socket1id).emit('MatchSuccess', {
          matchedUserId: userid,
          messages: this.roomModel.roomIdToMessages[roomid],
          code: this.roomModel.roomIdToCode[roomid],
          language: this.roomModel.roomIdToLanguage[roomid],
          questionData: this.roomModel.roomIdToQuestionData[roomid],
          twilioToken: tokenString1
        })

        this.io.to(socket.id).emit('MatchSuccess', {
          matchedUserId: this.roomModel.socketToUserId[socket1id],
          messages: this.roomModel.roomIdToMessages[roomid],
          code: this.roomModel.roomIdToCode[roomid],
          language: this.roomModel.roomIdToLanguage[roomid],
          questionData: this.roomModel.roomIdToQuestionData[roomid],
          twilioToken: tokenString2
        })

        console.log(`Match Success between ${userid} and ${this.roomModel.socketToUserId[socket1id]}`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleMessage (socket, { message }, callback) {
    try {
      console.log(socket.id)
      console.log(message)
      const roomId = this.roomModel.socketToRoom[socket.id]
      this.roomModel.roomIdToMessages[roomId].push(message)

      for (const index in this.roomModel.roomIdToSocketId[roomId]) {
        const socket2id = this.roomModel.roomIdToSocketId[roomId][index]
        if (socket2id !== socket.id) {
          console.log('hi')
          this.io.to(socket2id).emit('Message', { message })
        }
      }

      callback()
    } catch (error) {
      return callback(error)
    }
  }

  handleCodeChange (socket, { code }, callback) {
    try {
      console.log(socket.id)
      console.log(code)
      const roomId = this.roomModel.socketToRoom[socket.id]
      this.roomModel.roomIdToCode[roomId] = code

      for (const index in this.roomModel.roomIdToSocketId[roomId]) {
        const socket2id = this.roomModel.roomIdToSocketId[roomId][index]
        if (socket2id !== socket.id) {
          this.io.to(socket2id).emit('CodeChange', { code })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleChangeEditorLanguage (socket, { language }, callback) {
    try {
      console.log(socket.id)
      console.log(language)
      const roomId = this.roomModel.socketToRoom[socket.id]
      this.roomModel.roomIdToLanguage[roomId] = language

      for (const index in this.roomModel.roomIdToSocketId[roomId]) {
        const socket2id = this.roomModel.roomIdToSocketId[roomId][index]
        if (socket2id !== socket.id) {
          this.io.to(socket2id).emit('ChangeEditorLanguage', { language })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleChangeQuestionData (socket, { questionData }, callback) {
    try {
      console.log(socket.id)
      console.log('changing question data')
      console.log(questionData)
      const roomId = this.roomModel.socketToRoom[socket.id]
      this.roomModel.roomIdToQuestionData[roomId] = questionData
      axios.post('http://roomservice:8000/room/changeQuestion', { rid: roomId, questionData })
        .catch((error) => {
          console.log(error)
        })
      for (const index in this.roomModel.roomIdToSocketId[roomId]) {
        const socket2id = this.roomModel.roomIdToSocketId[roomId][index]
        if (socket2id !== socket.id) {
          this.io.to(socket2id).emit('ChangeQuestionData', { questionData })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleCloseRoom (socket, { rid, user1id, user2id, questionData, code, language, messages }, callback) {
    console.log('disconnecting other peer')
    const roomId = this.roomModel.socketToRoom[socket.id]
    let socket2idres = ''
    for (const index in this.roomModel.roomIdToSocketId[roomId]) {
      const socket2id = this.roomModel.roomIdToSocketId[roomId][index]
      if (socket2id !== socket.id) {
        socket2idres = socket2id
        this.io.to(socket2id).emit('DisconnectPeer')
        axios.post('http://roomservice:8000/room/savehistory', {
          rid,
          user1id,
          user2id,
          questionData,
          code,
          language,
          messages
        })
          .then((response) => {
            const message = response.data.message
            console.log(message)
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
    this.roomModel.roomIdToMessages[roomId] = null
    this.roomModel.roomIdToCode[roomId] = null
    this.roomModel.roomIdToLanguage[roomId] = null
    this.roomModel.roomIdToQuestionData[roomId] = null
    this.roomModel.disconnectFromSocket(socket.id)

    if (socket2idres !== '') {
      this.roomModel.disconnectFromSocket(socket2idres)
    }
  }

  handleDisconnect (socket) {
    this.roomModel.disconnectFromSocket(socket.id)
  }
}

module.exports = CollabController
