(function () {
  'use strict';

  angular
    .module('monitoring')
    .controller('MonitoringController', MonitoringController);

  MonitoringController.$inject = ['$http', '$mdDialog', '$scope', 'Authentication', 'CrawledArticles', 'ngProgressFactory', 'clipboard'];

  function MonitoringController($http, $mdDialog, $scope, Authentication, CrawledArticles, ngProgressFactory, clipboard) {
    var vm = this;

    vm.selected = [];
    vm.progressbar = ngProgressFactory.createInstance();
    vm.itemsPerPage = 10;
    vm.maxSize = 5;
    vm.currentPage = 1;
    vm.totalItems = 0;
    vm.data = { totalItems: 0, articles: [] };
    vm.filter = 'All';
    vm.counts = {};
    vm.keyword = null;
    vm.dashboardFilter = '일';

    vm.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
    };

    vm.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };

    // 홈페이지 올리기/내리기
    vm.toggleDisplayed = function(crawledArticle) {
      crawledArticle.displayed = !crawledArticle.displayed;
      crawledArticle.$update(function (response) {
      }, function (err) {
        vm.error = err.data.message;
      });
    };

    vm.crawledArticles = function (filter) {
      if (Authentication.user) {
        showChart(vm.dashboardFilter);

        vm.progressbar.start();
        vm.filter = filter;

        vm.data = CrawledArticles.get({ limit: vm.itemsPerPage, page: vm.currentPage, filter: filter, keyword: vm.keyword }, function (res) {
          vm.progressbar.complete();
          vm.totalItems = res.counts.totalItems;
          vm.counts = res.counts;
        }, function (err) {
          vm.progressbar.complete(err);
          console.log(err);
        });
      }
    };

    vm.closeDialog = function () {
      $mdDialog.hide();
    };

    vm.shareArticle = function ($event) {
      // 선택된 기사 공유하기
      // : 제목과 링크로 구성된 문자열을 만들어 클립보드로 복사한다.
      if (Authentication.user) {
        var selected = vm.selected;
        var text = '';
        angular.forEach(selected, function (item) {
          text += '<p>' + item.title + ' <a href="' + item.url + '">더보기</a></p>';
        });

        clipboard.copyText(text);

        var alert = $mdDialog.alert()
          .title('기사링크가 복사되었습니다.')
          .htmlContent('<md-content>' + text + '</md-content>')
          .ok('닫기');

        $mdDialog
          .show(alert)
          .finally(function () {
            alert = undefined;
          });
      }
    };


    var countOptions = {
      chart: {
        type: 'line'
      },
      credits: {
        enabled: false
      },
      title: {
        text: '기사 건수'
      },
      xAxis: {
        categories: []
      },
      yAxis: {
        title: {
          enabled: false
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: false
          },
          enableMouseTracking: false
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point}</b>'
      },
      series: []
    };

    var percentOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      credits: {
        enabled: false
      },
      title: {
        text: '기사 점유율'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: []
    };

    var dailyCounts = [];
    var monthlyCounts = [];
    var yearlyCounts = [];
    var keywords = [];
    var keywordStarts = [];
    var dates = [];

    function createChartData(datas, container) {
      while (container.length) { container.pop(); }
      keywords = [];
      dates = [];
      keywordStarts = [];

      datas.forEach(function(data) {
        if (dates.indexOf(data.date) === -1) {
          dates.push(data.date);
        }

        if (keywords.indexOf(data.keyword) !== -1) {
          for (var i = 0; i < container.length; ++i) {
            var item = container[i];
            if (item.name === data.keyword) {
              item.data.push(data.count);
              break;
            }
          }
        } else {
          console.log(data.keyword);

          keywords.push(data.keyword);
          keywordStarts.push({ keyword: data.keyword, date: data.date });
          container.push({ name: data.keyword, data: [] });
        }
      });
      console.log(dates);

      /*
       키워드별 시작일기준으로 이동하기
       시작일이전에는 모두 0으로 채운다.
       */
      keywordStarts.forEach(function (item) {
        var idx = dates.indexOf(item.date);
        console.log(idx);
        console.log(item.date);
        var data;
        for (var i = 0; i < container.length; ++i) {
          var di = container[i];
          if (di.name === item.keyword) {
            data = di.data;
            break;
          }
        }

        for (var j = 0; j < idx; ++j) {
          data.unshift(0);
        }
      });
    }

    function showChart(filter) {
      console.log('getCounts');
      if (filter === '일') {
        $http.get('/api/daily-counts').then(function (res) {
          createChartData(res.data, dailyCounts);
          vm.chart(filter);
        }, function (err) {
          console.error(err);
        });
      } else if (filter === '월') {
        $http.get('/api/monthly-counts').then(function (res) {
          createChartData(res.data, monthlyCounts);
          vm.chart(filter);
        }, function (err) {
          console.error(err);
        });
      } else if (filter === '년') {
        $http.get('/api/yearly-counts').then(function (res) {
          createChartData(res.data, yearlyCounts);
          vm.chart(filter);
        }, function (err) {
          console.error(err);
        });
      }
    }

    vm.chart = function (dashboardFilter) {
      vm.dashboardFilter = dashboardFilter;

      switch (dashboardFilter) {
        case '일':
          countOptions.xAxis.categories = dates;
          countOptions.series = dailyCounts;
          break;
        case '월':
          countOptions.xAxis.categories = dates;
          countOptions.series = monthlyCounts;
          break;
        case '연도':
          countOptions.xAxis.categories = dates;
          countOptions.series = yearlyCounts;
          break;
      }

      percentOptions.series = [{
        name: 'Brands',
        colorByPoint: true,
        data: [{
          name: '내 회사',
          y: 56.33,
          sliced: true
        }, {
          name: '경쟁사 D',
          y: 24.03
        }, {
          name: '경쟁사 A',
          y: 10.38
        }, {
          name: '경쟁사 B',
          y: 4.77
        }, {
          name: '경쟁사 C',
          y: 0.91
        }]
      }];

      /* eslint-disable */
      Highcharts.chart('news-count', countOptions);
      Highcharts.chart('news-percent', percentOptions);
      /* eslint-disable */
    };

  }
}());

