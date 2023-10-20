import { React, useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux'
import ScrollToBottom from 'react-scroll-to-bottom'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import SendIcon from '@mui/icons-material/Send'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import { Typography } from '@mui/material'
import { selectUserid } from '../redux/UserSlice'
import Navbar from "../components/Navbar";
import { selectRoomid, selectMatchedUserid, setMatchedUserId } from '../redux/MatchingSlice'

const SOCKETSERVER = 'http://localhost:2000'

const connectionOptions = {
  'force new connection': true,
  reconnectionAttempts: 'Infinity',
  timeout: 10000,
  transports: ['websocket']
}

function CollabPage () {
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isMatched, setIsMatched] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const userid = useSelector(selectUserid)
  const matchedUserid = useSelector(selectMatchedUserid)
  const matchedUseridRef = useRef(matchedUserid)
  const roomid = useSelector(selectRoomid)
  const dispatch = useDispatch()
  const socket = useRef()

  useEffect(() => {
    socket.current = io(SOCKETSERVER, connectionOptions)

    socket.current.on('connect', () => {
      console.log('connecting to websocket server')
      socket.current.emit('JoinRoom', { userid, roomid }, (error) => {
        if (error) {
          setErrorMessage(error)
          setShowErrorAlert(true)
        }
      })
      console.log('joined waiting room')
    })

    socket.current.on('MatchSuccess', ({ matchedUserId }) => {
      setIsMatched(true)
      dispatch(setMatchedUserId(matchedUserId))
      matchedUseridRef.current = matchedUserId
      console.log(matchedUserId)
    })

    // disconnect from socket when component unmounts
    return () => {
      if (socket.current) {
        socket.current.disconnect()
        dispatch(setMatchedUserId(''))
        matchedUseridRef.current = ''
        socket.current.off()
      }
    }
  }, [SOCKETSERVER])

  useEffect(() => {
    socket.current.on('Message', (message) => {
      const messageString = `${matchedUseridRef.current} : ${message.message}`
      setMessages(messages => [...messages, messageString])
    })

    socket.current.on('DisconnectPeer', (message) => {
      console.log('Hi')
      setErrorMessage('Peer has disconnected')
      setShowErrorAlert(true)
    })
  }, [])

  const sendMessage = (event) => {
    event.preventDefault()
    const messageString = `${userid} : ${message}`
    setMessages(messages => [...messages, messageString])
    if (message) {
      socket.current.emit('Message', { message }, () => setMessage(''))
    }
  }

  return (
    <>
      {showErrorAlert ? (
        <Alert severity="error" onClose={() => setShowErrorAlert(false)}>
          Error: {errorMessage}
        </Alert>
      ) : (
        <></>
      )}
      {isMatched ? (
        <>
          <Navbar />
          <Container>
            <Grid>
              <Typography variant="h3" component="h2">
                Matched with : {matchedUserid}
              </Typography>
            </Grid>
            <Grid>
              <Card>
                <ScrollToBottom className="messages">
                  {messages.map((message, i) => (
                    <div key={i}>
                      <Typography>{message}</Typography>
                    </div>
                  ))}
                </ScrollToBottom>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Send A Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  multiline
                  maxRows={4}
                />
                <Button
                  variant="contained"
                  onClick={sendMessage}
                  endIcon={<SendIcon />}
                >
                  Send
                </Button>
                <br />
              </Card>
            </Grid>
          </Container>
        </>
      ) : (
        <>
          <Container>
            <Typography variant="h3" component="h2">
              Awaiting Match
            </Typography>
            <CircularProgress />
          </Container>
        </>
      )}
    </>
  );
}

export default CollabPage
