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
  tag: {
    required: false,
    type: Array
  },
  imagesMap: {
    required: false,
    type: Map
  }
})

module.exports = mongoose.model('Data', dataSchema)
