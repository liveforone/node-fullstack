# React frontend

## create & install

- `npx create-react-app 프로젝트명 --template typescript`
- `npm i axios`
- `npm i classnames`
- `npm i react-icons`
- `npm i react-router-dom`
- `npm i sass`
- `npm i styled-components`

## axios

- post, path는 url, body, config(param, header)를 매개변수로 받는다.
- delete, get은 url, config(param, header, data)를 매개변수로 받는다.

## date 타입을 화면에 이쁘게 출력

```typescript
new Date(data.created_date).toLocaleString();
```

## useEffect 마운트해도 두번 실행

- React.strict가 설정되어 있는경우 useEffect를 마운트하여도 두번 실행된다. 따라서 해당 코드를 삭제하면 한 번만 작동한다.

## window.location.href vs replace

- href는 뒤로가기를 지원,
- replace는 뒤로가기를 지원하지 않는다.

## 성공과 실패 alert

- 에러는 error.response.data.message
- 성공은 response.data로 처리한다.

## axios command시 body 주의

- body를 state를 사용해서 객체를 정의해두었다면 해당 객체를 넣어야지 `{data}`처럼 넣어서는 안된다.
- `data`처럼 넣어야한다.
- 그러나 state에는 객체가 아니라 값만 들어있다면 위와 같은 `{name: val}`같은 형태로 넣어야한다.

## 재로딩

- 재로딩시에는 `window.location.reload()`를 사용하면 된다.
