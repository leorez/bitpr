/**
 * Created by noruya on 16. 5. 13.
 */
'use strict';

var sms = require('./bluehouselabsms');

var sendOptions = {
  "CONTENT" : "비트피알(BITPR) SMS 테스트입니다.",
  "SENDER" : "01021873886",
  "RECEIVERS" : ["01021873886"]
};

sms.send(sendOptions, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('success send sms : ' + JSON.stringify(sendOptions));
  }
});
