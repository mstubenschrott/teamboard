FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY src ./src
COPY tsconfig.json ./
RUN npm run build

CMD ["npm", "start"]
