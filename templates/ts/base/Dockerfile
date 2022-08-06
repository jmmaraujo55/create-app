# BUILD
FROM node:16.13.2 AS build

WORKDIR /buildstage

COPY package.json /buildstage/

RUN npm i

COPY . .

RUN npm run build

# APPLICATION
FROM node:16.13.2-alpine3.14

WORKDIR /workspace

COPY --from=build /buildstage/dist /workspace/dist
COPY tsconfig.json /workspace/tsconfig.json

COPY package.json /workspace/

RUN npm i --production

EXPOSE 80

CMD [ "npm", "start" ]
