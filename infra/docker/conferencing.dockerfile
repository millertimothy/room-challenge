FROM node:alpine

WORKDIR /conf
COPY package.json . 
COPY . .
RUN npm i 
RUN npm run build
RUN ls

CMD ["node", "./build/index.js"]