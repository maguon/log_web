app.controller("damage_report_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.userName = _basic.getSession(_basic.USER_NAME);
    $scope.userDepartment = parseInt(_basic.getSession(_basic.USER_TYPE));

    $scope.step_1 = true;
    $scope.step_2 = false;

    $scope.vinCheck = false;
    $scope.damageRemark = "";
    $scope.driverName = "";
    $scope.vinCode = "";
    $scope.damage_imageBox = [];
    $scope.damage_image_i = [];
    var damageId;


    // 根据输入的VIN进行模糊查询和精确查询
    $scope.searchVinInfo = function () {
        // 模糊查询所有匹配的6位VIN
        if ($scope.vinCode != undefined && $scope.vinCode != "") {
            if ($scope.vinCode.length >= 6) {
                _basic.get($host.api_url + "/carList?vinCode=" + $scope.vinCode + "&start=0&size=4").then(function (data) {
                    if (data.success == true && data.result.length > 0) {
                        $scope.vin_msg = data.result;
                        var vinObjs = {};
                        for (var i in $scope.vin_msg) {
                            vinObjs[$scope.vin_msg[i].id+'       '+$scope.vin_msg[i].vin] = null;
                        }
                        return vinObjs;
                    }
                    else {
                        return {};
                    }
                }).then(function (vinObjs) {
                    $('#autocomplete-input-vin').autocomplete({
                        data: vinObjs,
                        minLength: 6
                    });
                    $('#autocomplete-input-vin').focus();

                })
            }
            else {
                $('#autocomplete-input-vin').autocomplete({minLength: 6});
                $scope.vin_msg = {}
            }
        }

        // 根据填充完毕的完整VIN信息进行精确查询
        if ($scope.vinCode.length >= 17) {
            $scope.vinIdCode=$scope.vinCode.split('       ')[1];
            $scope.carIdCode=$scope.vinCode.split('       ')[0];
            $scope.vinCode=$scope.vinCode.split('       ')[1];
            console.log( $scope.vinIdCode,$scope.carIdCode,$scope.vinCode)
            _basic.get($host.api_url + "/carDamageDeclare?vin=" + $scope.vinIdCode+"&carId="+ $scope.carIdCode).then(function (data) {
                if (data.success === true && data.result.length !== 0) {
                    $scope.vinCheck = true;
                    $scope.vinData = data.result[0];
                    if(data.result[0].load_date!==null){
                        $scope.vinData.load_date=moment(data.result[0].load_date.toString()).format("YYYY-MM-DD hh:ss");
                    }

                    if($scope.vinData.drive_name!==null){
                        getDriverDetail();
                    }
                }
                else {
                    $scope.vinCheck = false;
                    swal("VIN不存在，请重新填写","","error")
                }
            });
        }
        else{
            $scope.vinData = [];
        }

    };

    function getDriverDetail(){
        _basic.get($host.api_url + "/drive?driveName=" + $scope.vinData.drive_name).then(function (data) {
            if (data.success === true) {
                $scope.AccurateDriverInfo = data.result[0];
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }


    // 获取所有司机信息
    function getAllDriver() {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success === true) {
                $scope.driverList = data.result;
                var driverObj = {};
                for (var i = 0; i < data.result.length; i++) {
                    driverObj[data.result[i].drive_name + "-" + data.result[i].mobile] = null;
                }
                // 填充autoComplete
                $('#autocomplete-input-driver').autocomplete({
                    data: driverObj,
                    limit:5,
                    // 点击后填充完成函数
                    onAutocomplete: function(val) {
                        var driverNameAndTel = val.split("-");
                        $scope.driverNameTel = driverNameAndTel.slice(1)+'';
                        $scope.searchAccurateDriver();
                    },
                    minLength: 1
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 根据电话号精确搜索司机
    $scope.searchAccurateDriver = function () {
        _basic.get($host.api_url + "/drive?mobile=" + $scope.driverNameTel).then(function (data) {
            if (data.success === true) {
                $scope.AccurateDriverInfo = data.result[0];
                $scope.vinData.truck_num= data.result[0].truck_num;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 如果手动修改了司机信息，司机id变为0
    $scope.hasModifyDriver = function () {
        if($scope.AccurateDriverInfo !== undefined) {
            $scope.AccurateDriverInfo.id = 0;
            $scope.AccurateDriverInfo.truck_id = 0;
            $scope.AccurateDriverInfo.truck_num = "";
            $scope.AccurateDriverInfo.drive_name = "";
        }
    };

    // 提交填写信息转到下一步
    $scope.nextStep = function () {
        var truckId = $scope.vinData.drive_name === "" ||$scope.vinData.drive_name === null? 0 : $scope.AccurateDriverInfo.truck_id;
        var truckNum = $scope.vinData.drive_name === "" ||$scope.vinData.drive_name === null? "" : $scope.AccurateDriverInfo.truck_num;
        var driveId = $scope.vinData.drive_name === "" ||$scope.vinData.drive_name === null? 0 : $scope.AccurateDriverInfo.id;
        var driveName = $scope.vinData.drive_name === "" ||$scope.vinData.drive_name === null? "" : $scope.AccurateDriverInfo.drive_name;
        if($scope.vinCode !== ""){
            if($scope.vinCode.length === 17 && $scope.vinCheck){
                _basic.post($host.api_url + "/user/" + userId + "/damage",{
                    carId:$scope.vinData.id,
                    vin:$scope.vinCode,
                    truckId:truckId,
                    truckNum:truckNum,
                    driveId:driveId,
                    driveName:driveName,
                    damageExplain:$scope.damageRemark
                }).then(function (data) {
                    if (data.success === true) {
                        $scope.step_1 = false;
                        $scope.step_2 = true;
                        damageId = data.id;
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
            else{
                swal("VIN有误，请重新填写","","error")
            }
        }
        else{
            swal("请填写VIN","","error")
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
                    _basic.formPost(dom_obj.parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=4', function (data) {
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
    }

    // 质损照片上传
    $scope.uploadDamageImage = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            _basic.post($host.record_url + "/user/" + userId + "/damage/" + damageId + "/image", {
                "username": _basic.getSession(_basic.USER_NAME),
                "userId": userId,
                "userType": _basic.getSession(_basic.USER_TYPE),
                "url": imageId,
                "vin": $scope.vinCode
            }).then(function (data) {
                if (data.success == true) {
                    if ($scope.damage_imageBox.length != 0) {
                        viewer.destroy();
                    }
                    var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
                    $scope.damage_image_i.push($host.file_url + '/image/' + imageId);
                    $scope.damage_imageBox.push({
                        src: $host.file_url + '/image/' + imageId,
                        time: nowDate,
                        user: _basic.getSession(_basic.USER_NAME)
                    });
                }
            });
        });
    };

    // 点击图片查看大图
    var viewer;
    $scope.damageFinish = function () {
        viewer = new Viewer(document.getElementById('damage_image'), {
            url: 'data-original'
        });
    };

    // 获取数据
    $scope.queryData = function () {
        getAllDriver();
    };
    $scope.queryData();
}]);