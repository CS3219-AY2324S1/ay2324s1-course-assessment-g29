import React, { useState, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserid, selectIdToken } from './redux/UserSlice'
import QuestionTable from './components/admin/QuestionTable'
import CreateNewQuestion from './components/admin/CreateNewQuestion'
import Question from './components/admin/Question'
import EditQuestion from './components/admin/EditQuestion'
import axios from 'axios'

const AdminApp = () => {
  const [questions, setQuestions] = useState([])
  const [isAuthorized, setIsAuthorized] = useState(null)
  const userId = useSelector(selectUserid)
  const idToken = useSelector(selectIdToken)

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${idToken}` }
    }

    axios
      .get(`http://localhost:3001/user/authorizeAdmin/${userId}`, config)
      .then((response) => {
        if (response.status === 200) {
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
        }
      })
      .catch((error) => {
        console.error('Error checking authorization:', error)
        setIsAuthorized(false)
      })
  }, [])

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
