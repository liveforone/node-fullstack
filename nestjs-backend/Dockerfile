FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --global pm2
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

# 아래 커맨드는 pm2로 포크모드를 사용해서 단일 서버를 실행시킬때 사용한다.
# CMD ["pm2-runtime", "dist/main.js"]

# 아래 커맨드는 pm2를 이용해 클러스터 모드로 실행할때 사용한다.
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]