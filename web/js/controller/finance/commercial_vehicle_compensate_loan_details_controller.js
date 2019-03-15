app.controller("commercial_vehicle_compensate_loan_details_controller", ["$scope","$state", "$stateParams", "$host", "_basic", function ($scope, $state, $stateParams, $host, _basic) {

    var userId = _basic.getSession(_basic.USER_ID);
    var loanId = $stateParams.id;
    var damageId = $stateParams.compensateId;
    $scope.hasRepayment = false;

// 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"commercial_vehicle_compensate_loan_details"}, {reload: true})
    };

    // 获取当前借款数据
    $scope.getCurrentLoanInfo = function () {
        _basic.get($host.api_url + "/damageInsureLoan?damageInsureLoanId=" + loanId).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                if(data.result[0].repayment_date !== null){
                    $scope.hasRepayment = true;
                }
                $scope.loanInfo = data.result[0];
                $scope.loanStatus = data.result[0].loan_status;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 根据事故id获取关联质损列表
    $scope.getConnectedAccidentList = function () {
        _basic.get($host.api_url + "/damageBase?damageInsureId=" + damageId).then(function (data) {
            if (data.success === true) {
                // console.log("damageData", data);
                $scope.connectDamageList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 打开财务借款模态框
    $scope.startLoan = function () {
        $scope.loanAmountMod = "";
        $scope.loanExplainMod = "";
        $('#financial_loan').modal('open');
    };

    // 点击确定完成借款并修改状态
    $scope.finishLoan = function () {
        if($scope.loanAmountMod !== ""){
            // 修改借款金额
            _basic.put($host.api_url + "/user/" + userId + "/damageInsureLoan/" + loanId,{
                loanMoney: $scope.loanAmountMod,
                loanExplain: $scope.loanExplainMod
            }).then(function (data) {
                if (data.success === true) {
                    // 修改借款状态
                    _basic.put($host.api_url + "/user/" + userId + "/damageInsureLoan/" + loanId + "/loanStatus/2",{}).then(function (data) {
                        if (data.success === true) {
                            $scope.getCurrentLoanInfo();
                            $('#financial_loan').modal('close');
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请填写借款金额！", "", "warning");
        }
    };

    // 点击拒绝改变状态
    $scope.refuseLoan = function () {
        swal({
                title: "确定拒绝当前借款吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
        }).then(
            function(result){
                if (result.value) {
                    _basic.put($host.api_url + "/user/" + userId + "/damageInsureLoan/" + loanId + "/loanStatus/0", {}).then(function (data) {
                        if (data.success === true) {
                            // console.log("data", data);
                            $scope.getCurrentLoanInfo();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    };

    // 点击借款保存按钮
    $scope.saveLoanInfo = function () {
        if($scope.loanInfo.loan_money == null || $scope.loanInfo.loan_money === "" || $scope.loanInfo.loan_explain == null || $scope.loanInfo.loan_explain === ""){
            swal("借款金额或借款描述不能为空！", "", "warning");
        }
        else{
            _basic.put($host.api_url + "/user/" + userId + "/damageInsureLoan/" + loanId,{
                loanMoney: $scope.loanInfo.loan_money,
                loanExplain: $scope.loanInfo.loan_explain
            }).then(function (data) {
                if (data.success === true) {
                    swal("保存成功", "", "success");
                    $scope.getCurrentLoanInfo();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    };

    // 点击还款保存按钮
    $scope.saveRepaymentInfo = function () {
        if($scope.loanInfo.repayment_money == null ){
            swal("请填写还款金额！", "", "warning");
        }
        else{
            _basic.put($host.api_url + "/user/" + userId + "/damageInsureRepayment/" + loanId,{
                repaymentMoney: $scope.loanInfo.repayment_money,
                repaymentExplain: $scope.loanInfo.repayment_explain
            }).then(function (data) {
                if (data.success === true) {
                    $scope.hasRepayment = true;
                    swal("保存成功", "", "success");
                    $scope.getCurrentLoanInfo();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    };

    // 点击完结修改状态
    $scope.finishRepayment = function () {
        if($scope.hasRepayment){
            swal({
                    title: "确定完结吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消"
            }).then(
                function(result){
                    if (result.value) {
                        _basic.put($host.api_url + "/user/" + userId + "/damageInsureLoan/" + loanId + "/loanStatus/3", {}).then(function (data) {
                            if (data.success === true) {
                                // console.log("data", data);
                                $scope.getCurrentLoanInfo();
                            }
                            else {
                                swal(data.msg, "", "error");
                            }
                        });
                    }
                });
        }
        else{
            swal("请先填写还款信息并保存！", "", "warning");
        }
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getCurrentLoanInfo();
        $scope.getConnectedAccidentList();
    };
    $scope.queryData();
}]);