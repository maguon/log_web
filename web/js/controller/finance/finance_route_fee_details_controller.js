app.controller("finance_route_fee_details_controller", ["$scope", "$stateParams", "$host", "_basic", function ($scope, $stateParams, $host, _basic) {

    var routeFeeId = $stateParams.id;

    // 获取数据
    $scope.queryData = function () {
        console.log("finance_route_fee_details_controller",routeFeeId);
    };
    $scope.queryData();
}]);