import { initFirebase } from '../configs/firebase.js'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setDisplayname, setUserid, setStateEmail, setLoginStatus } from '../redux/UserSlice.js'
import { useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'

function LoginPage () {
  const app = initFirebase()
  console.log(app)
  const auth = getAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password)
      // User is logged in
      const userid = userCredentials.user.uid
      dispatch(setUserid(userid))
      const displayName = userCredentials.user.displayName
      dispatch(setDisplayname(displayName))
      const useremail = userCredentials.user.email
      dispatch(setStateEmail(useremail))
      dispatch(setLoginStatus(true))
      console.log('Login successful')
      navigate('/home')
    } catch (error) {
      setErrorMessage(error.message) // TODO handle firebase errors (give better descriptions)
      setShowErrorAlert(true)
    }
  }

  const routeChangeSignup = () => {
    const path = '/signup'
    navigate(path)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      {showErrorAlert
        ? (
          <Alert severity='error' onClose={() => setShowErrorAlert(false)}>Error: {errorMessage}</Alert>
          )
        : (
          <>
          </>
          )}
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
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
        <button type='submit'>Log In</button>
      </form>
      <button onClick={routeChangeSignup}>Sign Up</button>

    </div>
  )
}

export default LoginPage
