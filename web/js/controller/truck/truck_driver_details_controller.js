/**
 * Created by zcy on 2017/7/14.
 */
app.controller("truck_driver_details_controller", ["$scope","$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$state, $stateParams, _basic, _config, $host) {
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
        $state.go($stateParams.from,{from:"truck_driver_details"}, {reload: true})
    };

    // 获取关联货车及公司信息
    $scope.getCompanyAndTruckInfo = function () {
        _basic.get($host.api_url + "/company").then(function (companyData) {
            if (companyData.success === true) {
                $scope.companyList = companyData.result;
                // console.log("companyList",$scope.companyList);
            }
            else {
                swal(companyData.msg, "", "error");
            }
        });

        _basic.get($host.api_url + "/truckFirst?truckType=1").then(function (truckData) {
            if (truckData.success === true) {
                $scope.truckList = truckData.result;
                $scope.newTruckList = $scope.truckList;
                // console.log("truckData",$scope.truckList);
            }
            else {
                swal(truckData.msg, "", "error");
            }
        });
    };

    // 根据select选择的所属类型获取所属公司信息
    $scope.chooseOperateType = function () {
        // console.log("operateType",$scope.driverInfo.operate_type);
        _basic.get($host.api_url + "/company?operateType=" + $scope.driverInfo.operate_type).then(function (companyData) {
            if (companyData.success === true) {
                $scope.companyList = companyData.result;
                // $scope.driverCompany = "";
            }
            else {
                swal(companyData.msg, "", "error");
            }
        });
    };

    // 根据司机id查询司机详细信息
    // console.log("driveId",driverId);
    $scope.getDriverDetails = function () {
        _basic.get($host.api_url + "/drive?driveId=" + driverId).then(function (data) {
            if (data.success === true) {
                // console.log("driveData",data);
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
    $scope.showDriverImages = function () {
        $scope.stepFirst = false;
        $scope.stepSecond = true;
        $scope.stepThird = false;
        $scope.stepforth = false;
    };
    $scope.showDriverBand = function () {
        $scope.stepFirst = false;
        $scope.stepSecond = false;
        $scope.stepThird = true;
        $scope.stepforth = false;
    };
    $scope.showCompanyDetails = function () {
        $scope.stepFirst = false;
        $scope.stepSecond = false;
        $scope.stepThird = false;
        $scope.stepforth = true;
    };

    // 司机解绑与重新绑定
    $scope.check_trailer = function (truckId) {
        $scope.truck_id = truckId;
        // console.log("truckId",truckId);
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
                // console.log("userId", userId, "truck_id", $scope.truck_id, "driverId", driverId);
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
                // console.log("userId", userId, "truck_id", $scope.truck_id, "driverId", driverId);
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

    // 照片上传函数
    function uploadBrandImage(filename,dom_obj,callback) {
        if(filename){
            if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
                var max_size_str = dom_obj.attr('max_size');
                var max_size = 4 * 1024 * 1024; //default: 4M
                var re = /\d+m/i;
                if (re.test(max_size_str)) {
                    max_size = parseInt(max_size_str.substring(0, max_size_str.length - 1)) * 1024 * 1024;
                    _basic.formPost(dom_obj.parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=2', function (data) {
                        if (data.success) {
                            var imageId = data.imageId;
                            callback(imageId);
                        } else {
                            swal('上传图片失败', "", "error");
                        }
                    }, function (error) {
                        swal('服务器内部错误', "", "error");
                    })
                }

                if (dom_obj[0].files[0].size > max_size) {
                    swal('图片文件最大: ' + max_size_str, "", "error");
                    return false;
                }
            }
            else if (filename && filename.length > 0) {
                dom_obj.val('');
                swal('支持的图片类型为. (jpeg,jpg,png,gif,svg,bmp,tiff)', "", "error");
            }else {

            }
        }
    };

    // 身份证上传（正面）
    $scope.uploadIdCardFrontImage = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            // console.log("imageId:",imageId);
            var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
            $scope.$apply(function () {
                $scope.drive_img_front = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
                // console.log("imageId",$scope.drive_img[0].img);
            });
            var obj = {
                "driveImage": imageId,
                "imageType": 1
            };
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId + "/image", obj).then(function (data) {
                if (data.success == true) {
                    // console.log("上传成功");
                    swal("身份证正面上传成功", "", "success");
                    if ($scope.drive_img.length != 0) {
                        viewer.destroy();
                    }
                    $scope.getDriverDetails();
                } else {
                    swal(data.msg, "", "error");
                    // console.log("上传失败:",data.msg);
                }
            })
        });
    };

    // 身份证上传（背面）
    $scope.uploadIdCardBackImage = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            // console.log("imageId:",imageId);
            var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
            $scope.$apply(function () {
                $scope.drive_img_back = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
                // console.log("imageId",$scope.drive_img[0].img);
            });
            var obj = {
                "driveImage": imageId,
                "imageType": 2
            };
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId + "/image", obj).then(function (data) {
                if (data.success == true) {
                    // console.log("上传成功");
                    swal("身份证背面上传成功", "", "success");
                    if ($scope.drive_img.length != 0) {
                        viewer.destroy();
                    }
                    $scope.getDriverDetails();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        });
    };


    // 驾驶证上传
    $scope.uploadLicenseImage = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
            $scope.$apply(function () {
                $scope.license_img = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
            });
            // console.log("$scope.license_img",$scope.license_img);
            var obj = {
                "driveImage": imageId,
                "imageType": 3
            };
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId + "/image", obj).then(function (data) {
                if (data.success == true) {
                    // console.log("上传成功");
                    swal("驾驶证上传成功", "", "success");
                    if ($scope.license_img.length != 0) {
                        viewer.destroy();
                    }
                    $scope.getDriverDetails();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        });
    };

    // 准驾证上传
    $scope.uploadPermitImage = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
            $scope.$apply(function () {
                $scope.permit_img = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
            });
            var obj = {
                "driveImage": imageId,
                "imageType": 4
            };
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId + "/image", obj).then(function (data) {
                if (data.success == true) {
                    // console.log("上传成功");
                    swal("准驾证上传成功", "", "success");
                    if ($scope.permit_img.length != 0) {
                        viewer.destroy();
                    }
                    $scope.getDriverDetails();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        });
    };

    // 司机照片上传
    $scope.uploadDriverImage = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
            $scope.$apply(function () {
                $scope.driver_img = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
            });
            var obj = {
                "driveImage": imageId,
                "imageType": 5
            };
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId + "/image", obj).then(function (data) {
                if (data.success == true) {
                    // console.log("上传成功");
                    swal("司机照片上传成功", "", "success");
                    if ($scope.driver_img.length != 0) {
                        viewer.destroy();
                    }
                    $scope.getDriverDetails();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        });
    };


    // 点击查看图片大图
    var viewer;
    $scope.licenseFinish = function () {
        viewer = new Viewer(document.getElementById('look_licenseImg'), {
            url: 'data-original'
        });
    };
    $scope.driverFrontFinish = function () {
        viewer = new Viewer(document.getElementById('look_driverIdentityFront'), {
            url: 'data-original'
        });
    };
    $scope.driverBackFinish = function () {
        viewer = new Viewer(document.getElementById('look_driverIdentityBack'), {
            url: 'data-original'
        });
    };
    $scope.permitFinish = function () {
        viewer = new Viewer(document.getElementById('look_permitImg'), {
            url: 'data-original'
        });
    };
    $scope.driverFinish = function () {
        viewer = new Viewer(document.getElementById('look_driver'), {
            url: 'data-original'
        });
    };


    // 司机信息
    $scope.submitInfo = function () {
        var newDriverInfo = {
            driveName: $scope.driverInfo.drive_name,
            gender: $scope.driverInfo.gender,
            idNumber: $scope.driverInfo.id_number,
            tel: $scope.driverInfo.mobile,

            licenseType: $scope.driverInfo.license_type,
            // entryDate: $scope.driverInfo.confirm_date,
            address: $scope.driverInfo.address,
            sibTel: $scope.driverInfo.sib_tel,
            licenseDate: $scope.driverInfo.license_date,
            remark: $scope.driverInfo.remark
        };
        // console.log(newDriverInfo);
        _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId, newDriverInfo).then(function (data) {
            if (data.success === true) {
                // console.log("successData", data);
                // console.log("info", newDriverInfo);
                swal("修改成功", "", "success");
            }
            else {
                // console.log("noData", data);
                swal(data.msg, "", "error");
            }
        });
    };

    //修改所属公司
    $scope.putCompanyId = function(){
        _basic.get($host.api_url + "/company?companyId="+$scope.driverInfo.company_id).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.companyName = data.result[0].company_name;
                putCompany($scope.companyName)
            } else {
                swal(data.msg, "", "error")
            }
        });
    }
    function putCompany(companyName){
        _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId+'/driveCompany', {
            companyId: $scope.driverInfo.company_id,
            companyName: companyName
        }).then(function (data) {
            if (data.success == true) {
                swal("修改成功", "", "success")
            } else {
                swal(data.msg, "", "error")
            }
        });
    }




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
        // console.log("newTruckList",$scope.newTruckList);
    };

    // 获取所有相关数据
    $scope.queryData = function () {
        $scope.getCompanyAndTruckInfo();
        $scope.getDriverDetails();
        $scope.getTruckUserInfo();
    };
    $scope.queryData();


}]);