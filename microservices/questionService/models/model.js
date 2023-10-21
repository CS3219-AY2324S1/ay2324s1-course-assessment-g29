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
  imagesMap: {
    required: false,
    type: Map
  },
  difficulty: {
    required: true,
    type: String,
    enum: ['Easy', 'Medium', 'Hard']
  }
})

module.exports = mongoose.model('Data', dataSchema)
