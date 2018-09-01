FROM node:8
# Create app directory
WORKDIR /twitception
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /twitception/
RUN npm install -g npm@latest
# If you are building your code for production
# RUN npm install --only=production
# bundle app source
COPY . /twitception
EXPOSE 8080
CMD [ "npm", "start" ]