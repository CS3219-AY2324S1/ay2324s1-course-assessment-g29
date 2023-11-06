import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectChangeDeactivateAccountAlert,
  setChangeDeactivateAccountAlert
} from '../redux/UserSlice'

export default function DeactivateAccountDialog ({
  denyChange,
  agreeChange
}) {
  const open = useSelector(selectChangeDeactivateAccountAlert)
  const dispatch = useDispatch()

  const handleDisagree = () => {
    denyChange()
    dispatch(setChangeDeactivateAccountAlert(false))
  }

  const handleAgree = () => {
    agreeChange()
    dispatch(setChangeDeactivateAccountAlert(false))
  }

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          Deactivate Account?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deactivating your account will permanently remove the account from PeerPrep, including all your progress.
            Are you sure you want to deactivate your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree} autoFocus>No, don't deactivate</Button>
          <Button color='error' onClick={handleAgree}>
            Yes, deactivate
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
