FROM node

RUN npm install -g nodemon

ENV HOME /home
RUN mkdir -p $HOME
WORKDIR $HOME

COPY package.json ./

RUN yarn install

COPY /src ./src/

EXPOSE 3001

CMD ["npm", "run", "start"]
