# Auth API

## jwt 토큰 헤더 주의사항

- 대부분의 경우 요청시 `Authorization`헤더에 `Bearer ${accessToken}`형태로 jwt 토큰을 삽입하여 request해야합니다.
- 따라서 이를 직접 명시하지는 않습니다.
- 그러나 토큰이 필요하지 않은 경우에 한하여는 문서에 명시하였습니다.

## auth

### login

- PATH = `/auth/login`
- Method = [POST]
- LoginDto - request

```json
{
  "username": "",
  "password": ""
}
```

- TokenInfo - response

```json
{
  "accessToken": "",
  "refreshToken": ""
}
```

### reissue

- PATH = `/auth/reissue`
- Method = [POST]
- HEADER = refresh-token
- idObj - request

```json
{ "id": "" }
```

- TokenInfo - response

```json
{
  "accessToken": "",
  "refreshToken": ""
}
```

### logout

- PATH = `/auth/logout`
- Method = [POST]
- success msg(string) - response
