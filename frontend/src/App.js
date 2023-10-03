import { Container } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectLoginstatus } from './redux/UserSlice'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import CollabPage from './pages/CollabPage'
import CodeEditorPage from './pages/CodeEditorPage'

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
                  <Route path='/question/:questionId' element={<CodeEditorPage />} />
                  <Route path='*' element={<Navigate to='/home' />} />
                </>
                )
              : (
                <>
                  <Route path='/' exact element={<LoginPage />} />
                  <Route path='/signup' exact element={<SignupPage />} />
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
