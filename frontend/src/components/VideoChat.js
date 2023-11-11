import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Draggable from 'react-draggable'
import Video from 'twilio-video'
import { selectRoomid, selectStartVideoChat, selectTwilioToken, setStartVideoChat, setTwilioToken } from '../redux/MatchingSlice'
// import {ReactComponent as AvatarVideoChat }from '../images/AvatarVideoChat.svg'

const VideoComponent = ({stopVideo, setStopVideo}) => {
  const dispatch = useDispatch()
  const startVideoChat = useSelector(selectStartVideoChat)
  const localVidRef = useRef()
  const remoteVidRef = useRef()
  const roomId = useSelector(selectRoomid)
  const token = useSelector(selectTwilioToken)
  const roomRef = useRef(null)
  const [displayRemoteAvatar, setDisplayRemoteAvatar] = useState(false)

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
            }
          })

          participant.on('trackSubscribed', track => {
            remoteVidRef.current.appendChild(track.attach())
          })
        })

        room.on('participantConnected', participant => {
          console.log(`Participant "${participant.identity}" connected`)

          participant.tracks.forEach(publication => {
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
          })
        })

        room.on('participantDisconnected', participant => {
          console.log(`Participant "${participant.identity}" disconnected`)
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

  return (
    <>
      {startVideoChat && (
        <>
          <Draggable
            position={null}
            defaultPosition={{ x: 20, y: 20 }}
          >
            <div style={{ width: '400px', height: '500px' }}>
              <div ref={localVidRef} muted />
              <h2>Remote Participants</h2>
              <div id='remote-media-div' ref={remoteVidRef} />
            </div>
          </Draggable>
        </>
      )}
    </>
  )
}

// <div style={{ width: '400px', height: '500px' }}>
// {displayLocalAvatar ? (
//   <>
//     <div style={{
//       width: '320px',
//       height: '180px',
//       backgroundColor: '#5D5B5B',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center'
//     }}>
//       <AvatarVideoChat />
//     </div>
//   </>
// ) : (
//   <>
//     <div ref={localVidRef} muted />
//   </>
// )}
// <h2>Remote Participants</h2>
// {displayRemoteAvatar ? (
//   <>
//     <div style={{
//       width: '320px',
//       height: '180px',
//       backgroundColor: '#5D5B5B',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center'
//     }}>
//       <AvatarVideoChat />
//     </div>
//   </>
// ) : (
//   <>
//     <div id='remote-media-div' ref={remoteVidRef} />
//   </>
// )}
// </div>

export default VideoComponent


// import React, { useEffect, useState, useRef } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import Draggable from 'react-draggable'
// import Video from 'twilio-video'
// import { selectRoomid, selectStartVideoChat, selectTwilioToken, setStartVideoChat, setTwilioToken } from '../redux/MatchingSlice'
// import { setErrorMessage, setShowError, setShowSuccess, setSucessMessage } from '../redux/ErrorSlice'
// import {ReactComponent as AvatarVideoChat }from '../images/AvatarVideoChat.svg'

// const VideoComponent = ({stopVideo, setStopVideo}) => {
//   const dispatch = useDispatch()
//   const startVideoChat = useSelector(selectStartVideoChat)
//   const localVidRef = useRef()
//   const remoteVidRef = useRef()
//   const roomId = useSelector(selectRoomid)
//   const token = useSelector(selectTwilioToken)
//   const roomRef = useRef(null)
//   const [displayRemoteAvatar, setDisplayRemoteAvatar] = useState(true)

//   useEffect(() => {
//     console.log(token)
//     if (token !== null && startVideoChat) {
//       Video.connect(token, {
//         name: roomId,
//         audio: true,
//         video: {
//           width: 320,
//           height: 180
//         }
//       }).then(room => {
//         roomRef.current = room
//         room.localParticipant.tracks.forEach(publication => {
//           localVidRef.current.appendChild(publication.track.attach())
//         })

//         room.participants.forEach(participant => {
//           console.log(`Participant "${participant.identity}" in room`)
//           participant.tracks.forEach(publication => {
//             if (publication.track) {
//               console.log('attaching track')
//               const track = publication.track
//               remoteVidRef.current.appendChild(track.attach())
//               setDisplayRemoteAvatar(false)
//             }
//           })

//           participant.on('trackSubscribed', track => {
//             remoteVidRef.current.appendChild(track.attach())
//             setDisplayRemoteAvatar(false)
//           })
//         })

//         room.on('participantConnected', participant => {
//           console.log(`Participant "${participant.identity}" connected`)

//           participant.tracks.forEach(publication => {
//             console.log('hi')
//             if (publication.isSubscribed) {
//               const track = publication.track
//               remoteVidRef.current.appendChild(track.attach())
//               setDisplayRemoteAvatar(false)
//             }
//           })

//           participant.on('trackSubscribed', track => {
//             if (track) {
//               if (remoteVidRef.current && remoteVidRef.current.firstChild) {
//                 remoteVidRef.current.removeChild(remoteVidRef.current.firstChild)
//               }
//               remoteVidRef.current.appendChild(track.attach())
//               setDisplayRemoteAvatar(false)
//               dispatch(setSucessMessage('Matched User has started their video chat'))
//               dispatch(setShowSuccess(true))
//             }
//           })
//         })

//         // room.participants.forEach(participant => {
//         //   participant.tracks.forEach(publication => {
//         //      publication.on('unsubscribed', () => {
//         //       // other user turn off camera
//         //       if (publication.track) {
//         //         const attachedElements = publication.track.detach()
//         //         attachedElements.forEach(element => element.remove())
//         //       }
//         //       if (remoteVidRef.current && remoteVidRef.current.firstChild) {
//         //         remoteVidRef.current.removeChild(remoteVidRef.current.firstChild)
//         //       }
//         //       setDisplayRemoteAvatar(true)
//         //      });
//         //   });
//         // });

//         // room.participants.forEach(participant => {
//         //   participant.tracks.forEach(publication => {
//         //       publication.on('subscribed', () => {
//         //         participant.tracks.forEach(publication => {
//         //           if (publication.isSubscribed) {
//         //             const track = publication.track
//         //             remoteVidRef.current.appendChild(track.attach())
//         //             setDisplayRemoteAvatar(false)
//         //           }
//         //         })
      
//         //         participant.on('trackSubscribed', track => {
//         //           if (remoteVidRef.current && remoteVidRef.current.firstChild) {
//         //             remoteVidRef.current.removeChild(remoteVidRef.current.firstChild)
//         //           }
//         //           remoteVidRef.current.appendChild(track.attach())
//         //           setDisplayRemoteAvatar(false)
//         //         }) 
//         //       });
//         //   });
//         // });

//         room.on('participantDisconnected', participant => {
//           console.log(`Participant "${participant.identity}" disconnected`)
//           participant.tracks.forEach(publication => {
//             if (publication.track) {
//               const attachedElements = publication.track.detach()
//               attachedElements.forEach(element => element.remove())
//             }
//             if (remoteVidRef.current && remoteVidRef.current.firstChild) {
//               remoteVidRef.current.removeChild(remoteVidRef.current.firstChild)
//             }
//           })
//           dispatch(setErrorMessage('Matched User has turned off their video chat'))
//           dispatch(setShowError(true))
//           setDisplayRemoteAvatar(true)
//         })

//         room.on('disconnected', room => {
//           // Detach the local media elements
//           room.localParticipant.tracks.forEach(publication => {
//             const attachedElements = publication.track.detach()
//             attachedElements.forEach(element => element.remove())
//           })
//         })
//       }).catch((error) => {
//         console.log(error)
//       })
//     }

//   }, [token, startVideoChat])

//   useEffect(() => {
//     if (stopVideo && roomRef.current) {
//       roomRef.current.disconnect()
//       dispatch(setStartVideoChat(false))
//       setDisplayRemoteAvatar(true)
//       setStopVideo(false)
//     }
//   }, [stopVideo])

//   useEffect(() => {
//     return () => {
//       if (token !== null) {
//         dispatch(setTwilioToken(null))
//         dispatch(setStartVideoChat(false))
//         if (roomRef.current) {
//           roomRef.current.disconnect()
//         }
//       }
//     }
//   }, [])

//   const turnOffVideo = (event) => {
//     event.preventDefault()
//     if (roomRef.current) {
//       roomRef.current.localParticipant.videoTracks.forEach(publication => {
//         publication.track.stop();
//         publication.unpublish();
//       });
//     }
//   }

//   const turnOffMic = (event) => {
//     event.preventDefault()
//     if (roomRef.current) {
//       roomRef.currrent.localParticipant.audioTracks.forEach(publication => {
//         publication.track.disable();
//       });
//     }
//   }
  
//   function handleTrackDisabled(track) {
//     track.on('diasbled', () => {
//       setDisplayRemoteAvatar(true)
//       setErrorMessage('Matched User has turned off their Mic')
//       setShowError(true)
//     })
//   }

//   return (
//     <>
//       {startVideoChat && (
//       <>
//         <Draggable
//           position={null}
//           defaultPosition={{ x: 20, y: 20 }}
//         >
//           <div style={{ width: '400px', height: '500px' }}>
//             <div ref={localVidRef} muted />
//             <h2>Remote Participants</h2>
//             {displayRemoteAvatar ? (
//               <>
//                 <div style={{
//                   width: '320px',
//                   height: '180px',
//                   backgroundColor: '#5D5B5B',
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center'
//                 }}>
//                   <AvatarVideoChat />
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div id='remote-media-div' ref={remoteVidRef} />
//               </>
//             )}
            
//           </div>
//         </Draggable>
//       </>
//       )}
//     </>
//   )
// }

// export default VideoComponent
