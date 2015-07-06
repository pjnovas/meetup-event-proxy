# meetup-event-proxy
A Meetup Event API proxy to use on your client for "realtime" event info, like current assistants count

1. `npm install`
2. Rename `config.json.sample` into `config.json`
3. Add your `Meetup API Key` and `EventID`
4. `npm start`
5. Shoot on your browser for `http://localhost:3000/api/meetup_event`

**It has a filesystem cache for 1 hour, so client fetching the api wont kill the API rate limit.**
