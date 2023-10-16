const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
  name: {
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
  imageBSON: {
    required: false,
    type: Buffer
  }
})

module.exports = mongoose.model('Data', dataSchema)
