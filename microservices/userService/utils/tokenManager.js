class TokenManager {
  constructor (firebaseAdmin) {
    this.admin = firebaseAdmin
  }

  authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
      const idToken = authHeader.split(' ')[1]
      this.admin
        .auth()
        .verifyIdToken(idToken)
        .then(function (decodedToken) {
          if (req.params.uid !== decodedToken.user_id) {
            throw new Error('Invalid token for current user')
          }
          return next()
        })
        .catch(function (error) {
          console.log(error)
          return res.sendStatus(403)
        })
    } else {
      res.sendStatus(401)
    }
  }
}

module.exports = TokenManager
