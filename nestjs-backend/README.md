# NestJS Backend

## install

- `nest new project-name`
- `code .`
- `npm i @nestjs/testing`
- `npm i @nestjs/config`
- `npm i dotenv`
- `wsl openssl rand -hex 64`
- `npm i @nestjs/jwt passport-jwt`
- `npm i @types/passport-jwt`
- `npm i @nestjs/passport`
- `npm i bcrypt`
- `npm i @types/bcrypt`
- `npm i class-validator class-transformer`
- `npm install @nestjs/cache-manager cache-manager`
- `npm i cache-manager-redis-yet`
- `npm i prisma`
- `npm i @prisma/client`
- `npm i prisma-no-offset`
- `npm i pg`
- `nest g module auth`, service, controller generate
- `nest g resource 이름`

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

- main.ts에 추가

```typescript
app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
app.enableShutdownHooks();
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
- 도커 compose를 실행하며 db에 마이그레이션 파일을 deploy하는 start command이다.
  - `npm start`
  - `"start": "npm run docker:start  && npx prisma migrate deploy && nest start",`
- 서버 실행을 완료한 후 종료시 사용하는 command이다.
  - `npm run close`
  - `"close": "npm run docker:stop",`
- 테스트 시 활용되며, start command에서 nest서버를 실행하는 것이 아닌 jest를 실행하는 command이다.
  - `npm test`
  - `"test": "npx prisma migrate deploy && jest -i",`

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

## 자주 쓰는 custom cli command

- `npm run start`
- `npm test`
- `npm run close`
- `npm db:update`

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
