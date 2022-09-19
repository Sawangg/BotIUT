FROM node:alpine

# Setup env
ENV FORCE_COLOR=1

# Install Python3 & build tools
RUN apk add --update --no-cache curl py-pip make g++

# Install chromium
RUN apk add --no-cache chromium --repository=http://dl-cdn.alpinelinux.org/alpine/v3.10/main

# Install the bot
WORKDIR /home/botiut
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile
COPY . .

# Build & run
RUN yarn build
COPY src/utils/ ./dist/utils/

CMD [ "yarn", "start:prod" ]
