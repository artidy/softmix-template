FROM --platform=linux/amd64 node:21-alpine3.17
WORKDIR /opt/softmix
COPY ./dist/apps/uploader/package.json .
RUN npm install --omit=dev
COPY ./dist/apps/uploader .
CMD ["node", "./main.js"]
