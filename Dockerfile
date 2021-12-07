FROM node:17.2.0-alpine

# Install Python3 & build tools
RUN apk add --update --no-cache curl py-pip make g++

# Install the project
WORKDIR /home/botiut
COPY package*.json ./
RUN npm ci
COPY . /home/botiut

# Build & run
RUN npm run build
CMD [ "npm", "start" ]