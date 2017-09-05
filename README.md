# OVC-Chatbot

## Descriptions

This is the source code for OVC chatbot API.
Please [read the PRD](http://bit.ly/2voU8bQ)
Respo: [bitbucket](https://bitbucket.org/account/user/solutions-union/projects/OV)

## Requirement
Correctly set up Mongo database server.
All app configurations including database url can be found at `server/config/config.json`

## API endpoints

All the api calls need to be send will the app token
**`https://<domain>/<api endpoint>?token=<app_token>`**

### customer endpoints
**`POST api/customer/setup`**:
- Need params:
    - `messenger user id`
- Return:
    - A text message depend on user language
    - Redirect to a block named `Initiate Conversation` inside Chat Fuel.
- create a new customer
- retrieve customer set locale attribute if present.

### locale endpoints
**`POST api/locale/set`**:
- Need params:
    - `messenger user id`
    - `language` (follow standard internalization: vi_VN, en_US, ...)
- Return:
    - A text confirm to user that the language had been set.
    - Redirect to a block named `Finish Customer Locale` inside Chat Fuel.
- set up the language/location for customer

### Phone number endpoints
**`POST api/phone/check`**:
- Need params:
    - `messenger user id`
- Return
    - Redirect to `Add Customer Phone` if there is no phone number presented.
    - Give back a dialog to keep or change phone number if the phone number is presented.
- check if a customer already have a phone number.

**`POST api/phone/add`**:
- Need params:
    - `messenger user id`
    - `phone number`
- Add a phone number for a customer.

**`POST api/phone/update`**:
- Params:
    - `messenger user id`
- update phone number for a customer.

### Appointment endpoints
**`POST /api/appointment/setup`**:
- Params:
    - `messenger user id`
    - `appointment fallback email`
    - `appointment open time`
    - `appointment close time`
    - `appointment fallback block`
- Create a new Appointment settings where you can define the client parameters.
- Update the current Appointment meeting if already present.

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
