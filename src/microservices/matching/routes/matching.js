const path = require('path');
const router = require('express').Router();
const axios = require('axios');

const MatchingService = require('../service/matching');

const matchingService = new MatchingService();

const collabServiceUrl = "http://localhost:8000/room/"

router.route('/').post(async (req, res) => {
    if (matchingService.isEmpty()) {
        console.log("Joining Queue");
        const {user1id} = req.body;
        matchingService.joinQueue(user1id);
        try {
            //getting roomID
            const result = await axios.post(collabServiceUrl+"createroom", {user1id});
            res.status(200).json({roomId: result.data.roomId, message: `Waiting for another person to join the queue`});
        } catch (error) {
            return res.status(400).json({message: error.response.data.message})
        }
    } else {
        const user1id = matchingService.popQueue();
        if (user1id) {
            const user2id = req.body.userid;
            try {
                const result = await axios.post(collabServiceUrl+"joinroom", {user1id, user2id})
                res.status(200).json({roomId: result.data.roomId, message: `Matched with ${user1id}`});
            } catch (error) {
                console.log(error);
                return res.status(400).json({message: error.response.data.message})
            }
            
        } else {
            res.status(400).json(`Unexpected error. Please rejoin queue.`);
        }
    }  
});

module.exports = router;