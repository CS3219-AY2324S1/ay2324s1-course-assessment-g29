import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useSelector } from 'react-redux'
import { selectAwaitChangeQuestionOpen } from '../redux/EditorSlice'

export default function AwaitChangeQuestionDialog ({matchedUserId}) {
  const awaitAlertOpen = useSelector(selectAwaitChangeQuestionOpen)

  return (
    <div>
      <Dialog
        open={awaitAlertOpen}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          Awaiting Matched User to agree to change
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Awaiting for {matchedUserId} to agree to change the Question
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  )
}
