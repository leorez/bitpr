(function () {
  'use strict';
  var passport = require('passport'),
    KakaoStrategy = require('passport-kakao').Strategy,
    users = require('../../controllers/users.server.controller');

  module.exports = function (config) {
    passport.use(new KakaoStrategy({
      clientID: config.kakao.clientID,
      callbackURL: config.kakao.callbackURL
    },
    function (req, accessToken, refreshToken, profile, done) {
      // 사용자의 정보는 profile에 들어있다.
      console.log(profile);
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      var providerUserProfile = {
        displayName: profile.username,
        email: profile.emails ? profile.emails[0].value : undefined,
        username: profile.id || generateUsername(profile),
        profileImageURL: providerData.properties.profile_image,
        provider: 'kakao',
        providerIdentifierField: 'id',
        providerData: providerData
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);

      function generateUsername(profile) {
        var username = '';

        if (profile.emails) {
          username = profile.emails[0].value.split('@')[0];
        } else if (profile.name) {
          username = profile.name.givenName[0] + profile.name.familyName;
        }

        return username.toLowerCase() || undefined;
      }
    }
    ));
  };

}());

