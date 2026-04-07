FROM --platform=linux/amd64 node:21-alpine3.17
WORKDIR /opt/softmix
COPY ./dist/apps/bff/package.json .
RUN npm install --omit=dev
COPY ./dist/apps/bff .
CMD ["node", "./main.js"]
