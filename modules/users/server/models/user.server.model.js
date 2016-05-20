'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    lowercase: true,
    trim: true,
    default: '',
    required: '이메일주소는 필수입니다.',
    validate: [validateLocalStrategyEmail, '형식에 맞지않는 이메일 주소입니다.']
  },
  emailConfirmed: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    default: ''
  },
  salt: {
    type: String
  },
  profileImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user'],
    required: 'Please provide at least one role'
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  /* 키워드 2개이상일때 ','로 구분하여 저장한다. */
  keywords: {
    type: String,
    default: ''
  },
  /* 뉴스 수집시간 데이타 오류를 최소화 하기위해 숫자형으로 기록하고 사용시 Datetime으로 변환하여 사용*/
  crawlTimeHour: {
    type: Number,
    max: 23
  },
  crawlTimeMinutes: {
    type: Number,
    max: 50
  },
  enabledCrawler: {
    type: Boolean,
    default: true
  },
  /* 기업 상장코드 */
  corpCode: {
    type: String,
    default: '',
    unique: '이미 존재하는 상장코드입니다.',
    required: '상장코드는 필수입니다.',
    trim: true
  },
  corpName: {
    type: String,
    default: '',
    trim: true
  },
  telephone: {
    type: String,
    default: '',
    trim: true
  },
  cellphone: {
    type: String,
    default: '',
    trim: true
  }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
    console.log('pre save password: ' + this.password);
  }

  next();
});

/**
 * Hook a pre validate method to test the local password
 */
UserSchema.pre('validate', function (next) {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    var result = owasp.test(this.password);
    if (result.errors.length) {
      var error = result.errors.join(' ');
      this.invalidate('password', error);
    }
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  console.log('hashed: ' + this.hashPassword(password));
  return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
// UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
//   var _this = this;
//   var possibleUsername = username.toLowerCase() + (suffix || '');
//
//   _this.findOne({
//     username: possibleUsername
//   }, function (err, user) {
//     if (!err) {
//       if (!user) {
//         callback(possibleUsername);
//       } else {
//         return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
//       }
//     } else {
//       callback(null);
//     }
//   });
// };

/**
* Generates a random passphrase that passes the owasp test
* Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
* NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
*/
UserSchema.statics.generateRandomPassphrase = function () {
  return new Promise(function (resolve, reject) {
    var password = '';
    var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    // iterate until the we have a valid passphrase
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
    while (password.length < 20 || repeatingCharacters.test(password)) {
      // build the random password
      password = generatePassword.generate({
        length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true
      });

      // check if we need to remove any repeating characters
      password = password.replace(repeatingCharacters, '');
    }

    // Send the rejection back if the passphrase fails to pass the strength test
    if (owasp.test(password).errors.length) {
      reject(new Error('An unexpected problem occured while generating the random passphrase'));
    } else {
      // resolve with the validated passphrase
      resolve(password);
    }
  });
};

mongoose.model('User', UserSchema);
