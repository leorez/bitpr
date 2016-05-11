'use strict';

(function () {
  // Article senders Controller Spec
  describe('Article senders Controller Tests', function () {
    // Initialize global variables
    var ArticleSendersController,
      ArticleSendersService,
      scope,
      $httpBackend,
      $stateParams,
      $location;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _ArticleSendersService_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      ArticleSendersService = _ArticleSendersService_;

      // Initialize the Article senders controller.
      ArticleSendersController = $controller('ArticleSendersController', {
        $scope: scope,
        articleSenderResolve: {}
      });
    }));

    it('$scope.vm.bill() with valid form data and user input content should send success', inject(function (ArticleSendersService) {

      var sampleRequest = new ArticleSendersService({
        title: '발송자료 테스트 제목',
        content: '발송자로 테스트 내용',
        reserveTime: 1,
        beToDart: true,
        sendCount: 1,
        fare: 5000000
      });

      var sampleResponse = new ArticleSendersService({
        _id: '525cf20451979dea2c000001',
        title: '발송자료 테스트 제목',
        content: '발송자로 테스트 내용',
        reserveTime: 1,
        beToDart: true,
        sendCount: 1,
        fare: 5000000
      });

      scope.vm.title = '발송자료 테스트 제목';
      scope.vm.content = '발송자로 테스트 내용';
      scope.vm.reserveTime = 1;
      scope.vm.beToDart = true;
      scope.vm.sendCount = 1;
      scope.vm.fare = 5000000;

      $httpBackend.expectPOST('article-senders', sampleRequest).respond(sampleResponse);

      scope.vm.bill();
      $httpBackend.flush();

      expect(scope.vm.fare).toEqual(5000000);
    }));

    it('$scope.vm.findOne() should get one articleSender', inject(function (ArticleSendersService) {
      var sample = new ArticleSendersService({
        title: 'An ArticleSender',
        content: 'ArticleSender Content',
        reserveTime: 1,
        beToDart: true,
        sendCount: 1,
        fare: 5000000
      });

      $stateParams.articleSenderId = '525a8422f6d0f87f0e407a33';

      $httpBackend.expectGET(/article-senders\/([0-9a-fA-F]{24})$/).respond(sample);

      scope.vm.findOne();
      $httpBackend.flush();

      expect(scope.vm.articleSender).toEqualData(sample);
    }));

    it('$scope.vm.find() should get list', inject(function (ArticleSendersService) {
      var sample = new ArticleSendersService({
        title: 'An ArticleSender',
        content: 'ArticleSender Content',
        reserveTime: 1,
        beToDart: true,
        sendCount: 1,
        fare: 5000000
      });

      var samples = [sample];

      $httpBackend.expectGET('article-senders').respond(samples);

      scope.vm.find();
      $httpBackend.flush();

      expect(scope.vm.articleSenders).toEqualData(samples);
    }));

    it('$scope.vm.update() should update a valid articleSender', inject(function (ArticleSendersService) {
      var sample = new ArticleSendersService({
        _id: '525cf20451979dea2c000001',
        title: 'An ArticleSender',
        content: 'ArticleSender Content',
        reserveTime: 1,
        beToDart: true,
        sendCount: 1,
        fare: 5000000
      });

      scope.vm.articleSender = sample;

      $httpBackend.expectPUT(/article-senders\/[0-9a-fA-F]{24}$/).respond();

      scope.vm.update();
      $httpBackend.flush();

      expect($location.path()).toBe('/article-senders/' + sample._id);
    }));

    it('$scope.vm.remove() should send a DELETE request with a valid articleSenderId and remove the articleSender', inject(function (ArticleSendersService) {
      var sample = new ArticleSendersService({
        _id: '525cf20451979dea2c000001',
        title: 'An ArticleSender',
        content: 'ArticleSender Content',
        reserveTime: 1,
        beToDart: true,
        sendCount: 1,
        fare: 5000000
      });

      scope.vm.articleSender = [sample];

      $httpBackend.expectDELETE(/article-senders\/([0-9a-fA-F]{24})$/).respond(204);

      scope.vm.remove(sample);
      $httpBackend.flush();

      expect(scope.vm.articleSender.length).toBe(0);
    }));

  });
}());
