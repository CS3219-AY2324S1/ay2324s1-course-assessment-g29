import { useEffect } from 'react'
import { Container } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie'
import { selectLoginstatus, setLoginStatus, setUserid } from './redux/UserSlice'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/login'
import Signup from './pages/signup'
import HomePage from './pages/HomePage'
import CollabPage from './pages/CollabPage'
import CodeEditorPage from './pages/CodeEditorPage'

function App () {

  const loginStatus = useSelector(selectLoginstatus);
  const [cookies, setCookie, removeCookie] = useCookies(['Peerprep'])
  const dispatch = useDispatch()

  useEffect(() => {
    if (loginStatus === false) {
      let userId = cookies.uid
      if (userId) {
        console.log(userId)
        dispatch(setUserid(userId))
        dispatch(setLoginStatus(true))
        // fetch user details in following code
      }
    }
  }, [])

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
