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

module.exports = app
