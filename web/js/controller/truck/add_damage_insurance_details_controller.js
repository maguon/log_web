app.controller("add_damage_insurance_details_controller", ["$scope", "$stateParams", "$host", "_basic", function ($scope, $stateParams, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    var damageId = $stateParams.id;
    $scope.damageNum = "";

    // 获取所有保险公司
    $scope.getInsuranceCompany = function () {
        _basic.get($host.api_url + "/truckInsure").then(function (data) {
            if (data.success === true) {
                $scope.insuranceCompanyList = data.result;
                // console.log("insuranceCompanyList",$scope.insuranceCompanyList)
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 根据质损id查询详细信息
    $scope.getCurrentDamageInfo = function () {
        // 保险公司及赔付信息
        _basic.get($host.api_url + "/damageInsure?damageInsureId=" + damageId).then(function (data) {
            if (data.success === true) {
                console.log("data", data);
                $scope.currentInsurInfo = data.result[0];
                $scope.insuranceCompany = data.result[0].insure_id;
                $scope.damageMoney = data.result[0].damage_money;
                $scope.insuranceCompensation = data.result[0].insure_plan;
                $scope.insurancePayment = data.result[0].insure_actual;
                $scope.insureStatus = data.result[0].insure_status;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取当前关联质损信息卡片
    $scope.getCurrentDamageCard = function () {
        _basic.get($host.api_url + "/damageBase?damageInsureId=" + damageId).then(function (data) {
            if (data.success === true) {
                // console.log("damageCardData", data);
                $scope.damageInfoCardList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 根据质损编号查询质损详细信息
    $scope.searchDamageDetails = function () {
        if ($scope.damageNum !== "") {
            _basic.get($host.api_url + "/damage?damageId=" + $scope.damageNum).then(function (data) {
                if (data.success === true) {
                    if (data.result.length !== 0) {
                        // 检测数组中是否有和返回结果相同的id
                        function checkDamageId(obj) {
                            return obj.id === data.result[0].id;
                        }

                        if ($scope.damageInfoCardList.some(checkDamageId)) {
                            swal("不能重复添加相同质损！", "", "warning");
                        }
                        else {
                            _basic.post($host.api_url + "/user/" + userId + "/damageInsureRel", {
                                damageInsureId: damageId,
                                damageId: $scope.damageNum
                            }).then(function (data) {
                                if (data.success === true) {
                                    swal("添加成功", "", "success");
                                    $scope.getCurrentDamageCard();
                                }
                                else {
                                    swal(data.msg, "", "error");
                                }
                            });
                            $scope.damageNum = "";
                        }
                        // console.log("damageInfoCardList",$scope.damageInfoCardList);
                    }
                    else {
                        swal("查无此编号信息", "", "warning");
                    }
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else {
            swal("请填写质损编号！", "", "error");
        }
    };

    // 删除选中的质损信息
    $scope.deleteDamageInfo = function (damageCardId) {
        if($scope.damageInfoCardList.length > 1){
            swal({
                    title: "确定删除当前质损信息吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    closeOnConfirm: true
                },
                function(){
                    _basic.delete($host.api_url + "/user/" + userId + "/damageInsure/" + damageId + "/damage/" + damageCardId).then(function (data) {
                        if (data.success === true) {
                            // console.log("data",data);
                            $scope.getCurrentDamageCard();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                });
        }
        else{
            swal("至少保留一条质损信息！", "", "warning");
        }

    };

    // 保存修改后的质损信息
    $scope.saveDamageInfo = function () {
        var damageIdArr = [];
        for (var i = 0; i < $scope.damageInfoCardList.length; i++) {
            damageIdArr.push($scope.damageInfoCardList[i].id);
        }
        // console.log("damageIdArr",damageIdArr);
        _basic.put($host.api_url + "/user/" + userId + "/damageInsure/" + damageId, {
            insureId: $scope.insuranceCompany,
            insurePlan: $scope.insuranceCompensation,
            damageMoney: $scope.damageMoney,
            financialLoan: $scope.currentInsurInfo.financial_loan,
            insureActual: $scope.insurancePayment,
            paymentExplain: $scope.currentInsurInfo.payment_explain,
            checkExplain: $scope.currentInsurInfo.check_explain,
            damageIds: damageIdArr
        }).then(function (data) {
            if (data.success === true) {
                swal("保存成功", "", "success");
                // $state.go("insurance_compensation");
                $scope.getCurrentDamageInfo();
                $scope.getCurrentDamageCard();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击完成按钮
    $scope.completeDamageList = function () {
        swal({
                title: "确定完成当前质损吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                _basic.put($host.api_url + "/user/" + userId + "/damageInsure/" + damageId + "/insureStatus/2",{}).then(function (data) {
                    if (data.success === true) {
                        console.log("data", data);
                        $scope.getCurrentDamageInfo();
                        $scope.getCurrentDamageCard();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getInsuranceCompany();
        $scope.getCurrentDamageInfo();
        $scope.getCurrentDamageCard();
    };
    $scope.queryData();
}]);