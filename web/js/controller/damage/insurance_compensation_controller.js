app.controller("insurance_compensation_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    $scope.start = 0;
    $scope.size = 20;
    $scope.handleStatus = "1";
    $scope.hasLoanType = true;

    // 获取所有保险公司
    $scope.getInsuranceCompany = function () {
        _basic.get($host.api_url + "/truckInsure").then(function (data) {
            if (data.success === true) {
                $scope.insureCompanyList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取保险赔偿列表
    $scope.getInsurancePaymentList = function () {
        _basic.get($host.api_url + "/damageInsure?" + _basic.objToUrl({
            damageInsureId:$scope.compensateNum,
            damageId:$scope.damageNum,
            insureId: $scope.insuranceCompany,
            createdOnStart: $scope.claimStartTimeStart,
            createdOnEnd: $scope.claimStartTimeEnd,
            financialLoanStatus: $scope.loanStatus,
            insurePlanStart: $scope.paymentMoneyStart,
            insurePlanEnd: $scope.paymentMoneyEnd,
            insureStatus: $scope.handleStatus,
            insureUserName: $scope.agentName,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                if ($scope.start > 0) {
                    $("#pre").show();
                }
                else {
                    $("#pre").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next").hide();
                }
                else {
                    $("#next").show();
                }
                $scope.damageInsurancePaymentList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击按钮进行查询
    $scope.searchInsurancePaymentList = function () {
        $scope.start = 0;
        $scope.getInsurancePaymentList();
    };

    // 下载csv
    $scope.downloadCsvFile = function () {
        var obj = {
            damageInsureId: $scope.paymentNum,
            damageId: $scope.damageNum,
            insureStatus: $scope.processingStatus,
            insureActualStart: $scope.insurancePaymentStart,
            insureActualEnd: $scope.insurancePaymentEnd,
            insureUserName: $scope.handlerName
        };
        window.open($host.api_url + "/damageInsureRel.csv?" + _basic.objToUrl(obj));
    };

    // 开启增加质损保险模态框
    $scope.addClaimInfo = function () {
        $scope.hasLoanType = true;
        $('#addDamageInfoModel').modal('open');
    };

    // 判断是否允许输入财务借款
    $scope.checkHasLoan = function () {
        if($scope.hasLoan == 1){
            $scope.hasLoanType = false;
        }
        else{
            $scope.loanMoneyNum = "";
            $scope.hasLoanType = true;
        }
    };

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - $scope.size;
        $scope.getInsurancePaymentList();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + $scope.size;
        $scope.getInsurancePaymentList();
    };


    // 获取数据
    $scope.queryData = function () {
        $scope.getInsurancePaymentList();
        $scope.getInsuranceCompany();
    };
    $scope.queryData();
}]);