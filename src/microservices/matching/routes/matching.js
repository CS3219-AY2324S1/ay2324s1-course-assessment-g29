const path = require('path');
const router = require('express').Router();
const MatchingService = require('../service/matching');

const matchingService = new MatchingService();

router.route('/').post((req, res) => {
    if (matchingService.isEmpty()) {
        console.log("Joining Queue");
        matchingService.joinQueue("user1");
        res.json(`Waiting for another person to join the queue`);
    } else {
        const userid = matchingService.popQueue();
        if (userid) {
            res.json(`Matched with ${userid}`);
        } else {
            res.json(`No one is in the queue.`);
        }
    }
});

module.exports = router;