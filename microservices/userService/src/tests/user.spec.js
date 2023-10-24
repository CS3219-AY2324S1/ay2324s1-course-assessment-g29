/* global describe, before, after, it */

const chai = require('chai')
const expect = chai.expect

const userController = require('../controller/user.controller')
const admin = require('firebase-admin')
const testUser = {
  uid: 'john',
  email: 'john@testexample.com',
  password: 'johnpassword',
  newPassword: 'johnpassword1',
  displayName: 'John Doe',
  newDisplayName: 'John Smith'
}
const defaultLanguage = ['Python']
const newLanguages = ['Java', 'C++']

describe('Test /user', () => {
  before('before', () => {
    console.log('Running test suites for /user')
  })

  after('after', () => {
    console.log('Ran all test suites for /user successfully')
  })

  describe('Register user on /registerUser', () => {
    it('User should be registered successfully on firebase', async () => {
      const { displayName, uid, email, password } = testUser
      const actualResult = await userController.registerUser({ name: displayName, username: uid, email, password })
      expect(actualResult.uid).to.equal(uid)
      expect(actualResult.email).to.equal(email)
      expect(actualResult.displayName).to.equal(displayName)
    })
  })

  describe('Update display name on /updateName', () => {
    it('Name should be updated successfully', async () => {
      const { uid, newDisplayName } = testUser
      const actualResult = await userController.updateDisplayName({ uid, name: newDisplayName })
      expect(actualResult.displayName).to.equal(newDisplayName)
    })
  })

  describe('Update password on /updatePassword', () => {
    it('Password should be changed without error', async () => {
      const { uid, newPassword } = testUser
      await userController.updateDisplayName({ uid, password: newPassword })
    })
  })

  describe('Reset password on /updatePassword', () => {
    it('Email to reset password should be sent without error', async () => {
      const { email } = testUser
      await userController.resetPassword(email)
    })
  })

  describe('Get languages on /getLanguage', () => {
    it('Languages should be retrieved without error', async () => {
      const { uid } = testUser
      const languageData = await userController.getLanguage(uid)
      expect(languageData).to.deep.equal(defaultLanguage)
    })
  })

  describe('Update languages on /updateLanguage', () => {
    it('Languages should be retrieved without error', async () => {
      const { uid } = testUser
      await userController.updateLanguage({ uid, languages: newLanguages })
      const languageData = await userController.getLanguage(uid)
      expect(languageData).to.deep.equal(newLanguages)
    })
  })

  describe('Delete user on /deregisterUser', () => {
    it('User should be deregistered successfully on firebase', async () => {
      const { uid } = testUser
      await userController.deregisterUser(uid)
      const uidExists = await admin.auth().getUser(uid).then(() => true).catch(() => false)
      expect(uidExists).to.equal(false)
    })
  })
})
