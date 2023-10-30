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

const firebase = require('firebase/app')
const firebaseApp = firebase.initializeApp(firebaseConfig, 'user')

const firebaseAuth = require('firebase/auth')
const auth = firebaseAuth.getAuth(firebaseApp)

const admin = require('firebase-admin')

const serviceAccount = {
  type: 'service_account',
  project_id: 'peerprep-f1dca',
  private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  // See: https://stackoverflow.com/a/50376092/3403247.
  private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
}, 'userService')

module.exports = { firebaseAuth, auth }
