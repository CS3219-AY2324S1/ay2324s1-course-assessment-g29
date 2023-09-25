const path = require('path');
const router = require('express').Router();
const axios = require('axios');

const Room = require('../models/room-model');

router.route('/createroom').post(async (req, res) => {
    try {
        const {user1id, user2id} = req.body;
        const existing1 = await Room.findOne({ user1id});
        if (existing1) {
            return res.status(400).json({ message: "Please end previous collab session" });
        }

        const existing2 = await Room.findOne({ user2id });
        if (existing2) {
            return res.status(400).json({ message: "Unexpected error please rejoin the collab session" });
        }
        const matchResult = await Room.create({ user1id, user2id });
        res.status(200).json({roomId: matchResult._id, message:"Room succesfully created!"});
    } catch (error) {
        res.status(200).json({roomId: matchResult._id, message:"Unexpected Error"});

    }
    
});

module.exports = router;