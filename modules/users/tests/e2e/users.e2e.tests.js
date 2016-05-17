'use strict';

describe('Users E2E Tests:', function () {
  var user1 = {
    corpCode: '005930',
    displayName: '홍길동',
    email: 'noruya@gmail.com',
    password: 'testtest!09AA'
  };

  var user2 = {
    corpCode: '005931',
    displayName: '이순신',
    email: 'test.user2@meanjs.com',
    password: 'testtest!09AA'
  };

  var signout = function () {
    // Make sure user is signed out first
    browser.get('http://localhost:3001/authentication/signout');
    // Delete all cookies
    browser.driver.manage().deleteAllCookies();
  };

  describe('Signup Validation', function () {
    beforeEach(function () {
      browser.get('/authentication/signup');
    });

    // it('Should report missing email address', function () {
    //   // Enter Corp code
    //   element(by.model('vm.credentials.corpCode')).sendKeys(user1.corpCode);
    //   // Enter display Name
    //   element(by.model('vm.credentials.displayName')).sendKeys(user1.displayName);
    //   // Enter Password
    //   element(by.model('vm.credentials.password')).sendKeys(user1.password);
    //   // Click Submit button
    //   element(by.css('button[type=submit]')).click();
    //   // Email address error
    //   expect(element.all(by.css('.error-text')).get(0).getText()).toBe('이메일주소는 필수입니다.');
    // });
    //
    // it('Should report invalid email address - "123"', function () {
    //   // Enter Corp code
    //   element(by.model('vm.credentials.corpCode')).sendKeys(user1.corpCode);
    //   // Enter display Name
    //   element(by.model('vm.credentials.displayName')).sendKeys(user1.displayName);
    //   // Enter Email
    //   element(by.model('vm.credentials.email')).sendKeys('123');
    //   // Enter Password
    //   element(by.model('vm.credentials.password')).sendKeys(user1.password);
    //   // Click Submit button
    //   element(by.css('button[type=submit]')).click();
    //   // Email address error
    //   expect(element.all(by.css('.error-text')).get(0).getText()).toBe('이메일을 입력하세요');
    // });
    //
    // /**
    //  * Note: 123@123 is a valid email adress according to HTML5.
    //  * However, 123@123@123 is an invalid email address.
    //  */
    // it('Should report invalid email address - "123@123@123"', function () {
    //   // Enter Corp code
    //   element(by.model('vm.credentials.corpCode')).sendKeys(user1.corpCode);
    //   // Enter display Name
    //   element(by.model('vm.credentials.displayName')).sendKeys(user1.displayName);
    //   // Enter Email
    //   element(by.model('vm.credentials.email')).sendKeys('123@123@123');
    //   // Enter Password
    //   element(by.model('vm.credentials.password')).sendKeys(user1.password);
    //   // Click Submit button
    //   element(by.css('button[type=submit]')).click();
    //   // Email address error
    //   expect(element.all(by.css('.error-text')).get(0).getText()).toBe('이메일을 입력하세요');
    // });
    //
    // it('Should report missing corpCode', function () {
    //   // Enter display Name
    //   element(by.model('vm.credentials.displayName')).sendKeys(user1.displayName);
    //   // Enter Email
    //   element(by.model('vm.credentials.email')).sendKeys(user1.email);
    //   // Enter Password
    //   element(by.model('vm.credentials.password')).sendKeys(user1.password);
    //   // Click Submit button
    //   element(by.css('button[type=submit]')).click();
    //   // Username Error
    //   expect(element.all(by.css('.error-text')).get(0).getText()).toBe('상장코드는 필수입니다.');
    // });
    //
    // it('Should report a password with less than 10 characters long - "P@$$w0rd!"', function () {
    //   // Enter Corp code
    //   element(by.model('vm.credentials.corpCode')).sendKeys(user1.corpCode);
    //   // Enter display Name
    //   element(by.model('vm.credentials.displayName')).sendKeys(user1.displayName);
    //   // Enter Email
    //   element(by.model('vm.credentials.email')).sendKeys(user1.email);
    //   // Enter Invalid Password
    //   element(by.model('vm.credentials.password')).sendKeys('P@$$w0rd!');
    //   // Click Submit button
    //   element(by.css('button[type=submit]')).click();
    //   // Password Error
    //   expect(element.all(by.css('.error-text')).get(0).getText()).toBe('암호는 적어도 10자이상 이여야합니다.');
    // });
    //
    // it('Should report a password with greater than 128 characters long.', function () {
    //   // Enter Corp code
    //   element(by.model('vm.credentials.corpCode')).sendKeys(user1.corpCode);
    //   // Enter display Name
    //   element(by.model('vm.credentials.displayName')).sendKeys(user1.displayName);
    //   // Enter Email
    //   element(by.model('vm.credentials.email')).sendKeys(user1.email);
    //   // Enter Invalid Password
    //   element(by.model('vm.credentials.password')).sendKeys(')!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+');
    //   // Click Submit button
    //   element(by.css('button[type=submit]')).click();
    //   // Password Error
    //   expect(element.all(by.css('.error-text')).get(0).getText()).toBe('암호는 128자이내여야합니다.');
    // });
    //
    // it('Should report a password with more than 3 or more repeating characters - "P@$$w0rd!!!"', function () {
    //   // Enter Corp code
    //   element(by.model('vm.credentials.corpCode')).sendKeys(user1.corpCode);
    //   // Enter display Name
    //   element(by.model('vm.credentials.displayName')).sendKeys(user1.displayName);
    //   // Enter Email
    //   element(by.model('vm.credentials.email')).sendKeys(user1.email);
    //   // Enter Invalid Password
    //   element(by.model('vm.credentials.password')).sendKeys('P@$$w0rd!!!');
    //   // Click Submit button
    //   element(by.css('button[type=submit]')).click();
    //   // Password Error
    //   expect(element.all(by.css('.error-text')).get(0).getText()).toBe('암호에 3자이상의 반복되는 문자가 포함되어있습니다.');
    // });
    //
    // it('Should report a password with no uppercase letters - "p@$$w0rd!!"', function () {
    //   // Enter Corp code
    //   element(by.model('vm.credentials.corpCode')).sendKeys(user1.corpCode);
    //   // Enter display Name
    //   element(by.model('vm.credentials.displayName')).sendKeys(user1.displayName);
    //   // Enter Email
    //   element(by.model('vm.credentials.email')).sendKeys(user1.email);
    //   // Enter Invalid Password
    //   element(by.model('vm.credentials.password')).sendKeys('p@$$w0rd!!');
    //   // Click Submit button
    //   element(by.css('button[type=submit]')).click();
    //   // Password Error
    //   expect(element.all(by.css('.error-text')).get(0).getText()).toBe('암호는 적어도 하나의 대문자를 포함해야합니다.');
    // });
    //
    // it('Should report a password with less than one number - "P@$$word!!"', function () {
    //   // Enter Corp code
    //   element(by.model('vm.credentials.corpCode')).sendKeys(user1.corpCode);
    //   // Enter display Name
    //   element(by.model('vm.credentials.displayName')).sendKeys(user1.displayName);
    //   // Enter Email
    //   element(by.model('vm.credentials.email')).sendKeys(user1.email);
    //   // Enter Invalid Password
    //   element(by.model('vm.credentials.password')).sendKeys('P@$$word!!');
    //   // Click Submit button
    //   element(by.css('button[type=submit]')).click();
    //   // Password Error
    //   expect(element.all(by.css('.error-text')).get(0).getText()).toBe('암호는 적어도 하나의 숫자를 포함해야합니다.');
    // });
    //
    // it('Should report a password with less than one special character - "Passw0rdss"', function () {
    //   // Enter Corp code
    //   element(by.model('vm.credentials.corpCode')).sendKeys(user1.corpCode);
    //   // Enter display Name
    //   element(by.model('vm.credentials.displayName')).sendKeys(user1.displayName);
    //   // Enter Email
    //   element(by.model('vm.credentials.email')).sendKeys(user1.email);
    //   // Enter Invalid Password
    //   element(by.model('vm.credentials.password')).sendKeys('Passw0rdss');
    //   // Click Submit button
    //   element(by.css('button[type=submit]')).click();
    //   // Password Error
    //   expect(element.all(by.css('.error-text')).get(0).getText()).toBe('암호는 특수문자를 포함해야합니다.');
    // });

    it('Should Successfully register new user', function () {
      // Enter Corp code
      element(by.model('vm.credentials.corpCode')).sendKeys(user1.corpCode);
      // Enter display Name
      element(by.model('vm.credentials.displayName')).sendKeys(user1.displayName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type="submit"]')).click();

      browser.wait(function () {
        return browser.getCurrentUrl().then(function (url) {
          return /\//.test(url);
        });
      }, 1000);
    });

    it('Should report Email already exists', function () {
      // Make sure user is signed out first
      signout();
      // Signup
      browser.get('http://localhost:3001/authentication/signup');
      // Enter Corp code
      element(by.model('vm.credentials.corpCode')).sendKeys(user1.corpCode);
      // Enter display Name
      element(by.model('vm.credentials.displayName')).sendKeys(user2.displayName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys(user2.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('strong')).get(0).getText()).toBe('Email already exists');
    });
  });

  describe('Signin Validation', function () {

    it('Should report missing credentials', function () {
      // Make sure user is signed out first
      signout();
      // Sign in
      browser.get('http://localhost:3001/authentication/signin');
      // Click Submit button
      element(by.css('button[type="submit"]')).click();
      // Username Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('이메일주소를 입력하세요.');
      // Password Error
      expect(element.all(by.css('.error-text')).get(1).getText()).toBe('암호를 입력하세요.');
    });

    it('Verify that the user is logged in', function () {
      // Make sure user is signed out first
      signout();
      // Sign in
      browser.get('http://localhost:3001/authentication/signin');
      // Enter UserName
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type="submit"]')).click();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/');
    });

  });

  // describe('Change Password Settings Validation', function () {
  //
  //   it('Should report missing passwords', function () {
  //     browser.get('http://localhost:3001/settings/password');
  //     // Click Submit button
  //     element(by.css('button[type=submit]')).click();
  //     // Password Errors
  //     expect(element.all(by.css('.error-text')).get(0).getText()).toBe('현재 암호를 입력하세요.');
  //     expect(element.all(by.css('.error-text')).get(1).getText()).toBe('새 암호를 입력하세요.');
  //     expect(element.all(by.css('.error-text')).get(2).getText()).toBe('확인 암호를 입력하세요.');
  //   });
  //
  //   it('Should report a password with less than 10 characters long - "P@$$w0rd!"', function () {
  //     browser.get('http://localhost:3001/settings/password');
  //     // Enter Current Password
  //     element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
  //     // Enter Invalid Password
  //     element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rd!');
  //     // Click Submit button
  //     element(by.css('button[type=submit]')).click();
  //     // Password Error
  //     expect(element.all(by.css('.error-text')).get(0).getText()).toBe('암호는 적어도 10자 이상 이여야합니다.');
  //   });
  //
  //   it('Should report a password with greater than 128 characters long.', function () {
  //     browser.get('http://localhost:3001/settings/password');
  //     // Enter Current Password
  //     element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
  //     // Enter Invalid Password
  //     element(by.model('vm.passwordDetails.newPassword')).sendKeys(')!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+');
  //     // Click Submit button
  //     element(by.css('button[type=submit]')).click();
  //     // Password Error
  //     expect(element.all(by.css('.error-text')).get(0).getText()).toBe('암호는 128자 이내 이여야합니다.');
  //   });
  //
  //   it('Should report a password with more than 3 or more repeating characters - "P@$$w0rd!!!"', function () {
  //     browser.get('http://localhost:3001/settings/password');
  //     // Enter Current Password
  //     element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
  //     // Enter Invalid Password
  //     element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rd!!!');
  //     // Click Submit button
  //     element(by.css('button[type=submit]')).click();
  //     // Password Error
  //     expect(element.all(by.css('.error-text')).get(0).getText()).toBe('암호에 3자이상의 반복되는 문자가 포함되어있습니다.');
  //   });
  //
  //   it('Should report a password with no uppercase letters - "p@$$w0rd!!"', function () {
  //     browser.get('http://localhost:3001/settings/password');
  //     // Enter Current Password
  //     element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
  //     // Enter Invalid Password
  //     element(by.model('vm.passwordDetails.newPassword')).sendKeys('p@$$w0rd!!');
  //     // Click Submit button
  //     element(by.css('button[type=submit]')).click();
  //     // Password Error
  //     expect(element.all(by.css('.error-text')).get(0).getText()).toBe('암호는 적어도 하나의 대문자를 포함해야합니다.');
  //   });
  //
  //   it('Should report a password with less than one number - "P@$$word!!"', function () {
  //     browser.get('http://localhost:3001/settings/password');
  //     // Enter Current Password
  //     element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
  //     // Enter Invalid Password
  //     element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$word!!');
  //     // Click Submit button
  //     element(by.css('button[type=submit]')).click();
  //     // Password Error
  //     expect(element.all(by.css('.error-text')).get(0).getText()).toBe('암호는 적어도 하나의 숫자를 포함해야합니다.');
  //   });
  //
  //   it('Should report a password with less than one special character - "Passw0rdss"', function () {
  //     browser.get('http://localhost:3001/settings/password');
  //     // Enter Current Password
  //     element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
  //     // Enter Invalid Password
  //     element(by.model('vm.passwordDetails.newPassword')).sendKeys('Passw0rdss');
  //     // Click Submit button
  //     element(by.css('button[type=submit]')).click();
  //     // Password Error
  //     expect(element.all(by.css('.error-text')).get(0).getText()).toBe('암호는 특수문자를 포함해야합니다.');
  //   });
  //
  //   it('Should report passwords do not match', function () {
  //     browser.get('http://localhost:3001/settings/password');
  //     // Enter Current Password
  //     element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
  //     // Enter New Password
  //     element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rds!!');
  //     // Verify New Password
  //     element(by.model('vm.passwordDetails.verifyPassword')).sendKeys(user1.password);
  //     // Click Submit button
  //     element(by.css('button[type=submit]')).click();
  //     // Password Errors
  //     expect(element.all(by.css('.error-text')).get(0).getText()).toBe('암호가 맞지 않습니다.');
  //   });
  //
  //   it('Should change the password to - "P@$$w0rds!!"', function () {
  //     browser.get('http://localhost:3001/settings/password');
  //     // Enter Current Password
  //     element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
  //     // Enter New Password
  //     element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rds!!');
  //     // Verify New Password
  //     element(by.model('vm.passwordDetails.verifyPassword')).sendKeys('P@$$w0rds!!');
  //     // Click Submit button
  //     element(by.css('button[type=submit]')).click();
  //     // Password Changed
  //     expect(element.all(by.css('.text-success')).get(0).getText()).toBe('암호가 변경되었습니다.');
  //   });
  // });
  //
  // describe('Edit Profile tests', function() {
  //
  //   beforeEach(function () {
  //     browser.get('/settings/profile');
  //   });
  //
  //   it('Should success to change displayName', function () {
  //     element(by.model('vm.user.displayName')).sendKeys(user2.displayName);
  //     element(by.css('button[type=submit]')).click();
  //     expect(element.all(by.css('.text-success')).get(0).getText()).toBe('변경내용이 저장되었습니다.');
  //   });
  // });

  describe('Forgot password tests', function () {

    beforeEach(function () {
      signout();
      browser.get('/password/forgot');
    });

    it('Should not be able to send email', function () {
      element(by.model('vm.credentials.email')).sendKeys(user2.email);
      element(by.css('button[type=submit]')).click();
      expect(element.all(by.css('.text-danger')).get(0).getText()).toBe('입력하신 이메일 주소로 가입된 사용자가 없습니다.');
    });

    // it('Should be able to send email', function () {
    //   element(by.model('vm.credentials.email')).sendKeys(user1.email);
    //   element(by.css('button[type=submit]')).click();
    //   browser.wait(function () {
    //     return element.all(by.css('.text-success')).get(0).getText() === '입력하신 이메일 주소로 암호재설정 이메일을 전송하였습니다.';
    //   }, 5000);
    // });
  });
});
