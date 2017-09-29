/**
 * Created by zcy on 2017/7/13.
 */
app.controller("add_truck_driver_controller", ["$scope", "$state", "_basic", "_config", "$host", function ($scope, $state, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var Picture_driverid;
    $scope.step_first = true;
    $scope.step_second = false;
    $scope.step_second = false;
    $scope.step_third = false;
    $scope.checkVal = false;
    // 电话号正则
    $scope.mobileReg = _config.mobileRegx;
    // 身份证正则
    $scope.identityReg = _config.CarNoRegx;

    // $scope.step_second = true;

    // 验证身份证号
    $scope.checkId = function (value) {
        if(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)){
            $scope.checkVal = true
        }
    };

    // 提交司机信息
    $scope.submitForm = function (inValid) {
        // console.log("isValid", inValid);
        $scope.checkId($scope.identityNum);
        $scope.submitted = true;
        if (inValid) {
            var driverInfo = {
                driveName: $scope.driveName,
                gender: $scope.driverType,
                idNumber: $scope.identityNum,
                tel: $scope.driverPhone,
                companyId: $scope.driverCompany,
                operateType:$scope.operateType,
                licenseType: $scope.drivingLicense,
                address: $scope.driverAddress,
                sibTel: $scope.driverParent,
                licenseDate: $scope.licenseEndTime,
                remark: $scope.remark
            };
            // console.log("driverInfo",driverInfo);
            _basic.post($host.api_url + "/user/" + userId + "/drive", driverInfo).then(function (data) {
                if (data.success === true) {
                    // console.log("successData", data);
                    // console.log("info", driverInfo);
                    // swal("新增成功", "", "success");
                    $scope.step_first = false;
                    $scope.step_second = true;
                    Picture_driverid = data.id;
                    $(".tabs .indicator").css({
                        right: 515 + "px",
                        left: 514 + "px"
                    });
                    $(".tab2>a").addClass("active");
                    $(".tab1>a").removeClass("active");
                    $(".tab3>a").removeClass("active");
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    };

    // 根据select选择的所属类型获取所属公司信息
    $scope.chooseOperateType = function () {
        // console.log("operateType",$scope.operateType);
        _basic.get($host.api_url + "/company?operateType=" + $scope.operateType).then(function (companyData) {
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
        _basic.get($host.api_url + "/truckFirst?truckType=1").then(function (truckData) {
            if (truckData.success === true) {
                $scope.truckList = truckData.result;
                // console.log("truckList",$scope.truckList);
            }
            else {
                swal(truckData.msg, "", "error");
            }
        });
    };
    $scope.queryData();

    // 照片上传函数
    function uploadBrandImage(filename,dom_obj,callback) {
        if(filename){
            if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
                var max_size_str = dom_obj.attr('max_size');
                var max_size = 4 * 1024 * 1024; //default: 4M
                var re = /\d+m/i;
                if (re.test(max_size_str)) {
                    max_size = parseInt(max_size_str.substring(0, max_size_str.length - 1)) * 1024 * 1024;
                    // $currentDom = $(dom).prev();
                    _basic.formPost(dom_obj.parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=2', function (data) {
                        if (data.success) {
                            // // console.log(data,Picture_truckid);
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
    $scope.uploadIdCardImageFront = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            // console.log("imageId:",imageId);
            var nowDate = moment(new Date()).format("YYYY-DD-MM HH:mm");
            $scope.$apply(function () {
                $scope.drive_img_front = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
            });
            var obj = {
                "driveImage": imageId,
                "imageType": 1
            };
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + Picture_driverid + "/image", obj).then(function (data) {
                if (data.success == true) {
                    console.log("上传成功");
                    swal("身份证正面上传成功", "", "success");
                }
                else {
                    swal(data.msg, "", "error");
                    console.log("上传失败:",data.msg);
                }
            })

        });
    };

    // 身份证上传（背面）
    $scope.uploadIdCardImageBack = function (dom){
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            // console.log("imageId:",imageId);
            var nowDate = moment(new Date()).format("YYYY-DD-MM HH:mm");
            $scope.$apply(function () {
                $scope.drive_img_back = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
            });
            var obj = {
                "driveImage": imageId,
                "imageType": 2
            };
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + Picture_driverid + "/image", obj).then(function (data) {
                if (data.success == true) {
                    console.log("上传成功");
                    swal("身份证背面上传成功", "", "success");
                }
                else {
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
            // console.log("imageId:",imageId);
            var nowDate = moment(new Date()).format("YYYY-DD-MM HH:mm");
            $scope.$apply(function () {
                $scope.license_img = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
            });
            var obj = {
                "driveImage": imageId,
                "imageType": 3
            };
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + Picture_driverid + "/image", obj).then(function (data) {
                if (data.success == true) {
                    console.log("上传成功");
                    swal("驾驶证上传成功", "", "success");
                }
                else {
                    swal(data.msg, "", "error");
                    console.log("上传失败:",data.msg);
                }
            })
        });
    };

    // 准驾证上传
    $scope.uploadPermitImage = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            // console.log("imageId:",imageId);
            var nowDate = moment(new Date()).format("YYYY-DD-MM HH:mm");
            $scope.$apply(function () {
                $scope.permit_img = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
            });
            var obj = {
                "driveImage": imageId,
                "imageType": 4
            };
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + Picture_driverid + "/image", obj).then(function (data) {
                if (data.success == true) {
                    console.log("上传成功");
                    swal("准驾证上传成功", "", "success");
                }
                else {
                    swal(data.msg, "", "error");
                    console.log("上传失败:",data.msg);
                }
            })
        });
    };

    // 司机个人照片上传
    $scope.uploadDriverImage = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            // console.log("imageId:",imageId);
            var nowDate = moment(new Date()).format("YYYY-DD-MM HH:mm");
            $scope.$apply(function () {
                $scope.driver_img = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
            });
            var obj = {
                "driveImage": imageId,
                "imageType": 5
            };
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + Picture_driverid + "/image", obj).then(function (data) {
                if (data.success == true) {
                    console.log("上传成功");
                    swal("司机照片上传成功", "", "success");
                }
                else {
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
    $scope.driverIdCardFrontFinish = function () {
        viewer = new Viewer(document.getElementById('look_driverIdentity_front'), {
            url: 'data-original'
        });
    };
    $scope.driverIdCardBackFinish = function () {
        viewer = new Viewer(document.getElementById('look_driverIdentity_back'), {
            url: 'data-original'
        });
    };
    $scope.permitFinish = function () {
        viewer = new Viewer(document.getElementById('look_permitImg'), {
            url: 'data-original'
        });
    };
    $scope.driverFinish = function () {
        viewer = new Viewer(document.getElementById('driver_img'), {
            url: 'data-original'
        });
    };

    // 点击按钮切换下一页
    $scope.uploadImage = function () {
        $scope.newTruckList = $scope.truckList;
        $scope.step_first = false;
        $scope.step_second = false;
        $scope.step_third = true;
        $(".tabs .indicator").css({
            right:0 + "px",
            left:1001 + "px"
        });
        $(".tab3>a").addClass("active");
        $(".tab1>a").removeClass("active");
        $(".tab2>a").removeClass("active");

    };

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
                    $state.go('truck_driver');
                }
                else {
                    swal(bindData.msg, "", "error");
                }
            });
        }
        else{
            $state.go('truck_driver');
        }
    }

}]);