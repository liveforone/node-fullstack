# NestJS Backend

## 목차

- [NestJS Backend](#nestjs-backend)
  - [목차](#목차)
  - [기술 스택](#기술-스택)
    - [기술 스택 선정이유](#기술-스택-선정이유)
      - [Prisma](#prisma)
    - [postgresql](#postgresql)
    - [class-validator](#class-validator)
  - [install](#install)
  - [pm2](#pm2)
    - [install](#install-1)
    - [command](#command)
  - [setting](#setting)
  - [script setting](#script-setting)
  - [prisma cli](#prisma-cli)
    - [초기세팅](#초기세팅)
    - [중간마다 계속 실행, 초기 포함, 스키마 변경시](#중간마다-계속-실행-초기-포함-스키마-변경시)
  - [prisma api 주의 사항](#prisma-api-주의-사항)
  - [redis](#redis)
    - [setting](#setting-1)
    - [접속](#접속)
    - [command](#command-1)
    - [code](#code)
  - [배포](#배포)
    - [1. 도커 단일서버 배포](#1-도커-단일서버-배포)
      - [도커 파일](#도커-파일)
      - [도커 포트 포워딩 및 expose](#도커-포트-포워딩-및-expose)
      - [도커 pm2](#도커-pm2)
      - [command](#command-2)
    - [2. 도커 클러스터 배포](#2-도커-클러스터-배포)
      - [클러스터 실행파일](#클러스터-실행파일)
      - [도커파일](#도커파일)
      - [command](#command-3)
    - [3. 일반 배포](#3-일반-배포)
      - [배포 프로세스](#배포-프로세스)
  - [nestjs 도메인 개발 특수사항](#nestjs-도메인-개발-특수사항)
  - [테스트시 주의점](#테스트시-주의점)
  - [Real DB Test](#real-db-test)
  - [페이징](#페이징)
  - [쿼리스트링 주의](#쿼리스트링-주의)
  - [postgres sql 조회](#postgres-sql-조회)
  - [prisma studio](#prisma-studio)
  - [postgres admin4 접속안될때](#postgres-admin4-접속안될때)
  - [프로덕션 추천 팁](#프로덕션-추천-팁)
  - [모듈 이해](#모듈-이해)
  - [복합키](#복합키)
  - [n+1 문제 해결](#n1-문제-해결)
  - [Json 성능 최적화](#json-성능-최적화)
  - [파일 업로드](#파일-업로드)
  - [db connection pool](#db-connection-pool)
  - [많이 쓰는 prisma 에러](#많이-쓰는-prisma-에러)
  - [type](#type)

## 기술 스택

- Framework : NestJS
- ORM : Prisma
- Query Lib : prisma-no-offset
- DB/Cache : Postgresql, Redis
- Security : Jwt, Passport
- Validation : class-validator
- Test : Jest

### 기술 스택 선정이유

#### Prisma

- typeorm을 먼저 사용했었다. 이 프로젝트는 typeorm으로 users 도메인까지 만들고, prisma로 전환하였다.
- typeorm은 너무나 많은 config 코드가 필요하며, 각 도메인 모듈마다 config 코드를 또 배치해야하고,
- 실제 DB 테스트시에 이 config 때문에 어렵고 복잡하여 테스트를 하기 어렵게 만들었다.
- Prisma는 기본적으로 config 설정이 간단하고 light하다.
- 또한 typeorm처럼 타입체크를 제대로 안해주지도 않는다.
- 그리고 코드로 엔티티를 작성하지 못한다는게 단점으로 생각되었지만, 프리즈마 스키마는 코드에서 가져다 쓸수도 있기때문에(엔티티, enum 등등) 이 점이 단점이 되지 못했다.
- no offset 페이징도 아주 쉽게 적용할 수 있었고, 라이브러리가 필요하면 만드는 것도 아주 간단하였다.

### postgresql

- async/await 사용이 가능한 mysql2를 먼저 사용하였다.
- mysql2를 사용하면서 여러 에러를 직면하게 되었다.
- 즉 사용하기 편하게 만든 것 같진 않았다. 특히 typeorm과 궁합이 아주 나빳다.
- 이러한 이유로 prisma로 orm을 전환하기 전에 db가 먼저 전환되었다.

### class-validator

- 기존에는 joi를 이용해서 pipe를 직접만들어서 사용하고 있었다.
- 이 방법은 귀찮은 코드가 너무 늘어나고, 이에 따라 class-validator를 사용하게 되었다.
- 간단하고, 스프링의 spring-validation과 유사한 것이 큰 이유였다.
- 다만 무겁고 성능 이슈가 존재하지만, 크게 와닿진 않았다.
- 성능이슈를 해결한 typia 등이 있지만, typia는 문서가 많지 않아 적용에 어려움이 있었다.

## install

- [주의] `dotenv`종속성은 절대로 추가하면 안된다. `nestjs/config`와 충돌난다.
- [주의] estlint와 관련된 종속성 모듈들은 버전을 확인하여 업데이트한다.(버전에 민감)
- [참고] 이 외의 모듈들은 특별히 버전을 관리하지 않아도 문제 없다. nestjs & typescript 모듈만 관리해주면 된다.
- `npx @nestjs/cli new project-name`
- `npx npm-check-updates -u -f "/nestjs*/"`
- `npm install`
- `npm i typescript@<version>`
- `npm i reflect-metadata@<version>`
- `npm i @nestjs/config`
- `wsl openssl rand -hex 64` : jwt 시크릿 키 생성
- `npm i @nestjs/jwt passport-jwt @types/passport-jwt`
- `npm i @nestjs/passport`
- `npm i bcrypt @types/bcrypt`
- `npm i redis`
- `npm i class-validator class-transformer`
- `npm i prisma @prisma/client`
- `npm i prisma-no-offset`
- `npm i prisma-common-error-handle`
- `npm i pg`
- 타입스크립트 & reflect-meatdata를 nestjs의 표준 버전과 맞춘다.
- `nest g module auth`, service, controller generate
- `nest g resource 이름`

## pm2

### install

- 글로벌로 설치해야하며, 이미 설치되어있다.
- `npm i uuid@latest -g`
- `npm i pm2 -g`

### command

- `pm2 monit`
- `pm2 stop 이름`
- `pm2 kill` : 모든 프로세스 죽이기

## setting

- prettier 변경

```json
{
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true
}
```

- eslintrc.js 에 추가

```javascript
'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
```

- package.json jest에 추가

```json
"moduleNameMapper": {
      "^src/(.*)$": "<rootDir>/$1"
    }
```

- `docker ps -a`로 in use인 컨테이너를 찾아서 `docker rm 컨테이너ID`로 모두 삭제한다.

## script setting

- 도커 compose를 wsl에서 실행한 후, wsl을 닫는 command이다.
  - `"docker:start": "wsl docker-compose up -d && wsl exit",`
- 도커 compose를 wsl에서 종료한 후, wsl을 닫는 command이다.
  - `"docker:stop": "wsl docker-compose down && wsl exit",`
- 개발 단계에서 중간중간 마이그레이션 파일을 만드는 command이다.
  - `npm run db:update`
  - `"db:update": "npx prisma generate && npx prisma migrate dev --name init",`
- db에 마이그레이션 파일을 deploy하는 start command이다.
  - 이는 프론트 단과 연동하여 개발할 때 사용한다.
  - `npm start`
  - `"start": "npx prisma migrate deploy && pm2 start dist/main.js",`
- 개발시 사용되며 db에 마이그레이션 파일을 deploy하는 command이다.
  - `npm start:dev`
  - `"start:dev": "npx prisma migrate deploy && nest start --watch"`
- 프로덕션에서 사용하는 command이다.
  - `npm start:prod`
  - `"start:prod": "npx prisma db push && npx prisma migrate deploy && pm2 start dist/main.js -i 8",`
- 테스트 시 활용되며, start command에서 nest서버를 실행하는 것이 아닌 jest를 실행하는 command이다.
  - `npm test`
  - `"test": "npx prisma migrate deploy && jest -i --forceExit",`
- 서버 실행을 완료한 후 종료시 사용하는 command이다.
  - `npm run close`
  - `"close": "npm run docker:stop",`

## prisma cli

### 초기세팅

- `npx prisma`
- `npx prisma init`

### 중간마다 계속 실행, 초기 포함, 스키마 변경시

- `npx prisma migrate dev --name init`
- `npx prisma generate`
- `npx prisma migrate deploy`
- `npx prisma db push`

## prisma api 주의 사항

- cud 메서드는 모두 잘못된 상황에서 예외가 발생하고, 이를 error 레벨의 로그로 기록한다.
- 특히나 이러한 command들은 데이터를 먼저 조회하고 그리고 command 쿼리가 날라간다.
- 따라서 데이터가 없을경우 에러가 발생한다. 이런 형태의 에러를 가장 많이 볼 수 있다.
- 그러나 `createMany`, `updateMany`, `deleteMany`처럼 벌크 command는 에러로그가 남지 않고, 예외또한 터지지 않는다.
- `create`나 `delete`작업은 critical 한 작업으로 판단된다. 따라서 에러 로그를 남기는 것이 나쁘지 않다.
- 그러나 `update`의 경우 로그를 굳이 남기지 말고, 비즈니스 로직에서 모든 조건을 체크하여 validation 한뒤 `updateMany`를 이용해서 조회없이 바로 command 쿼리를 날리도록 한다.
- `many` command들은 조회를 하지 않기 때문에, 미약하지마는 성능상 이점이 반드시 있다.
- 더하여 테스트시에 afterEach 혹은 afterAll 부분에서 db에 데이터를 삭제하는 코드를 날리는 경우가 있다.
- 이 때에도 `deleteMany`를 사용하여 추가적인 예외가 터지지 않고 삭제할 수 있도록 처리하는 것이 좋다.

## redis

> 실서버와 달리 로컬(개발) 환경에서는 wsl이 켜지면 자동으로 redis도 실행된다.

### setting

1. `sudo apt-get install redis-server` : redis 설치
2. `sudo vi /etc/redis/redis.conf`
3. `/requirepass` 를 통해서 주석처리된 부분을 찾는다.
4. `requirepass 비밀번호` 로 비밀번호를 설정한다.
5. `sudo systemctl restart redis-server`
6. `acl setuser 유저 on >비밀번호 allkeys allcommands`: 유저생성 -> 이 유저는 모든 권한을 가진다.
7. 외부에서 접근 해야하는 경우에는 `bind 0.0.0.0` 옵션을 conf 파일에 삽입한다.

### 접속

- 접속시에 `auth 비밀번호`로 접속한다.
- 혹은 `auth 유저 비밀번호`로 접속한다.

### command

- `redis-server` : redis 실행
- `service redis start` : redis 실행
- `service redis stop` : redis 중지
- `service redis status` : redis 상태 확인
- `redis-cli` : redis 접근
- `acl list` : 유저 확인
- `redis cli --user 유저 --pass 비밀번호 monitor` : 모니터링
- 필자는 `auth chan 159624`로 로그인한다.

### code

- redisProvider의 url에는 `username:password@host:port`형식으로 매핑한다.
- redis에 비밀번호가 걸려있는 경우 username은 `default`로 준다.
- 만약 유저를 만들어서 처리하고 있다면 해당 유저와 비밀번호를 넣어주면된다.
- `acl list`해서 유저 이름을 보면 기본 유저의 이름은 `default`로 되어있다.
- redis.module은 app.module에 import 해야한다.
- 또한 redisProvider를 사용하는 도메인이 있다면 해당 도메인 모듈에 import 해주어야한다.
- 일반적인 캐시 추상화 시스템과 달리 node-redis를 이용해 처리를 할 때에는 service단에서 모든 구현을 마치는 것이 좋다.
- 데이터를 redis에 저장할때에는 `JSON.stringify()`함수를 통해 수동으로 문자열로 바꾼후에 저장해야하며,
- redis에서 꺼낸 후에는 `JSON.parse()`함수를 통해 수동으로 json 객체로 변환시켜야한다.
- `expire()`메서드로 ttl을 설정할때에는 `mode`설정은 하지 말아라

```typescript
//redisProvider.ts
export const redisProvider = [
  {
    provide: REDIS_CLIENT,
    useFactory: async () => {
      const client = createClient({
        url: 'redis://default:159624@localhost:6379',
        username: 'chan',
        password: '159624',
      });
      await client.connect();
      return client;
    },
  },
];

//redis.module.ts
@Module({
  providers: [...redisProvider],
  exports: [...redisProvider],
})
export class RedisModule {}
```

## 배포

- 두가지 배포 형식에 대해 서술하고 있다.
- 첫째는 도커를 이용한 배포이다. 이 배포는 조금 복잡할지 몰라도 소스코드가 자주 변경되는 환경에서 아주 유익하다.
- 두번째는 일반적인 배포이다. 도커 보다 간단하면서 좀더 자유롭다는 장점을 지니지만, 자주 변경되는 환경에서는 아주 큰 단점을 가진다.

### 1. 도커 단일서버 배포

- 도커 배포의 경우 package.json의 여러 실행 스크립트를 쓰지 않는다.
- 또한 외부와 커넥션이 있고, 그 커넥션이 로컬일 경우 `host.docker.internal`을 사용해야한다.

#### 도커 파일

- 노드는 alpine을 사용하여 가볍게 구성해준다.
- pm2를 사용하길 원한다면 pm2를 도커에 설치해야한다.

```Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --global pm2
RUN npm install

COPY . .

RUN npx prisma generate
RUN npx prisma db push
RUN npm run build

EXPOSE 8080

CMD ["pm2-runtime", "dist/main.js"]
```

#### 도커 포트 포워딩 및 expose

- expose 명령어를 사용하면 해당하는 로컬의 포트를 열어줄 것 같지만 그렇지 않다.
- 그 포트를 사용하겠다고 명시하는 것 뿐이다.
- 따라서 컨테이너를 `run`할때 반드시 `-p` 옵션을 통해서 포트포워딩을 해주어야한다.

#### 도커 pm2

- pm2를 도커 내부에서 사용하기 위해서는 `pm2-runtime` 명령어로 fork 모드로 실행해야한다.

#### command

- 이미지 빌드 : `docker build --tag 이름:1.0 .`
- 이미지 확인 : `docker image ls`
- 이미지 배포 : `docker push 계정/이미지`
- 컨테이너 실행 : `docker run -p 8080:8080 컨테이너이름`
- pm2 list : `docker exec -it 컨테이너ID pm2 list`
- pm2 kill : `docker exec -it {컨테이너이름} pm2 kill`

### 2. 도커 클러스터 배포

- 1번 도커 단일서버 배포의 확장판이다.
- 따라서 1번을 숙지후 해당 문서를 사용하는 것이 좋다.

#### 클러스터 실행파일

```javascript
module.exports = [
  {
    script: 'dist/main.js',
    name: 'nest-backend:1.0', // <- 컨테이너 이름을 넣는다.
    exec_mode: 'cluster',
    instances: 5, // <- 인스턴스 수를 넣는다.
  },
];
```

#### 도커파일

```Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --global pm2
RUN npm install

COPY . .

RUN npx prisma generate
RUN npx prisma db push
RUN npm run build

EXPOSE 8080

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
```

#### command

- 이미지 빌드 : `docker build --tag 이름:1.0 .`
- 이미지 확인 : `docker image ls`
- 이미지 배포 : `docker push 계정/이미지`
- 컨테이너 실행 : `docker run -p 8080:8080 -d 컨테이너이름`
- pm2 list : `docker exec -it 컨테이너ID pm2 list`
- pm2 kill : `docker exec -it {컨테이너이름} pm2 kill`
- pm2 log : `docker exec -it {컨테이너이름} pm2 log 모듈에서 붙인 이름`

### 3. 일반 배포

#### 배포 프로세스

> db서버와 어플리케이션 서버가 분리되었다는 가정하에 작성한다.
> .pem과 같은 키는 어드민이 서버에 접속할 때 사용되며 포트로 커넥션시에는 필요없다.

1. db서버는 db port를 연다.
2. db url의 host부분에 db ip주소를 넣고 깃에 push한다.
3. db 서버에 적절히 database를 만든다.
4. 어플리케이션 서버는 8080 포트를 연다.
5. 어플리케이션 서버에 필요한 종속성들을 install한다. [node, pm2, redis, db]
6. redis를 세팅한다.
7. git clone으로 서버 어플리케이션을 불러온다.
8. 스크립트를 활용해 pm2로 서버 어플리케이션을 실행한다.

## nestjs 도메인 개발 특수사항

1. 예외 메세지 -> 예외 추가
2. cud(create, update, delete)는 모두 `.catch` 문을 활용하여 유니크 제약조건과 식별자들을 검증한다. 이때 prisma 에러 코드를 활용해 적당한 에러에 대해 먼저 핸들링하고, 후에 나머지 예외들을 커스텀 예외에 몰아 넣는다.
3. repository 개발 후 module에 추가 -> service export -> 다른 도메인에서 repository 사용할경우 repository도 export

## 테스트시 주의점

- 테스트를 할때 toEqual같은 함수는 일반 동기 함수이고
- toBeTruty 와 같은 함수는 비동기이다. 이는 커서를 올려서 Promise<void>인지 확인하여 알 수 있다.
- 비동기 함수는 아래와 같이 expect절을 작성해야 오류가 없다.

```typescript
expect(async () => {
  await test...
}).toBeTruty();
```

- 또한 에러를 체크하는 테스트의 경우, prisma 단에서 에러가 발생하면 error 레벨의 로그가 남는다. 이는 무시해도 좋으며, 실제 서버를 구동하여 똑같은 일을 하여도 prisma error level log가 남는다.
- 이왕이면 실패하는 테스트는 안하는 것이 좋다.(toThrow 예외를 맞추기가 은근 어렵다.)
- 그리고 jwt service나 config service가 들어가는 것들은 테스트 하지 않는 것이 좋다. 할때마다 모킹해야하며 이를 통해 강한 스트레스를 유발한다.
- 잘못된 식별자를 활용해서 command를 날리는 테스트를 할경우, custom 예외가 터지지 않는다.
- many가 아닌 일반 command는 조회 후 command작업을 한다. 조회시에는 이미 정의해둔 findOneById를 호출하는데, 이때 validate 작업을 같이하게된다.
- 따라서 HttpException이 발생한다.

## Real DB Test

- 결국엔 도커를 키더라도, prisma와 연결된 단 하나의 DB와 커넥션이 이루어진다.
- production의 경우 db url이 바뀐다. 따라서 개발단계에서는 localhost의 DB를 그냥 쓰자.
- `package.json`의 test 스크립트를 script setting에 기술된 대로 변경한다.
- 이렇게 완성된 테스트는 raw query가 제약조건상 나가지 않으므로, prisma의 api를 이용해서 사용한다.
- 따라서 global id를 두고 이를 테스트에서 활용하며, `afterEach`에서 해당 id를 가지고 각 테스트가 끝날 때마다 삭제한다.

## 페이징

- 페이징은 offset 페이징과 no offset 페이징으로 모두 나누어서 진행하였다.
- 두 페이징 모두 domain이름-page(domain이름Page)라는 객체를 리턴한다.
- 이 객체는 페이징에만 사용되는 컬럼들만 조회하여 리턴할 수 있도록 만든 객체로, 페이징 시에는 detail, 즉 상세정보가 필요 없다는 특징을 적극 활용하였다.
- detail시에 사용되는 객체는 domain이름-info 타입이다.
- offset 페이징은 no offset 페이징과 달리 현재 페이지를 같이 넘겨주는 domain이름-offset-page.dto를 리턴한다.
- no offset 페이징은 domain이름-optimized-page.dto를 리턴하며, lastId가 담겨있다.
- 프러덕션에 적용할땐 domainname-page.ts와 domainname-page.dto.ts로 구분해서 던지면 된다.

## 쿼리스트링 주의

- class validator를 전역으로 설정해놓으면, dto 뿐만 아니라, 쿼리스트링 등 클라이언트로 부터 넘겨받는 모든 객체에 validation이 부여된다.
- 따라서 lastId처럼 입력받지 않아도되는 optional value의 경우 해당 value의 값은 입력하지 않더라도, value의 이름은 기입해야한다.
- 아래와 같이 입력해주어야 에러가 발생하지 않는다.
- 이는 클라이언트와 백엔드가 모두지켜야할 규약이다.

```
[signle]
/post?lastId
/post?lastId=

[multiple]
/post?lastId&keyword
/post?lastId=&keyword=
```

## postgres sql 조회

- 조회시 `select * from users;`로 조회하면 조회가 되지 않는다.
- `스키마이름."테이블(대소문자 구분하여)"` 로 조회해야한다
- `select * from public."Users";`

## prisma studio

- `npx prisma studio`로 접속하며, localhost:5555 로 접속가능하다

## postgres admin4 접속안될때

1. 앱 데이터 C:\Users\%USERNAME%\AppData\Roaming\pgAdmin에서 삭제
2. 경로 변수에 추가 C:\Program Files\PostgreSQL\9.6\bin (실제로는 사용자와 시스템 모두에 추가했습니다)
3. 마우스 오른쪽 버튼을 클릭하고 관리자로 시작하세요.

## 프로덕션 추천 팁

- users의 경우 `@id @default(uuid())`로 id를 uuid로 설정하는게 좋을 것 같다.
- `@db.VarChar(length)`를 사용하면 길이 조정이 가능하다. varchar 뿐만아니라 필요한 타입을 적극 활용하면 좋다.
- createdDate은 `@default(now()) @db.Date`를 사용하면 된다.
- updatedDate는 `@updatedAt`를 사용한다.
- create나 update나 모두 `Datetime` 타입이다.
- `@relations`안에는 옵션으로 `onDelete: Cascade, onUpdate: Cascade`를 모두 줄 수 있다.
- enum을 만든 후 타입에 enum을 설정하고 default값을 매길 수 있다.
- migrate 커맨드는 자주 활용한다.

## 모듈 이해

- 모듈은 ioc를 도와주는 역할이라 생각하면 편하다.
- auth도메인에서 users에 있는 provider를 사용하길 원한다면, users에서는 해당 provider를 export 해주고,
- auth 도메인에서 users 모듈을 import하여주면 된다.

## 복합키

```prisma
model User {
  firstName String
  lastName  String
  email     String  @unique
  isAdmin   Boolean @default(false)

  @@id([firstName, lastName])
}
```

## n+1 문제 해결

- fluent api를 활용한다.
- fluent api가 실행되는 조건은 다음과 같다.
  1. 스키마에 연관 모델이 등록되어있어야한다.
  2. findFirst나 findUnique와 같은 단일 쿼리로 실행해야한다.

```typescript
//users를 기준으로 post를 가져온다.(one to many 관계에서 조회 -> n+1문제 발생)
//fluent api를 통해서 n+1문제 해결
const posts: Post[] = await prisma.user
  .findUniuqe({ where: { id: '1' } })
  .post(); //post는 users 스키마에 정의된 연관관계 post 이름
```

## Json 성능 최적화

- json은 client와 server가 통신하며 이루어지는 직렬화와 역직렬화 과정에서 불필요하게 성능을 떨어뜨린다.
- 이에 대한 해결책은 다음과 같다.
  1. 필요한 데이터만 넣는다.
  2. 최대한 컴팩트하게 유지한다.
  3. 중첩을 최대한 피한다.
  4. 네이밍을 축약한다. (transaction_state => tnxState)

## 파일 업로드

- 파일을 쓰는경우 express framework만 가능하다. fastify는 불가능하다.
- 그리고 복잡성이 두드러지므로, 파일 서버를 따로 분리하여서 save, serve 역할을 모두 하도록 위임하는 것이 좋다.

## db connection pool

- 커넥션 풀 사이즈는 .env에 있는 url을 통해 걸어주면 된다.

## 많이 쓰는 prisma 에러

- unique 제약조건은 http exception으로 처리한다.

```typescript
let message: string;
let status: HttpStatus;

if (err.code == PrismaCommonErrCode.UNIQUE_CONSTRAINTS_VIOLATION) {
  message = UsersExcMsg.USERNAME_UNIQUE_CONSTRAINTS_VIOLATION;
  status = HttpStatus.CONFLICT;
} else {
  message = err.message;
  status = HttpStatus.BAD_REQUEST;
}

throw new HttpException(message, status);
```

- 레코드 not found 에러는 다음과 같다.

```typescript
let message: string;
let status: HttpStatus;

if (err.code === PrismaCommonErrCode.RECORD_NOT_FOUND) {
  message = UsersExcMsg.USERS_ID_BAD_REQUEST;
  status = HttpStatus.BAD_REQUEST;
} else {
  message = err.message;
  status = HttpStatus.BAD_REQUEST;
}

throw new UsersException(message, status);
```

## type

- interface는 객체로만 선언이 가능하나, 타입은 다양한 형태(단일, 유니온, 배열 등)로 선언이 가능하다.
- 특히나 interface는 원시 자료형으로 선언이 불가하다.(예시 첫번째 처럼)

```typescript
type TExample = string; //원시 자료형
type TExample2 = string | number;
type Texample3 = [val: string, val2: number];
```

- 객체를 만들고 이를 타입으로 바꾸려면 `type 이름 = typeof 객체` 를 사용하면 된다.

```typescript
const obj = {
  id: number,
  name: string,
};

type TObj = typeof obj;
```

- 타입은 사용자와의 상호 작용보단, 마이크로서비스에서 서비스간 통신 혹은 서버 내에서의 통신에 사용하는 것이 좋을 것 같다.
- 여러개의 함수가 있고, 이 함수들에 매개변수가 중복되어 들어오는 경우 타입을 만들어서 사용하면 좋다.(특히나 파라미터 갯수가 3개 이상이 될때)
