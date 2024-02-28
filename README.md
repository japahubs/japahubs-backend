<p align="center">
 <img src="./diagrams/japahubs-logo.png" width="300" alt="Logo"/>
</p>

> Online platform for migration information, mentorship, and connections.

## Japahubs-backend

### Pre-requisites

**Docker**
Ensure you've [installed Docker](https://www.docker.com/products/docker-desktop/) on your machine and have it started.

1. Clone this repo to your machine.

2. `cd` into the folder.

3. Install dependencies.

```bash
npm install
```

4. Run the server in development mode.

```bash
npm run start:dev
```

> **Note**: This will start a PostgreSQL docker container, generate the Prisma client, run migrations, and start the backend server.

### Automated tests

**Run the E2E tests**

```bash
npm run test:e2e
```

> **Note**: This will start a PostgreSQL docker container, generate the Prisma client, run migrations, and start the backend server.

**Run the Integration tests**

These tests prove that we can:

- Start and stop the web server
- Connect to the database

```bash
npm run test:infra
```

### Built with

- Node.js
- Prisma - The ORM for Node.js
- Express.js - Lightweight webserver

### Architecture

Modular Monolith.

## Contributors ✨

Below is the list of people who has made contributions to the this repo:
