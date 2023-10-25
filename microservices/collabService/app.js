const express = require('express')
const { v4: uuidv4 } = require('uuid')
const axios = require('axios')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

const admin = require('firebase-admin')

const serviceAccount = require('./configs/peerprep-f1dca-firebase-adminsdk-cwpky-38ec2f2d38.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()
const roomCollection = db.collection('rooms')
const historyCollection = db.collection('history')

app.post('/room/createroom', async (req, res) => {
  try {
    const { user1id, user2id, matchingLanguages } = req.body
    let questionData
    await axios.get('http://questionservice:3002/question/getRandom')
      .then((response) => {
        questionData = response.data
      })
    const rid = uuidv4()
    const docRef = roomCollection.doc(rid)
    await docRef.set({ user1id, user2id, questionData, matchingLanguages })
    res.status(200).json({ roomId: rid, message: 'Room created successfully!', questionData })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/room/checkroom', async (req, res) => {
  try {
    const { userid } = req.body
    console.log(userid)
    const rooms = await roomCollection.get()
    let roomres = ''
    let roomdata = ''
    rooms.forEach(room => {
      const data = room.data()
      if (data.user1id === userid) {
        roomres = room.id
        roomdata = { matchedUserId: data.user2id, questionData: data.questionData, matchingLanguages: data.matchingLanguages }
      }
      if (data.user2id === userid) {
        roomres = room.id
        roomdata = { matchedUserId: data.user1id, questionData: data.questionData, matchingLanguages: data.matchingLanguages }
      }
    })
    res.status(200).json({ room: roomres, roomdata })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/room/savehistory', async (req, res) => {
  try {
    const { rid, user1id, user2id, questionData, code, language, messages } = req.body
    console.log(rid)
    console.log(questionData)
    console.log(code)
    await historyCollection.doc(rid).set({ user1id, user2id, questionData, code, language, messages })
    res.status(200).json({ message: 'Successfully save room history' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/room/updatehistory', async (req, res) => {
  try {
    const { rid, questionData, code, language, messages } = req.body
    console.log(rid)
    console.log(questionData)
    console.log(code)
    await historyCollection.doc(rid).update({ questionData, code, language, messages })
    res.status(200).json({ message: 'Successfully save room history' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// TODO: to implement in frontend
app.post('/room/changequestion', async (req, res) => {
  try {
    const { rid, questionData } = req.body
    console.log(rid)
    await roomCollection.doc(rid).update({ questionData })
    res.status(200).json({ message: 'Successfully change question' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/room/leaveroom', async (req, res) => {
  try {
    const { rid } = req.body
    console.log(`Deleting room ${rid}`)
    await roomCollection.doc(rid).delete()

    res.status(200).json({ message: 'Room deleted successfully!' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// const roomsRouter = require('./routes/room')

// app.use('/room', roomsRouter)

app.listen(port, () => console.log(`Express app running on port ${port}!`))

module.exports = app
