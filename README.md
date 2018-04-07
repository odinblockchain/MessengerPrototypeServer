# MessengerPrototypeServer

WIP - Development branch contains active work.

## Dependencies
- NodeJS + NPM
- Git

## Setup
Ensure you are on the `development` branch for setup. `git checkout development`
Run `npm install` to install primary dependencies.

Install `forever` which is a NodeJS process manager. This will run the MessengerPrototypeServer locally on the server in the background: `npm install -g forever`.

### MessengerPrototype
The MessengerPrototype is a separate Git repo and as such will need to be setup separately.

First initialize the MessengerPrototype as a submodule:
```
cd MessengerPrototype
git submodule update --init --recursive
```

Then switch to the `development` branch and initialize the dependencies:
```
git checkout development
npm install
```

## Server

### Production
To run this prototype server in production which will bind it to port `80` and set the environment to `production` simply use: `npm run start`.

### Development
To serve the API and MessengerPrototype separately you will need to start each module independently, likely in two separate bash sessions/windows. Both will by default run on port `4200`.

#### API
To start the API server, use `npm run development`.

#### MessengerPrototype
If you want to serve the MessengerPrototype from the source, please view the `README` of MessengerPrototype which will explain running the webapp locally.
