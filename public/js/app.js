var app = angular.module("myApp", ['angularMoment']);

// Service
app.service("Entries", function ($http) {
  this.getEntries = function () {
    return $http.get("/entries");
  }
  this.createEntry = function (entry) {
    return $http.post("/entries", entry);
  }
});

// Controller
app.controller("appController", ['$scope', '$log', 'Entries', function ($scope, $log, Entries) {
  $scope.today = moment.utc();
  $scope.firstName = null;
  $scope.lastName = null;
  $scope.dob = null;
  $scope.martianDays = null;
  $scope.entries = [];

  $scope.$watch('dob', function (change) {
    if ($scope.dob) {
      var utcDOB = moment.utc([
        $scope.dob.getFullYear(),
        $scope.dob.getMonth(),
        $scope.dob.getDate()
      ]);

      var diffInDays = $scope.today.diff(utcDOB, 'days');

      $scope.martianDays = Math.round(diffInDays * 0.9719);
    }
  });

  $scope.getEntries = function () {
    Entries.getEntries().then(function (response) {
      $log.info("Entries", response.data);
      $scope.entries = response.data;
      $scope.entries.forEach(function (data) {
        data.martianDays = Math.round($scope.today.diff(data.dob, 'days') * 0.9719);
      });
    }, function (error) {
      alert("Error getting entries.");
    });
  };

  $scope.createEntry = function () {
    var utcDOB = moment.utc([
      $scope.dob.getFullYear(),
      $scope.dob.getMonth(),
      $scope.dob.getDate()
    ]);
    var entry = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      dob: utcDOB
    };

    Entries.createEntry(entry).then(function (response) {
      alert("Entry created");
      $scope.getEntries();
    }, function (error) {
      alert("Error creating entry.");
    });
  };

}]);
