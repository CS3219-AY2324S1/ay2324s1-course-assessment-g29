const { firebaseAuth, auth } = require('../utils/firebase')
const admin = require('firebase-admin')

const db = admin.firestore()
const userCollection = db.collection('users')

const supportedLanguages = require('../utils/supportedLanguages')

// User registration route
exports.registerUser = async function (userObj) {
    try {
        const { name, username, email, password } = userObj
        const userRecord = await admin.auth().createUser({
            uid: username,
            email,
            emailVerified: false,
            password,
            displayName: name
        })
        const docRef = userCollection.doc(username)
        await docRef.set({
            language: [supportedLanguages[0]]
        })
        return userRecord
    } catch (error) {
        return Promise.reject(error)
    }
}

exports.updateDisplayName = async function (userObj) {
    try {
        const { uid, name } = userObj
        const userRecord = await admin.auth().updateUser(uid, {
            displayName: name
        })
        return userRecord
    } catch (error) {
        return Promise.reject(error)
    }
}

exports.updatePassword = async function (userObj) {
    try {
        const { uid, password } = userObj
        const userRecord = await admin.auth().updateUser(uid, {
            password
        })
        return userRecord
    } catch (error) {
        return Promise.reject(error)
    }
}

exports.updateLanguage = async function (userObj) {
    try {
        const { uid, languages } = userObj

        if (!languages.every(val => supportedLanguages.includes(val))) {
            throw new Error('Languages chosen are not supported.')
        }

        const docRef = userCollection.doc(uid)
        await docRef.set({ language: languages })

        return "OK"
    } catch (error) {
        return Promise.reject(error)
    }
}

exports.resetPassword = async function (email) {
    try {
        firebaseAuth.sendPasswordResetEmail(auth, email)
            .then(() => {
                return "OK"
            })
    } catch (error) {
        return Promise.reject(error)
    }
}

exports.getLanguage = async function (uid) {
    try {
        const docRef = userCollection.doc(uid)
        const doc = await docRef.get()
        if (!doc.exists) {
            throw new Error(`User does not exist: ${uid}`)
        }
        return doc.data().language
    } catch (error) {
        return Promise.reject(error)
    }
}

exports.getUserInfo = async function (uid) {
    try {
        userData = admin.auth()
            .getUser(uid)
            .then((userRecord) => {
                return userRecord.toJSON()
            })
        return userData
    } catch (error) {
        return Promise.reject(error)
    }
}

exports.deregisterUser = async function (uid) {
    try {
        await admin.auth().deleteUser(uid)
        await userCollection.doc(uid).delete()
        return "OK"
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
