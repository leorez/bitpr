# 비트피알 ReadMe

## 소스
github : https://github.com/leorez/bitpr

[Clone or download] 버튼을 눌러 clone또는 다운로드함
or
[Fork]버튼을 눌러 fork함

### Clone과 Fork의 차이
Clone은 저장소를 복제하여 동일한 소스루트를 사용하는것에 반해
Fork는 새로운 버전으로 분기하여 독립적인 소스루트를 사용한다.

## 폴더구성

* modules - 뷰와 컨트롤러및 서비스등 웹을 구성하는 프로그램 모듈들이 있는곳이다.
* public - 웹루트 경로에 해당되는 폴더이며 static한 자료들이 저장되어있다.
* lib - 외부서비스들을 사용하기위한 라이브러리 모듈을 저장한다.
* config - 각종 설정파일들
* tests - lib또는 scheduler.js와 같은 백그라운드 데몬등의 테스트
* uploads - 파일을 업로드하면 저장되는 곳

## 주요파일

* scheduler.js -
```bash
$ sh ./scripts/generate-ssl-certs.sh
```

## 서버


## 테스트하기

```bash
$ grunt testserver
```

```bash
$ grunt watch
```

```bash
$ grunt debug
```

```bash
$ grunt prod
```

## 인증
* 상장코드인증
* 이메일인증
* 전화인증

## 쇼셜미디어 연동
### 파일
* /modules/users/client/controllers/authentication.client.controller.js
* /home/noruya/projects/bitpr/modules/users/server/routes/auth.server.routes.js
* /home/noruya/projects/bitpr/modules/users/server/controllers/users/users.authentication.server.controller.js
* app.route('/api/auth/kakao').get(users.oauthCall('kakao'));
* app.route('/api/auth/kakao/callback').get(users.oauthCallback('kakao'));

### 함수
* oauthCall
* oauthCallback
* saveOAuthUserProfile


## TODO
* 상장코드 인증시 중복여부확인
* 이메일 수정시 이메일 입력창띄우기 (수정화면에서 직접수정할수 없도록 ReadOnly로함)
* 이메일 수정시 중복여부확인
* 보도자료 발송 상태 자동업데이트
* [스케쥴러] 기사수집시 중복(3개씩) 저장되는 버그
* [스케쥴러] 1만명이상 유저 테스트
* [기사모니터링] 키워드별로 분류해서 보여주기
* [기자관리] 우선순위 설정하기 (드래그앤 드랍)
* [소셜미디어연동] 개발자계정 변경하기
* [소셜미디어연동] 페이스북 연동테스트 (APP_ID를 받아서 테스트)


## README to PDF

```bash
$ npm install -g markdown-pdf
$ markdown-pdf README.md
```
