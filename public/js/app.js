var app = angular.module("myApp");

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

app.controller("appController", ['$scope', 'Contacts', function ($scope, Contacts) {

	$scope.fullName = null;
	$scope.dob = null;
	$scope.daysAlive = null;
	$scope.entries = [];

	$scope.init = function () {
		$scope.getEntries();
	}

	$scope.clickNewEntry = function () {
		$scope.daysAlive = $scope.daysSinceDate($scope.dob);
		$scope.newEntry();
	};

	$scope.daysSinceDate = function (aDate) {
		return 42;
	}

	// GET all entries
	$scope.getEntries = function () {
		Contacts.getEntries().then(function (data) {
			$scope.entries = data;
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

		Contacts.addEntry(entry).then(function (data) {
			alert("Added entry");
			$scope.getEntries();
		}, function (error) {
			alert("Error posting entry");
		});
	};


}]);