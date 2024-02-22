FROM node:20-alpine
RUN mkdir -p /home/chankim/server/nestjs
WORKDIR /home/chankim/server/nestjs
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD [ "npm", "run", "start:prod" ]