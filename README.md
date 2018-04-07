# MessengerPrototypeServer

WIP - Development branch contains active work.

## Dependencies
- NodeJS + NPM
- Git

## Setup
Ensure you are on the `development` branch for setup. `git checkout development`
Run `npm run init` to install primary dependencies and initialize the MessengerPrototype submodule.

Install `forever` which is a NodeJS process manager. This will run the MessengerPrototypeServer locally on the server in the background: `npm install -g forever`.

### MessengerPrototype
The MessengerPrototype is a separate Git repo and as such will need to be setup separately. This should have been accomplished through `npm run init` or `npm run init-prototype` but in case there was an issue you can set it up manually.

First initialize the MessengerPrototype as a submodule and install dependencies:
```
cd MessengerPrototype
git submodule update --init --recursive
```

This will set the branch to the specified commit/tag that is associated to the MessengerPrototypeServer. Alternatively, you can checkout the specific working branch - in this case `development`:
```
git checkout development
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
