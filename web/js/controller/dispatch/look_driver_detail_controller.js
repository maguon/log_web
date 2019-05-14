app.controller("look_driver_detail_controller", ["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {
   var userId = _basic.getSession(_basic.USER_ID);
        var driverId = $stateParams.id;
        $scope.stepFirst = true;
        $scope.stepSecond = false;
        $scope.stepThird = false;
        $scope.stepforth = false;
        // 电话号正则
        $scope.mobileReg = _config.mobileRegx;
        // 驾驶类型
        $scope.licenseType = _config.licenseType;

        $scope.bindTruckInput = true;
        $scope.bindMainTxt = false;
        $scope.bindViceTxt = false;


        // 返回
        $scope.return = function () {
            $state.go($stateParams.from,{from:"look_driver_detail"}, {reload: true})
        };

        // 获取关联货车及公司信息
        $scope.getCompanyAndTruckInfo = function () {
            _basic.get($host.api_url + "/company").then(function (companyData) {
                if (companyData.success === true) {
                    $scope.companyList = companyData.result;
                }
                else {
                    swal(companyData.msg, "", "error");
                }
            });

            _basic.get($host.api_url + "/truckFirst?truckType=1&operateType=2").then(function (truckData) {
                if (truckData.success === true) {
                    $scope.truckList = truckData.result;
                    $scope.newTruckList = $scope.truckList;
                }
                else {
                    swal(truckData.msg, "", "error");
                }
            });
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

        // 根据司机id查询司机详细信息
        $scope.getDriverDetails = function () {
            _basic.get($host.api_url + "/drive?driveId=" + driverId).then(function (data) {
                if (data.success === true) {
                    // 修改某些数据显示格式
                    data.result[0].confirm_date = moment(data.result[0].confirm_date).format("YYYY-MM-DD");
                    data.result[0].license_date = moment(data.result[0].license_date).format("YYYY-MM-DD");
                    data.result[0].operate_type = data.result[0].operate_type.toString();
                    // console.log("modifyData",data.result[0]);
                    $scope.driverInfo = data.result[0];
                    // console.log("driverInfo",$scope.driverInfo);
                    if($scope.driverInfo.drive_image != null){
                        $scope.drive_img_front = [{
                            img: $host.file_url + '/image/' + data.result[0].drive_image,
                        }];
                    }
                    else{
                        $scope.drive_img_front = [{
                            img: "../assets/images/id_image_b.png",
                        }];
                    }
                    if($scope.driverInfo.license_image != null){
                        $scope.license_img = [{
                            img: $host.file_url + '/image/' + data.result[0].license_image,
                        }];
                    }
                    else{
                        $scope.license_img = [{
                            img: "../assets/images/drive_image_b.png",
                        }];
                    }
                    if($scope.driverInfo.driver_image_re != null){
                        $scope.drive_img_back = [{
                            img: $host.file_url + '/image/' + data.result[0].driver_image_re,
                        }];
                    }
                    else{
                        $scope.drive_img_back = [{
                            img: "../assets/images/drive_image_back_b.png",
                        }];
                    }
                    if($scope.driverInfo.op_license_image != null){
                        $scope.permit_img = [{
                            img: $host.file_url + '/image/' + data.result[0].op_license_image,
                        }];
                    }
                    else{
                        $scope.permit_img = [{
                            img: "../assets/images/permit_image_b.png",
                        }];
                    }
                    if($scope.driverInfo.driver_avatar_image != null){
                        $scope.driver_img = [{
                            img: $host.file_url + '/image/' + data.result[0].driver_avatar_image,
                        }];
                    }
                    else{
                        $scope.driver_img = [{
                            img: ""
                        }];
                    }


                    // 判断绑定和解绑按钮隐藏显示
                    if(data.result[0].truck_num == null && data.result[0].vice == null){
                        $scope.bindBtn = true;
                        $scope.bindBtnCopilot = true;
                        $scope.unbindBtn = false;
                        $scope.unbindBtnCopilot = false;
                        $scope.showTruckList = true;
                        $scope.bindTruckInput = true;
                        $scope.bindMainTxt = false;
                        $scope.bindViceTxt = false;
                    }
                    else if(data.result[0].truck_num == null && data.result[0].vice != null){
                        $scope.bindBtn = false;
                        $scope.bindBtnCopilot = false;
                        $scope.unbindBtn = false;
                        $scope.unbindBtnCopilot = true;
                        $scope.showTruckList = false;
                        $scope.bindTruckInput = false;
                        $scope.bindMainTxt = false;
                        $scope.bindViceTxt = true;
                    }
                    else{
                        $scope.bindBtn = false;
                        $scope.bindBtnCopilot = false;
                        $scope.unbindBtn = true;
                        $scope.unbindBtnCopilot = false;
                        $scope.showTruckList = false;
                        $scope.bindTruckInput = false;
                        $scope.bindMainTxt = true;
                        $scope.bindViceTxt = false;
                    }

                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        };

        // 获取操作记录
        $scope.getTruckUserInfo = function () {
            _basic.get($host.record_url + "/user/" + userId + "/tuser/" + driverId + "/record").then(function (truckInfoData) {
                if(truckInfoData.success === true){
                    if(truckInfoData.result.length==0){
                        $scope.truckInfoList=[];
                    }
                    else{
                        $scope.truckInfoList = truckInfoData.result[0].comments;
                    }
                }
            });
        };

        // 点击tab控制显示隐藏
        $scope.showDriverDetails = function () {
            $scope.stepFirst = true;
            $scope.stepSecond = false;
            $scope.stepThird = false;
            $scope.stepforth = false;
        };
        $scope.showDriverBand = function () {
            $scope.stepFirst = false;
            $scope.stepSecond = false;
            $scope.stepThird = true;
            $scope.stepforth = false;
        };

        // 司机解绑与重新绑定
        $scope.check_trailer = function (truckId) {
            $scope.truck_id = truckId;
        };

        // 绑定主驾
        $scope.bundling = function () {
            if ($scope.truck_id) {
                _basic.put($host.api_url + "/user/" + userId + "/truck/" + $scope.truck_id + "/drive/" + driverId + "/bind", {}).then(function (bindData) {
                    if (bindData.success === true) {
                        $scope.getDriverDetails();
                        $scope.getCompanyAndTruckInfo();
                        swal("绑定主驾成功", "", "success");
                    }
                    else {
                        swal(bindData.msg, "", "error");
                    }
                });
            }
            else {
                swal("请选择货车", "", "error");
            }
        };

        // 解绑主驾
        $scope.unBundling = function () {
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + $scope.driverInfo.truck_id + "/drive/" + driverId + "/unbind", {}).then(function (unbindData) {
                if (unbindData.success === true) {
                    $scope.getDriverDetails();
                    $scope.getCompanyAndTruckInfo();
                    swal("解绑主驾成功", "", "success");
                }
                else {
                    swal("解绑失败", "", "error");
                }
            });
        };

        // 解绑副驾
        $scope.unBundlingCopilot = function () {
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + $scope.driverInfo.vice_truck_id + "/viceDrive/" + driverId + "/unbind", {}).then(function (unbindData) {
                if (unbindData.success === true) {
                    $scope.getDriverDetails();
                    $scope.getCompanyAndTruckInfo();
                    swal("解绑副驾成功", "", "success");
                }
                else {
                    swal("解绑失败", "", "error");
                }
            });
        };

        // 绑定副驾
        $scope.bundlingCopilot = function () {
            if ($scope.truck_id) {
                _basic.put($host.api_url + "/user/" + userId + "/truck/" + $scope.truck_id + "/viceDrive/" + driverId + "/bind", {}).then(function (bindData) {
                    if (bindData.success === true) {
                        $scope.getDriverDetails();
                        $scope.getCompanyAndTruckInfo();
                        swal("绑定副驾成功", "", "success");
                    }
                    else {
                        swal(bindData.msg, "", "error");
                    }
                });
            }
            else {
                swal("请选择货车", "", "error");
            }
        };


        // 司机信息
        $scope.submitInfo = function () {
            var newDriverInfo = {
                driveName: $scope.driverInfo.drive_name,
                gender: $scope.driverInfo.gender,
                idNumber: $scope.driverInfo.id_number,
                tel: $scope.driverInfo.mobile,
                licenseType: $scope.driverInfo.license_type,
                sibTel: $scope.driverInfo.sib_tel,
                licenseDate: $scope.driverInfo.license_date,
                remark: $scope.driverInfo.remark
            };
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId, newDriverInfo).then(function (data) {
                if (data.success === true) {
                    swal("修改成功", "", "success");
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        };


        // 根据输入关键字过滤货车
        $scope.updateTruckList = function () {
            $scope.newTruckList = [];
            if ($scope.driverInfo.truck_num != "") {
                for (var i = 0; i < $scope.truckList.length; i++) {
                    if (($scope.truckList[i].truck_num).indexOf($scope.driverInfo.truck_num) !== -1) {
                        $scope.newTruckList.push($scope.truckList[i]);
                    }
                }
            }
            else {
                $scope.newTruckList = $scope.truckList;
            }
        };

        // 获取所有相关数据
        $scope.queryData = function () {
            $scope.getCompanyAndTruckInfo();
            $scope.getDriverDetails();
            $scope.getTruckUserInfo();
        };
        $scope.queryData();


}]);