import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/login.js'
import Signup from './pages/signup.js'

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={Login} />
        <Route path='/signup' Component={Signup} />
        {/* Add other routes */}
      </Routes>
    </Router>
  )
}

export default App
