import { Box } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectLoginstatus } from './redux/UserSlice'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ErrorMessage from './components/ErrorMessage'
import { selectShowError } from './redux/ErrorSlice'
import ResetPasswordPage from './pages/ResetPasswordPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import CollabPage from './pages/CollabPage'
import CodeEditorPage from './pages/CodeEditorPage'
import PreviousQuestionPage from './pages/PreviousQuestionPage'

function App () {
  const loginStatus = useSelector(selectLoginstatus)
  const showErrorAlert = useSelector(selectShowError)

  return (
    <>
      <Box display='flex' flexDirection='column' height='100vh'>
        <BrowserRouter>
          {showErrorAlert && <ErrorMessage />}
          <Routes>
            {loginStatus
              ? (
                <>
                  <Route path='/' element={<Navigate to='/home' replace />} />
                  <Route path='/home' exact element={<HomePage />} />
                  <Route path='/collab' exact element={<CollabPage />} />
                  <Route path='/previousAttempt/:roomId' exact element={<PreviousQuestionPage/>} />
                  <Route
                    path='/question/:questionId'
                    element={<CodeEditorPage />}
                  />
                  <Route path='*' element={<Navigate to='/home' />} />
                </>
                )
              : (
                <>
                  <Route path='/' Component={LoginPage} />
                  <Route path='/signup' Component={SignupPage} />
                  <Route path='/resetPassword' Component={ResetPasswordPage} />
                  <Route path='' element={<Navigate to='/' />} />
                  <Route path='*' element={<Navigate to='/' />} />
                </>
                )}
          </Routes>
        </BrowserRouter>
      </Box>
    </>
  )
}

export default App
