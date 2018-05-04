var express = require('express');
var router = express.Router();

var db = require('../queries');


router.get('/tweets', db.getAllTweets);
router.post('/tweets', db.createTweet);
router.post('/tweets/:id/likes', db.createLike);
router.post('/tweets/:id/retweet', db.createRetweet);
router.get('/retweets', db.getAllRetweets);

module.exports = router;