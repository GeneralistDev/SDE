var app = angular.module("app", []);

app.controller("appController", ['$scope', '$http', function ($scope, $http) {

	$scope.firstName = null;
	$scope.lastName = null;
	$scope.dob = null;
	$scope.daysAlive = null;
	$scope.martianDays = null;
	$scope.history = [];

	$scope.init = function () {
		$scope.getHistory();
	}

	$scope.calculate = function () {
		$scope.daysAlive = $scope.getDaysSinceDate($scope.dob);
		$scope.martianDays = $scope.getMartianDaysSinceDate($scope.dob);

		// POST to server: timestamp, fullName, dob

		$scope.getHistory();
	};

	$scope.getDaysSinceDate = function (aDate) {
		return 42;
	}

	$scope.getMartianDaysSinceDate = function (aDate) {
		return 43;
	}

	$scope.getHistory = function () {
		$http.get("history.json").then(
			function (success) {
				$scope.history = success.data;
			}
		);
	};

}]);