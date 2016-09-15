var app = angular.module("app", []);

app.controller("appController", ['$scope', '$http', function ($scope, $http) {

	$scope.fullName = null;
	$scope.dob = null;
	$scope.daysAlive = null;
	$scope.history = [];
	$scope.historyError = null;

	$scope.init = function () {
		$scope.getHistory();
	}

	$scope.calculate = function () {
		$scope.daysAlive = 42;

		// POST to server: timestamp, fullName, dob, daysAlive

		$scope.getHistory();
	};

	$scope.getHistory = function () {
		$http.get("history.json").then(
			function (success) {
				$scope.history = success.data;
				$scope.historyError = null;
			},
			function (error) {
				$scope.historyError = error.data.error;
			}
		);

	};

}]);