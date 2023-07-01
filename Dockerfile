#stage 1
FROM node:16 as node
WORKDIR /app
# COPY . .
# RUN npm install -g npm@9.7.2
# RUN npm install
# RUN npm run build:local
# RUN ls -la ./dist/out-tsc

# #stage 2
# FROM nginx:alpine
# COPY --from=node /app/dist/demo-app /usr/share/nginx/html

ENTRYPOINT npm install && npm run build:local