class RoomController {
  constructor (roomModel, io) {
    this.roomModel = roomModel
    this.io = io
  }

  handleJoinRoom (socket, { userid, roomid }, callback) {
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
        callback()
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

        console.log('Match')

        this.io.to(socket1id).emit('MatchSuccess', {
          matchedUserId: userid,
          messages: this.roomModel.roomIdToMessages[roomid],
          code: this.roomModel.roomIdToCode[roomid],
          language: this.roomModel.roomIdToLanguage[roomid]
        })

        this.io.to(socket.id).emit('MatchSuccess', {
          matchedUserId: this.roomModel.socketToUserId[socket1id],
          messages: this.roomModel.roomIdToMessages[roomid],
          code: this.roomModel.roomIdToCode[roomid],
          language: this.roomModel.roomIdToLanguage[roomid]
        })

        console.log(`Match Success between ${userid} and ${this.roomModel.socketToUserId[socket1id]}`)
        callback()
      } else {
        callback()
      }
    } catch (error) {
      return callback(error)
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

      callback()
    } catch (error) {
      return callback(error)
    }
  }

  handleChangeEditorLanguage (socket, { language }, callback) {
    try {
      console.log(socket.id)
      console.log(language)
      const roomId = this.roomModel.socketToRoom[socket.id]

      for (const index in this.roomModel.roomIdToSocketId[roomId]) {
        const socket2id = this.roomModel.roomIdToSocketId[roomId][index]
        if (socket2id !== socket.id) {
          this.io.to(socket2id).emit('CheckChangeEditorLanguage', { language })
        }
      }

      callback()
    } catch (error) {
      return callback(error)
    }
  }

  handleConfirmChangeEditorLanguage (socket, { agree, language }, callback) {
    try {
      console.log(socket.id)
      const roomId = this.roomModel.socketToRoom[socket.id]
      this.roomModel.roomIdToLanguage[roomId] = language

      for (const index in this.roomModel.roomIdToSocketId[roomId]) {
        const socket2id = this.roomModel.roomIdToSocketId[roomId][index]
        if (socket2id !== socket.id) {
          this.io.to(socket2id).emit('ConfirmChangeEditorLanguage', { agree, language })
        }
      }

      callback()
    } catch (error) {
      return callback(error)
    }
  }

  handleCloseRoom (socket) {
    console.log('disconnecting other peer')
    const roomId = this.roomModel.socketToRoom[socket.id]
    let socket2idres = ''
    for (const index in this.roomModel.roomIdToSocketId[roomId]) {
      const socket2id = this.roomModel.roomIdToSocketId[roomId][index]
      if (socket2id !== socket.id) {
        socket2idres = socket2id
        this.io.to(socket2id).emit('DisconnectPeer')
      }
    }

    this.roomModel.roomIdToMessages[roomId] = null
    this.roomModel.roomIdToCode[roomId] = null
    this.roomModel.roomIdToLanguage[roomId] = null
    this.roomModel.disconnectFromSocket(socket.id)

    if (socket2idres !== '') {
      this.roomModel.disconnectFromSocket(socket2idres)
    }
  }

  handleDisconnect (socket) {
    this.roomModel.disconnectFromSocket(socket.id)
  }
}

module.exports = RoomController