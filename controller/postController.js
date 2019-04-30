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

    req.body.forEach(async (el) => {
      let newTweets = new tweets({
        user_id: user.user_id,
        text: el.text,
        id_str: el.id_str,
        lang: el.lang,
        favorite_count: el.favorite_count,
        retweeted: el.retweeted,
        source: el.source,
        truncated: el.truncated
      })
      await newTweets.save();
    })
    // for (let i = 0; i < req.body.length; i++) {
    // }
    // }
    // if () {
    // let postContent = req.body.text;
    // let post = await Tweets.findOne({
    //   post_content: postContent
    // });
    //   if (post == null) {
    //     let newPost = new Tweets({
    //       post_content: postContent,
    //       created_on: Date.now()
    //     })

    //     let savedPost = await newPost.save();

    //     if (savedPost) {
    //       res.json({
    //         isSuccess: true,
    //         data: savedPost
    //       });
    //     }
    //   } else {
    //     res.json({
    //       isSuccess: false,
    //       msg: "post already exists"
    //     });
    //   }
    // }
    // else {
    //   res.json({
    //     isSuccess: false,
    //     error: 'data incorrect'
    //   })
    // }
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
    let data = await tweets.aggregate([
      {
        $match: {
          user_id: req.params.user_id,
          isDeleted: false
        }
      },
      {
        $project: {
          text: 1
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

exports.searchTweets = async (req, res) =>{
  try {
    if (req.params.keyword.length > 0) {
      let data = await tweets.aggregate([
        {
          $match: {
            text: new RegExp("^.*" + req.params.keyword + ".*$", "i")
          }
        }
      ])
      if(data){
        console.log('data:', data)
        res.json({
          success: true,
          data: data
        })
      }
      else{
        res.json({
          success: true,
          data: []
        })
      }
    } else {
      res.json({
        success: false,
        error: 'error occured'
      })
    }
    
  } catch (err) {
    console.log('err:', err)
    res.json({
      success: false,
      err
    })
  }
}

