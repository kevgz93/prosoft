var app = angular.module('MyApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'materialCalendar','ui.calendar', 'ui.bootstrap'])

var t = 0;
var data;


app.controller('AppCtrl', function() {
  this.myDate = new Date('01/01/2008');
});


app.controller('startCalen', function($scope, $filter, $http, $q, $rootScope, $window, servData){
  var vm =  this;
  vm.aux;
  vm.data;
  vm.holiday;
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
    $rootScope.date = {
      "date": vm.myDate,
      "day": day,
      "month": month,
      "days": numDay,
      "code": vm.code,
    }
    servData.addData($rootScope.date);
    //call the function to know how many month needs to show
    fApi($rootScope.date);

    //brings the API
    api($rootScope.date);

    //show calendar
    vm.showcal = function(){
      vm.calendar = true;
    }
  }

  //Api controller call
  function api(data){
    //vm.dat = data1;
    callApi(data).then(function(resp){
      $rootScope.holiday = resp;
      //$window.location.href = '/calendar.html';
      vm.showcal();
  })
  .catch(function(resp){
    console.log(resp);
  });
};

  //Api promise
    function callApi (dat){
    var key = "68695711-db64-4a44-9eb2-1eeffaae5afb";
    var country = dat.code;
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
});

//Api function to get only the days for the necessary months.

function fApi(dat){
  var months = calendars(dat)
}


//how many months need to show
function calendars(dat) {
  var m = dat.month;
  var mo = dat.day + dat.days;
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


//services
app.service('servData', function() {
  var serv = {};

  this.addData = function (value) {
      serv = value;
}

  this.getData = function () {
    return serv;

 }
    return {
    addData: this.addData,
    getData: this.getData,
  }

  });


//Calendar controller

app.controller('CalendarCtrl',
   function($scope, $compile, $timeout, uiCalendarConfig, $rootScope) {
     console.log($rootScope.date);
     console.log($rootScope.holiday);
     //var date = $rootScope.date)
    var d = $rootScope.date.date.getDate();
    var m = $rootScope.date.date.getMonth();
    var y = $rootScope.date.date.getFullYear();

    $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
    };
    /* event source that contains custom events on the scope */
    $scope.events = [
    ];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };

    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Dropped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/


	$scope.inicio = 0;
	$scope.days= 0;

    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, $scope.inicio),
        end: new Date(y, m, $scope.days),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalendar = function(calendar) {
      $timeout(function() {
        if(uiCalendarConfig.calendars[calendar]){
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      });
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
        element.attr({'tooltip': event.title,
                      'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
		firstDay: 0,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

    $scope.changeLang = function() {
      if($scope.changeTo === 'Hungarian'){
        $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
        $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
        $scope.changeTo= 'English';
      } else {
        $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        $scope.changeTo = 'Hungarian';
      }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
});
