import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setDisplayname, setUserid, setStateEmail, setLoginStatus, setIdToken } from '../redux/UserSlice.js'
import { setShowError, setErrorMessage } from '../redux/ErrorSlice.js'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function SignupPage () {
  const auth = getAuth()

  const [name, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const requireAllNonNull = () => {
    const requiredFields = [name, username, email, password, passwordConfirmation]
    requiredFields.forEach((x, i) => {
      if (x === '') {
        throw new Error('All fields cannot be empty')
      }
    })
  }

  const checkPasswords = (password1, password2) => {
    if (password1 !== password2) {
      throw new Error('Passwords do not match')
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()

    try {
      requireAllNonNull()
      checkPasswords(password, passwordConfirmation)
      await axios.post('http://localhost:3001/user/register', { name, username, email, password })
      console.log('sign up success')
      const userCredentials = await signInWithEmailAndPassword(auth, email, password)
      const userid = userCredentials.user.uid
      dispatch(setUserid(userid))
      const displayName = userCredentials.user.displayName
      dispatch(setDisplayname(displayName))
      const useremail = userCredentials.user.email
      dispatch(setStateEmail(useremail))
      const idToken = await userCredentials.user.getIdToken()
      dispatch(setIdToken(idToken))
      console.log('Signup successful')
      console.log('idToken', idToken)
      dispatch(setLoginStatus(true))
      navigate('/home')
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(setShowError(true))
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h2>Sign up for a PeerPrep account!</h2>
      <form onSubmit={handleSignUp} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <input
          type='text'
          placeholder='Display Name'
          value={name}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type='password'
          placeholder='Confirm Password'
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        <button type='submit'>Sign up</button>
      </form>
    </div>
  )
}

export default SignupPage
