/* global describe, before, after, it */
// standard-ignore
const io = require('../../app.js')
const ioc = require('socket.io-client')
const { assert } = require('chai')

// Include your MatchingService implementation
const MatchingService = require('../model/matching')

describe('Matching Service Unit Tests', () => {
  let clientSocket, matchingService
  before((done) => {
    matchingService = new MatchingService()
    clientSocket = ioc('http://localhost:4000', {
      reconnection: false
    })

    clientSocket.on('connect', done)
  })

  after(() => {
    // Close the clientSocket connection
    clientSocket.disconnect()
  })

  // Test the 'JoinQueue' event
  it('Test JoinQueue timeout', function (done) {
    console.log('Timing out for 31s to test timeout')
    this.timeout(31000)
    const userData = {
      userid: 'user123',
      difficulty: 'Easy',
      languages: ['JavaScript', 'Python']
    }

    clientSocket.emit('JoinQueue', userData, async (response) => {
      clientSocket.on('ErrorMatching', (response) => {
        assert.equal(response.errorMessage, 'Connection Timeout! Please Rejoin Queue')
        done()
      })
    })
  })

  // Your new tests for MatchingService class
  it('should check if a user exists in a queue', () => {
    const userData = {
      userid: 'user123',
      socketid: 'socket123',
      languages: ['JavaScript', 'Python']
    }

    matchingService.joinQueue('Easy', userData.languages, userData.userid, userData.socketid)

    const existsInQueue = matchingService.checkNewLocation(userData.userid)
    assert.isTrue(existsInQueue)
  })

  it('should remove a user from a queue', () => {
    const userData = {
      userid: 'user123',
      socketid: 'socket123',
      languages: ['JavaScript', 'Python']
    }
    const isEmpty = matchingService.isEmpty('Easy', ['Python'])
    assert.isFalse(isEmpty)

    matchingService.leaveQueue(userData.socketid)

    const existsInQueue = matchingService.checkNewLocation(userData.userid)
    assert.isFalse(existsInQueue)
  })

  it('should find matching languages between two users', () => {
    const user1Languages = ['JavaScript', 'Python']
    const user2Languages = ['Python', 'Java']

    const matchingLanguages = matchingService.findMatchingLanguages(user1Languages, user2Languages)
    assert.deepEqual(matchingLanguages, ['Python'])
  })

  it('should determine if two users have matching languages', () => {
    const user1Languages = ['JavaScript', 'Python']
    const user2Languages = ['Python', 'Java']

    const hasMatchingLanguages = matchingService.hasMatchingLanguages(user1Languages, user2Languages)
    assert.isTrue(hasMatchingLanguages)
  })

  it('should determine if a queue is empty for a specific difficulty and languages', () => {
    const userData = {
      userid: 'user123',
      socketid: 'socket123',
      languages: ['JavaScript', 'Python']
    }

    matchingService.joinQueue('Easy', userData.languages, userData.userid, userData.socketid)

    const isEmpty = matchingService.isEmpty('Easy', ['Java', 'C++'])
    assert.isTrue(isEmpty)
  })

  it('should add a user to a queue', () => {
    const userData = {
      userid: 'user123',
      socketid: 'socket123',
      languages: ['JavaScript', 'Python']
    }

    matchingService.joinQueue('Medium', userData.languages, userData.userid, userData.socketid)

    const queue = matchingService.Queues.Medium
    assert.deepEqual(queue, [userData])
  })

  it('should find a match between two users', () => {
    const user1Languages = ['JavaScript', 'Python']
    const user2Languages = ['Python', 'Java']

    const match = matchingService.isMatchFound(user1Languages, user2Languages)
    assert.isTrue(match)
  })

  it('should pop a user from a queue when a match is found', () => {
    const user1 = {
      userid: 'user123',
      socketid: 'socket123',
      languages: ['JavaScript', 'Python']
    }

    const user2 = {
      userid: 'user456',
      socketid: 'socket456',
      languages: ['Python', 'Java']
    }

    matchingService.joinQueue('Easy', user1.languages, user1.userid, user1.socketid)
    matchingService.joinQueue('Easy', user2.languages, user2.userid, user2.socketid)

    const matchedUser = matchingService.popQueue('Easy', user2.languages)
    assert.deepEqual(matchedUser, user1)
  })
})
