#!/bin/bash

npm run prisma:migrate

exec "$@"
