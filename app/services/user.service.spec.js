describe('userService', function () {
    var mockUser = userMockData.getMockCurrentUser();
    var $httpFlush;
    var serviceApi = 'api/users/';

    beforeEach(function () {
        bard.appModule('AssortmentOptimization.Services');
        bard.inject(this, '$httpBackend', '$rootScope', 'userService');
    });

    afterEach(function () {
        //$httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        //bard.verifyNoOutstandingHttpRequests();
    });

    it('should be registered', function () {
        expect(userService).not.toEqual(null);
    });

    describe('error handling', function () {
        beforeEach(function () {
            $httpFlush = $httpBackend.flush;
        });

        var deptType = 1;

        //it('should handle an Error with message', function () {
        //    $httpBackend.when('GET', serviceApi + 'currentUser').respond(500, { message: 'bad errors' });
        //    userService.getCurrentUser().catch(function (error) {
        //        expect(error).toEqual('bad errors');
        //    });
        //    $httpFlush();
        //});

        //it('should handle an Error with no message', function () {
        //    $httpBackend.when('GET', serviceApi + 'currentUser').respond(500);
        //    userService.getCurrentUser().catch(function (error) {
        //        expect(error).toMatch(/unknown error/);
        //    });
        //    $httpFlush();
        //});
    });

    describe('getCurrentUser function', function () {
        beforeEach(function () {
            $httpBackend.when('GET', serviceApi + 'currentUser').respond(200, mockUser);
            $httpFlush = $httpBackend.flush;
        });

        it('should exist', function () {
            expect(userService.getCurrentUser).not.toEqual(null);
        });

        it('should contain user account', function (done) {
            userService.getCurrentUser().then(function (data) {
                expect(data.windowsAccountName).toEqual('testuser');
            }).then(done, done);
            $httpFlush();
        });
    });
});