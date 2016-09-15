var app = angular.module("myApp", []);

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

	$scope.fullName = null;
	$scope.dob = null;
	$scope.daysAlive = null;
	$scope.entries = [];

	$scope.init = function () {
		$scope.getEntries();
	}

	$scope.clickNewEntry = function () {
		$log.info("Click New Entry");
		$scope.daysAlive = $scope.daysSinceDate($scope.dob);
		$scope.newEntry();
	};

	$scope.daysSinceDate = function (aDate) {
		return 42;
	}

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
		var entry = {
			fullName: $scope.fullName,
			dob: $scope.dob
		};

		Entries.createEntry(entry).then(function (data) {
			alert("Added entry");
			$scope.getEntries();
		}, function (error) {
			alert("Error posting entry");
		});
	};


}]);