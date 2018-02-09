app.controller("accident_claim_details_controller", ["$scope", "$host", "$stateParams", "_basic", function ($scope, $host, $stateParams, _basic) {

    var userId = _basic.getSession(_basic.USER_ID);
    var accidentId = $stateParams.id;
    $scope.relationAccidentNum = "";

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

    // 根据事故id获取事故详细信息
    $scope.getCurrentAccidentDetails = function () {
        _basic.get($host.api_url + "/truckAccidentInsure?accidentInsureId=" + accidentId).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.accidentDetails = data.result[0];
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 根据事故id获取关联事故列表
    $scope.getConnectedAccidentList = function () {
        _basic.get($host.api_url + "/truckAccident?accidentInsureId=" + accidentId).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.accidentClaimList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
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

    // 保存当前修改的信息
    $scope.saveCurrentAccidentInfo = function () {
        if($scope.accidentClaimList.length === 0){
            swal("至少保留一条关联事故！", "", "warning");
        }
        else{
            var accidentIdArr = [];
            for (var i = 0; i < $scope.accidentClaimList.length; i++) {
                accidentIdArr.push($scope.accidentClaimList[i].id);
            }
            _basic.put($host.api_url + "/user/" + userId + "/truckAccidentInsure/" + accidentId,{
                insureId: $scope.accidentDetails.insure_id,
                insureType: $scope.accidentDetails.insure_type,
                insurePlan: $scope.accidentDetails.insure_plan,
                insureActual: $scope.accidentDetails.insure_actual,
                paymentExplain: $scope.accidentDetails.payment_explain,
                accidentIds: accidentIdArr
            }).then(function (data) {
                if (data.success === true) {
                    // console.log("data", data);
                    swal("保存成功", "", "success");
                    $scope.getCurrentAccidentDetails();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getInsureCompanyList();
        $scope.getCurrentAccidentDetails();
        $scope.getConnectedAccidentList();
    };
    $scope.queryData();
}]);