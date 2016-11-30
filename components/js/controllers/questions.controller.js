questionApp.controller('questionsController', ['$scope', '$routeParams', '$filter', '$location', '$timeout', 'commonConstants', 'commonServices',
    function ($scope, $routeParams, $filter, $location, $timeout, commonConstants, commonServices) {
        var self = $scope;
        var id;
        self.selectedAnswers = [];
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
        self.checkForLastAnswer = function(givenOption, optionId) {
            console.log(givenOption, optionId);
            if(givenOption == '') {
                return '';
            } else {
                var optionsToBind = givenOption.split(',');
                if(givenOption.split(',').indexOf(String(optionId)) == -1) {
                    return '';
                } else {
                    return '#4cdc4c';
                }
            }
        };
        self.clickedOnOption = function ($event, option) {
            //            console.log($event);
            console.log($event.currentTarget.children[1].children[0].checked);
            var toColor;
            var elem = $event.currentTarget.children[0];
            if ($event.currentTarget.children[1].children[0].checked == true) {
                console.log("checked checked");
                toColor = '#4cdc4c'; //green
                self.selectedAnswers.push(option);
                self.selectedAnswers = $filter('orderBy')(self.selectedAnswers, 'id', false);
                //                console.log(self.selectedAnswers);
            } else if ($event.currentTarget.children[1].children[0].checked == false) {
                console.log("not checked");
                toColor = '#b3adaa'; //grey
                for (i = 0; i < self.selectedAnswers.length; i++) {
                    if (self.selectedAnswers[i].id == option.id) {
                        self.selectedAnswers.splice(i, 1)
                    }
                }
            }
            elem.style.background = toColor;
            var top = 0;
            var left = 0;
            var width = 0;
            var height = 0;
            id = setInterval(frame, 1);

            function frame() {
                if (width >= 1000) {
                    clearInterval(id);
                    elem.style.width = '0px';
                    elem.style.height = '0px';
                    elem.style.top = '0px';
                    elem.style.left = '0px';
                    $event.currentTarget.style.background = toColor;
                } else {
                    width += 5;
                    height += 5;
                    top = $event.offsetY - $(elem).height() / 2;
                    left = $event.offsetX - $(elem).width() / 2
                    elem.style.width = width + 'px';
                    elem.style.height = height + 'px';
                    elem.style.top = top + 'px';
                    elem.style.left = left + 'px';
                }
            }
        };
        self.goToNextQuestionOrEndTest = function () {
            console.log(self.selectedAnswers);
            var stringToSent = '';
            for (i = 0; i < self.selectedAnswers.length; i++) {
                if (i == self.selectedAnswers.length - 1)
                    stringToSent = stringToSent + self.selectedAnswers[i].id;
                else
                    stringToSent = stringToSent + self.selectedAnswers[i].id + ','

            }
            commonServices.insertAnswers(stringToSent, self.parameters.questionNo);
            if (self.parameters.questionNo < 5) {
                var goTo = Number(self.parameters.questionNo) + 1;
                $location.path("questions/" + goTo);
            } else {
                console.log("go to result");
                $location.path("result");
            }
        };
    }
]);
