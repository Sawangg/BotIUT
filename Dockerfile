FROM node:alpine

# Setup env
ENV FORCE_COLOR=1

# Install Python3 & build tools
RUN apk add --update --no-cache curl py-pip make g++

# Install the bot
WORKDIR /home/botiut
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile
COPY . .

# Build & run
RUN yarn build
CMD [ "yarn", "start:prod" ]
