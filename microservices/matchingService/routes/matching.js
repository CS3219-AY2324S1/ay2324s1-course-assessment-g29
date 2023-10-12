const router = require('express').Router()
const axios = require('axios')

const MatchingService = require('../service/matching')

const matchingService = new MatchingService()

const collabServiceUrl = 'http://collabservice:8000/room/'

router.route('/').post(async (req, res) => {
  const { userid, difficulty, programmingLanguages } = req.body
  matchingService.checkRequeue(userid)
  if (matchingService.isEmpty(difficulty, programmingLanguages)) {
    const user1id = userid
    console.log(`${user1id} Joining ${difficulty} Queue`)
    matchingService.joinQueue(difficulty, programmingLanguages, user1id)
    try {
      // getting roomID
      const result = await axios.post(collabServiceUrl + 'createroom', { user1id })
      res.status(200).json({ roomId: result.data.roomId, message: 'Waiting for another person to join the queue', questionData: result.data.questionData })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: error.response.data.message })
    }
  } else {
    const user2id = userid
    const user = matchingService.popQueue(difficulty, programmingLanguages)
    const user1id = user.userid
    if (!user2id) {
      res.status(400).json('Unexpected error. Please rejoin queue.')
    }
    console.log(`${user2id} joining room with ${user1id}`)
    if (user2id) {
      try {
        const result = await axios.post(collabServiceUrl + 'joinroom', { user1id, user2id })
        res.status(200).json({ roomId: result.data.roomId, message: `Matched with ${user2id}`, questionData: result.data.questionData })
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
