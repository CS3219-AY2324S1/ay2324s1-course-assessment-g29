import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectUserid, selectDisplayname, selectEmail } from '../redux/UserSlice'
import { setRoomId, setQuestionData } from '../redux/MatchingSlice'
import axios from 'axios'
import Alert from '@mui/material/Alert'
import { Box, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'

function HomePage () {
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const userid = useSelector(selectUserid)
  const email = useSelector(selectEmail)
  const displayName = useSelector(selectDisplayname)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const joinQueue = async () => {
    try {
      console.log('Try Matching')
      const response = await axios.post('http://localhost:4000/match/', {
        user1id: userid
      })
      dispatch(setRoomId(response.data.roomId))
      dispatch(setQuestionData(response.data.questionData.question))
      setSuccessMessage(response.data.message)
      setShowSuccessAlert(true)
      navigate('/collab')
    } catch (error) {
      setErrorMessage(error.message)
      setShowErrorAlert(true)
    }
  }
  return (
    <>
      <Container>
        {showSuccessAlert
          ? (
            <Alert onClose={() => setShowSuccessAlert(false)}>{successMessage}</Alert>
            )
          : (
            <>
            </>
            )}
        {showErrorAlert
          ? (
            <Alert severity='error' onClose={() => setShowErrorAlert(false)}>Error: {errorMessage}</Alert>
            )
          : (
            <>
            </>
            )}
        <Card>
          <Typography>
            Name: {displayName}
          </Typography>
          <Typography>
            UserId: {userid}
          </Typography>
          <Typography>
            Email: {email}
          </Typography>
        </Card>
        <Box mt={2}>
          <Button variant='contained' onClick={joinQueue}>Start Match</Button>
        </Box>
      </Container>
    </>
  )
}

export default HomePage
