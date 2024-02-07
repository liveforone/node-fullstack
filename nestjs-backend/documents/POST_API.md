# Post API

## jwt 토큰 헤더 주의사항

- 대부분의 경우 요청시 `Authorization`헤더에 `Bearer ${accessToken}`형태로 jwt 토큰을 삽입하여 request해야합니다.
- 따라서 이를 직접 명시하지는 않습니다.
- 그러나 토큰이 필요하지 않은 경우에 한하여는 문서에 명시하였습니다.

## all post

- PATH = `/posts`
- Method = [GET]
- query = lastId(bigint)
- PostPage - response

```json
{
  "id": bigint,
  "title": "",
  "writer_id": "",
  "created_date": Date
}
```

- PostPageDto - response

```json
{
  "postPages": PostPage[],
  "metadata": {
    "lastId": bigint
  }
}
```

## belong-writer

- PATH = `/posts/belong-writer/:writerId` -> writerId(string)
- Method = [GET]
- query = lastId(bigint)
- PostPage - response

```json
{
  "id": bigint,
  "title": "",
  "writer_id": "",
  "created_date": Date
}
```

- PostPageDto - response

```json
{
  "postPages": PostPage[],
  "metadata": {
    "lastId": bigint
  }
}
```

## search post

- PATH = `/posts/search`
- Method = [GET]
- query = keyword(string) & lastId(bigint)
- PostPage - response

```json
{
  "id": bigint,
  "title": "",
  "writer_id": "",
  "created_date": Date
}
```

- PostPageDto - response

```json
{
  "postPages": PostPage[],
  "metadata": {
    "lastId": bigint
  }
}
```

## post detail

- PATH = `/posts/:id` -> id(bigint)
- Method = [Get]
- PageInfo - response

```json
{
  "id": "",
  "title": "",
  "content": "",
  "post_state": "ORIGINAL/EDITED",
  "writer_id": "",
  "created_date": ""
}
```

## create post

- PATH = `/posts`
- Method = [POST]
- CreatePostDto - request

```json
{
  "writerId": "",
  "title": "",
  "content": ""
}
```

- success msg(string) - response

## update post

- PATH = `/posts/:id` -> id(bigint)
- Method = Patch
- UpdatePostDto - request

```json
{
  "writerId": "",
  "content": ""
}
```

- success msg(string) - response

## delete post

- PATH = `/posts/:id` -> id(bigint)
- Method = Delete
- RemovePostDto - request

```json
{
  "writerId": ""
}
```

- success msg(string) - response
