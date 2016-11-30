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
