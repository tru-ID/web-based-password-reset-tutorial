# Web Based Password Reset Tutorial

[![License][license-image]][license-url]

This repository is a demo application for integrating tru.ID's [SubscriberCheck](https://developer.tru.id/docs/subscriber-check), and Vonage's Verify Api as a multi-factor authentication step creating a password-reset flow within a web application.

> **Note:** This is the `starter-files` branch for the tutorial. For the completed code please checkout `main`.

## Prerequisites

- A [tru.ID account](https://tru.id/).
- Create a [tru.ID project](https://developer.tru.id/console).
- A [Vonage account](https://developer.vonage.com).
- A mobile phone with a SIM card that has an active mobile data connection.

## Getting Started

Clone the `starter-files` branch via:

```bash
git clone -b starter-files --single-branch https://github.com/tru-ID/web-based-password-reset-tutorial.git
```

If you're only interested in the finished code in `main` then run:

```bash
git clone -b main https://github.com/tru-ID/web-based-password-reset-tutorial.git
```

Copy the `.env.example` file to `.env` and populate the values with your valid credentials:

```env
cp .env.example .env
```

This tutorial uses a sqlite3 database, with [Sequelize](https://sequelize.org/), a modern Node.js ORM to manage the queries.
If you do not wish to use sqlite3, you will need to update the `src/config/config.json` database credentials and values.

To install the database,create your `users` table and populate it with two existing users run the following migration command:

```bash
npx sequelize db:migrate
npx sequelize-cli db:seed:all
```

First initialize the ngrok tunnel by running the following command:

```bash
npx ngrok http 3000
```

In a new Terminal, run the web server, with the following command:

```bash
npm start
```

In your browser open `http://localhost:3000`. To test these users log in as:

* `valid.phone.number@example.com` (password = `password`)
* `valid.phone.number.sim.changed@example.com` (password = `password`)
* or `invalid.phone.number@example.com` (password = `password`)

## Meta

Distributed under the MIT license. See `LICENSE` for more information.

[https://github.com/tru-ID](https://github.com/tru-ID)

[license-image]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: LICENSE