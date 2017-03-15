var app = angular.module('MyApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'materialCalendar'])

var holiday = {};
var t = 1;
var data ={};

app.controller('AppCtrl', function() {
  this.myDate = new Date('01/01/2008');
});


app.controller('startCalen', function($scope, $filter, $http, $q){
  var vm =  this;

  //vm.day = moment();
  vm.myDate = new Date('01/01/2008');

  this.minDate = new Date(
    vm.myDate.getFullYear(),
    vm.myDate.getMonth() - 0,
    vm.myDate.getDate()
  );

  this.maxDate = new Date(
    this.myDate.getFullYear(),
    this.myDate.getMonth() + 11,
    this.myDate.getDate()
  );

  vm.subm = function(){

    var day = vm.myDate.getDate();
    var month = vm.myDate.getMonth();
    var numDay = parseInt(vm.days);
    data = {
      "day": day,
      "month": month,
      "days": numDay,
      "code": vm.code,
    }
    vm.calendar = true;

    console.log(data);
    holiday = api();
    fApi();
    //Api controller
    function api(){
      j().then(function(resp){
        console.log(resp);
       return resp;
    })
    .catch(function(resp){
      console.log(resp);
    });
  };

    //Api promise
      function j (){
      var key = "68695711-db64-4a44-9eb2-1eeffaae5afb";
      var country = data.code;
      var year = "2008";
      url = "https://holidayapi.com/v1/holidays?key="+key+"&country="+country+"&year="+year;
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: url,
        data: data
      }).success(function(data, status){
        deferred.resolve(data);
      })
      .error(function(data, status){
        deferred.reject(data);
      });

      return deferred.promise;
    };


    holiday = vm.holiday;
  }
});

//Api function to get only the days for the necessary months.

function fApi(){
  var months = calendars();
}


//how many months need to show
function calendars() {
  var m = data.month;
  var mo = data.day + data.days;
  var count=0;
  var b = true;
  for (var i = 0; i < 12; i++)
  {
    if(m == 0 || m == 2 || m == 4 || m == 6 || m == 7 || m == 9 || m == 11){
      treintayuno(mo);
    }

    if(m == 0 || m == 2 || m == 4 || m == 6 || m == 7 || m == 9 || m == 11){
      treita();
    }

    if(m ==1){
      febrary();
    }
    if(mo <= 0){
      break;
    }
  }
  console.log(t);
  return t;

  function treintayuno(){
      if(mo > 31){
        mo = mo-31;
        t++;
        m++;
      }
      if(mo<31){
        mo = 0;
      }
  }

  function treita(){
      if(mo > 30){
        mo = mo-30;
        t++;
        m++;
      }
      if(mo<31){
        mo = 0;
      }
  }

  function febrary(){
      if(mo > 28){
        mo = mo-28;
        t++;
        m++;
      }
      if(mo<31){
        mo = 0;
      }
  }

}



//Api service
app.service('apiService', function() {
    this.data = data;
    console.log(this.data);
    this.holiday = holiday;
});

//Directive

app.directive('calendar', function() {
    return {
        restrict: "E",
        templateUrl: 'calendar.html',
        scope: {
            selected: "="
        },
        controller: ['$scope', 'apiService', function($scope, apiService){
        $scope.data = data;
        $scope.api = holiday;
        }],
        link: function(scope) {
          //console.log(scope.api);
            scope.getData = _removeTime(scope.getDat || moment());
            scope.month = scope.getdata.data.month.clone();

            var start = scope.selected.clone();
            start.date(1);
            _removeTime(start.day(0));

            _buildMonth(scope, start, scope.month);

            scope.select = function(day) {
                scope.selected = day.date;
            };

            scope.next = function() {
                var next = scope.month.clone();
                _removeTime(next.month(next.month()+1)).date(1);
                scope.month.month(scope.month.month()+1);
                _buildMonth(scope, next, scope.month);
            };

            scope.previous = function() {
                var previous = scope.month.clone();
                _removeTime(previous.month(previous.month()-1).date(1));
                scope.month.month(scope.month.month()-1);
                _buildMonth(scope, previous, scope.month);
            };
        }
    };

    function _removeTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth(scope, start, month) {
        scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            scope.weeks.push({ days: _buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 1 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }

    function _buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(data.day, "day"),
                date: date
            });
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }
});

/*app.controller("calendarCtrl", function($scope, $filter, $http, $q) {



  '<div class="header"> <i class="fa fa-angle-left" ng-click="previous()"></i> <span>{{month.format("MMMM, YYYY")}}</span> <i class="fa fa-angle-right" ng-click="next()"></i></div><div class="week names"><span class="day">Sun</span><span class="day">Mon</span><span class="day">Tue</span><span class="day">Wed</span><span class="day">Thu</span><span class="day">Fri</span><span class="day">Sat</span></div><div class="week" ng-repeat="week in weeks"><span class="day" ng-class="{today: day.isToday, \"different-month\": !day.isCurrentMonth, selected: day.date.isSame(selected) }" ng-click="select(day)" ng-repeat="day in week.days">{{day.number}}</span></div>'




  scope: {
      selected: "="
  },



  $scope.dayFormat = "d";

   // To select a single date, make sure the ngModel is not an array.
  // $scope.selectedDate = "";

   // If you want multi-date select, initialize it as an array.
   var date = new Date();
   var date2 = date + 1;
   $scope.selectedDate = "";

   $scope.firstDayOfWeek = 0; // First day of the week, 0 for Sunday, 1 for Monday, etc.
   $scope.setDirection = function(direction) {
     $scope.direction = direction;
     $scope.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
   };

   $scope.dayClick = function(date) {
     $scope.msg = "You clicked " + $filter("date")(date, "MMM d, y h:mm:ss a Z");
   };

   $scope.prevMonth = function(data) {
     $scope.msg = "You clicked (prev) month " + data.month + ", " + data.year;
   };

   $scope.nextMonth = function(data) {
     $scope.msg = "You clicked (next) month " + data.month + ", " + data.year;
   };

   $scope.tooltips = true;
   $scope.setDayContent = function(date) {

       // You would inject any HTML you wanted for
       // that particular date here.
       return "<p></p>";

       // You could also use an $http function directly.
       return $http.get("/some/external/api");

       // You could also use a promise.
       var deferred = $q.defer();
       $timeout(function() {
           deferred.resolve("<p></p>");
       }, 1000);
       return deferred.promise;

   };*/
