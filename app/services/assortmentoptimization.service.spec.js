describe("AssortmentoptimizationService", function () {

    var mockAssortment = assortmentMockData.getMockAssortments();

    beforeEach(function () {
        bard.appModule('AssortmentOptimization.Services');
        bard.inject(this, '$httpBackend', '$rootScope', 'AssortmentoptimizationService');
    });

    afterEach(function () {
        //$httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        //bard.verifyNoOutstandingHttpRequests();
    });

    it('should be registered', function () {
        expect(AssortmentoptimizationService).not.toEqual(null);
    });

    it("says Hello", function () {
        expect(AssortmentoptimizationService.helloWorld()).toEqual("Hello World");
    });

    describe('error handling', function () {

        beforeEach(function () {
            $httpFlush = $httpBackend.flush;
        });

        it('should handle an Error with message', function () {
            $httpBackend.when('GET', './api/assortmentAnalysis/').respond(500, { message: 'bad errors' });
            AssortmentoptimizationService.getAssortments().catch(function (error) {
                console.log(error);
                expect(error).toEqual('bad errors');
            });
            $httpFlush();
        });

        it('should handle an Error with no message', function () {
            $httpBackend.when('GET', './api/assortmentAnalysis/').respond(500);
            AssortmentoptimizationService.getAssortments().catch(function (error) {
                console.log(error);
                expect(error).toMatch(/unknown error/);
            });
            $httpFlush();
        });

    });

    describe('getCurrentUser function', function () {
        beforeEach(function () {
            $httpBackend.when('GET', './api/assortmentAnalysis/').respond(200, mockAssortment);
            $httpFlush = $httpBackend.flush;
        });

        it('should exist', function () {
            expect(AssortmentoptimizationService.getAssortments).not.toEqual(null);
        });

        it('should contain user account', function (done) {
            AssortmentoptimizationService.getAssortments().then(function (data) {
                expect(data.name).toEqual('Test Assortment');
            }).then(done, done);
            $httpFlush();
        });
    });
});