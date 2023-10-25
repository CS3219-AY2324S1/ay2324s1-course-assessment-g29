/* global describe, before, after, it */

const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const expect = chai.expect

chai.use(chaiHttp)

describe('Express App Unit Tests', () => {
  it('should create a new room', (done) => {
    chai
      .request(app)
      .post('/room/createroom')
      .send({
        user1id: 'user123',
        user2id: 'user456',
        matchingLanguages: ['JavaScript', 'Python']
      })
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('roomId')
        expect(res.body).to.have.property('questionData')
        done()
      })
  })

  it('should check for an existing room', (done) => {
    chai
      .request(app)
      .post('/room/checkroom')
      .send({ userid: 'user123' })
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('room')
        expect(res.body).to.have.property('roomdata')
        done()
      })
  })

  it('should save room history', (done) => {
    chai
      .request(app)
      .post('/room/savehistory')
      .send({
        rid: 'room_id',
        user1id: 'user123',
        user2id: 'user456',
        questionData: 'your_question_data',
        code: 'your_code',
        language: 'your_language',
        messages: ['message1', 'message2']
      })
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
  })

  it('should update room history', (done) => {
    chai
      .request(app)
      .post('/room/updatehistory')
      .send({
        rid: 'room_id', // Provide a valid room ID
        questionData: 'updated_question_data',
        code: 'updated_code',
        language: 'updated_language',
        messages: ['updated_message1', 'updated_message2']
      })
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
  })

  it('should change question in a room', (done) => {
    chai
      .request(app)
      .post('/room/changequestion')
      .send({
        rid: 'room_id',
        questionData: 'new_question_data'
      })
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
  })

  it('should delete a room', (done) => {
    chai
      .request(app)
      .post('/room/leaveroom')
      .send({
        rid: 'room_id'
      })
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
  })
})
