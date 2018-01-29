app.controller("add_damage_insurance_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    $scope.handler = _basic.getSession(_basic.USER_NAME);
    $scope.damageInfoDetailsList = [];
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

    // 根据质损编号查询质损详细信息
    $scope.searchDamageDetails = function () {
        if($scope.damageNum !== ""){
            _basic.get($host.api_url + "/damage?damageId=" + $scope.damageNum).then(function (data) {
                if (data.success === true) {
                    if(data.result.length !== 0){
                        if($scope.damageInfoDetailsList.length === 0){
                            $scope.damageInfoDetailsList.push(data.result[0]);
                            $scope.damageNum = "";
                            // swal("新增成功", "", "success");
                        }
                        else{
                            // 检测数组中是否有和返回结果相同的id
                            function checkDamageId(obj) {
                                return obj.id === data.result[0].id;
                            }
                            if($scope.damageInfoDetailsList.some(checkDamageId)){
                                swal("不能重复添加相同保单！", "", "warning");
                            }
                            else{
                                $scope.damageInfoDetailsList.push(data.result[0]);
                                $scope.damageNum = "";
                                swal("新增成功", "", "success");
                            }
                        }
                        console.log("damageInfoDetailsList",$scope.damageInfoDetailsList);
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

    // 删除选中的质损信息
    $scope.deleteDamageInfo = function (index) {
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
                $scope.$apply(function () {
                    $scope.damageInfoDetailsList.splice(index,1);
                });
            });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getInsuranceCompany();
    };
    $scope.queryData();
}]);