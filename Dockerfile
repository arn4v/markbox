FROM node:lts-buster

ARG DATABASE_URL

ENV DATABASE_URL=${DATABASE_URL}

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY ./package.json ./yarn.lock ./prisma ./
RUN yarn install
RUN yarn db-gen

COPY . .

# Only set NODE_ENV to production after `yarn install` because
# yarn skips devDepdencies if NODE_ENV is production which breaks
# build
ENV NODE_ENV production

RUN yarn build

RUN mkdir /app/uploads

RUN chown -R node:node /app/.next
RUN chown -R node:node /app/uploads

USER node

CMD ["yarn", "run", "start-ci"]
