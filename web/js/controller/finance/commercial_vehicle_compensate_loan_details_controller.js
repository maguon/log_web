app.controller("commercial_vehicle_compensate_loan_details_controller", ["$scope", "$stateParams", "$host", "_basic", function ($scope, $stateParams, $host, _basic) {

    var userId = _basic.getSession(_basic.USER_ID);
    var loanId = $stateParams.id;
    var compensateId = $stateParams.compensateId;


    // 获取数据
    $scope.queryData = function () {

    };
    $scope.queryData();
}]);