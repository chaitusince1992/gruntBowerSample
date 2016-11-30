questionApp.run(['commonServices', function (commonServices) {
    console.log('inside run method');
    commonServices.preloadDataBase().then(function(result) {
        console.log(result);
    }, function(res) {
        console.log(res);
    });
}]);
