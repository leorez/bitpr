(function () {
  'use strict';

  angular
    .module('article-senders')
    .controller('ArticleSendersController', ArticleSendersController);

  ArticleSendersController.$inject = ['$scope', '$mdDialog', '$http', '$state', 'articleSenderResolve', '$location', 'Authentication', 'ArticleSendersService', 'Upload'];

  function ArticleSendersController($scope, $mdDialog, $http, $state, articleSender, $location, Authentication, ArticleSendersService, Upload) {
    var vm = this;

    console.log('auth: ' + JSON.stringify(Authentication.user));
    vm.error = null;
    vm.form = {};
    vm.articleSender = articleSender;
    vm.articleSender.dspType = 'A';
    vm.authentication = Authentication;
    var reserveTimes = [0, 999].concat(_.range(1, 24));
    reserveTimes.push(24, 48, 72); // 24: 1일후, 48: 2일후, 72: 3일후, 999: 공시확인후
    vm.reserveTimeOptions = [];
    reserveTimes.forEach(function (item) {
      var text = item + '시간후';
      switch (item) {
        case 0:
          text = '즉시';
          break;
        case 24:
          text = '1일후';
          break;
        case 48:
          text = '2일후';
          break;
        case 72:
          text = '3일후';
          break;
        case 999:
          text = '공시확인후';
          break;
      }
      var data = { text: text, data: item };
      vm.reserveTimeOptions.push(data);
    });
    vm.sendCounts = [1, 2, 4, 6, 8, 10];
    vm.dspTypes = [
      { data: 'A', text: '정기공시' },
      { data: 'B', text: '주요사항보고' },
      { data: 'C', text: '발행공시' },
      { data: 'D', text: '지분공시' },
      { data: 'E', text: '기타공시' },
      { data: 'F', text: '외부감사관련' },
      { data: 'G', text: '펀드공시' },
      { data: 'H', text: '자산유동화' },
      { data: 'I', text: '거래소공시' },
      { data: 'J', text: '공정위공시' }
    ];
    vm.articleSender.reserveTime = 0;
    vm.articleSender.sendCount = 1;
    vm.articleSender.beToDart = true;
    vm.articleSender.fare = 500000;
    vm.articleSender.contentType = 'uploadFile';
    /* 보도자료 내용 입력방법 직졉입력(inputContent)/ 파일업로드(uploadFile) */

    /*
     ** imageRoot (/uploads/images) 를 기준으로 /images/{image-name}으로 이미지소스를 가져올수 있도록
     *  path를 수정한다.
     *  /uploads 폴더 밑으로 디렉토리구조로 route되도록 config/lib/express.js 에 정의 되어있음
     */
    var imageRoot = '/images/';
    if (vm.articleSender.image1) vm.articleSender.image1 = imageRoot + vm.articleSender.image1;
    if (vm.articleSender.image2) vm.articleSender.image2 = imageRoot + vm.articleSender.image2;
    if (vm.articleSender.image3) vm.articleSender.image3 = imageRoot + vm.articleSender.image3;

    console.log('corpCode: ' + vm.authentication.user.corpCode);

    function autoTitle(corpName) {
      var title = corpName + ' 보도자료';
      title += '(' + corpName + '에서 보도자료를 보내드립니다. 관심과 배려 부탁드립니다.)';
      return title;
    }

    $http
      .post('/api/crp-code-to-name', { corpCode: vm.authentication.user.corpCode })
      .then(function (response) {
        console.log('success: ' + JSON.stringify(response));
        vm.articleSender.title = autoTitle(response.data.name);
      }, function (error) {
        console.error('error: ' + JSON.stringify(error));
        vm.articleSender.title = '';
        if (vm.authentication.user.corpName !== '') {
          vm.articleSender.title = autoTitle(vm.authentication.user.corpName);
        }
      });

    vm.bill = bill;
    vm.onSendCountChanged = onSendCountChanged;
    vm.update = update;
    vm.remove = remove;
    vm.cancel = cancel;
    vm.sendArticle = sendArticle;

    // 보도자료발송 작성중 취소버튼 클릭시 실행
    function cancel() {
      var confirm = $mdDialog.confirm()
        .textContent('취소하시면 입력하신 자료가 유실됩니다. 취소하시겠습니까?')
        .ok('예')
        .cancel('아니요');
      $mdDialog.show(confirm).then(function () {
        $location.path('/');
      });
    }

    function onSendCountChanged() {
      var defaultFare = 500000;
      if (vm.articleSender.sendCount === 1) {
        vm.articleSender.fare = defaultFare;
      } else {
        vm.articleSender.fare = defaultFare + vm.articleSender.sendCount / 2 * 300000;
      }
    }

    function bill(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleSenderForm');
        return false;
      }

      if (vm.articleSender.contentType === 'inputContent') {
        vm.articleSender.file = '';
      } else {
        vm.articleSender.content = '';
      }

      if (isValid && vm.articleSender.file) {
        var upload = Upload.upload({
          url: '/api/article-senders',
          method: 'POST',
          data: vm.articleSender,
          withCredentials: true,
          disableProgress: true
        });

        upload.then(function (resp) {
          console.log(resp);
          vm.articleSender.title = '';
          vm.articleSender.content = '';
          $state.go('article-senders.preview', {
            articleSenderId: resp.data._id
          });
        }, function (resp) {
          console.log('Error status: ' + resp.status);
          console.log(resp.data.message);
          vm.error = resp.data.message;
        }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 10);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });

      } else {
        vm.articleSender.content = vm.articleSender.content.replace(/\n/g, '<br />');
        vm.articleSender.$save(function (response) {
          console.log(response);
          vm.articleSender.title = '';
          vm.articleSender.content = '';
          $state.go('article-senders.preview', {
            articleSenderId: response._id
          });
        }, function (err) {
          vm.error = err.data.message;
        });
      }
    }

    function sendArticle() {
      console.log('send call');
      $http.post('/api/article-senders-send', { articleSenderId: vm.articleSender._id }).success(function (response) {
        console.log(response);
        var alert = $mdDialog.alert()
          .title('발송')
          .htmlContent('<md-content>발송이 시작되었습니다. 설정하신 시간후에 보도자료가 자동으로 발송됩니다.</md-content>')
          .ok('닫기');

        $mdDialog
          .show(alert)
          .finally(function () {
            alert = undefined;
            $state.go('article-senders.list', {
              articleSenderId: response._id
            });
          });
      }).error(function (response) {
        console.log(response.message);
        vm.error = response.message;
      });
    }

    function update(isValid) {
      if (isValid) {
        vm.articleSender.$update(function (response) {
          $state.go('article-senders.preview', {
            articleSenderId: vm.articleSender._id
          });
        }, function (err) {
          vm.error = err.data.message;
        });
      }
    }

    function remove(articleSender) {
      if (articleSender) {
        articleSender.$remove();

        for (var i in vm.articleSenders) {
          if (vm.articleSenders[i] === articleSender) {
            vm.articleSenders.splice(i, 1);
          }
        }
      } else {
        vm.articleSender.$remove(function () {
          $location.path('');
        });
      }
    }
  }
}());
