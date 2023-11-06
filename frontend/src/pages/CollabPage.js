// TODO: check if commented out code is needed
import { React, useEffect, useRef } from 'react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import io from 'socket.io-client'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Editor } from '../components/Editor'
import { Box } from '@mui/system'
import { QuestionComponent } from '../components/QuestionComponent'
// import ScrollToBottom from 'react-scroll-to-bottom'
import Button from '@mui/material/Button'
// import Card from '@mui/material/Card'
// import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import SendIcon from '@mui/icons-material/Send'
// import TextField from '@mui/material/TextField'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { Typography } from '@mui/material'
import { selectUserid } from '../redux/UserSlice'
import Navbar from '../components/Navbar'
// import chatComponent from '../components/ChatComponent'
import {
  selectRoomid,
  selectMatchedUserid,
  selectQuestionData,
  selectMatchingLanguages,
  setRoomId,
  setQuestionData,
  setMatchingLanguages,
  setMatchedUserId,
  selectMessages,
  appendMessages,
  setMessages
} from '../redux/MatchingSlice'
import {
  setErrorMessage,
  setShowError,
  setShowSuccess,
  setSucessMessage
} from '../redux/ErrorSlice'
// import Fab from '@mui/material/Fab'
import {
  setAwaitAlertOpen,
  selectNewProgrammingLanguage,
  selectCodeEditorLanguage,
  setCode,
  selectCode,
  setCodeEditorLanguage,
  setNewProgrammingLanguage,
  setChangeProgrammingLanguageAlert,
  setChangeQuestionAlertOpen,
  setCheckChangeQuestionData,
  setChangeQuestionData,
  setAwaitChangeQuestionOpen
} from '../redux/EditorSlice'
import ProgrammingLanguageDialog from '../components/ChangeProgrammingLanguageAlert'
import ChangeQuestionDialog from '../components/ChangeQuestionDialog'
import ChatComponent from '../components/ChatComponent'
import AwaitChangeQuestionDialog from '../components/AwaitChangeQuestionData'
import CheckChangeQuestionDataDialog from '../components/CheckChangeQuestionDataDialog'
import { setPreviousQuestions, setPreviousRooms, selectPreviousRooms } from '../redux/UserSlice'

const SOCKETSERVER = 'http://localhost:2000'

const connectionOptions = {
  'force new connection': true,
  reconnectionAttempts: 'Infinity',
  timeout: 10000,
  transports: ['websocket']
}

function CollabPage() {
  // const [message, setMessage] = useState('')
  const messages = useSelector(selectMessages)
  const navigate = useNavigate()
  const newProgrammingLanguage = useSelector(selectNewProgrammingLanguage)
  const userid = useSelector(selectUserid)
  const matchedUserid = useSelector(selectMatchedUserid)
  const roomid = useSelector(selectRoomid)
  const code = useSelector(selectCode)
  const language = useSelector(selectCodeEditorLanguage)
  const matchingLanguages = useSelector(selectMatchingLanguages)
  const questionData = useSelector(selectQuestionData)
  const dispatch = useDispatch()
  const socket = useRef()
  const previousRooms = useSelector(selectPreviousRooms)

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

    socket.current.on(
      'MatchSuccess',
      ({ matchedUserId, messages, code, language }) => {
        console.log(matchedUserId)
        console.log(messages)
        console.log(code)
        console.log(language)
        console.log('Match Success')
        dispatch(setMessages(messages))
        dispatch(setCode(code))
        dispatch(setCodeEditorLanguage(language))
        dispatch(setAwaitChangeQuestionOpen(false))
      }
    )

    // disconnect from socket when component unmounts
    return () => {
      if (socket.current) {
        socket.current.disconnect()
        socket.current.off()
      }
    }
  }, [dispatch, roomid, userid])

  useEffect(() => {
    socket.current.on('Message', (message) => {
      const messageString = message.message
      dispatch(appendMessages(messageString))
    })

    socket.current.on('CodeChange', (code) => {
      console.log(code.code)
      dispatch(setCode(code.code))
    })

    socket.current.on('CheckQuestionChange', ({ questionData }) => {
      console.log(questionData)
      dispatch(setChangeQuestionData(questionData))
      dispatch(setCheckChangeQuestionData(true))
    })

    socket.current.on('ConfirmChangeQuestion', ({ agree, questionData }) => {
      console.log('matched user has responded:')
      console.log(agree)
      console.log(questionData)
      if (agree) {
        dispatch(setCode('Please choose a language to begin!\n'))
        dispatch(setQuestionData(questionData))
        dispatch(setChangeQuestionData({}))
      } else {
        dispatch(
          setErrorMessage(
            `${matchedUserid} has declined to change the question`
          )
        )
        dispatch(setShowError(true))
      }
      dispatch(setAwaitChangeQuestionOpen(false))
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
        dispatch(
          setErrorMessage(
            `${matchedUserid} has declined to change the programming language`
          )
        )
        dispatch(setShowError(true))
      }
    })

    socket.current.on('DisconnectPeer', (message) => {
      dispatch(setErrorMessage('Peer has closed the room'))
      dispatch(setShowError(true))
    })
  }, [dispatch, matchedUserid])

  const LeaveRoom = (event) => {
    event.preventDefault()
    axios
      .post('http://localhost:8000/room/leaveroom', { rid: roomid })
      .then((request) => {
        console.log(request)
      })
      .catch((error) => {
        dispatch(setErrorMessage(error.message))
        dispatch(setShowError(true))
      })
    socket.current.emit('CloseRoom',
      {
        rid: roomid,
        user1id: userid,
        user2id: matchedUserid,
        questionData,
        code,
        language,
        messages
      })
    dispatch(setPreviousRooms([...previousRooms, roomid]))
    dispatch(setRoomId(''))
    dispatch(setMatchingLanguages([]))
    dispatch(setMatchedUserId(''))
    dispatch(setMessages([]))
    dispatch(setSucessMessage('Room has been closed'))
    dispatch(setShowSuccess(true))
    dispatch(setQuestionData({}))
    navigate('/')
  }

  const denyProgrammingLanguageChange = () => {
    console.log('disagree change')
    socket.current.emit(
      'ConfirmChangeEditorLanguage',
      { agree: false, language: newProgrammingLanguage },
      (error) => {
        if (error) {
          dispatch(setErrorMessage(error))
          dispatch(setShowError(true))
        }
      }
    )
    dispatch(setNewProgrammingLanguage(''))
  }

  const agreeProgrammingLanguageChange = () => {
    console.log('agree change')
    socket.current.emit(
      'ConfirmChangeEditorLanguage',
      { agree: true, language: newProgrammingLanguage },
      (error) => {
        if (error) {
          dispatch(setErrorMessage(error))
          dispatch(setShowError(true))
        }
      }
    )
    dispatch(setNewProgrammingLanguage(''))
    dispatch(setCodeEditorLanguage(newProgrammingLanguage))
  }

  const changeQuestion = (event) => {
    event.preventDefault()
    dispatch(setChangeQuestionAlertOpen(true))
  }

  return (
    <Box display='flex' flexDirection='column' alignContent='flex-start' >
      <Navbar />
      <Box
        display='flex'
        style={{ paddingTop: '1rem' }}
        justifyContent='center'
        height= '100vh'
        padding='2rem'
      >
        <PanelGroup direction="horizontal" autoSaveId="example">
          <Panel defaultSize={40} minSize={20} id="question">
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='center'
              sx={{ p: 2 }}
            >
              <Box justifyContent='center'>
                <Box>
                  <QuestionComponent questionData={questionData} />
                  <Box marginBottom={1}>
                    <Typography variant='body2' component='h2'>
                      You're currently matched with {matchedUserid}
                    </Typography>
                  </Box>
                  <Typography variant='body2' component='h2'>
                    Common Programming Languages:{' '}
                    {matchingLanguages.length > 0 &&
                      matchingLanguages.map((language, i) => (
                        <Chip key={i} label={language} />
                      ))}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Panel>
          <PanelResizeHandle />
          <Panel 
          defaultSize={40} 
          minSize={20} id='editor'>
            <div
              display='flex'
              flexDirection='column'
              flex={1}
              height='100vh'
              alignContent='flex-end'
            >
              <Box margin={1} flex={1}>
                <Editor socketRef={socket} />
              </Box>
              <Box
                margin={1}
                display='flex'
                flexDirection='row'
                alignContent='flex-end'
              >
                <Button
                  variant='contained'
                  onClick={LeaveRoom}
                  endIcon={<SendIcon />}
                >
                  Close room
                </Button>
                <Box marginRight={1} />
                <Button
                  variant='contained'
                  onClick={changeQuestion}
                  endIcon={<QuestionMarkIcon />}
                >
                  Change question
                </Button>
              </Box>
            </div>
          </Panel>
        </PanelGroup>
      </Box >
      <ProgrammingLanguageDialog
        matchedUserId={matchedUserid}
        language={newProgrammingLanguage}
        denyChange={denyProgrammingLanguageChange}
        agreeChange={agreeProgrammingLanguageChange}
      />
      <AwaitChangeQuestionDialog matchedUserId={matchedUserid} />
      <CheckChangeQuestionDataDialog socket={socket} matchedUserId={matchedUserid} />
      <ChangeQuestionDialog socket={socket} />
      <ChatComponent socket={socket} />
    </Box >
  )
}

export default CollabPage
