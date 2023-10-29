import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { selectChangeQuesitonAlertOpen, setChangeQuestionAlertOpen, setAwaitChangeQuestionOpen } from '../redux/EditorSlice'
import { setShowError, setErrorMessage } from '../redux/ErrorSlice'
import QuestionTable from './QuestionTable'

export default function ChangeQuestionDialog ({ socket }) {
  const dispatch = useDispatch()
  const changeQuestionAlertOpen = useSelector(selectChangeQuesitonAlertOpen)
  const [questions, setQuestions] = useState([])

  const handleClose = () => {
    dispatch(setChangeQuestionAlertOpen(false))
  }

  const signalChangeQuestion = (question) => {
    socket.current.emit('ChangeQuestionData', { question })
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
      <Dialog
        open={changeQuestionAlertOpen}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        fullWidth
        maxWidth='xl'
      >
        <DialogTitle id='alert-dialog-title'>
          Choose your question:
        </DialogTitle>
        <DialogContent>
          <QuestionTable questions={questions} setQuestions={setQuestions} signalChangeQuestion={signalChangeQuestion} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
