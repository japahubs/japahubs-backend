FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g dotenv-cli prisma

COPY . .

RUN npm run build

CMD ["npm", "start"]