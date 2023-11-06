import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Video from 'twilio-video'
import { selectRoomid, selectTwilioToken, setTwilioToken } from '../redux/MatchingSlice'

const VideoComponent = () => {
  const dispatch = useDispatch()
  const localVidRef = useRef()
  const remoteVidRef = useRef()
  const roomId = useSelector(selectRoomid)
  const token = useSelector(selectTwilioToken)
  const roomRef = useRef(null)

  useEffect(() => {
    console.log(token)
    if (token !== null) {
      Video.connect(token, {
        name: roomId
      }).then(room => {
        roomRef.current = room
        Video.createLocalVideoTrack().then(track => {
          // Remove the old video element from the parent element
          if (localVidRef.current && localVidRef.current.firstChild) {
            localVidRef.current.removeChild(localVidRef.current.firstChild)
          }
          localVidRef.current.appendChild(track.attach())
        })
        room.participants.forEach(participant => {
          console.log(`Participant "${participant.identity}" in room`)
          participant.tracks.forEach(publication => {
            console.log(publication.track)
            if (publication.track) {
              console.log('attaching track')
              const track = publication.track
              if (remoteVidRef.current && remoteVidRef.current.firstChild) {
                remoteVidRef.current.removeChild(remoteVidRef.current.firstChild)
              }
              remoteVidRef.current.appendChild(track.attach())
            }
          })

          participant.on('trackSubscribed', track => {
            if (remoteVidRef.current && remoteVidRef.current.firstChild) {
              remoteVidRef.current.removeChild(remoteVidRef.current.firstChild)
            }
            remoteVidRef.current.appendChild(track.attach())
          })
        })

        room.on('participantConnected', participant => {
          console.log(`Participant "${participant.identity}" connected`)

          participant.tracks.forEach(publication => {
            if (publication.isSubscribed) {
              const track = publication.track
              if (remoteVidRef.current && remoteVidRef.current.firstChild) {
                remoteVidRef.current.removeChild(remoteVidRef.current.firstChild)
              }
              remoteVidRef.current.appendChild(track.attach())
            }
          })

          participant.on('trackSubscribed', track => {
            if (remoteVidRef.current && remoteVidRef.current.firstChild) {
              remoteVidRef.current.removeChild(remoteVidRef.current.firstChild)
            }
            remoteVidRef.current.appendChild(track.attach())
          })
        })

        room.on('disconnected', room => {
          // Detach the local media elements
          room.localParticipant.tracks.forEach(publication => {
            const attachedElements = publication.track.detach()
            attachedElements.forEach(element => element.remove())
          })
        })
      })
    }

    return () => {
      if (token !== null) {
        dispatch(setTwilioToken(null))
      }
    }
  }, [token])

  return (
    <div>
      <div ref={localVidRef} />
      <h2>Remote Participants</h2>
      <div id='remote-media-div' ref={remoteVidRef} />
    </div>
  )
}

export default VideoComponent
