import { initFirebase } from '../configs/firebase.js'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setDisplayname, setUserid, setStateEmail, setLoginStatus, setIdToken } from '../redux/UserSlice.js'
import { setErrorMessage, setShowError } from '../redux/ErrorSlice.js'
import { useNavigate } from 'react-router-dom'

function LoginPage () {
  initFirebase()
  const auth = getAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
      console.log(userCredentials)
      const idToken = await userCredentials.user.getIdToken()
      dispatch(setIdToken(idToken))
      console.log('Login successful')
      dispatch(setLoginStatus(true))
      navigate('/home')
    } catch (error) {
      dispatch(setErrorMessage(error.message)) // TODO handle firebase errors (give better descriptions)
      dispatch(setShowError(true))
    }
  }

  const routeChangeSignup = () => {
    const path = '/signup'
    navigate(path)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
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
