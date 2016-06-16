(function () {
  'use strict';

  angular
    .module('article-senders.services')
    .factory('ArticleSendersMethodsService', ArticleSendersMethodsService);

  ArticleSendersMethodsService.$inject = ['$uibModal', '$http'];

  function ArticleSendersMethodsService($uibModal, $http) {
    return {
      /*
       dart 기업개황을 가져오기
       */
      dartCorpInfo: function (corpCode, callback) {
        $http
          .post('/api/crp-info', { corpCode: corpCode })
          .then(function (response) {
            console.log('success: ' + JSON.stringify(response));
            callback(null, response.data);
          }, function (error) {
            console.error('error: ' + JSON.stringify(error));
            callback(error);
          });
      },
      /*
        재발송
       */
      reSendArticle: function (articleSender) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'modules/article-senders/client/views/reporters-dialog.tmpl.html',
          controller: 'ReporterSelectDlgController',
          size: 'sm',
          resolve: {
            sendCount: function () {
              return articleSender.sendCount;
            }
          }
        });

        modalInstance.result.then(function (reporters) {
          var data = {
            reporters: reporters,
            articleSenders: [articleSender]
          };

          $http.post('/api/re-send-article', data).then(function (resp) {
            console.log(resp);
            // vm.success = resp.data.message;
          }, function (err) {
            console.error(err);
            // vm.error = '에러가 발생하였습니다.';
          });
        }, function () {
          // on cancel
        });
      }
    };
  }
}());
