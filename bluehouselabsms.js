/**
 * Created by noruya on 16. 5. 13.
 */
'use strict';
var https = require("https"),
  chalk = require('chalk');

var conf = {
  "APPID" : "bitpr",
  "APIKEY" : "11aca76618e311e6bca70cc47a1fcfae"
};
var credential = 'Basic '+new Buffer(conf.APPID+':'+conf.APIKEY).toString('base64');

exports.send = function (options, callback) {
  // console.log(chalk.green('Vitual Send SMS ' + JSON.stringify(options)));
  // callback();
  // return;

  var data = {
    "sender"     : options.SENDER,
    "receivers"  : options.RECEIVERS,
    "content"    : options.CONTENT
  };

  var body = JSON.stringify(data);

  var httpsOptions = {
    host: 'api.bluehouselab.com',
    port: 443,
    path: '/smscenter/v1.0/sendsms',
    headers: {
      'Authorization': credential,
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body)
    },
    method: 'POST'
  };

  var req = https.request(httpsOptions, function(res) {
    console.log(res.statusCode);
    var body = "";
    res.on('data', function(d) {
      body += d;
    });
    res.on('end', function(d) {
      if(res.statusCode==200)
        console.log(JSON.parse(body));
      else
        console.log(body);
      callback();
    });
  });

  req.write(body);
  req.end();
  req.on('error', function(e) {
    console.error(e);
    callback(e);
  });
};
