FROM node:latest AS deps

WORKDIR /app

COPY . .

RUN npm install

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

EXPOSE 3000

ENV PORT 3000
