import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { selectChangeQuesitonAlertOpen, setChangeQuestionAlertOpen, setAwaitChangeQuestionOpen } from '../redux/EditorSlice'
import { setShowError, setErrorMessage } from '../redux/ErrorSlice'
import QuestionTable from './QuestionTable'
import { Modal } from 'antd'

export default function ChangeQuestionDialog ({ socket }) {
  const dispatch = useDispatch()
  const changeQuestionAlertOpen = useSelector(selectChangeQuesitonAlertOpen)
  const [questions, setQuestions] = useState([])

  const handleClose = () => {
    dispatch(setChangeQuestionAlertOpen(false))
  }

  const signalChangeQuestion = (question) => {
    socket.current.emit('ChangeQuestionData', { questionData: question })
    dispatch(setChangeQuestionAlertOpen(false))
    dispatch(setAwaitChangeQuestionOpen(true))
  }

  useEffect(() => {
    axios
      .get('http://localhost:3002/question/getAll')
      .then((response) => {
        setQuestions(response.data)
      })
      .catch((error) => {
        dispatch(setErrorMessage(error.message))
        dispatch(setShowError(true))
      })
  }, [])

  return (
    <div>
      <Modal
        open={changeQuestionAlertOpen}
        onCancel={handleClose}
        title='Choose a question to change to:'
        width='90%'
        centered
        footer={null}
      >
        <QuestionTable questions={questions} setQuestions={setQuestions} signalChangeQuestion={signalChangeQuestion} />

      </Modal>
    </div>
  )
}
