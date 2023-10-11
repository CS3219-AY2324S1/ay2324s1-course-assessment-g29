const router = require('express').Router()
const axios = require('axios')

const MatchingService = require('../service/matching')

const matchingService = new MatchingService()

const collabServiceUrl = 'http://collabservice:8000/room/'

router.route('/').post(async (req, res) => {
  if (matchingService.isEmpty()) {
    const { user1id } = req.body
    console.log(`${user1id} Joining Queue`)
    matchingService.joinQueue(user1id)
    try {
      // getting roomID
      console.log('hi')
      const result = await axios.post(collabServiceUrl + 'createroom', { user1id })
      console.log(result)
      res.status(200).json({ roomId: result.data.roomId, message: 'Waiting for another person to join the queue', questionData: result.data.questionData })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: error.response.data.message })
    }
  } else {
    const user1id = matchingService.popQueue()
    const user2id = req.body.user1id
    if (user1id === user2id) {
      // same person rejoin
      matchingService.joinQueue(user1id)
      return res.status(200).json({ message: 'Waiting for another person to join the queue' })
    }
    console.log(`${user2id} joining room with ${user1id}`)
    if (user1id) {
      try {
        const result = await axios.post(collabServiceUrl + 'joinroom', { user1id, user2id })
        res.status(200).json({ roomId: result.data.roomId, message: `Matched with ${user1id}`, questionData: result.data.questionData })
      } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.response.data.message })
      }
    } else {
      res.status(400).json('Unexpected error. Please rejoin queue.')
    }
  }
})

module.exports = router
