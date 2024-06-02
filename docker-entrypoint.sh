#!/bin/bash

npm run prisma:generate
npm run prisma:migrate

exec "$@"
