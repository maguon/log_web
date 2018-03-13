app.controller("finance_index_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    $scope.waitingHandleCarCount = 0;
    $scope.handlingCarCount = 0;
    $scope.waitingHandleTruckCount = 0;
    $scope.handlingTruckCount = 0;
    $scope.waitingHandleCarCompensateCount = 0;
    $scope.handlingCarCompensateCount =0;
    $scope.notLoanMoneyCarCount = 0;
    $scope.notRepaymentMoneyCarCount = 0;
    $scope.notLoanMoneyTruckCount = 0;
    $scope.notRepaymentMoneyTruckCount =0;
    $scope.indemnityMoneyCarCount=0;
    // 获取商品车赔款管理统计
    function getCarCompensateLoanCount() {
        _basic.get($host.api_url + "/damageInsureLoanStatusCount").then(function (data) {
            if (data.success === true) {
                for (var i = 0; i < data.result.length; i++) {
                    if(data.result[i].loan_status === 1){
                        $scope.waitingHandleCarCompensateCount += data.result[i].loan_status_count;
                        $scope.notLoanMoneyCarCount += data.result[i].not_loan_money;
                    }
                    if(data.result[i].loan_status === 2){
                        $scope.handlingCarCompensateCount += data.result[i].loan_status_count;
                        $scope.notRepaymentMoneyCarCount += data.result[i].not_repayment_money;
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 获取货车理赔借款
    function getTruckLoanCount() {
        _basic.get($host.api_url + "/truckAccidentInsureLoanStatusCount").then(function (data) {
            if (data.success === true) {
                for (var i = 0; i < data.result.length; i++) {
                    if(data.result[i].loan_status === 1){
                        $scope.waitingHandleTruckCount += data.result[i].loan_status_count;
                        $scope.notLoanMoneyTruckCount += data.result[i].not_loan_money;
                    }
                    if(data.result[i].loan_status === 2){
                        $scope.handlingTruckCount += data.result[i].loan_status_count;
                        $scope.notRepaymentMoneyTruckCount += data.result[i].not_repayment_money;
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 获取商品车理赔打款
    function getCarLoanCount() {
        _basic.get($host.api_url + "/indemnityStatusCount").then(function (data) {
            if (data.success === true) {
                for (var i = 0; i < data.result.length; i++) {
                    if(data.result[i].indemnity_status === 1){
                        $scope.waitingHandleCarCount += data.result[i].indemnity_status_count;
                        $scope.indemnityMoneyCarCount += data.result[i].indemnity_money;
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 获取数据
    $scope.queryData = function () {
        getTruckLoanCount();
        getCarLoanCount();
        getCarCompensateLoanCount();
    };
    $scope.queryData();
}])
