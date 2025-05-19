FROM node:alpine3.20
WORKDIR package.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "start"]