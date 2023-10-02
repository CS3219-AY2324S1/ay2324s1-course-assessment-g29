import { Container } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectLoginstatus } from './redux/UserSlice'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/login'
import Signup from './pages/signup'
import HomePage from './pages/HomePage'
import CollabPage from './pages/CollabPage'

function App () {
  const loginStatus = useSelector(selectLoginstatus)

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Container>
          <Routes>
            {loginStatus 
              ? (
                <>
                  <Route path='/' element={<Navigate to='/home' replace />} />
                  <Route path='/home' exact element={<HomePage />} />
                  <Route path='/collab' exact element={<CollabPage />} />
                  <Route path='*' element={<Navigate to='/home' />} />
                </>
                )
              : (
                <>
                  <Route path='/' Component={Login} />
                  <Route path='/signup' Component={Signup} />
                  <Route path='' element={<Navigate to='/' />} />
                  <Route path='*' element={<Navigate to='/' />} />
                </>
              )}
          </Routes>
        </Container>
      </BrowserRouter>
    </>
  )
}

export default App
