# 스마트하게 ts/js 사용하기

## falsy

- `undefined`
- `null`
- `0`
- `''`
- `NaN`

## &&

- `a && b`
- a가 truthy이면 b
- a가 falsy이면 a

## || falsy일 경우에 대한 처리법

- `a || b`
- a가 truthy 이면 a
- a가 falsy이면 b

## 많은 조건을 한번에 비교

```javascript
function compareManyCondition(name) {
  const animals = ['고양이', '개', '거북이', '너구리'];
  return animals.includes(name);
}
```

## switch문 스마트하게 사용

- 이런 식은 각 case에 따라 각각 다른 값을 return해야할때 쓴다

```javascript
const sounds = {
  개: '멍멍!',
  고양이: '야옹~',
  참새: '짹짹',
  비둘기: '구구 구 구',
};
return sounds[animal] || '...?';
```

## 매개변수에 따라 실행해햐하는 코드 구문이 다를 경우

```javascript
function makeSound(animal) {
  const tasks = {
    개() {
      console.log('멍멍');
    },
    고양이() {
      console.log('고양이');
    },
    비둘기() {
      console.log('구구 구 구');
    },
  };
  if (!tasks[animal]) {
    console.log('...?');
    return;
  }
  tasks[animal]();
}

getSound('개');
getSound('비둘기');
```
