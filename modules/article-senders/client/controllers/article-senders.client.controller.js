'use strict';

angular.module('article-senders').controller('ArticleSendersController', ['$scope', '$stateParams', '$location', 'Authentication', 'ArticleSenders', 'Upload', '$timeout',
	function($scope, $stateParams, $location, Authentication, ArticleSenders, Upload, $timeout) {
		$scope.authentication = Authentication;
		$scope.reserveTimes = _.range(1,24);
		$scope.sendCounts = [1,2,4,6,8,10];
		$scope.reserveTime = 1;
		$scope.sendCount = 1;
		$scope.beToDart = true;
		$scope.fare = 500000;
		$scope.contentType = 'inputContent';/* 보도자료 내용 입력방법 직졉입력(inputContent)/ 파일업로드(uploadFile) */

		$scope.onSendCountChanged = function() {
			var defaultFare = 500000;
			if($scope.sendCount === 1) $scope.fare = defaultFare;
			else {
				$scope.fare = defaultFare + $scope.sendCount/2 * 300000;
			}
		};

		$scope.bill = function() {
			if($scope.contentType === 'inputContent') {
				$scope.file = '';
			} else {
				$scope.content = '';
			}
			
			var articleSenders = new ArticleSenders({
				title: $scope.title,
				reserveTime: $scope.reserveTime,
				beToDart: $scope.beToDart,
				sendCount: $scope.sendCount,
				fare: $scope.fare
			});

			console.log($scope.file);
			if ($scope.articleSenderForm.file.$valid && $scope.file) {
				articleSenders.file = $scope.file;
				articleSenders.user = Authentication.user._id;

				Upload.upload({
					url: '/api/article-senders',
					method: 'POST',
					data: articleSenders
				}).then(function(resp) {
					$location.path(resp.data._id);
					$scope.title = '';
					$scope.content = '';
				}, function(resp) {
					console.log('Error status: '+resp.status);
					console.log(resp.data.message);
					$scope.error = resp.data.message;
				}, function(evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded /evt.total);
					console.log('progress: ' + progressPercentage + '% '+ evt.config.data.file.name);
				});

			} else {
				articleSenders.content = this.content.replace(/\n/g, "<br />");
				articleSenders.$save(function (response) {
					$location.path(response._id);
					$scope.title = '';
					$scope.content = '';
				}, function (err) {
					$scope.error = err.data.message;
				});
			}
		};

		$scope.findOne = function() {
			$scope.articleSender = ArticleSenders.get({
				articleSenderId: $stateParams.articleSenderId
			});
		};

		$scope.find = function() {
			$scope.articleSenders = ArticleSenders.query();
		};

		$scope.update = function() {
			var articleSender = $scope.articleSender;

			articleSender.$update(function() {
				$location.path(articleSender._id);
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		$scope.remove = function(articleSender) {
			if(articleSender) {
				articleSender.$remove();

				for(var i in $scope.articleSenders) {
					if($scope.articleSenders[i] === articleSender) {
						$scope.articleSenders.splice(i, 1);
					}
				}
			} else {
				$scope.articleSender.$remove(function() {
					$location.path('');
				});
			}
		};
	}
]);
