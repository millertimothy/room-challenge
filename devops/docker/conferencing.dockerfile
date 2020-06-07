FROM node:alpine

WORKDIR /room
COPY package.json . 
RUN npm i 
COPY . .

CMD ["npm", "start"]