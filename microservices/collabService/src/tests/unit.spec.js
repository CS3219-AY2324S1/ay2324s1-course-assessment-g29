/* global describe, it */

const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon')
const axios = require('axios')
const admin = require('firebase-admin')

chai.use(chaiHttp)
const expect = chai.expect

// Stubs
const fakeQuestionData = {
  _id: '653408cca7a26f448a0fc147',
  name: 'roman-to-integer',
  displayName: 'Roman To Integer',
  description: 'Beep Boop',
  topic: [
    'algorithms'
  ],
  imagesArray: [],
  difficulty: 'Easy',
  __v: 0
}
const matchingLanguages = ['Python']

const axiosStub = sinon.stub(axios, 'get')
axiosStub.withArgs('http://questionservice:3002/question/getRandom').resolves({
  data: fakeQuestionData
})

const firestoreStub = sinon.stub(admin, 'firestore')
const collectionStub = sinon.stub()

firestoreStub.get(function () {
  return function () {
    return { collection: collectionStub }
  }
})

collectionStub.withArgs('rooms').returns({
  get: sinon.stub().resolves(
    [{
      data: () => ({
        user1id: 'user1',
        user2id: 'user2',
        questionData: fakeQuestionData,
        matchingLanguages
      })
    }]
  ),
  doc: sinon.stub().callsFake((rid) => {
    return {
      set: sinon.stub().resolves({ message: 'Done!' }),
      update: sinon.stub().resolves({ message: 'Done!' }),
      delete: sinon.stub().resolves({ message: 'Done!' })
    }
  })
})

collectionStub.withArgs('history').returns({
  doc: sinon.stub().callsFake((rid) => {
    return {
      set: sinon.stub().resolves({ message: 'Done!' }),
      update: sinon.stub().resolves({ message: 'Done!' })
    }
  })
})

collectionStub.withArgs('useridToRoom').returns({
  doc: sinon.stub().callsFake((uid) => {
    return {
      set: sinon.stub().resolves({ message: 'Done!' }),
      get: sinon.stub().resolves({ data: () => ({ roomId: [] }) })
    }
  })
})

// Import functions to test
const { createRoom, checkRoom, saveHistory, updateHistory, changeQuestion, leaveRoom } = require('../controller/roomController')

describe('Unit Test for /collab', () => {
  it('should create a new room', async () => {
    const req = { body: { user1id: 'user1', user2id: 'user2', matchingLanguages } }
    const res = {
      status: (code) => {
        expect(code).to.equal(200)
        return {
          json: (data) => {
            expect(data).to.have.property('roomId')
            expect(data).to.have.property('message')
          }
        }
      }
    }

    // Test the createRoom function
    await createRoom(req, res)

    // Restore the stub after the test
    axiosStub.restore()
  })

  it('should check for an existing room', async () => {
    const req = { body: { userid: 'user1' } }
    const res = {
      status: (code) => {
        expect(code).to.equal(200)
        return {
          json: (data) => {
            expect(data).to.have.property('room')
            expect(data).to.have.property('roomdata')
          }
        }
      }
    }

    await checkRoom(req, res)
  })

  it('should save room history', async () => {
    const req = {
      body: {
        rid: 'room_id',
        user1id: 'user123',
        user2id: 'user456',
        questionData: 'your_question_data',
        code: 'your_code',
        language: 'your_language',
        messages: ['message1', 'message2']
      }
    }
    const res = {
      status: (code) => {
        expect(code).to.equal(200)
        return {
          json: (data) => {
            expect(data).to.have.property('message')
          }
        }
      }
    }
    await saveHistory(req, res)
  })

  it('should update room history', async () => {
    const req = {
      body: {
        rid: 'room_id', // Provide a valid room ID
        questionData: 'updated_question_data',
        code: 'updated_code',
        language: 'updated_language',
        messages: ['updated_message1', 'updated_message2']
      }
    }
    const res = {
      status: (code) => {
        expect(code).to.equal(200)
        return {
          json: (data) => {
            expect(data).to.have.property('message')
          }
        }
      }
    }
    await updateHistory(req, res)
  })

  it('should change question in a room', async () => {
    const req = {
      body: {
        rid: 'room_id',
        questionData: 'new_question_data'
      }
    }
    const res = {
      status: (code) => {
        expect(code).to.equal(200)
        return {
          json: (data) => {
            expect(data).to.have.property('message')
          }
        }
      }
    }

    await changeQuestion(req, res)
  })

  it('should delete a room', async () => {
    const req = { body: { rid: 'room_id' } }
    const res = {
      status: (code) => {
        expect(code).to.equal(200)
        return {
          json: (data) => {
            expect(data).to.have.property('message')
          }
        }
      }
    }
    await leaveRoom(req, res)
  })
})
