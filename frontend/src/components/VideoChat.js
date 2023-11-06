import React, { useEffect, useRef } from "react";
import { Peer } from "peerjs";
import Draggable from 'react-draggable'
import { useDispatch, useSelector } from "react-redux";
import { selectIsInitiator, selectMatchedUserid, setIsInitiator } from "../redux/MatchingSlice";
import { selectUserid } from "../redux/UserSlice";

function Video() {
  const dispatch = useDispatch()
  const isInitiator = useSelector(selectIsInitiator)
  const userId = useSelector(selectUserid)
  const matchedUserid = useSelector(selectMatchedUserid)
  const peer = useRef(null)
  const localVideo = useRef(null)
  const remoteVideo = useRef(null)

  useEffect(() => {
    if (isInitiator !== 'awaiting') {
      peer.current = new Peer(userId, {
        host: "localhost",
        port: 3003,
        path: "/peerjs",
      });
      console.log(isInitiator)
      if (isInitiator) {
        const conn = peer.current.connect(matchedUserid);
        conn.on('open', () => {
          conn.send('handshake')
        })
        navigator.mediaDevices.getUserMedia(
          { video: true, audio: true },
          (stream) => {
            localVideo.srcObject = stream
            const call = peer.current.call(matchedUserid, stream);
            call.on("stream", (remoteStream) => {
              console.log('Stream received success')
              remoteVideo.srcObject = remoteStream
            })
          },
          (err) => {
            console.error("Failed to get local stream", err);
          },
        )
      } else {
        peer.current.on('connection', (conn) => {
          conn.on('handshake', (data) => {
            console.log(data)
          })
          conn.on('open', () => {
            conn.send('hello!');
          })
        })

        peer.current.on("call", (call) => {
          navigator.mediaDevices.getUserMedia(
            { video: true, audio: true },
            (stream) => {
              localVideo.srcObject = stream
              console.log('Stream received success')
              call.answer(stream);
              call.on("stream", (remoteStream) => {
                remoteVideo.srcObject = remoteStream
              })
            },
            (err) => {
              console.error("Failed to get local stream", err);
            },
          );
        })
      }
    }

    // disconnect from socket when component unmounts
    return () => {
      if (peer.current) {
        peer.current.destroy();
        dispatch(setIsInitiator('awaiting'))
        
      }
    }
  }, [isInitiator])
  return (
    <>
    {isInitiator !== 'awaiting' && (
      <>
        {localVideo && <video ref={localVideo} muted={true}/>}
        {remoteVideo && <video ref={remoteVideo}/>}
      </>
    )}

    </>
  );
}

export default Video;
