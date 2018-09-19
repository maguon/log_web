app.controller("damage_declaration_details_controller", ["$scope","$state", "$stateParams", "$host", "_basic", function ($scope,$state, $stateParams, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    var damageId = $stateParams.id;
    $scope.photoClick = false;
    $scope.driverModify = false;
    $scope.damageStatus = $stateParams.status;
    $scope.damageImageList = [];

    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"damage_declaration_details"}, {reload: true})
    };


    // 获取当前质损信息
    $scope.getCurrentDamageInfo = function () {
        _basic.get($host.api_url + "/damage?damageId=" + damageId).then(function (data) {
            if (data.success === true) {
                data.result[0].created_on = moment(data.result[0].created_on).format("YYYY-MM-DD HH:mm:ss");
                $scope.currentDamageInfo = data.result[0];
                $scope.driverName = data.result[0].drive_name;
                $scope.driverId = data.result[0].drive_id;
                $scope.truckNum = data.result[0].truck_num;
                $scope.truckId = data.result[0].truck_id;
                // console.log("currentDamageInfo",$scope.currentDamageInfo);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取所有司机信息
    $scope.getAllDriver = function () {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success === true) {
                // console.log("driver",data);
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
                        $scope.searchAccurateDriver(driverNameAndTel);
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
    $scope.searchAccurateDriver = function (nameAndTelArr) {
        _basic.get($host.api_url + "/drive?mobile=" + nameAndTelArr[1]).then(function (data) {
            if (data.success === true) {
                $scope.truckNum = data.result[0].truck_num;
                $scope.driverId = data.result[0].id;
                $scope.driverName = data.result[0].drive_name;
                $scope.truckId = data.result[0].truck_id;
                // console.log("afterModifyDriverInfo",data.result[0]);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 如果手动修改了司机信息，司机id变为0
    $scope.hasModifyDriver = function () {
        $scope.driverId = 0;
        $scope.truckId = 0;
        $scope.truckNum = "";
        $scope.driverName = "";
    };

    // 提交修改后的信息
    $scope.submitModifyInfo = function () {
        _basic.put($host.api_url + "/user/" + userId + "/damage/" + damageId,{
            truckId:$scope.truckId,
            truckNum:$scope.truckNum,
            driveId:$scope.driverId,
            driveName:$scope.driverName,
            damageExplain:$scope.currentDamageInfo.damage_explain
        }).then(function (data) {
            if (data.success === true) {
                swal("修改成功", "", "success");
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取当前质损照片
    $scope.getCurrentDamageImage = function () {
        _basic.get($host.record_url + "/damageRecord?damageId=" + damageId).then(function (data) {
            if (data.success === true) {
                if(data.result.length !== 0){
                    $scope.damageImageList = data.result[0].damage_image;
                    for (var i = 0; i < $scope.damageImageList.length; i++) {
                        $scope.damageImageList[i].url = $host.file_url + '/image/' + $scope.damageImageList[i].url
                    }
                    // console.log("imageData",$scope.damageImageList)
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
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
                "vin": $scope.currentDamageInfo.vin
            }).then(function (data) {
                if (data.success == true) {
                    $scope.getCurrentDamageImage();
                    // 保证新增的图片也可以放大
                    if ($scope.damageImageList.length != 0) {
                        viewer.destroy();
                    }
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

    // 获取当前damageId下之前保存的信息
   function  getBeforeDamageInfo(){
        _basic.get($host.api_url + "/damageCheck?damageId=" + damageId).then(function (data) {
            if (data.success === true) {
                if(data.result.length !== 0){
                    if(data.result[0].damage_type === 0 || data.result[0].damage_type == null){
                        data.result[0].damage_type = ""
                    }
                    if(data.result[0].damage_link_type === 0 || data.result[0].damage_link_type == null){
                        data.result[0].damage_link_type = ""
                    }
                }
                $scope.damageInfoBefore = data.result[0];
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };


    // tab切换
    $scope.showDamageDetails = function () {
        $scope.photoClick = false;
    };

    $scope.showDamageImages = function () {
        $scope.photoClick = true;
        $scope.getCurrentDamageImage();
    };


    // 获取数据
    $scope.queryData = function () {
        $scope.getCurrentDamageInfo();
        $scope.getAllDriver();
        getBeforeDamageInfo();
    };
    $scope.queryData();
}]);