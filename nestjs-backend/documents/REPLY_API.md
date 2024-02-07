# Reply API

## jwt 토큰 헤더 주의사항

- 대부분의 경우 요청시 `Authorization`헤더에 `Bearer ${accessToken}`형태로 jwt 토큰을 삽입하여 request해야합니다.
- 따라서 이를 직접 명시하지는 않습니다.
- 그러나 토큰이 필요하지 않은 경우에 한하여는 문서에 명시하였습니다.

## reply detail

- PATH = `/reply/:id` -> id(bigint)
- Method = GET
- ReplyInfo - response

```json
{
  "id": bigint,
  "writer_id": "",
  "post_id": bigint,
  "content": "",
  "reply_state": "ORIGINAL/EDITED",
  "created_date": Date
}
```

## belong post

- PATH = `/reply/belong-post/:postId` -> postId(bigint)
- Method = [GET]
- query -> lastId(string)
- ReplyPage - response

```json
{
  "id": bigint,
  "writer_id": "",
  "post_id": bigint,
  "content": "",
  "reply_state": "ORIGINAL/EDITED",
  "created_date": Date
}
```

- ReplyPageDto - response

```json
{
  "replyPages": ReplyPage[],
  "metadata": {
    "lastId": bigint
  }
}
```

## create reply

- PATH = `/reply`
- Method = [POST]
- CreateReplyDto - request

```json
{
  "writerId": "",
  "postId": bigint,
  "content": ""
}
```

- success msg(string) - response

## update reply

- PATH = `/reply/:id` -> id(bigint)
- Method = PATCH
- UpdateReplydto - request

```json
{
  "writerId": "",
  "content": ""
}
```

- success msg(string) - response

## delete reply

- PATH = `/reply/:id` -> id(bigint)
- Method = DELETE
- RemoveReplyDto - request

```json
{
  "writerId": ""
}
```

- success msg(string) - response
