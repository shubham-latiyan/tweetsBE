const express = require('express')
var router = express.Router();
const postController = require('../controller/postController')

router.get('/', function (req, res) {
    res.json({
        'API': '1.0'
    });
});

router.post('/tweets', postController.saveTweets);
router.get('/tweets/:user_id/:value', postController.getTweets);
router.patch('/tweets/edit/:tweet_id', postController.editTweet);
router.delete('/tweets/:tweet_id', postController.deleteTweet);
router.get('/tweets/search/:keyword/filter/:from/:to', postController.searchTweets);
router.post('/tweets/favourite', postController.makeFavourite);

// router.post('/upvote', postController.upvote);
// router.get('/getAllPosts', postController.getAllPosts);
module.exports = router;