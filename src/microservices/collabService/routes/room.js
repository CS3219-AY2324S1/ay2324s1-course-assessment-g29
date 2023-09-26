const path = require('path');
const router = require('express').Router();
const axios = require('axios');

const Room = require('../models/room-model');

router.route('/createroom').post(async (req, res) => {
    try {
        const {user1id} = req.body;
        console.log(user1id);
        console.log("creating room");
        const existing1 = await Room.findOne({user1id});
        if (existing1) {
            return res.status(400).json({ message: "Please end previous collab session" });
        }
        const matchResult = await Room.create({ user1id });
        res.status(200).json({roomId: matchResult._id, message:"Room succesfully created!"});
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Unexpected Error"});

    }
    
});

router.route('/joinroom').post(async (req, res) => {
    try {
        const {user1id, user2id} = req.body;
        console.log("joining room");
        const existing1 = await Room.findOne({user1id});
        if (!existing1) {
            return res.status(400).json({ message: "Invalid Match" });
        } else {
            const roomId = existing1._id;
            existing1.user2id = user2id;
            await existing1.save();
            return res.status(200).json({roomId, message:`Matching with ${user1id}! Joining Room`}); 
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).json({ message:"Unexpected Error"});

    }
    
});

module.exports = router;