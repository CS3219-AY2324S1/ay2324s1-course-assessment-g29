import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import axios from 'axios'
import { setRoomId, setQuestionData, selectAwaitingMatching, setAwaitingMatching, setMatchedUserId, selectDifficulty, setDifficulty, setMatchingLanguages, selectRoomid } from '../redux/MatchingSlice'
import { setShowError, setErrorMessage } from '../redux/ErrorSlice'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { selectPreferredLanguages, selectUserid } from '../redux/UserSlice'
import { setCode } from '../redux/EditorSlice'
import Card from '@mui/material/Card'

const MATCHINGSERVER = 'http://localhost:4000'

const COLLABSERVER = 'http://localhost:4000'

const connectionOptions = {
  reconnectionAttempts: 'Infinity',
  timeout: 10000,
  transports: ['websocket']
}

function MatchingComponent () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userid = useSelector(selectUserid)
  const roomid = useSelector(selectRoomid)
  const [alreadyInRoom, setAlreadyInRoom] = useState(false)
  const preferredLanguages = useSelector(selectPreferredLanguages)
  const difficulty = useSelector(selectDifficulty)
  const isMatching = useSelector(selectAwaitingMatching)
  const socket = useRef()

  const handleChange = (event) => {
    dispatch(setDifficulty(event.target.value))
  }

  useEffect(() => {
    axios.post(`http://localhost:8000/room/checkroom`, { userid })
      .then((response) => {
        const roomid = response.data.room
        const roomdata = response.data.roomdata
        if (roomid !== '') {
          setAlreadyInRoom(true)
          dispatch(setRoomId(roomid))
          dispatch(setMatchedUserId(roomdata.matchedUserId))
          dispatch(setQuestionData(roomdata.questionData))
          dispatch(setMatchingLanguages(roomdata.matchingLanguages))
        } 
      }).catch((error) => {
        dispatch(setErrorMessage(error.message))
        dispatch(setShowError(true))
      })
  }, [])

  useEffect(() => {
    // disconnect from socket when component unmounts
    if (isMatching) {
      joinQueue()
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect()
        dispatch(setAwaitingMatching(false))
        socket.current.off()
      }
    }
  }, [])

  const joinQueue = () => {
    if (difficulty === '') {
      dispatch(setErrorMessage('Choose a difficulty before joining the queue'))
      dispatch(setShowError(true))
      return
    }
    console.log('Try Matching')
    socket.current = io(MATCHINGSERVER, connectionOptions)
    socket.current.connect()
    socket.current.emit('JoinQueue', { userid, difficulty, languages: preferredLanguages }, (error) => {
      if (error) {
        dispatch(setErrorMessage(error))
        dispatch(setShowError(true))
      }
    })
    dispatch(setAwaitingMatching(true))
    socket.current.on('MatchingSuccess', ({ matchedUserId, roomId, questionData, matchingLanguages }) => {
      dispatch(setMatchedUserId(matchedUserId))
      dispatch(setRoomId(roomId))
      dispatch(setQuestionData(questionData))
      console.log(matchingLanguages)
      dispatch(setMatchingLanguages(matchingLanguages))
      dispatch(setCode('Please choose a language to begin!\n'))
      navigate('/collab')
    })
    socket.current.on('ErrorMatching', ({ errorMessage }) => {
      dispatch(setErrorMessage(errorMessage))
      dispatch(setShowError(true))
      socket.current.disconnect()
      dispatch(setAwaitingMatching(false))
    })

    console.log('joined waiting room')
  }

  const leaveQueue = () => {
    console.log('disconecting from matching websocket')
    socket.current.disconnect()
    dispatch(setAwaitingMatching(false))
  }

  const joinRoom = () => {
    navigate('/collab')
  }

  return (
    <>
      <Grid mt={2}>
        <Card>
          {alreadyInRoom 
            ? (
              <>
                <Box>
                  <Typography variant='h3' component='h2'>
                    Already In Room
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Button variant='contained' onClick={joinRoom}>Join Room</Button>
                </Box>
              </>

            ) : (
              <>
                {isMatching
                  ? (
                    <>
                      <Box>
                        <Typography variant='h3' component='h2'>
                          Awaiting Match
                        </Typography>
                        <CircularProgress />
                      </Box>
                      <Box mt={2}>
                        <Button variant='contained' onClick={leaveQueue}>Leave Queue</Button>
                      </Box>
                    </>
                  )
                  : (
                    <>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <InputLabel id='difficultyForm'>Difficulty</InputLabel>
                          <Select
                            labelId='difficultySelect-label'
                            id='difficultySelect'
                            value={difficulty}
                            label='Difficulty'
                            onChange={handleChange}
                          >
                            <MenuItem value='Easy'>Easy</MenuItem>
                            <MenuItem value='Normal'>Normal</MenuItem>
                            <MenuItem value='Hard'>Hard</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box mt={2}>
                        <Button variant='contained' onClick={joinQueue}>Start Match</Button>
                      </Box>
                    </>
                  )}
              </>
            )}
        </Card>
      </Grid>
    </>
  )
}

export default MatchingComponent
