FROM nodered/node-red
WORKDIR /usr/src/node-red/
USER root
COPY package.json .
COPY custom_nodes/ .
COPY scripts/ /usr/src/node-red/scripts/
RUN npm install --unsafe-perm --no-update-notifier --no-fund --only=production
RUN apk add samba-client
RUN npm install node-red-node-mysql
RUN npm install node-red-contrib-mssql-plus
RUN npm install node-red-node-sqlite
RUN npm install node-red-contrib-fs-ops
RUN npm install node-red-node-email
RUN npm install node-red-contrib-telegrambot
CMD ["npm", "start", "--", "--userDir", "/cfg-data"] 
