# 비트피알

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
