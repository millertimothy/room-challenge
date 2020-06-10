FROM node:alpine

WORKDIR /conf
COPY package.json . 
RUN npm i 
COPY . .
RUN npm build

CMD ["npm", "start"]