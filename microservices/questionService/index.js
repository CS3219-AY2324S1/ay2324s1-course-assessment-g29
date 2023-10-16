require('dotenv').config()

// Set up
const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

const port = process.env.PORT || 3002

app.listen(port, () => {
  console.log(`Server Started at ${port}`)
})

// Connecting to MongoDB
const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString)
const database = mongoose.connection

database.on('error', (error) => {
  console.log(error) // log if connection error
})

database.once('connected', () => {
  console.log('Database Connected') // log if connection successful
})

// Import route file
const routes = require('./routes/routes')

app.use('/question', routes)