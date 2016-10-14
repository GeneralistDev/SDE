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
	$scope.fullName = null;
	$scope.dob = null;
	$scope.entries = [];

	$scope.getEntries = function () {
		Entries.getEntries().then(function (response) {
			$log.info("Entries", response.data);
			$scope.entries = response.data;
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
			fullName: $scope.fullName,
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
