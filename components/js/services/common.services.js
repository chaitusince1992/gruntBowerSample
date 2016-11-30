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
