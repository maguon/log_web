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
    $scope.dpRouteTaskNotLoanCount = 0;
    // 未派发笔数
    $scope.notDistributedCount = 0;
    // 未派发金额
    $scope.notDistributedMoneyCount = 0;
    // 未报销笔数
    $scope.unreimbursedCount = 0;
    // 未报销金额
    $scope.unreimbursedMoneyCount = 0;

    function dpRouteTaskNotLoanCount() {
        var url = $host.api_url + "/dpRouteTaskNotLoanCount?taskStatusArr=8";
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.dpRouteTaskNotLoanCount=data.result[0].not_loan_count;

            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取未派发接口
    function getNotDistributedCount() {
        var url = $host.api_url + "/dpRouteTaskLoanCount?taskLoanStatus=1";
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.notDistributedCount=data.result[0].task_loan_count;
                $scope.notDistributedMoneyCount=data.result[0].apply_plan_money;

            } else {
                swal(data.msg, "", "error");
            }
        });
    }
    //获取未派发接口
    function getUnreimbursedCount() {
        var url = $host.api_url + "/dpRouteTaskLoanCount?taskLoanStatus=2";
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.unreimbursedCount=data.result[0].task_loan_count;
                $scope.unreimbursedMoneyCount=data.result[0].apply_plan_money;

            } else {
                swal(data.msg, "", "error");
            }
        });
    }



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
        dpRouteTaskNotLoanCount();
        getNotDistributedCount();
        getUnreimbursedCount();
    };
    $scope.queryData();
}])
