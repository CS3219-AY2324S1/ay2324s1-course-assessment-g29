class RoomModel {
  constructor () {
    this.roomIdToSocketId = {}
    this.socketToUserId = {}
    this.socketToRoom = {}
    this.roomIdToCode = {}
    this.roomIdToMessages = {}
    this.roomIdToLanguage = {}
  }

  disconnectFromSocket (socketId) {
    const roomId = this.socketToRoom[socketId]
    this.socketToRoom[socketId] = null
    this.socketToUserId[socketId] = null
    const newArray = this.roomIdToSocketId[roomId] ? this.roomIdToSocketId[roomId].filter(socket2Id => socket2Id !== socketId) : null
    this.roomIdToSocketId[roomId] = newArray
  }
}

module.exports = RoomModel
