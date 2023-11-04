import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import Draggable from 'react-draggable';
import { selectRoomid } from '../redux/MatchingSlice';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';

const connectionOptions = {
    'force new connection': true,
    reconnectionAttempts: 'Infinity',
    timeout: 10000,
    transports: ['websocket']
  }

export default function VideoChat() {
    const myStream = useRef();
    const peerStream = useRef();
    const peer = useRef();
    const [connected, setConnected] = useState(false);
    const socketRef = useRef();
    const roomId = useSelector(selectRoomid)

    useEffect(() => {
        socketRef.current = io('http://localhost:2000', connectionOptions);
        socketRef.current.emit('JoinVideoRoom', { roomId });
        socketRef.current.on('VideoSignal', data => {
            startPeer(true, data);
        });
        socketRef.current.on('VideoReturnSignal', (data) => {
            peer.current.signal(data);
        });
    }, []);

    const startMyVideo = async () => {
        try {
            myStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            socketRef.current.emit('VideoInitiate', { roomId });
        } catch (error) {
            console.error("Error accessing media devices.", error);
        }
    };    
    
    const startPeer = (initiator, signal) => {
        peer.current = new Peer({
            initiator,
            trickle: false,
            stream: myStream.current,
        });

        peer.current.on('signal', (data) => {
            if (initiator) {
                socketRef.current.emit('VideoSignal', data, { roomId });
            } else {
                socketRef.current.emit('VideoReturnSignal', data, { roomId });
            }
        });

        peer.current.on('stream', (stream) => {
            peerStream.current = stream;
            setConnected(true);
        });

        if (!initiator) {
            peer.current.signal(signal);
        }
    };

    const stopVideo = () => {
        myStream.current.getTracks().forEach(track => track.stop());
        myStream.current = null;
        if (peer.current) {
            peer.current.destroy();
            peer.current = null;
            setConnected(false);
        }
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
    };

    return (
        <div>
            {(connected || myStream.current) && (
                <>
                    <Draggable>
                        <Typography>
                            Hello Test
                        </Typography>
                        <video playsInline muted ref={video => video && (video.srcObject = myStream.current)} autoPlay />
                        <video playsInline ref={video => video && (video.srcObject = peerStream.current)} autoPlay />
                    </Draggable>
                </>
            )}
            {myStream.current ? (
                <Button onClick={stopVideo}>Stop My Video</Button>
            ) : (
                <Button onClick={startMyVideo}>Start My Video</Button>
            )}
        </div>
    );
}