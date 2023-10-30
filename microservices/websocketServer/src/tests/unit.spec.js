// /* global describe, before, after, it */
// const ioc = require('socket.io-client')
// const { assert } = require('chai')

// // Socket.io setup
// describe('Websocket Service Unit Tests', () => {
//   let clientSocket, clientSocket2
//   // Set up the Socket.io server and client connections
//   before(async () => {
//     clientSocket = ioc('http://localhost:2000', {
//       reconnection: false
//     })
//     clientSocket2 = ioc('http://localhost:2000', {
//       reconnection: false
//     })
//     await new Promise((resolve) => {
//       clientSocket.on('connect', resolve)
//     })

//     await new Promise((resolve) => {
//       clientSocket2.on('connect', resolve)
//     })
//   })

//   after(() => {
//     // Close the clientSocket connection
//     clientSocket.disconnect()
//     clientSocket2.disconnect()
//   })

//   it('should get matchsucess', (done) => {
//     // Keep track of how many times 'MatchingSuccess' event is received
//     const user1 = { userid: 'user123', roomid: 'room1' }
//     const user2 = { userid: 'user456', roomid: 'room1' }
//     let matchingSuccessCount = 0
//     clientSocket.emit('JoinRoom', user1, (response) => {
//     })

//     clientSocket2.emit('JoinRoom', user2, (response) => {
//     })

//     clientSocket.on('MatchSuccess', (response) => {
//       assert.equal(response.matchedUserId, user2.userid)
//       matchingSuccessCount++
//       if (matchingSuccessCount === 2) {
//         // Both clients have received the event
//         done()
//       }
//     })
//     // Listen for the 'MatchingSuccess' event on both client sockets
//     clientSocket2.on('MatchSuccess', (response) => {
//       assert.equal(response.matchedUserId, user1.userid)
//       matchingSuccessCount++
//       if (matchingSuccessCount === 2) {
//         // Both clients have received the event
//         done()
//       }
//     })
//   })

//   it('should handle the Message event', (done) => {
//     const messageData = { message: 'Hello, World!' }

//     clientSocket.emit('Message', messageData, () => {
//     })
//     clientSocket2.on('Message', (response) => {
//       console.log(response)
//       assert.equal(response.message, messageData.message)
//       done()
//     })
//   })

//   it('should handle the CodeChange event', (done) => {
//     const codeData = { code: 'Hello, World!' }

//     clientSocket.emit('CodeChange', codeData, () => {
//     })
//     clientSocket2.on('CodeChange', (response) => {
//       assert.equal(response.code, codeData.code)
//       done()
//     })
//   })

//   it('should handle the ChangeEditorLanguage event', (done) => {
//     const languageData = { language: 'Python' }

//     clientSocket.emit('ChangeEditorLanguage', languageData, () => {
//     })
//     clientSocket2.on('CheckChangeEditorLanguage', (response) => {
//       assert.equal(response.language, languageData.language)
//       done()
//     })
//   })

//   it('should handle the ConfirmChangeEditorLanguage event', (done) => {
//     const languageData = { agree: true, language: 'Python' }

//     clientSocket.emit('ConfirmChangeEditorLanguage', languageData, () => {
//     })
//     clientSocket2.on('ConfirmChangeEditorLanguage', (response) => {
//       assert.equal(response.agree, languageData.agree)
//       assert.equal(response.language, languageData.language)
//       done()
//     })
//   })

//   it('should handle the CloseRoom event', (done) => {
//     clientSocket.emit('CloseRoom', () => {
//     })
//     // Listen for the 'MatchingSuccess' event on both client sockets
//     clientSocket2.on('DisconnectPeer', (response) => {
//       done()
//     })
//   })
// })
