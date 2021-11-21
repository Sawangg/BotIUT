FROM node:17.1.0-alpine

# Install Python3 & build tools
RUN apk add --update --no-cache curl py-pip make g++

# Install the project
WORKDIR /home/botiut
COPY package*.json ./
RUN npm install
COPY . /home/botiut

# Build & run
RUN npm run build
CMD [ "npm", "start" ]