FROM sammlerio/node

RUN yarn global add nodemon

ENV HOME /home
RUN mkdir -p $HOME
WORKDIR $HOME

COPY package.json yarn.lock ./

RUN yarn install

COPY /src ./src/

EXPOSE 3001

CMD ["yarn", "run", "start"]
