// controllers/roomController.js
const admin = require('firebase-admin')
const { v4: uuidv4 } = require('uuid')
const serviceAccount = require('../configs/peerprep-f1dca-firebase-adminsdk-cwpky-38ec2f2d38.json')
const axios = require('axios')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()
const roomCollection = db.collection('rooms')
const historyCollection = db.collection('history')
const userToRoomCollection = db.collection('useridToRoom')

const createRoom = async (req, res) => {
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
}

const checkRoom = async (req, res) => {
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
}

const saveHistory = async (req, res) => {
  try {
    const { rid, user1id, user2id, questionData, code, language, messages } = req.body
    console.log(rid)
    console.log(questionData)
    console.log(code)

    await historyCollection.doc(rid).set({ user1id, user2id, questionData, code, language, messages })

    // Fetch the existing roomId data for user1id
    const user1Doc = await userToRoomCollection.doc(user1id).get()
    const user1Data = user1Doc.data() || { roomId: [] }
    const user1RoomIds = user1Data.roomId

    // Fetch the existing roomId data for user2id
    const user2Doc = await userToRoomCollection.doc(user2id).get()
    const user2Data = user2Doc.data() || { roomId: [] }
    const user2RoomIds = user2Data.roomId

    // Update the roomId arrays
    user1RoomIds.push(rid)
    user2RoomIds.push(rid)

    // Update the roomId data for user1id and user2id
    await userToRoomCollection.doc(user1id).set({ roomId: user1RoomIds })
    await userToRoomCollection.doc(user2id).set({ roomId: user2RoomIds })

    res.status(200).json({ message: 'Successfully save room history' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const updateHistory = async (req, res) => {
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
}

const changeQuestion = async (req, res) => {
  try {
    const { rid, questionData } = req.body
    console.log(rid)
    await roomCollection.doc(rid).update({ questionData })
    res.status(200).json({ message: 'Successfully change question' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const leaveRoom = async (req, res) => {
  try {
    const { rid } = req.body
    console.log(`Deleting room ${rid}`)
    await roomCollection.doc(rid).delete()
    res.status(200).json({ message: 'Room deleted successfully!' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  createRoom,
  checkRoom,
  saveHistory,
  updateHistory,
  changeQuestion,
  leaveRoom
}
