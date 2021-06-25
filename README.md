# 🤖 Citripio

A barebones linked entries log with crypto sprinkled on top 🐱‍🏍

## Repo local setup

1. Clone this repository with `git clone git@github.com:klujanrosas/citripio.git`
1. Navigate into the correct directory with `cd citripio`
1. Install dependencies with `yarn install`
1. Start the development server with `yarn start`

### Routes

List current entries in log

```
GET /
```

Write an entry into the log

```
POST /citripio
{
  "message": "my cool message"
}
```

### Testing

##### Run all tests

Runs unit and integration tests on a single command.

```
yarn test
```

##### Run unit tests

All code under src/ will be scanned for tests which will then be executed.

```
yarn test:unit
```

##### Run integration tests

A server with a random (available) port will be spawned and killed immediately after tests finish running. Real GET/POST requests will be fired towards this temporary server.

```
yarn test:integration
```

### Inner workings

For simplicity all log entries(writes) are stored in memory, which then is periodically flushed onto the filesystem to prevent locking the log file.
