# meetup-event-proxy
A Meetup Event API proxy to use on your client for "realtime" event info, like current assistants count

1. `npm install`
2. Rename `config.json.sample` into `config.json`
3. Add your `Meetup API Key` and an array of `EventID`s
4. Set the Cache time, options could be `days`, `hours`, `minutes`, `seconds`
5. `npm start`

Shoot on your browser at 
* `http://localhost:3000/api/meetup_events` quick counters, less payload  
* `http://localhost:3000/api/meetup_events_full` for full data  

**By default it has a filesystem cache for 1 hour, so client fetching the api wont kill the API rate limit. You can change it from the config.json file**

For the `meetup_events_full` response you can find more info at [Events MeetupAPI Docs](http://www.meetup.com/meetup_api/docs/2/events/) in each event you will get the full group as [Events MeetupAPI Docs](http://www.meetup.com/meetup_api/docs/2/groups/)

Example response for `meetup_events`:  
```javascript
{
  timestamp: 1438266837, // unix time last fetch to API
  events: {
    "123456789": {
      id: "123456789",
      name: "Event name",
      status: "upcoming",
      time: 1438983900000,
      yes_rsvp_count: 50, // current assistants
      rsvp_limit: 120, // limit of assitants
      waitlist_count: 0, // waitlist
      group: {
        id: 123456,
        name: "Group name",
        urlname: "GroupName",
        members: 1245 // members count of the group
      }
    },
    "223456789": {
      id: "223456789",
      // ...
    }
  }
}
```

Example of use from client side:  
```javascript
$.ajax({
  url: "http://yourdomain.com/api/meetup_events"
}).done(function(data){
  var events = data.events;
  for(var p in events) {
    console.dir(events[p]);
  }
  // or directly by
  console.dir(events["event_id"]);
});
```
