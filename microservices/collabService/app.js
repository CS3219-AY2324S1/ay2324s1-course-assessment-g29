const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8000
const roomRoutes = require('./routes/roomRoutes')

app.use(cors())
app.use(express.json())

app.use('/', roomRoutes)

app.listen(port, () => console.log(`Express app running on port ${port}!`))
