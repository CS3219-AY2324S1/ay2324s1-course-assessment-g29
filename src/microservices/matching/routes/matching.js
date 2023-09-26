const path = require('path');
const router = require('express').Router();
const axios = require('axios');

const MatchingService = require('../service/matching');

const matchingService = new MatchingService();

const collabService = "http://localhost:4000/room/createroom"

router.route('/').post(async (req, res) => {
    if (matchingService.isEmpty()) {
        console.log("Joining Queue");
        matchingService.joinQueue("user1");
        return res.json(`Waiting for another person to join the queue`);
    } else {
        const userid = matchingService.popQueue();
        if (userid) {
            const result = await axios.post(collabServiceUrl, {user1id: userid, user1id: req.body.userid})
            if (result) {
                return res.json({message: `Matched with ${userid}`});
            } else {
                return res.json(message: 'unexpected error, please rejoin the queue')
            }
            
        } else {
            res.json(`No one is in the queue.`);
        }
    }  
});

module.exports = router;