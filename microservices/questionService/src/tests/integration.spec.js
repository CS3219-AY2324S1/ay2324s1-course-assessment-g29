/* global describe, beforeEach, before, after it, */
/* eslint-disable no-unused-expressions */

const chai = require('chai')
const expect = chai.expect
const rewire = require('rewire')
const request = require('supertest')

const app = rewire('../app')

describe('Testing express app routes', () => {
  let server

  // Start the Express app before the tests
  before('before', () => {
    server = app.listen(3003, () => {
      console.log('Express app is listening on port 3003')
    })
  })

  after('after', () => {
    server.close(() => {
      console.log('Express app has been stopped')
    })
  })

  describe('Testing /question route', () => {
    let sampleQuestionData

    beforeEach(() => {
      sampleQuestionData = {
        imagesArray: [],
        name: 'test-sum',
        displayName: 'Test Sum',
        description: 'This is a fake question for testing.',
        topic: [
          'array',
          'hash-table'
        ],
        difficulty: 'Medium'
      }
    })

    it('POST /post should successfully create a new question', async () => {
      const response = await request(app).post('/question/post').send(sampleQuestionData)
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('name').to.equal(sampleQuestionData.name)
      expect(response.body).to.have.property('displayName').to.equal(sampleQuestionData.displayName)
      expect(response.body).to.have.property('difficulty').to.equal(sampleQuestionData.difficulty)
      expect(response.body).to.have.property('description').to.equal(sampleQuestionData.description)
      expect(response.body).to.have.property('imagesArray').to.deep.equal(sampleQuestionData.imagesArray)
      expect(response.body).to.have.property('topic').to.deep.equal(sampleQuestionData.topic)
    })

    it('GET /getall should return all available questions', async () => {
      const response = await request(app).get('/question/getAll')
      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('array')
      expect(response.body).to.be.an('array').and.to.have.length.of.at.least(1)
      expect(response.body[0]).to.have.property('name')
      expect(response.body[0]).to.have.property('displayName')
      expect(response.body[0]).to.have.property('difficulty')
      expect(response.body[0]).to.have.property('description')
      expect(response.body[0]).to.have.property('imagesArray')
      expect(response.body[0]).to.have.property('topic')
    })

    it('GET /getDifficulty should return all available questions for a selected difficulty', async () => {
      const response = await request(app).get(`/question/getDifficulty/${sampleQuestionData.difficulty}`)
      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('array')
      expect(response.body).to.be.an('array').and.to.have.length.of.at.least(1)
      expect(response.body[0]).to.have.property('difficulty').to.equal(sampleQuestionData.difficulty)
    })

    it('GET /getTopic should return all available questions for a selected topic', async () => {
      const queryTopic = sampleQuestionData.topic[0]
      const response = await request(app).get(`/question/getTopic/${queryTopic}`)
      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('array')
      expect(response.body).to.be.an('array').and.to.have.length.of.at.least(1)
      expect(response.body[0]).to.have.property('topic')
      expect(response.body[0].topic).to.include(queryTopic)
    })

    it('GET /getOneByName should return correct question', async () => {
      const response = await request(app).get(`/question/getOneByName/${sampleQuestionData.name}`)
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('name').to.equal(sampleQuestionData.name)
    })

    it('GET /getOneByDifficulty should return one question with correct difficulty', async () => {
      const response = await request(app).get(`/question/getOneByDifficulty/${sampleQuestionData.difficulty}`)
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('difficulty').to.equal(sampleQuestionData.difficulty)
    })

    it('GET /getOneByTopic should return one question with correct topic', async () => {
      const queryTopic = sampleQuestionData.topic[0]
      const response = await request(app).get(`/question/getOneByTopic/${queryTopic}`)
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('topic').to.include(queryTopic)
    })

    it('PATCH /update should update the question with given name', async () => {
      const newQuestionData = {
        imagesArray: [],
        name: 'test-sum',
        displayName: 'Test Sum 123',
        description: 'This is a fake updated question for testing.',
        topic: [
          'array',
          'hash-table'
        ],
        difficulty: 'Hard'
      }
      const response = await request(app).patch(`/question/update/${sampleQuestionData.name}`).send(newQuestionData)
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('name').to.equal(sampleQuestionData.name)
      expect(response.body).to.have.property('displayName').to.equal(newQuestionData.displayName)
      expect(response.body).to.have.property('description').to.equal(newQuestionData.description)
    })

    it('DELETE /delete/:name should delete question', async () => {
      const deleteResponse = await request(app).delete(`/question/delete/${sampleQuestionData.name}`)
      expect(deleteResponse.status).to.equal(200)

      const response = await request(app).get(`/question/getOneByName/${sampleQuestionData.name}`)
      expect(response.status).to.equal(200)
      expect(response.body).to.be.null
    })
  })
})
