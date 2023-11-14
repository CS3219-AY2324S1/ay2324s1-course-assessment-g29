const express = require('express')
const router = express.Router()

const admin = require('firebase-admin')
const TokenManager = require('../utils/tokenManager')
const tokenManager = new TokenManager(admin)

const userController = require('../controller/user.controller')

router.post('/register', async (req, res) => {
  console.log('Register User')
  try {
    const { name, username, email, password } = req.body
    const userRecord = await userController.registerUser({ name, username, email, password })
    res.status(201).json({ message: 'User registered successfully', user: userRecord })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/updateName', async (req, res) => {
  console.log('Update Display Name')
  try {
    const { uid, name } = req.body
    const userRecord = await userController.updateDisplayName({ uid, name })
    res.status(200).json({ message: 'Display name updated successfully!', user: userRecord })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/updatePassword', async (req, res) => {
  console.log('Update Password')
  try {
    const { uid, password } = req.body
    const userRecord = await userController.updatePassword({ uid, password })
    res.status(200).json({ message: 'Password updated successfully!', user: userRecord })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/updateLanguage', async (req, res) => {
  console.log('Update Language')
  try {
    const { uid, languages } = req.body
    await userController.updateLanguage({ uid, languages })
    res.status(200).json({ message: 'Language updated successfully!' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/resetPassword', async (req, res) => {
  console.log('Reset Password')
  try {
    const { email } = req.body
    await userController.resetPassword(email)
    res.status(200).json({ message: 'Email to reset password sent!' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/getLanguage/:uid', async (req, res) => {
  console.log('Get Language')
  try {
    const { uid } = req.params
    const languageData = await userController.getLanguage(uid)
    res.status(200).json({ languages: languageData })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/:uid', async (req, res) => {
  console.log('Get User Info')
  try {
    const { uid } = req.params
    const userRecord = await userController.getUserInfo(uid)
    res.status(200).json({ userData: userRecord })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/history/:uid', async (req, res) => {
  console.log('Get User Info')
  try {
    const { uid } = req.params
    const userHistory = await userController.getUserHistory(uid)
    res.status(200).json({ history: userHistory })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/deregister/:uid', tokenManager.authenticateValidUser, async (req, res) => {
  console.log('Deregister User')
  try {
    const { uid } = req.params
    await userController.deregisterUser(uid)
    res.status(200).json({ message: 'User deregistered successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/token', async (req, res) => {
  console.log('Generate Token for User')
  try {
    const { uid, idToken } = req.body
    const jwtToken = await userController.generateJwt(
      uid,
      (role) => tokenManager.generateToken(idToken, role)
    )
    res.status(200).json({ token: jwtToken })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/authorizeAdmin/:uid', async (req, res) => {
  console.log('Authorization for admins')
  try {
    await tokenManager.authorizeAdmin(req, res, () => {})
    res.status(200).json({ message: 'Authorized' })
  } catch (error) {
    res.status(400).json({ message: 'Unauthorized' })
  }
})

module.exports = router
