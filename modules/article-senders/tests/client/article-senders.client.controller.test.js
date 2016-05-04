'use strict';

(function() {
	// Article senders Controller Spec
	describe('Article senders Controller Tests', function() {
		// Initialize global variables
		var ArticleSendersController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Article senders controller.
			ArticleSendersController = $controller('ArticleSendersController', {
				$scope: scope
			});
		}));

		it('$scope.bill() with valid form data and user input content should send success', inject(function(ArticleSenders) {

			var sampleRequest = new ArticleSenders({
				title: '발송자료 테스트 제목',
				content: '발송자로 테스트 내용',
				reserveTime: 1,
				beToDart: true,
				sendCount: 1,
				fare: 5000000
			});

			var sampleResponse = new ArticleSenders({
				_id: '525cf20451979dea2c000001',
				title: '발송자료 테스트 제목',
				content: '발송자로 테스트 내용',
				reserveTime: 1,
				beToDart: true,
				sendCount: 1,
				fare: 5000000
			});

			scope.title = '발송자료 테스트 제목';
			scope.content = '발송자로 테스트 내용';
			scope.reserveTime = 1;
			scope.beToDart = true;
			scope.sendCount = 1;
			scope.fare = 5000000;
			
			$httpBackend.expectPOST('article-senders', sampleRequest).respond(sampleResponse);

			scope.bill();
			$httpBackend.flush();

			expect(scope.fare).toEqual(5000000);
		}));

		it('$scope.findOne() should get one articleSender', inject(function(ArticleSenders) {
			var sample = new ArticleSenders({
				title: 'An ArticleSender',
				content: 'ArticleSender Content',
				reserveTime: 1,
				beToDart: true,
				sendCount: 1,
				fare: 5000000
			});

			$stateParams.articleSenderId = '525a8422f6d0f87f0e407a33';

			$httpBackend.expectGET(/article-senders\/([0-9a-fA-F]{24})$/).respond(sample);

			scope.findOne();
			$httpBackend.flush();

			expect(scope.articleSender).toEqualData(sample);
		}));

		it('$scope.find() should get list', inject(function(ArticleSenders){
			var sample = new ArticleSenders({
				title: 'An ArticleSender',
				content: 'ArticleSender Content',
				reserveTime: 1,
				beToDart: true,
				sendCount: 1,
				fare: 5000000
			});

			var samples = [sample];

			$httpBackend.expectGET('article-senders').respond(samples);

			scope.find();
			$httpBackend.flush();

			expect(scope.articleSenders).toEqualData(samples);
		}));

		it('$scope.update() should update a valid articleSender', inject(function(ArticleSenders) {
			var sample = new ArticleSenders({
				_id: '525cf20451979dea2c000001',
				title: 'An ArticleSender',
				content: 'ArticleSender Content',
				reserveTime: 1,
				beToDart: true,
				sendCount: 1,
				fare: 5000000
			});

			scope.articleSender = sample;

			$httpBackend.expectPUT(/article-senders\/[0-9a-fA-F]{24}$/).respond();

			scope.update();
			$httpBackend.flush();

			expect($location.path()).toBe('/article-senders/' + sample._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid articleSenderId and remove the articleSender', inject(function(ArticleSenders) {
			var sample = new ArticleSenders({
				_id: '525cf20451979dea2c000001',
				title: 'An ArticleSender',
				content: 'ArticleSender Content',
				reserveTime: 1,
				beToDart: true,
				sendCount: 1,
				fare: 5000000
			});

			scope.articleSenders = [sample];

			$httpBackend.expectDELETE(/article-senders\/([0-9a-fA-F]{24})$/).respond(204);

			scope.remove(sample);
			$httpBackend.flush();

			expect(scope.articleSenders.length).toBe(0);
		}));

	});
}());
