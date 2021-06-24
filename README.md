# 🚧 WIP 🚧 Citripio
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

### Inner workings

For simplicity all log entries(writes) are stored in memory, which then is periodically flushed onto the filesystem to prevent locking the log file.
