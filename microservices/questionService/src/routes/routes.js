// init router
const express = require('express')
const router = express.Router()

const questionController = require('../controllers/question.controller')

// Post Method
router.post('/post', async (req, res) => {
  try {
    const dataToSave = await questionController.postQuestion(req.body)
    res.status(200).json(dataToSave)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get all Method
router.get('/getAll', async (req, res) => {
  try {
    const data = await questionController.getAllQuestion()
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all by difficulty Method
router.get('/getDifficulty/:difficulty', async (req, res) => {
  try {
    const data = await questionController.getAllByDifficulty(req.params.difficulty)
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get by Name Method
router.get('/getOneByName/:name', async (req, res) => {
  try {
    const data = await questionController.getByName(req.params.name)
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get random one with difficulty
router.get('/getOneByDifficulty/:difficulty', async (req, res) => {
  try {
    const data = await questionController.getOneByDifficulty(req.params.difficulty)
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all by Topic Method
router.get('/getTopic/:topic', async (req, res) => {
  try {
    const data = await questionController.getAllByTopic(req.params.topic)
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get random
router.get('/getRandom', async (req, res) => {
  try {
    const data = await questionController.getRandom()
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get random one with topic
router.get('/getOneByTopic/:topic', async (req, res) => {
  try {
    const data = await questionController.getOneByTopic(req.params.topic)
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update by Name Method
router.patch('/update/:name', async (req, res) => {
  try {
    const name = req.params.name
    const updatedData = req.body

    const result = await questionController.updateName({ name, updatedData })

    res.send(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete by Name Method
router.delete('/delete/:name', async (req, res) => {
  try {
    const data = await questionController.deleteQuestion(req.params.name)
    res.send(`Document with ${data.name} has been deleted.`)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
