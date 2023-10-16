// init router
const express = require('express')

const router = express.Router()

module.exports = router

// allow  base64 for image
const fs = require('fs')

// import model
const Model = require('../models/model')

// Post Method
router.post('/post', async (req, res) => {
  // if an image comes with the question, find it in the image folder and parse it into base64 representation.
  const images64 = []
  if (Object.prototype.hasOwnProperty.call(req.body, 'images')) {
    for (let i = 0; i < req.body.images.length; i++) {
      const currentImage = req.body.images[i]
      const imageBuffer = fs.readFileSync(`images\\${currentImage}`)
      const base64Image = imageBuffer.toString('base64')
      images64.push(base64Image)
    }
  }

  const data = new Model({
    name: req.body.name,
    description: req.body.description,
    images: images64
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
