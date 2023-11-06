import React, { useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import QuestionTable from './components/admin/QuestionTable'
import CreateNewQuestion from './components/admin/CreateNewQuestion'
import Question from './components/admin/Question'
import EditQuestion from './components/admin/EditQuestion'

const AdminApp = () => {
  const [questions, setQuestions] = useState([])

  return (
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
}

export default AdminApp
