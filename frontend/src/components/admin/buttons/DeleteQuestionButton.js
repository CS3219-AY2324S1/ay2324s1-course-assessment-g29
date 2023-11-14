import { Button } from 'antd'
import React from 'react'
import axios from 'axios'

const DeleteQuestionButton = ({ name, setQuestions, questions, handleDelete }) => {
  const deleteQuestion = async (qid) => {
    console.log(qid)
    await axios
      .delete(`http://34.125.231.246:3002/question/delete/${qid}`)
      .then((response) => {
        // TODO: Add success message
        console.log('Deleted successfully')
        handleDelete()
      })
      .catch((error) => {
        console.log(error.message)
      })
  }

  return (
    <Button type='primary' onClick={() => deleteQuestion(name)}>
      Delete
    </Button>
  )
}

export default DeleteQuestionButton
