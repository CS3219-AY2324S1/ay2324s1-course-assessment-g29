// Express + Set up port
const express = require('express')
const app = express()
app.use(express.json())
const port = process.env.PORT || 3000

// Set up firebase
const admin = require('firebase-admin')

const serviceAccount = require('./configs/peerprep-f1dca-firebase-adminsdk-cwpky-38ec2f2d38.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// const db = admin.firestore(); // For profile picture sprint 2?
// const userCollection = 'users';

app.post('/test', (req, res) => {
  console.log(req.body)
  res.json({ requestBody: req.body }) // <==== req.body will be a parsed JSON object
})

// Set up other dependencies
function validateFields (reqBody, requiredFields) {
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

// User registration route
app.post('/user/register', async (req, res) => {
  try {
    validateFields(req.body, ['name', 'username', 'email', 'password'])
    const { name, username, email, password } = req.body
    const userRecord = await admin.auth().createUser({
      uid: username,
      email,
      emailVerified: false,
      password,
      displayName: name
      // photoURL: '' // init photoURL as empty string
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

app.post('/user/updatePicture', async (req, res) => {
  // TODO: Store photo in Firestore
  try {
    validateFields(req.body, ['uid', 'photoUrl'])
    const { uid, photoUrl } = req.body
    const userRecord = await admin.auth().updateUser(uid, {
      photoURL: photoUrl
    })
    res.status(200).json({ message: 'Profile picture updated successfully!', user: userRecord })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/user/deregister', async (req, res) => {
  // TODO: Store photo in Firestore
  try {
    validateFields(req.body, ['uid'])
    const { uid } = req.body
    await admin.auth().deleteUser(uid)
    res.status(200).json({ message: 'User deregistered successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

/*
// User login route
// TODO: Move to FE and use getAuth
app.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const isEmail = validator.validate(identifier);
        var userRecord;
        if (isEmail) {
            userRecord = await admin.auth().getUserByEmail(identifier);
        } else {
            userRecord = await admin.auth().getUser(identifier);
        }
        // Verify user's password here, if necessary
        // Return JWT token or session information upon successful login
        console.log(userRecord)
        res.status(200).json({ message: 'User logged in successfully', user: userRecord });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// User logout route
// TODO: Move to FE
app.post('/logout', (req, res) => {
    // Implement logout logic here (e.g., invalidate tokens or clear sessions)
    res.status(200).json({ message: 'User logged out successfully' });
});
*/
