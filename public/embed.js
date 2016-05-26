/**
 * 홈페이지에 올린 기사자료 or 보도자료 목록을 표시하는 임베디드 스크립트
 */

(function () {
  'use strict';

  var d = document,
    xhttp,
    div = d.getElementById(bitpr_config.target);

  // stylesheet
  (function loadStylesheets() {
    var css = d.createElement('link');
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.href = bitpr_config.host + 'css/embed.css';
    (d.head || d.body).appendChild(css);

    css = d.createElement('link');
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.href = bitpr_config.host + 'css/bootstrap.min.css';
    (d.head || d.body).appendChild(css);
  })();

  // Init Ajaxs
  if (window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4 && xhttp.status === 200) {

      var data = JSON.parse(xhttp.responseText);
      if (bitpr_config.type === 'SEARCH')
        displaySearchData(data);
      else if (bitpr_config.type === 'REPORT')
        displayReportData(data);
    }
  };

  if (bitpr_config.type === 'SEARCH') {
    xhttp.open("GET", bitpr_config.host + '/api/displayed-articles/' + bitpr_config.corpCode, true);
  } else {
    xhttp.open("GET", bitpr_config.host + '/api/article-senders/' + bitpr_config.corpCode, true);
  }
  xhttp.send();


  function convertDateFormat(data) {
    data.forEach(function (item) {
      item.created = new Date(item.created).format("yyyy-mm-dd hh:ii:ss");
    });
  }

  /**
   * 기사자료 리스팅
   */
  function displaySearchData(data) {
    convertDateFormat(data);
    var html = '<div class="container-fluid"><div id="articleGroup" class="list-group">';

    data.forEach(function (item) {
      html += '<div class="list-group-item item">\
        <a href="' + item.url + '" target="_blank">\
          <h4 class="list-group-item-heading title">\
            <span>' + item.title + '</span>\
            <span class="media">' + item.media + '</span>\
            <span class="media">' + item.articleAt + '</span>\
          </h4>\
          <div class="list-group-item-text item-summary">' + item.summary + '</div>\
        </a></div>';
    });

    html += '</div></div>';
    div.innerHTML = html;
  }



  /**
   * 보도자료 리스팅
   */
  function displayReportData(data) {
    convertDateFormat(data);

    var html = '<div class="container-fluid"><div id="articleGroup" class="list-group">';
    data.forEach(function (item) {
      item.summary = item.content.summary();
      html += '<div class="list-group-item item" onclick="showHide_bitpr(this)">\
          <h4 class="list-group-item-heading title">\
            <span>' + item.title + '</span>\
            <span class="media">' + item.created + '</span>\
          </h4>\
          <div class="list-group-item-text item-summary">' + item.summary + '</div>\
          <div class="list-group-item-text item-content-none">' + item.content + '</div>\
        </div>';
    });

    html += '</div></div>';
    div.innerHTML = html;
  }

  // len만큼 요약된 문자열 반환
  String.prototype.summary = function(len) {
    function stripHTML(html)
    {
      var tmp = document.implementation.createHTMLDocument("New").body;
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    }
    return stripHTML(this.substring(0, len || 200)) + '...';
  };

  Date.prototype.format = function(format) {
    var yyyy = this.getFullYear().toString();
    format = format.replace(/yyyy/g, yyyy)
    var mm = (this.getMonth()+1).toString();
    format = format.replace(/mm/g, (mm[1]?mm:"0"+mm[0]));
    var dd  = this.getDate().toString();
    format = format.replace(/dd/g, (dd[1]?dd:"0"+dd[0]));
    var hh = this.getHours().toString();
    format = format.replace(/hh/g, (hh[1]?hh:"0"+hh[0]));
    var ii = this.getMinutes().toString();
    format = format.replace(/ii/g, (ii[1]?ii:"0"+ii[0]));
    var ss  = this.getSeconds().toString();
    format = format.replace(/ss/g, (ss[1]?ss:"0"+ss[0]));
    return format;
  };
}());

function showHide_bitpr(obj) {
  var c = obj.getElementsByClassName('item-content-none');
  c[0].style.display = (c[0].style.display === 'block') ? 'none' : 'block';

  var s = obj.getElementsByClassName('item-summary');
  s[0].style.display = (c[0].style.display === 'block') ? 'none' : 'block';
}

