# Next-bot

## Descriptions

This is the source code for OVC chatbot API.
Please [read the PRD](http://bit.ly/2voU8bQ)
Respo: [bitbucket](https://bitbucket.org/solutions-union/next-bot)

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
App Url: https://nextbot-sun.herokuapp.com/
Need to set appropriate environment variables:
`PORT`
`MONGO_URI`
`API_TOKEN`

## How to clone a bot
- Set up a new mongo db from mlab
    - Create a new user and get the credentials

- Set up a new Heroku app. Get your own Heroku token
    - Create following environment varibales:
        - `PORT`
        - `MONGO_URI`
        - `API_TOKEN`

- Go to next-bot repo,
    - Click + sign on the narrow left column
    - Choose to fork the repo, enter required information

- Go to your new clone repository
    - Go to Pipelines, enable it, the first run will failed.
    - Go to Settings > environment variables. Provide it with the followings:
        - `SNYK_TOKEN`
        - `HEROKU_APP_NAME`
        - `HEROKU_API_KEY`
    - Go and rerun pipelines, after the test passed it should deploy to Heroku

- To update your cloned bot from newest Next-bot
    - Clone the repo to your local
    - Add Heroku remote ( for using heroku-cli)
    `git remote add heroku https://git.heroku.com/<app-name>.git`
    - Add upstream to point to next-bot
    `git remote add upstream `https://<username>@bitbucket.org/solutions-union/next-bot.git`
    - To update the child bot:
    `git pull upstream master`
    `git push`
    - To see heroku server log:
    `git logs -t`

- IMPORTANT - EXPERIMENTAL: Update the cloned bot FROM Bitbucket control panel
    - Go to cloned bot repo
    - Go to Branches
    - Add `compare` after the url
    - Choose the appropriate source and destination, click compare
    - There will be a link to merge your different
        - MAKE SURE THE SOURCE OF THE MERGE IS NEXT-BOT
        - THE MESSAGE SHOULD BE LIKE "Merged solutions-union/next-bot into master"
