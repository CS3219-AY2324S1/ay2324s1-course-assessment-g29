/* global describe, beforeEach, afterEach, it, */
/* eslint-disable no-unused-expressions */

const chai = require('chai')
const expect = chai.expect

const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const rewire = require('rewire')

const mongoose = require('mongoose')

const sandbox = sinon.createSandbox()

let questionController = rewire('../controllers/question.controller')

describe('Unit Test for /question', () => {
  let sampleQuestionData
  let findOneStub
  let findStub

  beforeEach(() => {
    sampleQuestionData = {
      imagesArray: [],
      name: 'two-sum',
      displayName: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n.You can return the answer in any order.',
      topic: [
        'array',
        'hash-table'
      ],
      difficulty: 'Medium'
    }
  })

  afterEach(() => {
    questionController = rewire('../controllers/question.controller')
    sandbox.restore()
  })

  describe('Post Question', () => {
    it('should succeed when given correct questionObj input', async () => {
      const saveStub = sandbox.stub().returns(sampleQuestionData)
      const questionModelStub = sandbox.stub().returns({ save: saveStub })
      questionController.__set__('Model', questionModelStub)

      const result = await questionController.postQuestion(sampleQuestionData)

      expect(questionModelStub).to.have.been.calledWithNew
      expect(questionModelStub).to.have.been.calledWith(sampleQuestionData)
      expect(saveStub).to.have.been.called
      expect(result).to.equal(sampleQuestionData)
    })
  })

  describe('Get All Question', () => {
    it('should succeed', async () => {
      findStub = sandbox.stub(mongoose.Model, 'find').resolves([sampleQuestionData])
      const result = await questionController.getAllQuestion()

      expect(findStub).to.have.been.calledOnce
      expect(result).to.deep.equal([sampleQuestionData])
    })
  })

  describe('Get All Question By Difficulty', () => {
    it('should succeed', async () => {
      findStub = sandbox.stub(mongoose.Model, 'find').resolves([sampleQuestionData])
      const result = await questionController.getAllByDifficulty(sampleQuestionData.difficulty)

      expect(findStub).to.have.been.calledOnce
      expect(result).to.deep.equal([sampleQuestionData])
    })
  })

  describe('Get All Question By Topic', () => {
    it('should succeed', async () => {
      findStub = sandbox.stub(mongoose.Model, 'find').resolves([sampleQuestionData])
      const result = await questionController.getAllByTopic(sampleQuestionData.topic[0])

      expect(findStub).to.have.been.calledOnce
      expect(result).to.deep.equal([sampleQuestionData])
    })
  })

  describe('Get By Name', () => {
    it('should succeed', async () => {
      findOneStub = sandbox.stub(mongoose.Model, 'findOne').resolves(sampleQuestionData)
      const result = await questionController.getByName(sampleQuestionData.name)

      expect(findOneStub).to.have.been.calledOnce
      expect(result).to.equal(sampleQuestionData)
    })
  })

  describe('Get One By Difficulty', () => {
    it('should succeed', async () => {
      findStub = sandbox.stub(mongoose.Model, 'find')
      findStub.withArgs().returns({
        countDocuments: sandbox.stub().callsFake(() => {
          return 1
        })
      })
      findOneStub = sandbox.stub(mongoose.Model, 'findOne').withArgs().returns({
        skip: sandbox.stub().callsFake(() => {
          return {
            exec: sinon.stub().returns(sampleQuestionData)
          }
        })
      })

      const result = await questionController.getOneByDifficulty(sampleQuestionData.difficulty)

      expect(findStub).to.have.been.calledOnce
      expect(findOneStub).to.have.been.calledOnce
      expect(result).to.equal(sampleQuestionData)
    })
  })

  describe('Get One By Topic', () => {
    it('should succeed', async () => {
      findStub = sandbox.stub(mongoose.Model, 'find')
      findStub.withArgs().returns({
        countDocuments: sandbox.stub().callsFake(() => {
          return 1
        })
      })
      findOneStub = sandbox.stub(mongoose.Model, 'findOne').withArgs().returns({
        skip: sandbox.stub().callsFake(() => {
          return {
            exec: sinon.stub().returns(sampleQuestionData)
          }
        })
      })

      const result = await questionController.getOneByTopic(sampleQuestionData.topic[0])

      expect(findStub).to.have.been.calledOnce
      expect(findOneStub).to.have.been.calledOnce
      expect(result).to.equal(sampleQuestionData)
    })
  })

  describe('Update by Name', () => {
    it('should succeed', async () => {
      const findOneUpdateStub = sandbox.stub(mongoose.Model, 'findOneAndUpdate').resolves(sampleQuestionData)

      const result = await questionController.updateName(sampleQuestionData)

      expect(findOneUpdateStub).to.have.been.calledOnce
      expect(result).to.equal(sampleQuestionData)
    })
  })

  describe('Delete Question', () => {
    it('should succeed', async () => {
      const findOneDeleteStub = sandbox.stub(mongoose.Model, 'findOneAndDelete').resolves(sampleQuestionData)

      const result = await questionController.deleteQuestion(sampleQuestionData.name)

      expect(findOneDeleteStub).to.have.been.calledOnce
      expect(result).to.equal(`Document with ${sampleQuestionData.name} has been deleted.`)
    })
  })
})
