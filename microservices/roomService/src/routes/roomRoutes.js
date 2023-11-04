const express = require('express')
const router = express.Router()
const roomController = require('../controller/roomController')

router.post('/room/createroom', roomController.createRoom)
router.post('/room/checkroom', roomController.checkRoom)
router.post('/room/savehistory', roomController.saveHistory)
router.post('/room/updatehistory', roomController.updateHistory)
router.get('/room/getHistory/:rid', roomController.getHistory)
router.post('/room/changequestion', roomController.changeQuestion)
router.post('/room/leaveroom', roomController.leaveRoom)

module.exports = router
