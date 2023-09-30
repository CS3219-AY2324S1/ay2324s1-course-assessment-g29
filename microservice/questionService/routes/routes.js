// init router
const express = require('express')

const router = express.Router()

module.exports = router

// import model
const Model = require('../models/model')

// Post Method
router.post('/post', async (req, res) => {
  const data = new Model({
    name: req.body.name,
    description: req.body.description,
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

// Update by Name Method
router.patch('/update/:name', async (req, res) => {
  try {
    const name = req.params.name
    const updatedData = req.body
    const options = { new: true } // whether to return the updated data

    const result = await Model.findOneAndUpdate(
      { name: name },
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
    const data = await Model.findOneAndDelete({ name: name })
    res.send(`Document with ${data.name} has been deleted.`)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})
