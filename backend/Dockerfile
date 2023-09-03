FROM node:16
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "/usr/src/app/"]
RUN npm install
COPY . /usr/src/app/
EXPOSE 3000
CMD ["npm", "start"]
