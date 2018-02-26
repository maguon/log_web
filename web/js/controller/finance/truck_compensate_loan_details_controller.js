app.controller("truck_compensate_loan_details_controller", ["$scope", "$host", "$stateParams", "_basic", function ($scope, $host, $stateParams, _basic) {

    var loanId = $stateParams.id;

    // 获取当前借款数据
    $scope.getCurrentLoanInfo = function () {
        _basic.get($host.api_url + "/truckAccidentInsureLoan?accidentInsureLoanId=" + loanId).then(function (data) {
            if (data.success === true) {
                console.log("data", data);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getCurrentLoanInfo();
    };
    $scope.queryData();
}]);