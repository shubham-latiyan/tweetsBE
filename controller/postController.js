require("dotenv").config();
const tweets = require('../model/Tweets')
const users = require('../model/Users')
const mongoose = require('mongoose')

exports.saveTweets = async (req, res) => {
  // console.log('req:', req.body)
  try {
    let user;
    user = await users.findOne({
      user_id: req.body[0].user.id_str
    })
    if (user == null) {
      user = new users({
        user_id: req.body[0].user.id_str,
        alias: req.body[0].user.screen_name,
        name: req.body[0].user.name
      })
      await user.save();
    }
    // check if already tweets are saved or not.
    let tweetsData = await tweets.find({ user_id: user.user_id })
    let finalArray = [];
    if(tweetsData.length > 0){
      finalArray = req.body.filter(ar1 => !tweetsData.find(ar2 => ar1.id_str === ar2.id_str))
    }
    else {
      finalArray = req.body;
    }

    if (finalArray.length > 0) {
      finalArray.forEach(async (el) => {
        let newTweets = new tweets({
          user_id: user.user_id,
          text: el.text,
          id_str: el.id_str,
          lang: el.lang,
          favorite_count: el.favorite_count,
          retweeted: el.retweeted,
          source: el.source,
          truncated: el.truncated,
          created_at: el.created_at
        })
        await newTweets.save();
      })
    }
    res.json({
      success: true,
    })
  } catch (err) {
    console.log('err:', err)
    res.json({
      isSuccess: false,
      error: err
    })
  }
}

exports.getTweets = async (req, res) => {
  try {
    let query = {};
    query["user_id"] = req.params.user_id;
    query["isDeleted"] = false;
    if (req.params.value == "true") {
      query["isFavourite"] = true;
    }

    let data = await tweets.aggregate([
      {
        $match: query
      },
      {
        $project: {
          text: 1,
          isFavourite: 1
        }
      }
    ])
    if (data.length) {
      res.json({
        success: true,
        data
      })
    }
    else {
      res.json({
        success: false,
        data: []
      })
    }
  } catch (err) {
    res.json({
      success: false,
      err: err
    })
  }
}

exports.editTweet = async (req, res) => {
  try {
    if (req.params.tweet_id.length > 0) {
      let tweet = await tweets.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.params.tweet_id)
      }, {
          $set: {
            text: req.body.tweetContent
          }
        })
      if (tweet) {
        res.json({
          success: true,
        })
      }
    }
    else {
      res.json({
        success: false,
        error: 'id not found'
      })
    }
  } catch (err) {
    console.log('err:', err)
    res.json({
      success: false,
      error: err
    })
  }
}

exports.deleteTweet = async (req, res) => {
  try {
    if (req.params.tweet_id) {
      let tweet = await tweets.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.params.tweet_id)
      }, {
          $set: {
            isDeleted: true
          }
        })
      if (tweet) {
        res.json({
          success: true,
        })
      }
    }
    else {
      res.json({
        success: false,
        error: 'id not found'
      })
    }

  } catch (err) {
    res.json({
      success: false,
      err
    })
  }
}

exports.searchTweets = async (req, res) => {
  try {
    let query = {};
    query["user_id"] = req.params.id;
    if (req.params.keyword !== "undefined") {
      query["text"] = new RegExp("^.*" + req.params.keyword + ".*$", "i")
    }
    else if (req.params.from != "undefined" && req.params.to != "undefined") {
      let from = new Date(req.params.from);
      let to = new Date(req.params.to);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      query["created_at"] = {
        $gte: from,
        $lt: to
      }
    }
    else {
      res.json({
        success: false,
        error: 'error occured'
      })
    }
    let data = await tweets.aggregate([
      {
        $match: query
      }
    ])
    if (data) {
      res.json({
        success: true,
        data: data
      })
    }
    else {
      res.json({
        success: true,
        data: []
      })
    }


  } catch (err) {
    res.json({
      success: false,
      err
    })
  }
}

exports.makeFavourite = async (req, res) => {
  try {
    if (req.body.id) {
      let data = await tweets.findOne({
        _id: mongoose.Types.ObjectId(req.body.id)
      })
      data.isFavourite ? data.isFavourite = false : data.isFavourite = true;
      await data.save();
      if (data) {
        res.json({
          success: true,
        })
      }
    }
    else {
      res.json({
        success: false,
        error: 'id not found'
      })
    }
  } catch (err) {
    res.json({
      success: false,
      err
    })
  }
}
