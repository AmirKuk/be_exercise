var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://user:password@db:5432/tweeter';
var db = pgp(connectionString);

// add query functions

module.exports = {
  getAllTweets: getAllTweets,
  getAllRetweets: getAllRetweets,
  createTweet: createTweet,
  createRetweet: createRetweet,
  createLike: createLike
};


function getAllTweets(req, res, next) {
  console.log(process.env)
  db.any('select t.*,COALESCE(cl.likes_count,0) as likes_count, COALESCE(cr.retweets_count,0) as retweets_count'+
		' from tweeter.Tweet_DB t' +
		' LEFT JOIN' +
		' (select post_id ,COUNT(*) as likes_count from tweeter.Like_DB GROUP BY post_id) cl' +
		' ON cl.post_id = t.id' +
		' LEFT JOIN' +
		' (select post_id ,COUNT(*) as retweets_count from tweeter.ReTweet_DB GROUP BY post_id) cr' +
		' ON cr.post_id = t.id')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function createTweet(req, res, next) {
  var d = new Date();
  var stringDate = d.toISOString();
  req.body.timestamp = stringDate;
  db.none('insert into tweeter.Tweet_DB(content, username, timestamp)' +
      'values(${content}, ${username}, ${timestamp})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted tweet'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getAllRetweets(req, res, next) {
  db.any('select t.content as content, rt.username as retweet_user, t.id as tweet_id, t.username as tweet_user, rt.timestamp as timestamp'+
         ' from tweeter.ReTweet_DB rt, tweeter.Tweet_DB t where rt.post_id = t.id')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function createLike(req, res, next) {
  var d = new Date();
  var stringDate = d.toISOString();
  req.body.timestamp = stringDate;
  req.body.post_id = parseInt(req.params.id);
  db.none('insert into tweeter.Like_DB(post_id, username, timestamp)' +
      'values(${post_id}, ${username}, ${timestamp})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted Like'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createRetweet(req, res, next) {
  var d = new Date();
  var stringDate = d.toISOString();
  req.body.timestamp = stringDate;
  req.body.post_id = parseInt(req.params.id);
  db.none('insert into tweeter.ReTweet_DB(post_id, username, timestamp)' +
      'values(${post_id}, ${username}, ${timestamp})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted retweet'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}