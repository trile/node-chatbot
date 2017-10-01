# Next-bot

## Descriptions

This is the source code for Next chatbot API.

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
    - **set ChatFuel properties `language` for customer**

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
    - `appointment fallback email`: client email
    - `appointment open time`: time to start accepting appointment
    - `appointment close time`: time to stop accepting appointment
    - `timezone`: client timezone
    - `appointment fallback block`: a block for undefined behavior
- Create a new Appointment settings where you can define the client parameters.
- Update the current Appointment meeting if already present.

## Development

### Commands
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
Need to set appropriate environment variables:
`PORT`
`MONGO_URI`
`API_TOKEN`
