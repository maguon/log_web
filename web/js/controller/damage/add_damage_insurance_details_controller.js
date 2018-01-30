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
                // console.log("data", data);
                $scope.insuranceCompany = data.result[0].insure_id;
                $scope.handler = data.result[0].insure_user_name;
                $scope.insuranceCompensation = data.result[0].insure_plan;
                $scope.insurancePayment = data.result[0].insure_actual;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 质损信息卡片
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
                                    $scope.getCurrentDamageInfo();
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
    $scope.deleteDamageInfo = function (damageRelId) {
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
                    _basic.delete($host.api_url + "/user/" + userId + "/damageInsureRel/" + damageRelId).then(function (data) {
                        if (data.success === true) {
                            $scope.getCurrentDamageInfo();
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

    // 提交修改后的质损信息列表
    $scope.submitDamageList = function () {
        var damageIdArr = [];
        for (var i = 0; i < $scope.damageInfoCardList.length; i++) {
            damageIdArr.push($scope.damageInfoCardList[i].id);
        }
        // console.log("damageIdArr",damageIdArr);
        _basic.put($host.api_url + "/user/" + userId + "/damageInsure/" + damageId, {
            insureId: $scope.insuranceCompany,
            insurePlan: $scope.insuranceCompensation,
            insureActual: $scope.insurancePayment,
            damageIds: damageIdArr
        }).then(function (data) {
            if (data.success === true) {
                swal("提交成功", "", "success");
                // $state.go("insurance_compensation");
                $scope.getCurrentDamageInfo();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getInsuranceCompany();
        $scope.getCurrentDamageInfo();
    };
    $scope.queryData();
}]);