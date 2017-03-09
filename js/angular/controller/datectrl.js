var app = angular.module('MyApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

app.controller('AppCtrl', function() {
  this.myDate = new Date('01/01/2008');
});


app.controller('drop', function($scope) {
    $scope.names = ["Emil", "Tobias", "Linus"];
});

app.controller("calendarCtrl", function($scope, $filter, $http, $q) {


});
