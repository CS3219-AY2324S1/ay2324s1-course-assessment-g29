const path = require('path')
const envPath = path.join(__dirname, '../../configs/.env')
require('dotenv').config({ path: envPath })
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
}

console.log(process.env.API_KEY)
console.log(firebaseConfig)

const firebase = require('firebase/app')
const firebaseApp = firebase.initializeApp(firebaseConfig)

const firebaseAuth = require('firebase/auth')
const auth = firebaseAuth.getAuth(firebaseApp)

const admin = require('firebase-admin')

const serviceAccount = require('../../configs/peerprep-f1dca-firebase-adminsdk-cwpky-38ec2f2d38.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

module.exports = { firebaseAuth, auth }
