(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$scope'];

  function DashboardController($scope) {
    var vm = this;
    /* eslint-disable */
    Highcharts.chart('news-count', {
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
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
      series: [{
        name: '내 회사',
        data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
      }, {
        name: '경쟁사 A',
        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
      }, {
        name: '경쟁사 B',
        data: [15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8, 3.9, 4.2, 5.7, 8.5, 11.9]
      }]
    });

    // eslint-disable-next-line no-use-before-define
    Highcharts.chart('news-percent', {
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
      series: [{
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
      }]
    });
    /* eslint-disable */
  }
}());

