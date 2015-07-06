
var jf = require('jsonfile')
  , eventPath = __dirname + '/event.json'
  , moment = require("moment");

var config = require('./config.json');
var meetup = require('meetup-api')({ key: config.MEETUP_KEY });

function getEvent(done){

  meetup.getEvent({
    id: config.MEETUP_EVENT_ID
  }, function(err, event) {
    if (err) return done(err);
    console.dir(event);
    done(null, event);
  });
}

function getCache(req, res, next){

  jf.readFile(eventPath, function(err, obj) {
    if (err){
      console.log(err);
      obj = { 'timestamp': 0 };
    }

    res.event = obj || { 'timestamp': 0 };
    next();
  });

}

function checkAndUpdate(req, res, next){

  var datetime = moment.unix(res.event.timestamp);
  if (datetime.add(1, 'hour') > moment()){
    console.log('using cache');
    return next();
  }

  function SaveAndContinue(newObj){
    jf.writeFile(eventPath, newObj, function(err){
      if (err){
        console.log(err);
        return next();
      }

      res.event = newObj;
      next();
    });
  }

  meetup.getEvent({
    id: config.MEETUP_EVENT_ID
  }, function(error, event){
    if (error) {
      console.dir(error);
      return next();
    }

    SaveAndContinue({
      timestamp: moment().unix(),
      data: event
    });

  });

}

var express = require('express');
var router = express.Router();

router.get('/api/meetup_event', getCache, checkAndUpdate, function(req, res){
  delete res.event.data.ratelimit;
  res.send(res.event);
});

module.exports = router;