var app = angular.module("myApp", ['angularMoment']);

app.service("Entries", function ($http) {

	this.getEntries = function () {
		return $http.get("/entries").
		then(function (response) {
			return response;
		}, function (response) {
			alert("Error finding entries.");
		});
	}

	this.createEntry = function (entry) {
		return $http.post("/entries", entry).
		then(function (response) {
			return response;
		}, function (response) {
			alert("Error creating entry.");
		});
	}

});

app.controller("appController", ['$scope', '$log', 'Entries', function ($scope, $log, Entries) {
  $scope.today = moment.utc();
	$scope.fullName = null;
	$scope.dob = null;
	$scope.entries = [];

	$scope.init = function () {
		$scope.getEntries();
	}

	$scope.clickNewEntry = function () {
		$log.info("Click New Entry");
		$scope.newEntry();
	};

	// GET all entries
	$scope.getEntries = function () {
		Entries.getEntries().then(function (response) {
			$log.info(response);
			if (response.data) {
				$scope.entries = response.data;
			} else {
				$scope.entries = response;
			}

		}, function (error) {
			alert("Error getting entries");
		});
	};

	// POST a new entry
	$scope.newEntry = function () {
    var utcDOB = moment.utc([
      $scope.dob.getFullYear(),
      $scope.dob.getMonth(),
      $scope.dob.getDate()
      ]);
		var entry = {
			fullName: $scope.fullName,
			dob: utcDOB
		};

		Entries.createEntry(entry).then(function (data) {
			alert("Added entry");
			$scope.getEntries();
		}, function (error) {
			alert("Error posting entry");
		});
	};


}]);
