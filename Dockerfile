FROM node:lts-buster

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY ./package.json ./yarn.lock ./prisma ./
RUN yarn install --frozen-lockfile
RUN yarn db-gen

COPY . .

# Only set NODE_ENV to production after `yarn install` because
# yarn skips devDepdencies if NODE_ENV is production which breaks
# build
ENV NODE_ENV production

RUN yarn build

RUN chown -R node:node /app/.next
USER node

CMD ["yarn", "start"]
