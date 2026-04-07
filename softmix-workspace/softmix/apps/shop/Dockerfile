FROM --platform=linux/amd64 node:21-alpine3.17
WORKDIR /opt/softmix
COPY ./dist/apps/shop/package.json .
RUN npm install --omit=dev
RUN npm install pg -E
COPY ./dist/apps/shop .
CMD ["node", "./main.js"]
