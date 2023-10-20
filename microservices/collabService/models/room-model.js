const mongoose = require('mongoose')

const Schema = mongoose.Schema

const roomSchema = new Schema({
  user1id: { type: String, required: true },
  questionData: { type: Object, required: true },
  user2id: { type: String }
}, {
  timestamps: true
})

const Room = mongoose.model('Room', roomSchema)

module.exports = Room
