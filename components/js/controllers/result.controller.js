questionApp.controller('resultController', ['$scope', '$routeParams', '$filter', '$location', '$timeout', 'commonConstants', 'commonServices',
    function ($scope, $routeParams, $filter, $location, $timeout, commonConstants, commonServices) {
        var self = $scope;
        self.selectedAnswers = [];
        console.log('inside login controller');
        self.init = function () {
            self.getData();
        };
        self.goBack = function () {
            history.back();
        };
        self.getData = function () {
            commonServices.db().transaction(function (tx) {
                tx.executeSql('SELECT * FROM questions', [], function (tx, res) {
                    console.log(res);
                    var dataFromSQLLite = new Array();
                    var i = 0,
                        count1 = 0, count2 = 0, count0 = 0;
                    while (i < res.rows.length) {
                        if (res.rows.item(i).givenOption == '') {
                            count0++;
                        } else if (res.rows.item(i).givenOption == res.rows.item(i).correctOption) {
                            count1++;
                        } else {
                            count2++;
                        }
                        i++;
                    }
                    self.wrongWidthNo = count2;
                    self.correctWidthNo = count1;
                    self.noAnswersNo = count0;
                    self.wrongWidth = (count2/5)*98.9+"%";
                    self.correctWidth = (count1/5)*98.9+"%";
                    self.noAnswers = (count0/5)*98.9+"%";
//                    return count;
                }, function (error) {});
            });
        }
    }
]);
