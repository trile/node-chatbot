# OVC-Chatbot

## Descriptions

This is the source code for OVC chatbot API.
Please [read the PRD](http://bit.ly/2voU8bQ)
Respo: [bitbucket](https://bitbucket.org/account/user/solutions-union/projects/OV)
Heroku app: https://ovc-chatbot-sun.herokuapp.com/

## Requirement
Correctly set up Mongo database server.
All app configurations including database url can be found at `server/config/config.json`

## API endpoints

`/addclient`: create a new client.

`/findclient`: check if client already exist.

`/updatephone`: update phone number for a client.

## Commands
To start server:
```bash
yarn start
```

To run tests
```bash
yarn test
```

To start test watch development
```bash
yarn test-watch
```

## Deployment on Heroku
