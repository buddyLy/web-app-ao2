var userMockData = (function () {
    return {
        getMockCurrentUser: getMockCurrentUser
    };

    function getMockCurrentUser() {
        return {
            displayName: "Test User",
            division: 0,
            domain: "homeoffice",
            email: "test.user@walmart.com",
            givenName: "Test",
            postalCode: "72716",
            stateOrProvince: "AR",
            streetAddress: "805 Moberly Lane",
            surName: "User",
            upn: "testuser@homeoffice.wal-mart.com",
            windowsAccountName: "testuser"
        };
    }
})();
