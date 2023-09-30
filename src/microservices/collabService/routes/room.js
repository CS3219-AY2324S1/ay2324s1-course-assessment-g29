const router = require('express').Router()
const Room = require('../models/room-model')

router.route('/createroom').post(async (req, res) => {
  try {
    const {user1id} = req.body
    console.log(`${user1id} creating room`)
    await Room.findOneAndRemove({user1id})
    await Room.findOneAndDelete({user2id: user1id})
    const matchResult = await Room.create({ user1id })
    res.status(200).json({roomId: matchResult._id, message:'Room succesfully created!'})
  } catch (error) {
    console.log(error)
    res.status(400).json({message:'Unexpected Error'})
  }  
})

router.route('/joinroom').post(async (req, res) => {
  try {
    const {user1id, user2id} = req.body
    await Room.findOneAndRemove({user1id: user2id})
    await Room.findOneAndRemove({user2id})
    console.log(`${user2id} joining room`)
    const existing3 = await Room.findOne({user1id})
    if (!existing3) {
      return res.status(400).json({ message: 'Invalid Match' })
    } else {
      const roomId = existing3._id
      existing3.user2id = user2id
      await existing3.save()
      return res.status(200).json({roomId, message:`Matching with ${user1id}! Joining Room`})
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message:'Unexpected Error'})
  }
})

router.route('/leaveroom').post(async (req, res) => {
  try {
    const {userid} = req.body;
    console.log('joining room');
    const existing1 = await Room.findOneAndRemove({ user1id: userid });
    if (existing1) {
      return res.status(200).json({message: 'Successfully left room' })
    } 
    const existing2 = await Room.findOne({user2id: userid})
    if (existing2)  {
      existing2.user1id = existing2.user2id
      existing2.user2id = ''
      await existing2.save()
      return res.status(200).json({message: 'Successfully left room' })
    }
    return res.status(200).json({message: 'Successfully left room' })
    } catch (error) {
      console.log(error);
      res.status(400).json({ message:'Unexpected Error'})
    }
})

module.exports = router
