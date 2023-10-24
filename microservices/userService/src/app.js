// Express + Set up port
const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())

const { userRoutes } = require('./routes')

app.get('/', (req, res) => {
  res.json({
    status: true
  })
})

app.use('/user', userRoutes)

module.exports = app