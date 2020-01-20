/**
 * Created by zcy on 2017/6/28.
 */
app.controller("car_query_details_controller", ["$scope", "$stateParams", "$host", "_basic", "_config", "baseService", "$state", function ($scope, $stateParams, $host, _basic, _config, baseService, $state) {
    var userId = _basic.getSession(_basic.USER_ID);
    var userName = _basic.getSession(_basic.USER_NAME);
    var vin = $stateParams.vin;
    var carId = $stateParams.id;
    $scope.tabSwitchLeft = true;
    $scope.tabSwitchRight = false;
    $scope.recordList=[];
    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"car_query_details"}, {reload: true})
    };


    // 根据VIN获取相关车辆信息
    $scope.getVinCodeInfo = function () {
        _basic.get($host.api_url + "/carList?" + "carId=" + carId).then(function (carData) {
            if (carData.success === true) {
                $scope.vincodeList = carData.result;
            }
            else {
                swal(carData.msg, "", "error");
            }
        });

        _basic.get($host.api_url + "/dpRouteLoadTaskDetailBase?" + "carId=" + carId).then(function (carData) {
            if (carData.success === true) {
                $scope.loadingDetailsList = carData.result;
                for(var i=0;i< $scope.loadingDetailsList.length;i++){
                    if(carData.result[i].load_date&&carData.result[i].load_date!==undefined){
                        $scope.loadingDetailsList[i].load_date = moment(carData.result[i].load_date).format('YYYY-MM-DD');
                    }
                }

            }
            else {
                swal(carData.msg, "", "error");
            }
        });
    };

    // 根据用户id和VIN获取相关操作记录
    $scope.getOperationRecord = function () {
        _basic.get($host.record_url + "/user/" + userId + "/car/" + carId + "/record").then(function (recordData) {
            if (recordData.success === true) {
                if(recordData.result.length !== 0){
                    for(var i=0;i<recordData.result.length;i++){

                        for(var j=0;j<recordData.result[i].comment.length;j++){
                            $scope.recordList.push(recordData.result[i].comment[j]);
                        }

                    }
                    if(recordData.result[0].storage_image.length !== 0){
                        // 将数组里的图片有效路径转为正确路径,并添加用户名
                        for (var i = 0; i < recordData.result[0].storage_image.length; i++) {
                            recordData.result[0].storage_image[i].url = $host.file_url + '/image/' + recordData.result[0].storage_image[i].url;
                            recordData.result[0].storage_image[i].user = userName;
                        }
                        $scope.imageList = recordData.result[0].storage_image;
                    }
                    else{
                        $scope.imageList = [];
                    }
                }
            }
            else {
                swal(recordData.msg, "", "error");
            }
        });
    };

    // 获取质损信息
    $scope.getDamageInfoList = function () {
        _basic.get($host.api_url + "/damage?vin=" + vin).then(function (data) {
            if (data.success === true) {
                // console.log("data",data);
                $scope.damageInfoList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取当前质损照片
    $scope.getCurrentDamageImage = function (damageId, index) {
        _basic.get($host.record_url + "/damageRecord?damageId=" + damageId).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                var damageList = [];
                if (data.result.length !== 0) {
                    // 如果有图片，则将图片数组放到damageInfoList当前元素的obj里,并转换为有效格式
                    for (var i = 0; i < data.result[0].damage_image.length; i++) {
                        damageList.push({
                            url: $host.file_url + '/image/' + data.result[0].damage_image[i].url,
                            name: data.result[0].damage_image[i].name,
                            timez: data.result[0].damage_image[i].timez
                        });
                    }
                }
                $scope.damageInfoList[index].damageImgList = damageList;
                // console.log("damageInfoList",$scope.damageInfoList);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 图片上传
    $scope.uploadBrandImage = function (dom) {
        var filename = $(dom).val();
        if (filename) {
            if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
                //check size
                //$file_input[0].files[0].size
                var max_size_str = $(dom).attr('max_size');
                var max_size = 4 * 1024 * 1024; //default: 4M
                var re = /\d+m/i;
                if (re.test(max_size_str)) {
                    max_size = parseInt(max_size_str.substring(0, max_size_str.length - 1)) * 1024 * 1024;
                }

                if ($(dom)[0].files[0].size > max_size) {
                    swal('图片文件最大: ' + max_size_str, "", "error");
                    return false;
                }

            }
            else if (filename && filename.length > 0) {
                $(dom).val('');
                swal('支持的图片类型为. (jpeg,jpg,png,gif,svg,bmp,tiff)', "", "error");
            }

            _basic.formPost($(dom).parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=4', function (data) {
                if (data.success) {
                    // console.log(data);
                    var imageId = data.imageId;
                    $scope.imagesId = imageId;
                    // console.log("imageId:", $scope.imagesId);
                    _basic.post($host.record_url + "/car/" + carId + "/vin/" + vin + "/storageImage", {
                        "username": _basic.getSession(_basic.USER_NAME),
                        "userId": userId,
                        "userType": _basic.getSession(_basic.USER_TYPE),
                        "url": imageId
                    }).then(function (data) {
                        if (data.success === true) {
                            // console.log("success", data);
                            $scope._id = data.result._id;
                            if ($scope.imageList.length != 0) {
                                viewer.destroy();
                            }
                            var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
                            $scope.imageList.push({
                                url: $host.file_url + '/image/' + imageId,
                                record_id: $scope._id,
                                timez: nowDate,
                                name: _basic.getSession(_basic.USER_NAME)
                            });
                            // console.log("imageList_push",$scope.imageList)
                        }
                    });
                } else {
                    swal('上传图片失败', "", "error");
                }
            }, function (error) {
                swal('服务器内部错误', "", "error");
            })
        }
    };

    $scope.queryData = function () {
        $scope.getVinCodeInfo();
        $scope.getOperationRecord();
        $scope.getDamageInfoList();
    };
    $scope.queryData();

    var viewer;
    $scope.carImageFinish = function () {
        viewer = new Viewer(document.getElementById('car_image'), {
            url: 'data-original'
        });
    };

    $scope.damageImageFinish = function () {
        viewer = new Viewer(document.getElementById('damage_image'), {
            url: 'data-original'
        });
    };

}]);
