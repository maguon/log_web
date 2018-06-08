app.controller("insurance_compensation_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    $scope.start = 0;
    $scope.size = 21;
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.handler = _basic.getSession(_basic.USER_NAME);
    $scope.handleStatus = "1";
    $scope.hasLoanType = true;
    $scope.damageInfoDetailsList = [];

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
                $scope.boxArray = data.result;
                $scope.damageInsurancePaymentList = $scope.boxArray.slice(0, 20);
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
            damageInsureId: $scope.compensateNum,
            damageId: $scope.damageNum,
            insureId: $scope.insuranceCompany,
            createdOnStart: $scope.claimStartTimeStart,
            createdOnEnd: $scope.claimStartTimeEnd,
            financialLoanStatus: $scope.loanStatus,
            insurePlanStart: $scope.paymentMoneyStart,
            insurePlanEnd: $scope.paymentMoneyEnd,
            insureStatus: $scope.handleStatus,
            insureUserName: $scope.agentName
        };
        window.open($host.api_url + "/damageInsureRel.csv?" + _basic.objToUrl(obj));
    };

    // 开启增加质损保险模态框并初始化所有信息
    $scope.addClaimInfo = function () {
        $scope.insuranceCompanyMod = "";
        $scope.insurePlanMod = "";
        $scope.hasLoan = "";
        $scope.hasLoanType = true;
        $scope.loanMoneyNum = 0;
        $scope.paymentExplain = "";
        $scope.damageNumMod = "";
        $scope.damageInfoDetailsList = [];
        $('#addDamageInfoModel').modal('open');
    };

    // 判断是否允许输入财务借款
    $scope.checkHasLoan = function () {
        if($scope.hasLoan == 1){
            $scope.hasLoanType = false;
        }
        else{
            $scope.loanMoneyNum = 0;
            $scope.hasLoanType = true;
        }
    };

    // 根据质损编号查询质损详细信息
    $scope.searchDamageDetails = function () {
        if($scope.damageNumMod !== ""){
            _basic.get($host.api_url + "/damage?damageId=" + $scope.damageNumMod).then(function (data) {
                if (data.success === true) {
                    if(data.result.length !== 0){
                        if($scope.damageInfoDetailsList.length === 0){
                            $scope.damageInfoDetailsList.push(data.result[0]);
                            $scope.damageNumMod = "";
                            // swal("新增成功", "", "success");
                        }
                        else{
                            // 检测数组中是否有和返回结果相同的id
                            function checkDamageId(obj) {
                                return obj.id === data.result[0].id;
                            }
                            if($scope.damageInfoDetailsList.some(checkDamageId)){
                                swal("不能重复添加相同质损！", "", "warning");
                            }
                            else{
                                $scope.damageInfoDetailsList.push(data.result[0]);
                                $scope.damageNumMod = "";
                                // swal("新增成功", "", "success");
                            }
                        }
                        // console.log("damageInfoDetailsList",$scope.damageInfoDetailsList);
                    }
                    else{
                        swal("查无此编号信息", "", "warning");
                    }
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请填写质损编号！", "", "error");
        }
    };

    // 提交新增质损信息
    $scope.addDamageRecord =  function () {
        if($scope.insuranceCompanyMod !== ""
            && $scope.insurePlanMod !== ""
            && $scope.hasLoan !== ""
            && $scope.damageInfoDetailsList.length !== 0
        ){
            var damageIdArr = [];
            for (var i = 0; i < $scope.damageInfoDetailsList.length; i++) {
                damageIdArr.push($scope.damageInfoDetailsList[i].id);
            }
            _basic.post($host.api_url + "/user/" + userId + "/damageInsure",{
                insureId: $scope.insuranceCompanyMod,
                insurePlan: $scope.insurePlanMod,
                financialLoanStatus: $scope.hasLoan,
                financialLoan: $scope.loanMoneyNum,
                paymentExplain: $scope.paymentExplain,
                damageIds: damageIdArr
            }).then(function (data) {
                if (data.success === true) {
                    swal("新增成功", "", "success");
                    $('#addDamageInfoModel').modal('close');
                    $scope.getInsurancePaymentList();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("保险公司或关联质损不能为空！", "", "error");
        }
    };

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.getInsurancePaymentList();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.getInsurancePaymentList();
    };


    // 获取数据
    $scope.queryData = function () {
        $scope.getInsurancePaymentList();
        $scope.getInsuranceCompany();
    };
    $scope.queryData();
}]);