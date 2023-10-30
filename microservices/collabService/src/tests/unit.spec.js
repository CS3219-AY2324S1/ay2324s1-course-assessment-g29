/* global describe, it, before, after */

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

const sandbox = sinon.createSandbox()

const axiosStub = sandbox.stub(axios, 'get')
axiosStub.withArgs('http://questionservice:3002/question/getRandom').resolves({
  data: fakeQuestionData
})

const firestoreStub = sandbox.stub(admin, 'firestore')
const collectionStub = sandbox.stub()

firestoreStub.get(function () {
  return function () {
    return { collection: collectionStub }
  }
})

collectionStub.withArgs('rooms').returns({
  get: sandbox.stub().resolves(
    [{
      data: () => ({
        user1id: 'user1',
        user2id: 'user2',
        questionData: fakeQuestionData,
        matchingLanguages
      })
    }]
  ),
  doc: sandbox.stub().callsFake((rid) => {
    return {
      set: sandbox.stub().resolves({ message: 'Done!' }),
      update: sandbox.stub().resolves({ message: 'Done!' }),
      delete: sandbox.stub().resolves({ message: 'Done!' })
    }
  })
})

collectionStub.withArgs('history').returns({
  doc: sandbox.stub().callsFake((rid) => {
    return {
      set: sandbox.stub().resolves({ message: 'Done!' }),
      update: sandbox.stub().resolves({ message: 'Done!' })
    }
  })
})

collectionStub.withArgs('useridToRoom').returns({
  doc: sandbox.stub().callsFake((uid) => {
    return {
      set: sandbox.stub().resolves({ message: 'Done!' }),
      get: sandbox.stub().resolves({ data: () => ({ roomId: [] }) })
    }
  })
})

// Import functions to test
const { createRoom, checkRoom, saveHistory, updateHistory, changeQuestion, leaveRoom } = require('../controller/roomController')

describe('Unit Test for /collab', () => {
  before('before', () => {
    console.log('Running test suites for /collab')
  })

  after('after', () => {
    console.log('Ran all test suites for /collab successfully')
    // Restore the stub after the test
    sandbox.restore()
    firestoreStub.restore()
  })

  describe('Create room on /createroom', () => {
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
    })
  })

  describe('Check for room on /checkroom', () => {
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
  })

  describe('Save room history on /savehistory', () => {
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
  })

  describe('Update history on /updatehistory', () => {
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
  })

  describe('Change question on /changequestion', () => {
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
  })

  describe('Exit and delete room on /leaveroom', () => {
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
})
