import React, { useState, useRef, useEffect } from "react";
import { selectMessages, appendMessages } from "../redux/MatchingSlice";
import { useDispatch, useSelector } from "react-redux";
import ScrollToBottom from "react-scroll-to-bottom";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import SendIcon from "@mui/icons-material/Send";
import Fab from "@mui/material/Fab";
import { selectUserid } from "../redux/UserSlice";
import { selectMatchedUserid } from "../redux/MatchingSlice";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import "react-chat-elements/dist/main.css";
import { MessageList } from "react-chat-elements";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

const ChatComponent = ({ socket }) => {
  const dispatch = useDispatch();
  const messageListReferance = React.createRef();

  const [message, setMessage] = useState("");
  const [chatopen, setChatopen] = useState(false);

  const messages = useSelector(selectMessages);
  const userid = useSelector(selectUserid);
  const matchedUserid = useSelector(selectMatchedUserid);

  const toggleChat = () => {
    setChatopen(!chatopen);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const messageString = `${userid} : ${message}`;
    if (message) {
      dispatch(appendMessages(messageString));
      socket.current.emit("Message", { message: messageString }, () =>
        setMessage("")
      );
    }
  };

  const messageListData = (messages) =>
    messages.map((message, i) => {
      if (message) {
        const useridLen = userid.length;
        const firstCharacters = message.substring(0, useridLen);
        let text = message.substring(useridLen + 3, message.length);
        let position = "";
        let sender = "";
        if (firstCharacters === userid) {
          position = "right";
          sender = userid;
        } else {
          position = "left";
          sender = matchedUserid;
        }

        return {
          position: position,
          type: "text",
          title: sender,
          text: text, // Ensure you use message.text here
          key: i,
        };
      } else {
        return null;
      }
    });
  return (
    <Box>
      {chatopen ? (
        <Card
          style={{
            position: "fixed",
            bottom: "20px", // Adjust this value as needed
            right: "20px", // Adjust this value as needed
            height: "600px",
            width: "400px", // Set a maximum height for the Card
          }}
          alignContent={"space-between"}
        >
          <Box display="flex" justifyContent={"flex-end"}>
            <Tooltip title="close message box">
              <IconButton onClick={toggleChat}>
                <CloseIcon
                  
                />
              </IconButton>
            </Tooltip>
          </Box>

          <Box
            alignItems="stretch" // This ensures elements stretch horizontally
            style={{ height: "100%" }}
          >
            <div
              style={{
                overflowY: "scroll",
                height: "calc(100% - 95px)",
                flex: 1, // Adjust as needed to leave space for input and button
              }}
            >
              <MessageList
                referance={messageListReferance}
                className="message-list"
                lockable={true}
                toBottomHeight={"100%"}
                dataSource={messageListData(messages, userid)}
              />
            </div>
            <Box display="flex" flexDirection="row" alignContent="center">
              <TextField
                id="standard-basic"
                variant="standard"
                label="Send A Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                multiline
                maxRows={3}
                style={{ flex: 1, marginRight: "5px", marginLeft: "5px" }}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                endIcon={<SendIcon />}
                style={{ marginRight: "5px", marginLeft: "5px" }}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Card>
      ) : (
        <Fab
          color="primary"
          onClick={toggleChat}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
          }}
        >
          <ChatIcon />
        </Fab>
      )}
    </Box>
  );
};

export default ChatComponent;
