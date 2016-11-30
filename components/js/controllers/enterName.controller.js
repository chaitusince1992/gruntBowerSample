questionApp.controller('enterNameController', ['$scope', '$rootScope','$location','commonConstants', 'commonServices',
    function ($scope,$rootScope,$location, commonConstants, commonServices) {
        var self = $scope;
        console.log('inside login controller');
        self.init = function () {
        };
        self.submitUserName = function() {
            console.log(self.userName);
            $rootScope.userName = self.userName;
        };
        self.submitButtonForAnimation = function($event) {
            console.log(self.userName);
            if(self.userName == '' || self.userName == null) {
                alert("Please enter name to proceed with the Quiz!!");
            } else {
                $location.path("questions/1");
            }
        };
    }
]);
