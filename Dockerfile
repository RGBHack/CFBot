FROM node:12

WORKDIR /tmp

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start"]
