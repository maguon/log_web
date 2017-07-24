/**
 * Created by zcy on 2017/7/14.
 */
app.controller("truck_driver_details_controller", ["$scope","$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$state, $stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var driverId = $stateParams.id;
    $scope.stepFirst = true;
    $scope.stepSecond = false;
    $scope.stepThird = false;
    // 电话号正则
    $scope.mobileReg = _config.mobileRegx;

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
    console.log("driveId",driverId);
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
                $scope.drive_img = [{
                    img: $host.file_url + '/image/' + data.result[0].drive_image,
                }];
                $scope.license_img = [{
                    img: $host.file_url + '/image/' + data.result[0].license_image,
                }];

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
                // console.log("truckInfoData",truckInfoData);
                $scope.truckInfoList = truckInfoData.result[0].comments;
            }
        });
    };

    // 点击tab控制显示隐藏
    $scope.showDriverDetails = function () {
        $scope.stepFirst = true;
        $scope.stepSecond = false;
        $scope.stepThird = false;
    };
    $scope.showDriverImages = function () {
        $scope.stepFirst = false;
        $scope.stepSecond = true;
        $scope.stepThird = false;
    };
    $scope.showDriverBand = function () {
        $scope.stepFirst = false;
        $scope.stepSecond = false;
        $scope.stepThird = true;
    };


    // 司机解绑与重新绑定
    $scope.check_trailer = function (truckId) {
        $scope.truck_id = truckId;
        // console.log("truckId",truckId);
    };

    $scope.unBundling = function () {
        // 判断绑定是否为空，为空则进行绑定操作，否则进行解绑操作
        if ($scope.driverInfo.truck_num == null) {
            if ($scope.truck_id) {
                _basic.put($host.api_url + "/user/" + userId + "/truck/" + $scope.truck_id + "/drive/" + driverId + "/bind", {}).then(function (bindData) {
                    if (bindData.success === true) {
                        $scope.getDriverDetails();
                        $scope.getCompanyAndTruckInfo();
                        swal("绑定成功", "", "success");
                    }
                    else {
                        swal(bindData.msg, "", "error");
                    }
                });
            }
            else {
                swal("请选择货车", "", "error");
            }
        }
        // 解绑
        else {
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + $scope.driverInfo.truck_id + "/drive/0/unbind", {}).then(function (unbindData) {
                if (unbindData.success === true) {
                    $scope.getDriverDetails();
                    $scope.getCompanyAndTruckInfo();
                    swal("解绑成功", "", "success");
                }
                else {
                    swal("解绑失败", "", "error");
                    // console.log("userId", userId, "truck_id", $scope.truck_id, "driverId", driverId);
                }
            });
        }
        // console.log($scope.relatedTruck);
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

    // 身份证上传
    $scope.uploadIdCardImage = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            // console.log("imageId:",imageId);
            var nowDate = moment(new Date()).format("YYYY-DD-MM HH:mm");
            $scope.$apply(function () {
                $scope.drive_img = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
                // console.log("imageId",$scope.drive_img[0].img);
            });
            var driveImageObj = {
                "driveImage": imageId,
                "imageType": 1
            };
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId + "/image", driveImageObj).then(function (data) {
                if (data.success == true) {
                    console.log("上传成功");
                    swal("身份证上传成功", "", "success");
                    if ($scope.drive_img.length != 0) {
                        viewer.destroy();
                    }
                    $scope.getDriverDetails();
                } else {
                    swal(data.msg, "", "error");
                    console.log("上传失败:",data.msg);
                }
            })
        });
    };


    // 驾驶证上传
    $scope.uploadLicenseImage = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            var nowDate = moment(new Date()).format("YYYY-DD-MM HH:mm");
            $scope.$apply(function () {
                $scope.license_img = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
            });
            var licenseImageObj = {
                "driveImage": imageId,
                "imageType": 2
            };
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId + "/image", licenseImageObj).then(function (data) {
                if (data.success == true) {
                    console.log("上传成功");
                    swal("驾驶证上传成功", "", "success");
                    if ($scope.license_img.length != 0) {
                        viewer.destroy();
                    }
                    $scope.getDriverDetails();
                } else {
                    swal(data.msg, "", "error");
                    console.log("上传失败:",data.msg);
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
    $scope.driverFinish = function () {
        viewer = new Viewer(document.getElementById('look_driverIdentity'), {
            url: 'data-original'
        });
    };


    // 司机信息
    $scope.submitInfo = function () {
        var newDriverInfo = {
            driveName: $scope.driverInfo.drive_name,
            gender: $scope.driverInfo.gender,
            idNumber: $scope.driverInfo.id_number,
            tel: $scope.driverInfo.tel,
            companyId: $scope.driverInfo.company_id,
            licenseType: $scope.driverInfo.license_type,
            entryDate: $scope.driverInfo.confirm_date,
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

    // 获取所有相关数据
    $scope.queryData = function () {
        $scope.getCompanyAndTruckInfo();
        $scope.getDriverDetails();
        $scope.getTruckUserInfo();
    };
    $scope.queryData();


}]);