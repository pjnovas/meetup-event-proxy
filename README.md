# meetup-event-proxy
A Meetup Event API proxy to use on your client for "realtime" event info, like current assistants count

1. `npm install`
2. Rename `config.json.sample` into `config.json`
3. Add your `Meetup API Key` and an array of `EventID`s
4. Set the Cache time, options could be `days`, `hours`, `minutes`, 'seconds'
5. `npm start`

Shoot on your browser at 
* `http://localhost:3000/api/meetup_events` quick counters, less payload  
* `http://localhost:3000/api/meetup_events_full` for full data  

**It has a filesystem cache for 1 hour, so client fetching the api wont kill the API rate limit.**

[More Info at MeetupAPI Docs](http://www.meetup.com/meetup_api/docs/2/events/)
