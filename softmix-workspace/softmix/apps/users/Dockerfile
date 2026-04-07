FROM --platform=linux/amd64 node:19-alpine3.17
WORKDIR /opt/softmix
COPY ./dist/apps/users/package.json .
RUN npm install --omit=dev
COPY ./dist/apps/users .
CMD ["node", "./main.js"]
