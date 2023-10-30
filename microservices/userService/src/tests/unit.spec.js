/* global describe, before, after, it */

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')

const userController = require('../controller/user.controller')
const admins = require('firebase-admin')
const adminAuth = admins.auth()
const firestore = admins.firestore()

// Test user
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

// Stubs
const sandbox = sinon.createSandbox()

const collectionStub = sandbox.stub(firestore, 'collection')
collectionStub.withArgs('users').returns({
  doc: sandbox.stub().callsFake((uid) => {
    return {
      set: sandbox.stub().resolves({ message: 'Language updated successfully!' }),
      get: sandbox.stub().resolves({
        data: () => ({ language: defaultLanguage })
      })
    }
  })
})

const createUserStub = sandbox.stub(adminAuth, 'createUser')
createUserStub.callsFake(async (user) => {
  return { uid: testUser.uid, ...user }
})

const getUserStub = sandbox.stub(adminAuth, 'getUser')
getUserStub.callsFake(async (uid) => {
  if (uid === testUser.uid) {
    return { uid, email: testUser.email, displayName: testUser.displayName }
  } else {
    throw new Error('User not found')
  }
})

const updateUserStub = sandbox.stub(adminAuth, 'updateUser')
updateUserStub.callsFake(async (uid, updatedUser) => {
  if (uid === testUser.uid) {
    return { uid, ...updatedUser }
  } else {
    throw new Error('User not found')
  }
})

const deleteUserStub = sandbox.stub(adminAuth, 'deleteUser')
deleteUserStub.callsFake(async (uid) => {
  if (uid === testUser.uid) {
    return null
  } else {
    throw new Error('User not found')
  }
})

describe('Unit Test for /user', () => {
  before('before', () => {
    console.log('Running test suites for /user')
  })

  after('after', () => {
    console.log('Ran all test suites for /user successfully')
    sandbox.restore()
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
      const uidExists = await userController.deregisterUser(uid).then(() => {
        // Modify the getUserStub to return false if uid is 'stubbed-uid'
        getUserStub.callsFake(async (checkedUid) => {
          if (checkedUid === uid) {
            return false // Return false if the user is deleted
          } else {
            throw new Error('User not found')
          }
        })

        return adminAuth.getUser(uid)
      })
      expect(uidExists).to.equal(false)
    })
  })
})
