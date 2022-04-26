## Description

This project has been built with Nestjs, MongoDB, PassportJs and Docker <br />
Feature: Limit Login within 3 attempts and 5 minutes <br />
Tech: I have used @nestjs/passport-local and @nestjs/jwt for the validation <br />
-- Server will determine user valid or not: <br />
---- if not return false<br />
---- if yes:<br />
------- first check user is locked or not (return false if true)<br />
------- then create a JWT expires in 5 minutes for first login<br />
------------ if wrong password: attempts + 1 (user will be locked when attempts reach 3) and return false<br />
------------ user is locked if JWT expired<br />
------------ return access_token (& refresh_token suggested) if password match within 3 attempts and 5 minutes<br />

## Design Doc

![Alt text](https://github.com/huyhung1601/Nest-Login-3Attempts-5minutes/blob/modification/loginChart.jpg?raw=true)

## Run docker

```bash
docker compose up
```

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
