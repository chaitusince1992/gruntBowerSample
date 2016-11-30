

//-----------------------------------------------
var questionApp = angular.module('questionApp', ['ngRoute','ngAnimate']);

//-----------------------------------------------
questionApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/enterName', {
            templateUrl: 'view/enterName.template.html',
            controller: 'enterNameController'
        })
        .when('/', {
            templateUrl: 'view/enterName.template.html',
            controller: 'enterNameController'
        })
        .when('/questions/:questionNo', {
            templateUrl: 'view/questions.template.html',
            controller: 'questionsController'
        })
        .when('/result', {
            templateUrl: 'view/result.template.html',
            controller: 'resultController'
        })
        .when('/answers/:questionNo', {
            templateUrl: 'view/answers.template.html',
            controller: 'answersController'
        })
        .when('/thankyou', {
            templateUrl: 'view/thankyou.template.html',
            controller: 'thankyouController'
        })
        .otherwise("/", {
            url: '/enterName'
        })
}]);


//-----------------------------------------------
questionApp.run(['commonServices', function (commonServices) {
    console.log('inside run method');
    commonServices.preloadDataBase().then(function(result) {
        console.log(result);
    }, function(res) {
        console.log(res);
    });
}]);


//-----------------------------------------------
questionApp.constant('commonConstants', ({
        dbName: 'questions',
        sqliteDatabase: {
            createTableQueries: [
                'CREATE IF NOT EXIST'
            ]
        }
}));


//-----------------------------------------------
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


//-----------------------------------------------
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


//-----------------------------------------------
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


//-----------------------------------------------
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


//-----------------------------------------------
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


//-----------------------------------------------
questionApp.directive('checkForOption', function () {
    return {
        link: function (scope, elements, attributes) {
            console.log(scope, elements, attributes);
            if(elements[0].style.background == 'rgb(76, 220, 76)') {
                elements[0].children[1].children[0].checked = true;
            }
        }
    }
});


//-----------------------------------------------
questionApp.service('commonServices', ['commonConstants','$q', function (commonConstants,$q) {
    var _db;
    self = this;
    self.db = function() {
        _db = window.openDatabase(commonConstants.dbName, "1.0", "Questions", 200000);
        window.db = _db;
//        console.log(_db);
        return _db;
    };
    
    self.preloadDataBase = function() {
        var deferred = $q.defer();
        self.db().transaction(function(tx) {
            var queries = 'CREATE TABLE IF NOT EXISTS questions (srNo integer primary key, questionText varchar, option1 varchar, option2 varchar, option3 varchar, option4 varchar, correctOption varchar, givenOption varchar)';
//            var queries = 'DROP TABLE questions';
            tx.executeSql(queries);
        }, function(error) {
            deferred.reject(error);
        }, function(msg) {
            deferred.resolve('Completing the creation of the database');
            self.insertRowsQuery();
        });
        return deferred.promise;
    };
    
    self.insertRowsQuery = function() {
        self.db().transaction(function(tx) {
            console.log(tx);
            var insertHead = "INSERT OR REPLACE INTO questions(srNo, questionText, option1, option2, option3, option4, correctOption, givenOption) VALUES (?,?,?,?,?,?,?,?)"
            tx.executeSql(insertHead, [1,'When did india won the world cup?','2007','2008','2010','2011','1,4','']);
            tx.executeSql(insertHead, [2,'Author of "Who will cry when you die?"','Rahul Sharma','Robin Sharma','Rohit Sharma','Abhishek Sharma','2','']);
            tx.executeSql(insertHead, [3,'Who won the silver medal in 2016 olympics for India?','P.V.Sindhu','Dipa Karmakar','Sakshi Malik','Pullela Gopichand','1','']);
            tx.executeSql(insertHead, [4,'Why did Kattappa killed Baahubali?','Kattappa hates Baahubali','Baahubali loved Devasena','Baallaladeva told Kattappa to do so','Hypothetical question!','4','']);
            tx.executeSql(insertHead, [5,'Why are you answering these questions?','To check my knowledge','To assess your knowledge','To recruit','To have fun','3','']);
        },function(data) {
            console.log(data);
        },function(data) {
            console.log(data);
        });
    };
    self.insertAnswers = function(answer, srNo) {
        self.db().transaction(function(tx) {
            console.log(tx);
            tx.executeSql("UPDATE questions SET givenOption = ? where srNo = ?", [answer, srNo]);
        },function(data) {
            console.log(data);
        },function(data) {
            console.log(data);
        });
    };
    self.selectAll = function() {
        var deferred = $q.defer();
        self.db().transaction(function(tx) {
            console.log(tx);
            tx.executeSql('SELECT * FROM questions', [],function(tx, res) {
                console.log(res);
                var dataFromSQLLite = new Array();
                var i = 0;
                while (i < res.rows.length) {
                    dataFromSQLLite[i] = res.rows.item(i);
                    i++;
                }
                console.log(dataFromSQLLite);
                deferred.resolve(dataFromSQLLite);
            },function(error) {
                console.log(error); 
                deferred.reject(error);
            });
        },function(err) {
        },function(res) {
        });        
        return deferred.promise;
    };
    self.selectRowsQuery = function(id) {
        var deferred = $q.defer();
        self.db().transaction(function(tx) {
            console.log(tx);
            tx.executeSql('SELECT * FROM questions where srNo = ?', [id],function(tx, res) {
                console.log(res);
                var dataFromSQLLite = new Array();
                var i = 0;
                while (i < res.rows.length) {
                    dataFromSQLLite[i] = res.rows.item(i);
                    i++;
                }
                console.log(dataFromSQLLite);
                deferred.resolve(dataFromSQLLite);
            },function(error) {
                console.log(error); 
                deferred.reject(error);
            });
        },function(err) {
        },function(res) {
        });        
        return deferred.promise;
    };
    self.farmatOptionsData = function(data) {
        var formatedData = new Object();
        formatedData["srNo"] = data.srNo;
        formatedData["questionText"] = data.questionText;
        formatedData["correctOption"] = data.correctOption;
        formatedData["givenOption"] = data.givenOption;
        var optionsArray = new Array();
        optionsArray.push({
            id:1,
            option:data.option1
        });
        optionsArray.push({
            id:2,
            option:data.option2
        });
        optionsArray.push({
            id:3,
            option:data.option3
        });
        optionsArray.push({
            id:4,
            option:data.option4
        });
        formatedData["options"] = optionsArray;
        return formatedData;
    };
}]);
