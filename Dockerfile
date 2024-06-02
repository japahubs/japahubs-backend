#----------------------- base ------------------------#
FROM node:22-alpine AS base

WORKDIR /app
COPY package*.json /app
COPY prisma /app/prisma


#----------------------- production ------------------------#
FROM base AS production

ENV NODE_ENV=production
COPY --from=base /app/prisma /app/prisma
RUN npm ci
COPY . /
EXPOSE 3000
CMD ["npm", "run", "start:ci"]

#----------------------- development ------------------------#
FROM base AS dev

ENV NODE_ENV=development
COPY --from=base /app/prisma /app/prisma
RUN npm install
COPY . /
ENTRYPOINT [ "/docker-entrypoint.sh" ]
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
