// Express + Set up port
const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())

const { routes } = require('./routes')

app.get('/', (req, res) => {
  res.json({
    status: true
  })
})

app.use('/question', routes)

// Connecting to MongoDB
const mongoose = require('mongoose')
const path = require('path')
const envPath = path.join(__dirname, '../.env')
require('dotenv').config({ path: envPath })

const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString)
const database = mongoose.connection

database.on('error', (error) => {
  console.log(error) // log if connection error
})

database.once('connected', () => {
  console.log('Database Connected') // log if connection successful
})

module.exports = app
