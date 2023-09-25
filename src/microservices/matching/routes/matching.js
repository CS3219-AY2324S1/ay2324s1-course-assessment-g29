const path = require('path');
const router = require('express').Router();
const axios = require('axios');

const MatchingService = require('../service/matching');

const matchingService = new MatchingService();

const collabService = "http://localhost:4000/room/createroom/"

router.route('/').post(async (req, res) => {
    if (matchingService.isEmpty()) {
        console.log("Joining Queue");
        matchingService.joinQueue("user1");
        res.json(`Waiting for another person to join the queue`);
    } else {
        const userid = matchingService.popQueue();
        if (userid) {
            //await axios.post(collabServiceUrl, {user1Id: userid, user2Id: req.params.userid})
            res.json(`Matched with ${userid}`);
        } else {
            res.json(`No one is in the queue.`);
        }
    }
});

module.exports = router;