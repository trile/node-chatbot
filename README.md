# OVC-Chatbot

## Descriptions

This is the source code for OVC chatbot API.
Please [read the PRD](http://bit.ly/2voU8bQ)
Respo: [bitbucket](https://bitbucket.org/account/user/solutions-union/projects/OV)

## Requirement
Correctly set up Mongo database server.
All app configurations including database url can be found at `server/config/config.json`

## API endpoints

### customer endpoints
`api/customer/setup`: retrieve customer set locale attribute if present.

### locale endpoints
`api/locale/setup`: set up the language/location for customer

### Phone number endpoints
`api/phone/check`: check if a customer already have a phone number.
`api/phone/add`: add a phone number for a customer.
`api/phone/update`: update phone number for a customer.

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
App Url: https://ovc-chatbot-sun.herokuapp.com/
Need to set appropriate environment variables:
`PORT`
`MONGO_URI`
`API_TOKEN`
