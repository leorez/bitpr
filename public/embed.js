/**
 * 홈페이지에 올린 기사자료 목록을 표시하는 임베디드 스크립트
 */
(function () {
  'use strict';

  var d = document,
    xhttp,
    div = d.getElementById("bitpr_thread");

  // stylesheet
  (function loadStylesheets() {
    var css = d.createElement('link');
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.href = 'css/embed.css';
    (d.head || d.body).appendChild(css);

    css = d.createElement('link');
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.href = 'css/bootstrap.min.css';
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
      displayData(data);
    }
  };

  xhttp.open("GET", '/api/displayed-articles/' + bitpr_config.corpCode, true);
  xhttp.send();

  /**
   * 기사자료 리스팅
   */
  function displayData(data) {
    var html = '<div class="container-fluid"><div id="articleGroup" class="list-group">';

    data.forEach(function (item) {
      html += '<div class="list-group-item item">\
    <a href="' + item.url + '" target="_blank">\
      <h4 class="list-group-item-heading title">\
        <span>' + item.title + '</span>\
        <span class="media">' + item.media + '</span>\
        <span class="media">' + item.articleAt + '</span>\
      </h4>\
      <p class="list-group-item-text item-summary">' + item.summary + '</p>\
    </a></div>';
    });

    html += '</div></div>';
    div.innerHTML = html;
  }

}());

