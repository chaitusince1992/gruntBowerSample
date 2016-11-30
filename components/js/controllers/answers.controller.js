questionApp.controller('answersController', ['$scope', '$routeParams', '$sce', '$location', '$timeout', 'commonConstants', 'commonServices',
    function ($scope, $routeParams, $sce, $location, $timeout, commonConstants, commonServices) {
        var self = $scope;
        var id;
        console.log('inside login controller');
        self.init = function () {
            console.log($routeParams.questionNo);
            self.parameters = $routeParams;
            commonServices.selectRowsQuery(self.parameters.questionNo).then(function (result) {
                console.log(result);
                self.questionInformation = commonServices.farmatOptionsData(result[0]);
            }, function () {

            });
        };
        self.goBack = function () {
            history.back();
        };
        self.goToNextQuestionOrEndTest = function () {
            if (self.parameters.questionNo < 5) {
                var goTo = Number(self.parameters.questionNo) + 1;
                $location.path("answers/" + goTo);
            } else {
                console.log("go to result");3
                $location.path("thankyou");
            }
        };
        self.correctOrWrongColor = function (info, option) {
            //            console.log(info);
            var givenOptions = info.givenOption.split(',');
            var correctOptions = info.correctOption.split(',');
            if (correctOptions.indexOf(String(option.id)) == -1) {
                if(givenOptions.indexOf(String(option.id)) == -1) {
                    return 'grey';
                } else {
                    return 'red';
                }
            } else {
                return 'green';
            }
        };
        self.correctOrWrongSymbol = function (info, option) {
            //            console.log(info);
            var givenOptions = info.givenOption.split(',');
            var correctOptions = info.correctOption.split(',');
            if (givenOptions.indexOf(String(option.id)) == -1) {
                return '';
            } else {
                var indexOfOption = correctOptions.indexOf(String(option.id));
                console.log(indexOfOption);
                if (indexOfOption == -1) {
                    return $sce.trustAsHtml('&#10006;');
                } else {
                    return $sce.trustAsHtml('&#10004;');
                }
            }
        };
    }
]);
