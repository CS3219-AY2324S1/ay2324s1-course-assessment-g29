import { React, useState, useEffect } from "react";
import io from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux'
import ScrollToBottom from 'react-scroll-to-bottom';
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import SendIcon from '@mui/icons-material/Send';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import { selectRoomid, selectUserid, selectMatchedUserid, setMatchedUserId } from "./MatchingSlice";

const SOCKETSERVER = 'http://localhost:2000';

var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
};

function CollabPage () {
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isMatched, setIsMatched] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(false);
    const userid = useSelector(selectUserid);
    const matchedUserid = useSelector(selectMatchedUserid);
    const roomid = useSelector(selectRoomid);
    const dispatch = useDispatch();

    let socket;

    useEffect(() => {
        socket = io(SOCKETSERVER, connectionOptions);

        socket.on('connect', () => {
            console.log('connecting to websocket server');
            socket.emit('JoinRoom', {userid, roomid} , (error) => {
                if(error) {
                    alert(error);
                }
            });
            console.log('joined waiting room');
        });

        socket.on("MatchSuccess", ({ matchedUserId }) => {
            setIsMatched(true);
            dispatch(setMatchedUserId(matchedUserId));
        });

        socket.on('Message', (message) => {
            setMessages(messages => [ ...messages, message]);
        });

        socket.on('DisconnectPeer', (message) => {
            setErrorMessage('Peer has disconnected')
            setShowErrorAlert(true);
        });

        //disconnect from socket when component unmounts
        return () => {
            socket.disconnect();

            socket.off();
        }

    }, []);  

    const sendMessage = (event) => {
        event.preventDefault();
    
        if (message) {
            socket.emit('Message', message, () => setMessage(''));
        }
    } 
    
    const chatComponent = () => {
        return (
            <>
                <Card>
                    <ScrollToBottom className="messages">
                            {messages.map((message, i) => <div key={i}><Typography>{message}</Typography></div>)}
                    </ScrollToBottom>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Send A Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        multiline
                        maxRows={4}
                    />
                    <Button variant="contained" onClick={sendMessage} endIcon={<SendIcon />}>
                        Send
                    </Button>
                    <br />
                </Card>
            </>
        )
    }

    return (
        <>
        { showErrorAlert ? (
                    <Alert severity="error" onClose={() => setShowErrorAlert(false)}>Error: {errorMessage}</Alert>
                ) : (<></>)}
        { isMatched ? 
            <>
                <Container>
                    <Typography variant="h3" component="h2">
                        Matched with : {matchedUserid}
                    </Typography>
                </Container>
            </>
            :
            <>
                <Container>
                    <Typography variant="h3" component="h2">
                        Awaiting Match
                    </Typography>
                    <CircularProgress/>
                </Container>
            </>

        }
        </>
    )
    
}

export default CollabPage;