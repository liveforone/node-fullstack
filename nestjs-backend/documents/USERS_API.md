# Users API Docs

## jwt 토큰 헤더 주의사항

- 대부분의 경우 요청시 `Authorization`헤더에 `Bearer ${accessToken}`형태로 jwt 토큰을 삽입하여 request해야합니다.
- 따라서 이를 직접 명시하지는 않습니다.
- 그러나 토큰이 필요하지 않은 경우에 한하여는 문서에 명시하였습니다.

## signup

- PATH = `/users/signup`
- Method = [POST]
- jwt토큰이 필요하지 않습니다.
- success msg(string) - response

```json
{
  "username": "",
  "password": ""
}
```

## update-password

- PATH = `/users/update/password`
- Method = [PATCH]
- UpdatePwdto - request

```json
{
  "originalPw": "",
  "newPw": ""
}
```

- success msg(string) - response

## withdraw

- PATH = `/users/withdraw`
- Method = [DELTE]
- WithdrawDto - request

```json
{
  "password": ""
}
```

- success msg(string) - response

## profile

- PATH = `/users/profile`
- Method = [GET]
- UserInfo - response

```json
{
  "id": "",
  "username": "",
  "role": "MEMBER/ADMIN"
}
```

## info

- PATH = `/users/info/:id` -> id(string)
- Method = [GET]
- jwt토큰이 필요하지 않습니다.
- UserInfo - response

```json
{
  "id": "",
  "username": "",
  "role": "MEMBER/ADMIN"
}
```

## return id

- PATH = `/users/return-id`
- Method = [GET]
- id object - response

```json
{
  "id": ""
}
```
