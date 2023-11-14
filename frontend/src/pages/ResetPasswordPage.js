import { Box, Button, TextField, Typography, Dialog, DialogActions } from '@mui/material'
import React, { useState } from 'react'
import LoginPageBanner from '../components/FrontPageBanner'
import { setShowError, setErrorMessage } from '../redux/ErrorSlice.js'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import DialogContent from '@mui/material/DialogContent'

function ResetPasswordPage () {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleResetPassword = (e) => {
    axios
      .post('http://34.125.231.246:3001/user/resetPassword', { email })
      .then((response) => {
        setIsDialogOpen(true)
        navigate('/')
      })
      .catch((error) => {
        dispatch(setErrorMessage(error.message))
        dispatch(setShowError(true))
        setEmailError(error.message)
      })
  }

  return (
    <Box display='flex' flexDirection='row' height='100vh'>
      <Box
        display='flex'
        flex={1}
        flexDirection='column'
        justifyContent='center'
      >
        <Box display='flex' flexDirection='column' padding='25%'>
          <Typography variant='h4' marginBottom='1rem' fontWeight='bold'>
            Reset Password
          </Typography>
          <Typography variant='body2' marginBottom='2rem'>
            <b>Please enter your details</b>
          </Typography>
          <form
            onSubmit={handleResetPassword}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <TextField
              label='Email'
              variant='standard'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: '1rem' }}
              error={emailError}
              helperText={emailError}
              autoFocus
              fullWidth
            />
            <Button variant='contained' type='submit' fullWidth>
              <b>Login</b>
            </Button>
          </form>

          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
            <DialogContent>
              <Typography variant='body1'>
                An email has been sent to your email to reset your password.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDialogOpen(false)}>OK</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <LoginPageBanner />
    </Box>
  )
}

export default ResetPasswordPage
