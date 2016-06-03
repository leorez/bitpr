(function () {
  'use strict';

  angular
    .module('article-senders')
    .controller('ArticleSendersController', ArticleSendersController);

  ArticleSendersController.$inject = ['ngProgressFactory', '$scope', '$timeout', '$window', 'FileUploader', '$mdDialog', '$http', '$state', 'articleSenderResolve', '$location', 'Authentication', 'ArticleSendersService', 'Upload'];

  function ArticleSendersController(ngProgressFactory, $scope, $timeout, $window, FileUploader, $mdDialog, $http, $state, articleSender, $location, Authentication, ArticleSendersService, Upload) {
    var vm = this;

    vm.error = null;
    vm.form = {};
    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.articleSender = articleSender;

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
    vm.types = ['신제품', '신사업', '실적', '기타'];


    // 새로운 보도자료 작성시 default values
    if (!vm.articleSender._id) {
      vm.articleSender.type = '신제품';
      vm.articleSender.reserveTime = 0;
      vm.articleSender.sendCount = 1;
      vm.articleSender.beToDart = true;
      vm.articleSender.fare = 500000;
      vm.articleSender.contentType = 'uploadFile'; /* 보도자료 내용 입력방법 직졉입력(inputContent)/ 파일업로드(uploadFile) */
      vm.articleSender.dspType = 'A';
      vm.articleSender.contact = vm.articleSender.contact || vm.user.telephone + ' / ' + vm.user.cellphone;
      vm.articleSender.sender = vm.articleSender.sender || vm.user.displayName;
      if (!vm.articleSender.subheadline) {
        vm.articleSender.subheadline = '<p># 전통적 비수기 1Q ... 전년 동기 대비 매출 40%, 영업이익 42%늘어</p>';
        vm.articleSender.subheadline += '<p># 보호 필름과 케이스 의존성 탈피 가시화... 기타 제품 9배 성장</p>';
        vm.articleSender.subheadline += '<p># 애플 워치 및 차량용 제품 인기</p>';
      }
      if (!vm.articleSender.lead) {
        vm.articleSender.lead = '<p>농림축산식품부(이하 농식품부)와 농협은행은 5.23일 펀드운용사를 대상으로 농식품 투자플랫폼사업(이하 플랫폼사업) 설명회를 개최할 계획이다.</p>';
        vm.articleSender.lead += '<p>농식품 투자플랫폼은 농업인이 첨단온실, 버섯재배사와 같은 농업시설을 매각후 재임차(SaleLease-back)하고 환매할 수 있는 새로운 농업금융 지원 시스템이다.</p>';
      }
      if (!vm.articleSender.main) {
        vm.articleSender.main = '<p>농식품 투자플랫폼은 농업인이 첨단온실, 버섯재배사와 같은 농업시설을 매각후 재임차(SaleLease-back)하고 환매할 수 있는 새로운 농업금융 지원 시스템이다.</p>';
        vm.articleSender.main += '<p>이 날 설명회는 플랫폼사업에 필요한 자본을 조달하기 위해서 농식품 모태펀드 운용사 10여 곳을 대상으로 진행된다.</p>';
        vm.articleSender.main += '<p>설명회에서 농식품부와 농협은행은 플랫폼사업의 개요와 그간 발굴한 사업대상자 후보 농업법인을 소개한다. </p>';
        vm.articleSender.main += '<p>사업대상자 후보인 A농업법인은 파프리카 유리온실 확장을 희망하는데, 기존 방식에 따르면 담보능력이 부족하여 자금조달에 어려움이 있고, 대출을 받더라도 매년 대출원금과 이자를 상환해야 하는 부채가 증가하여 실패시 재기가 어려운 문제가 있다.</p>';
      }
      if (!vm.articleSender.detail) {
        vm.articleSender.detail = '세부사실';
      }
      if (!vm.articleSender.corpSummary) {
        vm.articleSender.corpSummary = '<p>(주)뉴로스 각종 첨단기술의 복합체인 가스터빈엔진 개발경험을 보유한 연구진들이 모여 창업한 벤처기업이며, 냉동공조 분야, 항공추진 분야, 지능형 로봇 분야, 발전 및 에너지 분야, 기술자문 용역 및 소프트웨어 개발 분야 등 첨단기술을 활용한 고부가가치 미래 사업에 주력하고 있는 기업입니다.</p>';
      }


    }

    $http
      .post('/api/crp-info', { corpCode: vm.user.corpCode })
      .then(function (response) {
        console.log('success: ' + JSON.stringify(response));
        vm.user.corpInfo = response.data;
        if (!vm.articleSender._id)
          vm.articleSender.title = autoTitle(response.data.crp_nm_i);
      }, function (error) {
        console.error('error: ' + JSON.stringify(error));
        vm.user.corpInfo = {
          crp_nm: '(주) 비트피알',
          crp_nm_i: '비트피알',
          adr: '서울시 마포구 독막로 331 22F(도화동, 마스터즈타워)',
          hm_url: 'http://www.bitpr.kr'
        };

        if (vm.user.corpInfo.crp_nm_i && !vm.articleSender._id) {
          vm.articleSender.title = autoTitle(vm.user.corpInfo.crp_nm_i);
        }
      });

    function autoTitle(corpName) {
      var title = corpName + ' 보도자료';
      title += '(' + corpName + '에서 보도자료를 보내드립니다. 관심과 배려 부탁드립니다.)';
      return title;
    }


    /*
     ** imageRoot (/uploads/images) 를 기준으로 /images/{image-name}으로 이미지소스를 가져올수 있도록
     *  path를 수정한다.
     *  /uploads 폴더 밑으로 디렉토리구조로 route되도록 config/lib/express.js 에 정의 되어있음
     */
    var imageRoot = '/images/';
    if (vm.articleSender.image1) vm.articleSender.image1 = imageRoot + vm.articleSender.image1;
    if (vm.articleSender.image2) vm.articleSender.image2 = imageRoot + vm.articleSender.image2;
    if (vm.articleSender.image3) vm.articleSender.image3 = imageRoot + vm.articleSender.image3;

    vm.onSendCountChanged = onSendCountChanged;
    vm.update = update;
    vm.remove = remove;
    vm.sendArticle = sendArticle;
    vm.imageQueue = [];
    vm.articleSender.imageFiles = [];
    vm.errFiles = [];

    vm.onImageFilesSelected = function(files, errFiles) {
      console.log(files);
      vm.articleSender.imageFiles = files;
      vm.errFiles = errFiles;
      vm.articleSender.imageFiles.forEach(function(file) {
        if ($window.FileReader) {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);

          fileReader.onload = function (fileReaderEvent) {
            $timeout(function () {
              vm.imageQueue.push(fileReaderEvent.target.result);
              console.log('result: ' + vm.imageQueue);
            }, 0);
          };
        }
      });
    };

    // 보도자료발송 작성중 취소버튼 클릭시 실행
    vm.cancel = function() {
      $state.go('article-senders.list');
    };

    function onSendCountChanged() {
      var defaultFare = 500000;
      if (vm.articleSender.sendCount === 1) {
        vm.articleSender.fare = defaultFare;
      } else {
        vm.articleSender.fare = defaultFare + vm.articleSender.sendCount / 2 * 300000;
      }
    }

    function createArticleSender() {
      vm.articleSender.status = 'Reserved';
      vm.articleSender.reserved = new Date();

      if (vm.articleSender.contentType === 'inputContent') {
        vm.articleSender.file = '';
      } else {
        vm.articleSender.content = '';
      }

      if (vm.articleSender.file || vm.articleSender.imageFiles.length > 0) {
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
          $state.go('article-senders.list');
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
          $state.go('article-senders.list');
        }, function (err) {
          vm.error = err.data.message;
        });
      }
    }

    vm.temporarySave = function () {
      vm.articleSender.status = 'Temporary';
      createArticleSender();
    };

    function updateArticleSender() {
      vm.articleSender.$update(function (response) {
        console.log(response);
        $state.go('article-senders.preview', { articleSenderId: vm.articleSender._id });
      }, function (err) {
        vm.error = err.data.message;
      });
    }

    vm.save = function(isValid) {
      if (articleSender._id) {
        updateArticleSender();
      } else {
        createArticleSender();
      }
    };

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
      console.log(articleSender);
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

    vm.focus = function (model) {
      console.log('clear' + model);
      var el = angular.element(document.querySelectorAll('[ng-model="vm.articleSender.' + model + '"]'));
      el.focus();
    };
  }
}());
