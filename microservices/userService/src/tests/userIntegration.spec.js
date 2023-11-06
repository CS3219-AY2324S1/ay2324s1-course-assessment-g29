/* global describe, before, after, it */

const chai = require('chai')
const expect = chai.expect

const path = require('path')
const envPath = path.join(__dirname, '../../configs/.env')
require('dotenv').config({ path: envPath })

const userController = require('../controller/user.controller')
const { auth } = require('../utils/firebase')
const { signInWithEmailAndPassword } = require('firebase/auth')
const admin = require('firebase-admin')
const testUser = {
  uid: 'john',
  email: 'john@testexample.com',
  password: 'johnpassword',
  newPassword: 'johnpassword1',
  displayName: 'John Doe',
  newDisplayName: 'John Smith'
}
const adminUser = {
  uid: 'ben',
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PW
}
const defaultLanguage = ['Python']
const newLanguages = ['Java', 'C++']
const history = ['abcd-efgh-xyz0']
const TokenManager = require('../utils/tokenManager')
const tokenManager = new TokenManager(admin)
const jwt = require('jsonwebtoken')

describe('Integration Test with firebase for /user', () => {
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

  describe('Get room history on /history', () => {
    it('User history should be retrieved correctly without error', async () => {
      const { uid } = testUser
      await admin.firestore().collection('useridToRoom').doc(uid).set({ roomId: history })
      const roomHistory = await userController.getUserHistory(uid)
      expect(roomHistory).to.deep.equal(history)
    })
  })

  describe('Generate token on /generateJwt', () => {
    it('User token should be generated correctly', async () => {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        testUser.email,
        testUser.password
      )
      const idToken = await userCredentials.user.getIdToken()
      const jwtToken = await userController.generateJwt(testUser.uid, (role) => tokenManager.generateToken(idToken, role))
      const decoded = jwt.verify(jwtToken, tokenManager.secretKey)
      expect(decoded.role).to.equal('user')
    })

    it('Admin token should be generated correctly', async () => {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        adminUser.email,
        adminUser.password
      )
      const idToken = await userCredentials.user.getIdToken()
      const jwtToken = await userController.generateJwt(adminUser.uid, (role) => tokenManager.generateToken(idToken, role))
      const decoded = jwt.verify(jwtToken, tokenManager.secretKey)
      expect(decoded.role).to.equal('admin')
    })
  })

  describe('User authentication on token manager authenticateValidUser', () => {
    it('Valid uid and idToken should authenticate', async () => {
      const { uid } = testUser
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        testUser.email,
        testUser.password
      )
      const idToken = await userCredentials.user.getIdToken()
      const jwtToken = await userController.generateJwt(testUser.uid, (role) => tokenManager.generateToken(idToken, role))

      const req = {
        params: {
          uid
        },
        headers: {
          authorization: `Bearer ${jwtToken}`
        }

      }
      const res = {
        status: (code) => {
          expect(code).to.equal(200)
        }
      }

      await tokenManager.authenticateValidUser(req, res, () => { return res.status(200) })
    })

    it('Different uid should throw forbidden', async () => {
      const uid = 'wrong_uid'
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        testUser.email,
        testUser.password
      )
      const idToken = await userCredentials.user.getIdToken()
      const jwtToken = await userController.generateJwt(testUser.uid, (role) => tokenManager.generateToken(idToken, role))

      const req = {
        params: {
          uid
        },
        headers: {
          authorization: `Bearer ${jwtToken}`
        }

      }
      const res = {
        status: (code) => {
          expect(code).to.equal(403)
          return {
            json: (data) => {
              expect(data).to.have.property('error')
              expect(data.error).to.equal('Forbidden')
            }
          }
        }
      }

      await tokenManager.authenticateValidUser(req, res, () => { return res.status(200) })
    })

    it('No id should throw unauthorized', async () => {
      const { uid } = testUser

      const req = {
        params: {
          uid
        },
        headers: {
          authorization: null
        }
      }
      const res = {
        status: (code) => {
          expect(code).to.equal(401)
          return {
            json: (data) => {
              expect(data).to.have.property('error')
              expect(data.error).to.equal('Unauthorized')
            }
          }
        }
      }

      await tokenManager.authenticateValidUser(req, res, () => { return res.status(200) })
    })
  })

  describe('Admin authorization on /authorizeAdmin', () => {
    it('Valid uid and idToken should authenticate', async () => {
      const { uid } = adminUser
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        adminUser.email,
        adminUser.password
      )
      const idToken = await userCredentials.user.getIdToken()
      const jwtToken = await userController.generateJwt(uid, (role) => tokenManager.generateToken(idToken, role))

      const req = {
        params: {
          uid
        },
        headers: {
          authorization: `Bearer ${jwtToken}`
        }

      }
      const res = {
        status: (code) => {
          expect(code).to.equal(200)
        }
      }

      await tokenManager.authorizeAdmin(req, res, () => { return res.status(200) })
    })

    it('Different uid should throw forbidden', async () => {
      const uid = 'wrong_uid'
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        adminUser.email,
        adminUser.password
      )
      const idToken = await userCredentials.user.getIdToken()
      const jwtToken = await userController.generateJwt(adminUser.uid, (role) => tokenManager.generateToken(idToken, role))

      const req = {
        params: {
          uid
        },
        headers: {
          authorization: `Bearer ${jwtToken}`
        }

      }
      const res = {
        status: (code) => {
          expect(code).to.equal(403)
          return {
            json: (data) => {
              expect(data).to.have.property('error')
              expect(data.error).to.equal('Forbidden')
            }
          }
        }
      }

      await tokenManager.authorizeAdmin(req, res, () => { return res.status(200) })
    })

    it('No id should throw unauthorized', async () => {
      const { uid } = adminUser

      const req = {
        params: {
          uid
        },
        headers: {
          authorization: null
        }
      }
      const res = {
        status: (code) => {
          expect(code).to.equal(401)
          return {
            json: (data) => {
              expect(data).to.have.property('error')
              expect(data.error).to.equal('Unauthorized')
            }
          }
        }
      }

      await tokenManager.authorizeAdmin(req, res, () => { return res.status(200) })
    })

    it('Normal user should not authorize', async () => {
      const { uid } = testUser
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        testUser.email,
        testUser.password
      )
      const idToken = await userCredentials.user.getIdToken()
      const jwtToken = await userController.generateJwt(uid, (role) => tokenManager.generateToken(idToken, role))

      const req = {
        params: {
          uid
        },
        headers: {
          authorization: `Bearer ${jwtToken}`
        }

      }
      const res = {
        status: (code) => {
          expect(code).to.equal(401)
          return {
            json: (data) => {
              expect(data).to.have.property('error')
              expect(data.error).to.equal('Unauthorized')
            }
          }
        }
      }

      await tokenManager.authorizeAdmin(req, res, () => { return res.status(200) })
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
