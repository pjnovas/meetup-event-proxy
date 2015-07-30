var debug = require('debug')('meetup-event-proxy:api');

var jf = require('jsonfile')
  , eventPath = __dirname + '/events.json'
  , cors = require('cors')
  , moment = require("moment")
  , _ = require('lodash');

var config = require('./config.json');
var meetup = require('meetup-api')({ key: config.MEETUP_KEY });

function getCache(req, res, next){

  jf.readFile(eventPath, function(err, obj) {
    if (err){
      console.log(err);
      obj = { 'timestamp': 0 };
    }

    res.events = obj || { 'timestamp': 0 };
    next();
  });

}

function checkAndUpdate(req, res, next){

  var datetime = moment.unix(res.events.timestamp);
  var cacheTime = config.CACHE || { 'hour': 1 };
  var cacheType = Object.keys(cacheTime)[0]

  if ( datetime.add(cacheTime[cacheType], cacheType) > moment() ){
    debug('>> Using cache');
    return next();
  }

  function SaveAndContinue(newObj){
    debug('>> Sorting new Cache');
    jf.writeFile(eventPath, newObj, function(err){
      if (err){
        console.log(err);
        return next();
      }

      res.events = newObj;
      next();
    });
  }

  debug('>> Fetching Meetup');

  meetup.getEvents({
    event_id: config.MEETUP_EVENT_IDS,
    status: config.MEETUP_EVENT_STATUS || 'upcoming',
  }, function(error, events){
    if (error) {
      console.dir(error);
      return next();
    }

    var groupIds = events.results.map(function(event){ return event.group.id; });
    groupIds = _.uniq(groupIds);

    meetup.getGroups({
      group_id: groupIds
    }, function(error, groups){
      if (error) {
        console.dir(error);
        return next();
      }

      var _groups = _.object(_.pluck(groups.results, 'id'), groups.results);

      events.results.forEach(function(event){
        event.group = _groups[event.group.id];
      });

      SaveAndContinue({
        timestamp: moment().unix(),
        data: events
      });

    });

  });

}

var express = require('express');
var router = express.Router();

router.get('/api/meetup_events_full', cors(), getCache, checkAndUpdate, function(req, res){
  res.send({
    timestamp: res.events.timestamp,
    events: res.events.data.results
  });
});

router.get('/api/meetup_events', cors(), getCache, checkAndUpdate, function(req, res){

  var events = _.map(res.events.data.results, function(event){
    var _event = _.pick(event, ['id', 'name', 'status', 'time', 'yes_rsvp_count', 'rsvp_limit', 'waitlist_count']);
    _event.group = _.pick(event.group, ['id', 'name', 'urlname', 'members']);
    return _event;
  });

  events = _.object(_.pluck(events, 'id'), events);

  res.send({
    timestamp: res.events.timestamp,
    events: events
  });
});

module.exports = router;