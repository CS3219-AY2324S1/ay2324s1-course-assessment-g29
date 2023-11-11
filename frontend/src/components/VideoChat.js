import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Draggable from 'react-draggable'
import Video from 'twilio-video'
import { selectRoomid, selectStartVideoChat, selectTwilioToken, setStartVideoChat, setTwilioToken } from '../redux/MatchingSlice'
import {ReactComponent as AvatarVideoChat }from '../images/AvatarVideoChat.svg'
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { setErrorMessage, setShowError, setShowSuccess, setSucessMessage } from '../redux/ErrorSlice'

const VideoComponent = ({stopVideo, setStopVideo}) => {
  const dispatch = useDispatch()
  const startVideoChat = useSelector(selectStartVideoChat)
  const localVidRef = useRef()
  const remoteVidRef = useRef()
  const roomId = useSelector(selectRoomid)
  const token = useSelector(selectTwilioToken)
  const roomRef = useRef(null)
  const [displayRemoteAvatar, setDisplayRemoteAvatar] = useState(true)
  const [micOn, setMicOn] = useState(true)

  useEffect(() => {
    console.log(token)
    if (token !== null && startVideoChat) {
      Video.connect(token, {
        name: roomId,
        audio: true,
        video: {
          width: 320,
          height: 180
        }
      }).then(room => {
        roomRef.current = room
        console.log(roomRef.current)
        room.localParticipant.tracks.forEach(publication => {
          localVidRef.current.appendChild(publication.track.attach())
        })

        room.participants.forEach(participant => {
          console.log(`Participant "${participant.identity}" in room`)
          participant.tracks.forEach(publication => {
            if (publication.track) {
              console.log('attaching track')
              const track = publication.track
              remoteVidRef.current.appendChild(track.attach())
              setDisplayRemoteAvatar(false)
            }
          })

          participant.on('trackSubscribed', track => {
            remoteVidRef.current.appendChild(track.attach())
            setDisplayRemoteAvatar(false)
          })
        })

        room.on('participantConnected', participant => {
          console.log(`Participant "${participant.identity}" connected`)

          participant.tracks.forEach(publication => {setDisplayRemoteAvatar(false)
            if (publication.isSubscribed) {
              const track = publication.track
              remoteVidRef.current.appendChild(track.attach())

            }
          })

          participant.on('trackSubscribed', track => {
            if (remoteVidRef.current && remoteVidRef.current.firstChild) {
              remoteVidRef.current.removeChild(remoteVidRef.current.firstChild)
            }
            remoteVidRef.current.appendChild(track.attach())
            setDisplayRemoteAvatar(false)
          })
        })

        room.on('participantDisconnected', participant => {
          console.log(`Participant "${participant.identity}" disconnected`)
          setDisplayRemoteAvatar(true)
          participant.tracks.forEach(publication => {
            if (publication.track) {
              const attachedElements = publication.track.detach()
              attachedElements.forEach(element => element.remove())
            }
            if (remoteVidRef.current && remoteVidRef.current.firstChild) {
              remoteVidRef.current.removeChild(remoteVidRef.current.firstChild)
            }
          })
        })

        room.on('disconnected', room => {
          // Detach the local media elements
          room.localParticipant.tracks.forEach(publication => {
            const attachedElements = publication.track.detach()
            attachedElements.forEach(element => element.remove())
          })
        })
      }).catch((error) => {
        console.log(error)
      })
    }
  }, [token, startVideoChat])

  useEffect(() => {
    if (stopVideo) {
      roomRef.current.disconnect()
      setDisplayRemoteAvatar(true)
      setStopVideo(false)
    }
  }, [stopVideo])

  useEffect(() => {
    return () => {
      if (token !== null) {
        dispatch(setTwilioToken(null))
      }
      if (roomRef.current) {
        roomRef.current.disconnect()
      }
      dispatch(setStartVideoChat(false))
    }
  }, [])

  const turnOffMic = (event) => {
    event.preventDefault()
    if (roomRef.current) {
      roomRef.current.localParticipant.audioTracks.forEach(publication => {
        console.log(publication.track)
        if (publication.track) {
          publication.track.disable()
          console.log(publication.track)
        }
      });
    }
    console.log(roomRef.current)
    setMicOn(false)
  }

  const turnOnMic = (event) => {
    event.preventDefault()
    if (roomRef.current) {
      roomRef.current.localParticipant.audioTracks.forEach(publication => {
        if (publication.track) {
          publication.track.enable();
        }
      });
    }
    console.log(roomRef.current)
    setMicOn(true)
  }

  return (
    <>
      {startVideoChat && (
        <>
          <Draggable
            position={null}
            defaultPosition={{ x: 20, y: 20 }}
          >
            <div style={{ width: '400px', height: '500px' }}>
              <div style={{
                      width: '320px',
                      height: '200px',
                      display: 'flex',
                      backgroundColor: '#D2B48C',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                <div ref={localVidRef} muted />
                {micOn ? (
                  <>
                    <IconButton aria-label="delete" size="small" onClick={turnOffMic}>
                      <MicIcon fontSize="inherit" />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton aria-label="delete" size="small" onClick={turnOnMic}>
                      <MicOffIcon fontSize="inherit" />
                    </IconButton>
                  </>
                )}
              </ div>
                
              <h2>Remote Participants</h2>
              {displayRemoteAvatar && 
                <>
                  <div style={{
                    width: '320px',
                    height: '180px',
                    backgroundColor: '#5D5B5B',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <AvatarVideoChat />
                  </div>
                </>
              }
              <div id='remote-media-div' ref={remoteVidRef} />
            </div>
          </Draggable>
        </>
      )}
    </>
  )
}

export default VideoComponent
