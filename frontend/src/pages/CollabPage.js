import { React, useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Editor } from '../components/Editor'
import { Box } from '@mui/system'
import { QuestionComponent } from '../components/QuestionComponent'
import ScrollToBottom from 'react-scroll-to-bottom'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import SendIcon from '@mui/icons-material/Send'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import { Typography } from '@mui/material'
import { selectUserid } from '../redux/UserSlice'
import { selectRoomid, selectMatchedUserid, selectQuestionData, selectMatchingLanguages, setRoomId, setQuestionData, setMatchingLanguages, setMatchedUserId, selectMessages, appendMessages, setMessages } from '../redux/MatchingSlice'
import { setErrorMessage, setShowError } from '../redux/ErrorSlice'
import { selectCode, selectCodeEditorLanguage } from '../redux/EditorSlice'
import { setAwaitAlertOpen, selectNewProgrammingLanguage, setCode, setCodeEditorLanguage, setNewProgrammingLanguage, setChangeProgrammingLanguageAlert } from '../redux/EditorSlice'
import ProgrammingLanguageDialog from '../components/ChangeProgrammingLanguageAlert'

const SOCKETSERVER = 'http://localhost:2000'

const connectionOptions = {
  'force new connection': true,
  reconnectionAttempts: 'Infinity',
  timeout: 10000,
  transports: ['websocket']
}

function CollabPage () {
  const [message, setMessage] = useState('')
  const messages = useSelector(selectMessages)
  const navigate = useNavigate()
  const newProgrammingLanguage = useSelector(selectNewProgrammingLanguage)
  const userid = useSelector(selectUserid)
  const matchedUserid = useSelector(selectMatchedUserid)
  const matchedUseridRef = useRef(matchedUserid)
  const roomid = useSelector(selectRoomid)
  const code = useSelector(selectCode)
  const language = useSelector(selectCodeEditorLanguage)
  const matchingLanguages = useSelector(selectMatchingLanguages)
  const questionData = useSelector(selectQuestionData)
  const dispatch = useDispatch()
  const socket = useRef()

  useEffect(() => {
    socket.current = io(SOCKETSERVER, connectionOptions)

    socket.current.on('connect', () => {
      console.log('connecting to websocket server')
      socket.current.emit('JoinRoom', { userid, roomid }, (error) => {
        if (error) {
          dispatch(setErrorMessage(error))
          dispatch(setShowError(true))
        }
      })
      console.log('joined waiting room')
    })

    socket.current.on('MatchSuccess', ({ matchedUserId, messages, code, language }) => {
      console.log(matchedUserId)
      console.log(messages)
      console.log(code)
      console.log(language)
      console.log('Match Success')
      dispatch(setMessages(messages))
      dispatch(setCode(code))
      dispatch(setCodeEditorLanguage(language))
    })

    // disconnect from socket when component unmounts
    return () => {
      if (socket.current) {
        socket.current.disconnect()
        socket.current.off()
      }
    }
  }, [SOCKETSERVER])

  useEffect(() => {
    socket.current.on('Message', (message) => {
      const messageString = message.message
      dispatch(appendMessages(messageString))
    })

    socket.current.on('CodeChange', (code) => {
      console.log(code.code)
      dispatch(setCode(code.code))
    })

    socket.current.on('CheckChangeEditorLanguage', ({ language }) => {
      dispatch(setNewProgrammingLanguage(language))
      dispatch(setChangeProgrammingLanguageAlert(true))
    })

    socket.current.on('ConfirmChangeEditorLanguage', ({ agree, language }) => {
      console.log('matched user has responded:')
      console.log(agree)
      console.log(language)
      if (agree) {
        dispatch(setCodeEditorLanguage(language))
        dispatch(setAwaitAlertOpen(false))
      } else {
        dispatch(setAwaitAlertOpen(false))
        dispatch(setErrorMessage(`${matchedUserid} has declined to change the programming language`))
        dispatch(setShowError(true))
      }
    })

    socket.current.on('DisconnectPeer', (message) => {
      dispatch(setErrorMessage('Peer has closed the room'))
      dispatch(setShowError(true))
    })
  }, [])

  const sendMessage = (event) => {
    event.preventDefault()
    const messageString = `${userid} : ${message}`
    if (message) {
      dispatch(appendMessages(messageString))
      socket.current.emit('Message', { message: messageString }, () => setMessage(''))
    }
  }

  const LeaveRoom = (event) => {
    event.preventDefault()
    axios.post('http://localhost:8000/room/leaveroom', { rid: roomid })
      .catch((error) => {
        dispatch(setErrorMessage(error.message))
        dispatch(setShowError(true))
      })
    socket.current.emit('CloseRoom')
    axios.post('http://localhost:8000/room/savehistory', { rid: roomid, user1id: userid, user2id: matchedUserid, questionData: questionData, code, language, messages })
    .then((response) => {
      const message = response.data.message
      dispatch(setRoomId(''))
      dispatch(setMatchingLanguages([]))
      dispatch(setMatchedUserId(''))
      dispatch(setMessages([]))
      dispatch(setQuestionData({}))
      dispatch(setErrorMessage(message))
      dispatch(setShowError(true))
      navigate('/')
    }).catch((error) => {
      dispatch(setErrorMessage(error.message))
      dispatch(setShowError(true))
    })
  }

  const denyProgrammingLanguageChange = () => {
    console.log('disagree change')
    socket.current.emit('ConfirmChangeEditorLanguage', { agree: false, language: newProgrammingLanguage }, (error) => {
      if (error) {
        dispatch(setErrorMessage(error))
        dispatch(setShowError(true))
      }
    })
    dispatch(setNewProgrammingLanguage(''))
  }

  const agreeProgrammingLanguageChange = () => {
    console.log('agree change')
    socket.current.emit('ConfirmChangeEditorLanguage', { agree: true, language: newProgrammingLanguage }, (error) => {
      if (error) {
        dispatch(setErrorMessage(error))
        dispatch(setShowError(true))
      }
    })
    dispatch(setNewProgrammingLanguage(''))
    dispatch(setCodeEditorLanguage(newProgrammingLanguage))
  }

  return (
    <>
      <div style={{ width: '100%', height: '70%', paddingTop: '1rem' }}>
        <ProgrammingLanguageDialog
          matchedUserId={matchedUserid}
          language={newProgrammingLanguage}
          denyChange={denyProgrammingLanguageChange}
          agreeChange={agreeProgrammingLanguageChange}
        />
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='center'
          alignItems='start'
        >
          <div style={{ width: '50%' }}>
            <QuestionComponent questionData={questionData} />
          </div>
          <div style={{ width: '50%', height: '100%' }}>
            <Editor socketRef={socket} />
          </div>
        </Box>
      </div>
      <Container>
        <Grid>
          <Typography variant='h3' component='h2'>
            Matching Programming Languages:
          </Typography>
          {matchingLanguages.length > 0 && matchingLanguages.map((language, i) => (
            <div key={i}>
              <Typography>{language}</Typography>
            </div>
          ))}
        </Grid>
        <Grid>
          <Typography variant='h3' component='h2'>
            Matched with : {matchedUserid}
          </Typography>
        </Grid>
        <Grid>
          <Button variant='contained' onClick={LeaveRoom} endIcon={<SendIcon />}>
            Close Room
          </Button>
        </Grid>
        <Grid>
          <Card>
            <ScrollToBottom className='messages'>
              {messages.map((message, i) => (
                <div key={i}>
                  <Typography>{message}</Typography>
                </div>
              ))}
            </ScrollToBottom>
            <TextField
              id='outlined-multiline-flexible'
              label='Send A Message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              maxRows={4}
            />
            <Button variant='contained' onClick={sendMessage} endIcon={<SendIcon />}>
              Send
            </Button>
            <br />
          </Card>
        </Grid>
      </Container>
    </>
  )
}

export default CollabPage
