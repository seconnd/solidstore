# Matrixphere 가이드
버전: 0.0.7 | 작성일: 2025-03-27

## 목차
- [개요](#개요)
- [호출 방법](#호출-방법)
- [상태값 생성](#상태값-생성)
- [상태값 호출](#상태값-호출)
- [상태값 업데이트](#상태값-업데이트)
- [상태값 삭제](#상태값-삭제)
- [시스템 상태 및 기능](#시스템-상태-및-기능)
- [UNDO, REDO](#UNDO-REDO)

## 개요
매트릭스피어 (Matrixphere): 여러 상태들이 결합된 원형의 집합체.
State는 Redux Store를 기반으로 상태를 전역으로 관리하며 Rxjs, Redux Subscribe 등으로 상태값의 핸들링을 매우 유연하게 처리할 수 있음.

## 호출 방법

ESM
```javascript
import { m$, stateObservable } from 'matrixphere'
```

UMD
```javascript
<script src="matrixphere"></script> // html
...
const { m$, stateObservable } = Matrixphere // js script
```

## 상태값 생성
```javascript
m$.set({
    name: 'test', // string
    value: 'test', // any, 상태의 초기값
    actions: [{
        name: 'action1' // string
        method: (data: {state, action, ...}) => {
            // 해당 상태의 본 액션을 호출할때 실행할 스크립트
            return data // 리턴할 떄는 data형식 그대로 리턴해주어야함.
        }
        // actions는 observable을 사용할 수 없음.
    }],
    // 실행하기 전 사전에 실행되는 스크립트
    // 일반 함수는 data형식 그대로 리턴해야하며 observable 구조는 리턴 없음. 혼용 가능.
    before: (data: {state, action, ...}) => {
            return data
    },
    after: (data: {state, action, ...}) => {
        // 해당 상태 호출이 끝나고 실행할 스크립트
        // 리턴 없음
    },
    undo: (data: {state, action, ...}): void => {
        // 해당 상태의 undo시 실행할 스크립트
        // 리턴 없음
    },
    // 아래와 같이 rxjs observable 구조로도 사용 가능.
    redo: new stateObservable()
        .pipe(
            // rxjs 기능들과 같이 사용할 수 있음.
            filter( (data: {state, action, ...}) => { // filter의 경우 rxjs의 filter를 임포트 시켜야 함.
                console.log(data)
                console.log('pipe')
                return true
            })
        ).subscribe({
            next: (data: any) => {
                console.log('next')
            }
        })
})
```

## 상태값 호출
```javascript
m$.get('test') // test 상태값 호출
console.log(m$.getState()) // 전체 상태값 호출
```

## 상태값 업데이트
```javascript
m$.update('test', 'test2') // test의 상태값을 test2로 변경
m$.action('test', 'action1', 'test3') // test의 커스텀 액션 action1을 test3값을 전달하면서 실행
```

## 상태값 삭제
```javascript
m$.remove('test') // test 상태 삭제
```

## 시스템 상태 및 기능
System 상태값인 initial$, history$가 있음.
- **initial$**: 상태의 초기값을 저장하는 저장소, 따로 액션을 호출하지 않아도 상태 생성 시 자동으로 저장됨.
- **history$**: 모든 상태에 대해 변경 감지 시 이전 값을 past: [] 에 저장하는 저장소, Undo, Redo 기능 구현에 사용되며 사용자가 따로 액션을 호출할 경우는 없음.


## UNDO, REDO
```javascript
m$.undo()
m$.redo()
```