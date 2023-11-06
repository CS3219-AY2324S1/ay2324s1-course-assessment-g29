const path = require('path')
const envPath = path.join(__dirname, '../../configs/.env')
require('dotenv').config({ path: envPath })

const jwt = require('jsonwebtoken')
const UserRoles = require('../utils/userRoles')

class TokenManager {
  constructor (firebaseAdmin) {
    this.admin = firebaseAdmin
    this.secretKey = process.env.JWT_SECRET
  }

  generateToken = (idToken, role) => {
    const payload = {
      idToken,
      role
    }
    const token = jwt.sign(payload, this.secretKey, { expiresIn: '3h' })
    return token
  }

  checkValidIdToken = async (uid, idToken, next) => {
    this.admin
      .auth()
      .verifyIdToken(idToken)
      .then(function (decodedToken) {
        if (uid !== decodedToken.user_id) {
          throw new Error('Invalid token for current user')
        }
        return next()
      })
  }

  checkExpired = async (decodedToken) => {
    if (decodedToken.exp && Date.now() / 1000 > decodedToken.exp) {
      return true
    }
    return false
  }

  authenticateValidUser = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
      const jwtToken = authHeader.split(' ')[1]
      const decoded = jwt.verify(jwtToken, this.secretKey)

      if (this.checkExpired(decoded) === true) {
        return res.status(401).json({ error: 'Token has expired' })
      }

      try {
        this.checkValidIdToken(req.params.uid, decoded.idToken, next)
      } catch (error) {
        console.log(error)
        return res.status(403).json({ error: 'Forbidden' })
      }
    } else {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  authorizeAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
      const jwtToken = authHeader.split(' ')[1]
      const decoded = jwt.verify(jwtToken, this.secretKey)

      if (this.checkExpired(decoded) === true) {
        return res.status(401).json({ error: 'Token has expired' })
      }

      if (decoded.role !== UserRoles.admin) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      try {
        this.checkValidIdToken(req.params.uid, decoded.idToken, next)
      } catch (error) {
        console.log(error)
        return res.status(403).json({ error: 'Forbidden' })
      }
    } else {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }
}

module.exports = TokenManager
