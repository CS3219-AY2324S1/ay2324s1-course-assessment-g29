import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import ScrollToBottom from 'react-scroll-to-bottom';
import Card, { IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import { selectRoomid, selectUserid } from "./MatchingSlice";

const SOCKETSERVER = 'http://localhost:6000';

var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
};

function CollabPage () {

    const [isMatched, setIsMatched] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(false);
    const userid = useSelector(selectUserid);
    const roomid = useSelector(selectRoomid);
    const dispatch = useDispatch();

    useEffect(() => {

        socket = io(ENDPOINT, connectionOptions);

        if (!isMatched) {
            console.log(userid, roomid)
            socket.emit('join room', {userid, roomid} , (error) => {
                if(error) {
                    alert(error);
                }
            });

        }

        //disconnect from socket when component unmounts
        return () => {
            socket.disconnect();

            socket.off();
        }

    }, [ENDPOINT, location.search]);

    useEffect(() => {

        socket.on("matched", ({ users }) => {
            setIsMatched(true);
        });

        socket.on('message', (message) => {
            
            setMessages(messages => [ ...messages, message]);
        });

    }, []);

    const sendMessage = (event) => {
        event.preventDefault();

        if (messageText) {
            socket.emit('sendMessage', messageText, () => setMessageText(''));
        }
    }   

    return (
        <>
        { isMatched ? 
            <>
                <Card className={classes.container}>
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
                    <Button variant="contained" endIcon={<SendIcon />}>
                        Send
                    </Button>
                    <br />
                    <TextContainer users={users} />
                    <br />
                </Card>
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