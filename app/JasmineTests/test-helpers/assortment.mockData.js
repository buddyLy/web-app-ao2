var assortmentMockData = (function () {
    return {
        getMockAssortments: getMockAssortments
    };

    function getMockAssortments() {
        return {
            id: 1,
            name: "Test Assortment",
            department: 9,
            creator: "Test User",
            status: "Done"
        };
    }
})();