(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$scope'];

  function DashboardController($scope) {
    var vm = this;
    vm.filter = '일';

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


    vm.chart = function (filter) {
      vm.filter = filter;

      switch (filter) {
        case '일':
          countOptions.xAxis.categories = ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '1.20', '1.21', '1.22', '1.23', '1.24', '1.25', '1.26', '1.27', '1.28', '1.29', '1.30', '1.31', '2.1', '2.2', '2.3'];
          countOptions.series = [{
            name: '내 회사',
            data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6, 7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
          }, {
            name: '경쟁사 A',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8, 3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
          }, {
            name: '경쟁사 B',
            data: [15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8, 3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8, 3.9, 4.2, 5.7, 8.5, 11.9]
          }];
          break;
        case '월':
          countOptions.xAxis.categories = ['2015.9', '2015.10', '2015.11', '2015.12', '2016.1', '2016.2', '2016.3', '2016.4', '2016.5', '2016.6', '2016.7', '2016.8'];
          countOptions.series = [{
            name: '내 회사',
            data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
          }, {
            name: '경쟁사 A',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
          }, {
            name: '경쟁사 B',
            data: [15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8, 3.9, 4.2, 5.7, 8.5, 11.9]
          }];
          break;
        case '연도':
          countOptions.xAxis.categories = ['2010', '2011', '2012', '2013', '2014', '2015', '2016'];
          countOptions.series = [{
            name: '내 회사',
            data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2]
          }, {
            name: '경쟁사 A',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0]
          }, {
            name: '경쟁사 B',
            data: [15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
          }];
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

    vm.chart(vm.filter);
  }
}());

