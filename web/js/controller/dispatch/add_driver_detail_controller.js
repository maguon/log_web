app.controller("add_driver_detail_controller", ["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {
        var userId = _basic.getSession(_basic.USER_ID);
        var Picture_driverid;
        $scope.step_first = true;
        $scope.step_third = false;
        $scope.checkVal = false;
        // 电话号正则
        $scope.mobileReg = _config.mobileRegx;
        // 身份证正则
        $scope.identityReg = _config.CarNoRegx;
        // 驾驶类型
        $scope.licenseType = _config.licenseType;

        // 验证身份证号
        $scope.checkId = function (value) {
            if(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)){
                $scope.checkVal = true;
            }
            else{
                $scope.checkVal = false;
            }
        };

        // 提交司机信息
        $scope.submitForm = function (inValid) {
            $scope.checkId($scope.identityNum);
            $scope.submitted = true;
            if (inValid) {
                var driverInfo = {
                    driveName: $scope.driveName,
                    gender: $scope.driverType,
                    idNumber: $scope.identityNum,
                    tel: $scope.driverPhone,
                    operateType:2,
                    companyId:0,
                    licenseType: $scope.drivingLicense,
                    licenseDate: $scope.licenseEndTime,
                    remark: $scope.remark
                };
                _basic.post($host.api_url + "/user/" + userId + "/drive", driverInfo).then(function (data) {
                    if (data.success === true) {
                        $scope.step_first = false;
                        $scope.step_third = true;
                        Picture_driverid = data.result.driveId;
                        $(".tabs .indicator").css({
                            right: 0 + "px",
                            left: 630 + "px"
                        });
                        $(".tab3>a").addClass("active");
                        $(".tab1>a").removeClass("active");
                        $scope.newTruckList = $scope.truckList;
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
        };

        // 根据select选择的所属类型获取所属公司信息
        $scope.chooseOperateType = function () {
            _basic.get($host.api_url + "/company?operateType=2").then(function (companyData) {
                if (companyData.success === true) {
                    $scope.companyList = companyData.result;
                }
                else {
                    swal(companyData.msg, "", "error");
                }
            });
        };

        // 获取货车数据
        $scope.queryData = function () {
            _basic.get($host.api_url + "/truckFirst?truckType=1&operateType=2").then(function (truckData) {
                if (truckData.success === true) {
                    $scope.truckList = truckData.result;
                }
                else {
                    swal(truckData.msg, "", "error");
                }
            });
        };
        $scope.queryData();


        // 过滤货车
        $scope.updateTruckList = function () {
            $scope.newTruckList = [];
            if ($scope.keyWord != "") {
                for (var i = 0; i < $scope.truckList.length; i++) {
                    if (($scope.truckList[i].truck_num).indexOf($scope.keyWord) !== -1) {
                        $scope.newTruckList.push($scope.truckList[i]);
                    }
                }
            }
            else {
                $scope.newTruckList = $scope.truckList;
            }

        };

        // 暂不绑定
        $scope.clear_trailer = function () {
            $scope.truck_id = "";
        };

        $scope.check_trailer = function (truckId) {
            $scope.truck_id = truckId;
        };

        // 绑定货车
        $scope.uploadBrandTruck = function () {
            if($scope.truck_id){
                _basic.put($host.api_url + "/user/" + userId + "/truck/" + $scope.truck_id + "/drive/" + Picture_driverid + "/bind",{}).then(function (bindData) {
                    if (bindData.success === true) {
                        swal("绑定成功","","success");
                        $state.go('outsourcing_vehicles');
                    }
                    else {
                        swal(bindData.msg, "", "error");
                    }
                });
            }
            else{
                $state.go('outsourcing_vehicles');
            }
        }


}]);