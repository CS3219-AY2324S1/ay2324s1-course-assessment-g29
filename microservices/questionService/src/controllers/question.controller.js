// import model
const Model = require('../models/model')

// Post Method
exports.postQuestion = async function (questionObj) {
  try {
    const { displayName, name, description, topic, imagesArray, difficulty } = questionObj
    const data = new Model({
      name,
      displayName,
      description,
      topic,
      imagesArray,
      difficulty,
      id
    })
    return await data.save()
  } catch (error) {
    return Promise.reject(error)
  }
}

// Get all Method
exports.getAllQuestion = async function () {
  try {
    return await Model.find()
  } catch (error) {
    return Promise.reject(error)
  }
}

// Get all by difficulty Method
exports.getAllByDifficulty = async function (difficulty) {
  try {
    return await Model.find({ difficulty })
  } catch (error) {
    return Promise.reject(error)
  }
}

// Get by Name Method
exports.getByName = async function (name) {
  try {
    return await Model.findOne({ name })
  } catch (error) {
    return Promise.reject(error)
  }
}

// Get by ID method
exports.getById = async function (id) {
  try {
    return await Model.findOne({ id })
  } catch (error) {
    return Promise.reject(error)
  }
}

// Get random one with difficulty
exports.getOneByDifficulty = async function (difficulty) {
  try {
    const count = await Model.find({ difficulty }).countDocuments()
    const random = Math.floor(Math.random() * count)
    return await Model.findOne({ difficulty }).skip(random).exec()
  } catch (error) {
    return Promise.reject(error)
  }
}

// Get all by Topic Method
exports.getAllByTopic = async function (topic) {
  try {
    return await Model.find({ topic })
  } catch (error) {
    return Promise.reject(error)
  }
}

// Get random
exports.getRandom = async function () {
  try {
    let data
    await Model.aggregate().sample(1).replaceRoot({ question: '$$ROOT' }).then((res) => {
      data = res[0]
    })
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

// Get random one with topic
exports.getOneByTopic = async function (topic) {
  try {
    const count = await Model.find({ topic }).countDocuments()
    const random = Math.floor(Math.random() * count)
    return await Model.findOne({ topic }).skip(random).exec()
  } catch (error) {
    return Promise.reject(error)
  }
}

// Update by Name Method
exports.updateName = async function (questionObj) {
  try {
    const { name, updatedData } = questionObj
    const options = { new: true } // whether to return the updated data

    return await Model.findOneAndUpdate(
      { name },
      updatedData,
      options
    )
  } catch (error) {
    return Promise.reject(error)
  }
}

// Delete by Name Method
exports.deleteQuestion = async function (name) {
  try {
    const data = await Model.findOneAndDelete({ name })
    return (`Document with ${data.name} has been deleted.`)
  } catch (error) {
    return Promise.reject(error)
  }
}
