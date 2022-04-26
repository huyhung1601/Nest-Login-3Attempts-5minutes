## Description

This project has been built with Nestjs, MongoDB, PassportJs and Docker
Feature: Limit Login within 3 attempts and 5 minutes
Tech: I have used @nestjs/passport-local and @nestjs/jwt for the validation
-- Server will determine user valid or not:
---- if not return false
---- if yes:
------- first check user is locked or not (return false if true)
------- then create a JWT expires in 5 minutes for first login
------------ if wrong password: attempts + 1 (user will be locked when attempts reach 3) and return false
------------ user is locked if JWT expired
------------ return access_token (& refresh_token suggested) if password match within 3 attempts and 5 minutes

## Design Doc

![Screenshot](loginChart.png)

## Run docker

docker compose up

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
