questionApp.controller('thankyouController', ['$scope', '$rootScope','$routeParams', '$filter', '$location', '$timeout', 'commonConstants', 'commonServices',
    function ($scope, $rootScope,$routeParams, $filter, $location, $timeout, commonConstants, commonServices) {
        var self = $scope;
        self.selectedAnswers = [];
        console.log('inside login controller');
        self.init = function () {
            self.userName = $rootScope.userName;
        };
        self.goBack = function () {
            history.back();
        };
    }
]);
