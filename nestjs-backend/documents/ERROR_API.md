# Error API

## error response

- 에러는 공통적으로 `message`속성이 있습니다.
- 일반적인 에러는 다음과 같습니다.

```json
{
    "message": "",
    "statusCode": httpstatus,
    "timestamp": "",
    "path": ""
}
```

- 그러나 dto나 사용자가 요청할때 삽입된 여러 값들에 대해 validation 필터링에서 걸린 예외는 다음과 같습니다.
- 또한 message가 배열형태로 전달됨에 알 수 있듯, 여러개의 message가 담길 수 있습니다.

```json
{
	"statusCode": number,
	"message": [
		"title should not be empty",
	],
	"error": "Bad Request"
}
```
