// Express + Set up port
const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
const port = process.env.PORT || 3001

// Set up firebase
const admin = require('firebase-admin')

const serviceAccount = require('./configs/peerprep-f1dca-firebase-adminsdk-cwpky-38ec2f2d38.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()
const userCollection = db.collection('users')

// Set up other dependencies
function validateFields(reqBody, requiredFields) {
  const missingFields = []
  for (const field of requiredFields) {
    if (!(field in reqBody)) {
      missingFields.push(field)
    }
  }

  if (missingFields.length > 0) {
    throw new Error(`Missing fields: ${missingFields.join(', ')}`)
  }
};

const supportedLanguages = ['Python', 'Java', 'C', 'C++', 'C#', 'JavaScript']

// User registration route
app.post('/user/register', async (req, res) => {
  try {
    validateFields(req.body, ['name', 'username', 'email', 'password'])
    console.log('Received')
    const { name, username, email, password } = req.body
    const userRecord = await admin.auth().createUser({
      uid: username,
      email,
      emailVerified: false,
      password,
      displayName: name
      // photoURL: '' // init photoURL as empty string
    })
    const docRef = userCollection.doc(username)
    await docRef.set({
      language: [supportedLanguages[0]]
    })

    res.status(201).json({ message: 'User registered successfully', user: userRecord })
  } catch (error) {
    console.log()
    res.status(400).json({ error: error.message })
  }
})

app.post('/user/updateName', async (req, res) => {
  try {
    validateFields(req.body, ['uid', 'name'])
    const { uid, name } = req.body
    const userRecord = await admin.auth().updateUser(uid, {
      displayName: name
    })
    res.status(200).json({ message: 'Display name updated successfully!', user: userRecord })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/user/updatePassword', async (req, res) => {
  try {
    validateFields(req.body, ['uid', 'password'])
    const { uid, password } = req.body
    const userRecord = await admin.auth().updateUser(uid, {
      password
    })
    res.status(200).json({ message: 'Password updated successfully!', user: userRecord })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/user/updateLanguage', async (req, res) => {
  try {
    validateFields(req.body, ['uid', 'languages'])
    const { uid, languages } = req.body

    if (!languages.every(val => supportedLanguages.includes(val))) {
      throw new Error('Languages chosen are not supported.')
    }

    const docRef = userCollection.doc(uid)
    await docRef.set({ language: languages })

    res.status(200).json({ message: 'Language updated successfully!' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/user/getLanguage/:uid', async (req, res) => {
  try {
    const docRef = userCollection.doc(req.params.uid)
    const doc = await docRef.get()
    if (!doc.exists) {
      throw new Error(`User does not exist: ${req.params.uid}`)
    }
    res.status(200).json({ languages: doc.data().language })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.delete('/user/deregister/:uid', async (req, res) => {
  try {
    await admin.auth().deleteUser(req.params.uid)
    await userCollection.doc(req.params.uid).delete();
    res.status(200).json({ message: 'User deregistered successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
