const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  displayName: {
    required: true,
    type: String
  },
  description: {
    required: true,
    type: String
  },
  topic: {
    required: true,
    type: Array
  },
  imagesArray: {
    required: false,
    type: Array
  },
  difficulty: {
    required: true,
    type: String,
    enum: ['Easy', 'Medium', 'Hard']
  },
  id: {
    required: false,
    type: Number
  }
})

module.exports = mongoose.model('Data', dataSchema)
