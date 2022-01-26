FROM node:lts-buster

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

ARG NEXT_PUBLIC_DEPLOYMENT_URL
ENV NEXT_PUBLIC_DEPLOYMENT_URL=${NEXT_PUBLIC_DEPLOYMENT_URL}

ARG NEXT_PUBLIC_MIXPANEL_TOKEN
ENV NEXT_PUBLIC_MIXPANEL_TOKEN=${NEXT_PUBLIC_MIXPANEL_TOKEN}

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

RUN apt-get update

RUN apt-get install -yyq ca-certificates libappindicator1 libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 gconf-service lsb-release wget xdg-utils fonts-liberation libgbm-dev

COPY ./package.json ./yarn.lock ./prisma ./
RUN yarn install --frozen-lockfile
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
RUN chmod -R o+rwx /app/node_modules/puppeteer/.local-chromium

USER node

CMD ["yarn", "run", "start-ci"]
