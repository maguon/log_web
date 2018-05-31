app.controller("accident_claim_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    var userId = _basic.getSession(_basic.USER_ID);
    $scope.start = 0;
    $scope.size = 21;
    $scope.accidentClaimList = [];
    $scope.relationAccidentNum = "";
    $scope.hasLoanType = true;

    // 获取所有保险公司
    $scope.getInsureCompanyList = function () {
        _basic.get($host.api_url + "/truckInsure").then(function (data) {
            if (data.success === true) {
                // console.log("data",data);
                $scope.insureCompanyList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取事故理赔列表
    $scope.getDamageClaimList = function () {
        _basic.get($host.api_url + "/truckAccidentInsure?" + _basic.objToUrl({
            accidentInsureId: $scope.compensateNum,
            insureType: $scope.insuranceType,
            insureId: $scope.insuranceCompany,
            createdOnStart: $scope.claimStartTimeStart,
            createdOnEnd: $scope.claimStartTimeEnd,
            financialLoanStatus: $scope.financialLoan,
            insurePlanStart: $scope.paymentMoneyStart,
            insurePlanEnd: $scope.paymentMoneyEnd,
            insureStatus: $scope.handleStatus,
            completedDateStart: $scope.paymentSettlementTimeStart,
            completedDateEnd: $scope.paymentSettlementTimeEnd,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.damageClaimList = $scope.boxArray.slice(0, 20);
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
    $scope.searchDamageClaimList = function () {
        $scope.start = 0;
        $scope.getDamageClaimList();
    };

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.getDamageClaimList();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.getDamageClaimList();
    };


    // 点击增加按钮打开新增保险赔付模态框
    $scope.addClaimInfo = function () {
        // 初始化所有信息
        $scope.insuranceCompanyMod = "";
        $scope.insuranceTypeMod = "";
        $scope.paymentMoneyMod = "";
        $scope.hasLoan = "";
        $scope.loanMoneyNum = "";
        $scope.paymentDescription = "";
        $scope.hasLoanType = true;

        $scope.relationAccidentNum = "";
        $scope.accidentClaimList = [];
        $('#addAccidentClaimModal').modal('open');
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

    // 根据事故编号查询事故详细信息
    $scope.searchAccidentInfo = function () {
        if($scope.relationAccidentNum !== ""){
            _basic.get($host.api_url + "/truckAccident?truckAccidentId=" + $scope.relationAccidentNum).then(function (data) {
                if (data.success === true) {
                    // console.log("data", data);
                    if(data.result.length !== 0){
                        // 检测数组中是否有和返回结果相同的id
                        function checkAccidentId(obj) {
                            return obj.id === data.result[0].id;
                        }
                        if($scope.accidentClaimList.some(checkAccidentId)){
                            swal("不能重复添加相同事故！", "", "warning");
                        }
                        else{
                            $scope.accidentClaimList.push(data.result[0]);
                            $scope.relationAccidentNum = "";
                        }
                    }
                    else{
                        swal("查无此事故信息！", "", "warning");
                    }
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请填写事故编号！", "", "warning");
        }
    };

    // 删除当前事故信息
    $scope.deleteAccidentInfo = function (index) {
        swal({
                title: "确定删除当前事故吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                $scope.$apply(function (){
                    $scope.accidentClaimList.splice(index, 1)
                })
            });
    };

    // 提交保险赔付列表
    $scope.submitClaimInfoList = function () {
        if($scope.insuranceCompanyMod !== ""
            && $scope.insuranceTypeMod !== ""
            && $scope.paymentMoneyMod !== ""
            && $scope.hasLoan !== ""
            && $scope.accidentClaimList.length !== 0
            && $scope.paymentDescription !== ""
        ){
            var financialLoanCount = $scope.hasLoan == 1 ? $scope.loanMoneyNum : 0;
            var accidentIdArr = [];
            for (var i = 0; i < $scope.accidentClaimList.length; i++) {
                accidentIdArr.push($scope.accidentClaimList[i].id);
            }
            _basic.post($host.api_url + "/user/" + userId + "/truckAccidentInsure",{
                insureId: $scope.insuranceCompanyMod,
                insureType: $scope.insuranceTypeMod,
                insurePlan: $scope.paymentMoneyMod,
                financialLoanStatus: $scope.hasLoan,
                financialLoan: financialLoanCount,
                paymentExplain: $scope.paymentDescription,
                accidentIds: accidentIdArr
            }).then(function (data) {
                if (data.success === true) {
                    // console.log("data", data);
                    $scope.searchDamageClaimList();
                    $('#addAccidentClaimModal').modal('close');
                    swal("新增成功", "", "success");
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }

    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getInsureCompanyList();
        $scope.searchDamageClaimList();
    };
    $scope.queryData();
}]);