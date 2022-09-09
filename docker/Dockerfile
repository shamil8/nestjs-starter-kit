FROM node:16-alpine

ARG DB_HOST
ARG RABBITMQ_URL

ENV DB_HOST=$DB_HOST
ENV RABBITMQ_URL=$RABBITMQ_URL

ADD .. /app
WORKDIR /app

# unnecessary folder
RUN rm -rf ./docker

RUN apk add git
RUN git config --global user.email "dockerbot@example.com"
RUN git config --global user.name "DockerBot"

RUN yarn install
RUN yarn build

# start nest
ENTRYPOINT ["yarn", "start:prod"]
