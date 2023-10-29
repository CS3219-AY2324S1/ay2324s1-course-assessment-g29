import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCheckChangeQuestionData,
  selectChangeQuesitonData,
  setCheckChangeQuestionData,
  setChangeQuestionData
} from '../redux/EditorSlice'
import { setQuestionData } from '../redux/MatchingSlice'

export default function CheckChangeQuestionDataDialog ({socket, matchedUserId}) {
  const open = useSelector(selectCheckChangeQuestionData)
  const newQuestion = useSelector(selectChangeQuesitonData)
  const dispatch = useDispatch()

  const handleDisagree = () => {
    socket.current.emit('ConfirmChangeQuestion', {agree: false, question: newQuestion})
    dispatch(setCheckChangeQuestionData(false))
    dispatch(setChangeQuestionData({}))
  }

  const handleAgree = () => {
    const finalQuestion = { question: newQuestion }
    socket.current.emit('ConfirmChangeQuestion', {agree: true, question: finalQuestion})
    dispatch(setQuestionData(finalQuestion))
    dispatch(setCheckChangeQuestionData(false))
    dispatch(setChangeQuestionData({}))
  }

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          Change Question?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {matchedUserId} is trying to change the current question to:
            <br />
            {newQuestion.displayName}.
            <br />
            <br />
            Description:
            <br />
            {newQuestion.description}
            <br />
            <br />
            Do you agree to the change?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree}>Disagree</Button>
          <Button onClick={handleAgree} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
