angular.module('MyApp',['$scope','ngMaterial', 'ngMessages', 'material.svgAssetsCache']).controller('AppCtrl', function($scope) {
  $scope.myDate = new Date();
});
