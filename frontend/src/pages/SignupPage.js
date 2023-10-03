import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setDisplayname, setUserid, setStateEmail, setLoginStatus } from '../redux/UserSlice.js'
import { setShowError, setErrorMessage } from '../redux/ErrorSlice.js'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function SignupPage () {
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const requireAllNonNull = () => {
    const requiredFields = [displayName, username, email, password, passwordConfirmation]
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
      axios.post('http://localhost:3001/user/register', { name: displayName, username, email, password })
        .then((response) => {
          const userCredentials = response.data
          const userid = userCredentials.user.uid
          dispatch(setUserid(userid))
          const displayName = userCredentials.user.displayName
          dispatch(setDisplayname(displayName))
          const useremail = userCredentials.user.email
          dispatch(setStateEmail(useremail))
          dispatch(setLoginStatus(true))
          console.log('Signup successful')
          navigate('/home')
        }).catch((error) => {
          dispatch(setErrorMessage(error.message)) // TODO Handle axios errors
          dispatch(setShowError(true))
        })
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
          value={displayName}
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
