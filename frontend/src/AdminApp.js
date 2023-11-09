import React, { useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthorized } from './redux/UserSlice'
import QuestionTable from './components/admin/QuestionTable'
import CreateNewQuestion from './components/admin/CreateNewQuestion'
import Question from './components/admin/Question'
import EditQuestion from './components/admin/EditQuestion'

const AdminApp = () => {
  const [questions, setQuestions] = useState([])
  const isAuthorized = useSelector(selectIsAuthorized)

  // useEffect(() => {
  //   const config = {
  //     headers: { Authorization: `Bearer ${idToken}` }
  //   }

  //   console.log("HELPERINOS")
  //   axios
  //     .get(`http://localhost:3001/user/authorizeAdmin/${userId}`, config)
  //     .then((response) => {
  //       if (response.status === 200) {
  //         dispatch(setIsAuthorized(true))
  //       } else {
  //         dispatch(setIsAuthorized(false))
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error checking authorization:', error)
  //       dispatch(setIsAuthorized(false))
  //     })
  // }, [userId, idToken, dispatch])

  return (
    <>
      {isAuthorized == null
        ? <div>Checking authorization</div>
        : isAuthorized
          ? (
            <Routes>
              <Route path='/' element={<Navigate to='questions' replace />} />
              <Route
                path='questions'
                element={
                  <QuestionTable questions={questions} setQuestions={setQuestions} />
                  }
              />
              <Route
                exact
                path='questions/create'
                element={
                  <CreateNewQuestion
                    questions={questions}
                    setQuestions={setQuestions}
                  />
                  }
              />
              <Route
                exact
                path='questions/:name/'
                element={
                  <Question questions={questions} setQuestions={setQuestions} />
                  }
              />
              <Route
                exact
                path='questions/edit/:name/'
                element={
                  <EditQuestion questions={questions} setQuestions={setQuestions} />
                  }
              />
            </Routes>
            )
          : <div>Authorized content for admin</div>}
    </>
  )
}

export default AdminApp
