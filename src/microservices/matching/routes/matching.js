const path = require('path');
const router = require('express').Router();
const axios = require('axios');

const MatchingService = require('../service/matching');

const matchingService = new MatchingService();

const collabServiceUrl = "http://localhost:4000/room/createroom"

router.route('/').post(async (req, res) => {
    if (matchingService.isEmpty()) {
        console.log("Joining Queue");
        const {userid} = req.body;
        matchingService.joinQueue(userid);
        return res.json(`Waiting for another person to join the queue`);
    } else {
        const user1id = matchingService.popQueue();
        if (user1id) {
            const user2id = req.body.userid;
            try {
                const result = await axios.post(collabServiceUrl, {user1id, user2id})
                res.json({roomId: result.data.roomId, message: `Matched with ${user1id}`});

            } catch (error) {
                console.log(error);
                return res.json({message: error.response.data.message})
            }
            
            
        } else {
            res.json(`No one is in the queue.`);
        }
    }  
});

module.exports = router;