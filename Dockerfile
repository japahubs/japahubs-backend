FROM node:22-alpine as base

WORKDIR /app
COPY package*.json /app
EXPOSE 3000

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . /
CMD ["npm", "run", "start:ci"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install
RUN prisma generate --schema prisma/schema.prisma
RUN dotenv -e $NODE_ENV -- npm run migrate
COPY . /
CMD ["npm", "run", "start:dev"]
