// init router
const express = require('express')

const router = express.Router()

module.exports = router

// import model
const Model = require('../models/model')

// Post Method
router.post('/post', async (req, res) => {
  const displayName = req.body.displayName
  const name = displayName.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
  const data = new Model({
    name,
    displayName,
    description: req.body.description,
    topic: req.body.topic
  })

  try {
    const dataToSave = await data.save()
    res.status(200).json(dataToSave)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get all Method
router.get('/getAll', async (req, res) => {
  try {
    const data = await Model.find()
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get by Name Method
router.get('/getOne/:name', async (req, res) => {
  try {
    const data = await Model.find({ name: req.params.name })
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all by Topic Method
router.get('/getTopic/:topic', async (req, res) => {
  try {
    const data = await Model.find({ topic: req.params.topic })
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get random
router.get('/getRandom', async (req, res) => {
  try {
    let data
    await Model.aggregate().sample(1).replaceRoot({ question: '$$ROOT' }).then((res) => {
      data = res[0]
    })
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get random one with topic
router.get('/getOneByTopic/:topic', async (req, res) => {
  try {
    const count = await Model.Model.find({ topic: req.params.topic }).estimatedDocumentCount()
    const random = Math.floor(Math.random() * count)
    const data = await Model.findOne({ topic: req.params.topic }).skip(random).exec()
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
    const options = { new: true } // whether to return the updated data

    const result = await Model.findOneAndUpdate(
      { name },
      updatedData,
      options
    )

    res.send(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete by Name Method
router.delete('/delete/:name', async (req, res) => {
  try {
    const name = req.params.name
    const data = await Model.findOneAndDelete({ name })
    res.send(`Document with ${data.name} has been deleted.`)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})
