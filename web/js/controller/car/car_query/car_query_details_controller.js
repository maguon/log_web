/**
 * Created by zcy on 2017/6/28.
 */
app.controller("car_query_details_controller", ["$scope", "$stateParams", "$host", "_basic", "_config", "baseService", "$state", function ($scope, $stateParams, $host, _basic, _config, baseService, $state) {
    var userId = _basic.getSession(_basic.USER_ID);
    var vin = $stateParams.vin;
    var carId = $stateParams.id;
    $scope.tabSwitchLeft = true;
    $scope.tabSwitchRight = false;

    // 根据vin码获取相关车辆信息
    $scope.getVinCodeInfo = function () {
        _basic.get($host.api_url + "/carList?" + "vin=" + vin).then(function (carData) {
            if (carData.success === true) {
                $scope.vincodeList = carData.result;
                console.log("vin:", carData);
            }
            else {
                swal(carData.msg, "", "error");
            }
        });
    };
    $scope.getVinCodeInfo();

    // 根据用户id和vin码获取相关操作记录
    $scope.getOperationRecord = function () {
        _basic.get($host.record_url + "/user/" + userId + "/car/" + carId + "/record").then(function (recordData) {
            if (recordData.success === true) {
                $scope.recordList = recordData.result[0].comment;
                // 将数组里的图片有效路径转为正确路径,并添加用户名
                for (var i = 0; i < recordData.result[0].storage_image.length; i++) {
                    recordData.result[0].storage_image[i].url = $host.file_url + '/image/' + recordData.result[0].storage_image[i].url
                    recordData.result[0].storage_image[i].user = $scope.recordList[0].name;
                }
                $scope.imageList = recordData.result[0].storage_image;
                console.log("recordList666:", $scope.recordList);
                console.log("imageList", $scope.imageList);
            }
            else {
                swal(recordData.msg, "", "error");
            }
        });
    };
    $scope.getOperationRecord();

    // tab跳转
    $scope.basicInfo = function () {
        $scope.tabSwitchLeft = true;
        $scope.tabSwitchRight = false;
        $('.carImages').removeClass("active");
        $('.basicInfo').addClass("active");
    };

    $scope.carImages = function () {
        $scope.tabSwitchLeft = false;
        $scope.tabSwitchRight = true;
        $('.carImages').addClass("active");
        $('.basicInfo').removeClass("active");
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
                    console.log(data);
                    var imageId = data.imageId;
                    $scope.imagesId = imageId;
                    console.log("imageId:", $scope.imagesId);
                    _basic.post($host.record_url + "/car/" + carId + "/vin/" + vin + "/storageImage", {
                        "username": _basic.getSession(_basic.USER_NAME),
                        "userId": userId,
                        "userType": _basic.getSession(_basic.USER_TYPE),
                        "url": imageId
                    }).then(function (data) {
                        if (data.success === true) {
                            console.log("success", data);
                            $scope._id = data.result._id;
                            if ($scope.imageList.length != 0) {
                                viewer.destroy();
                            }
                            var nowDate = moment(new Date()).format("YYYY-DD-MM HH:mm");
                            $scope.imageList.push({
                                url: $host.file_url + '/image/' + imageId,
                                record_id: $scope._id,
                                time: nowDate,
                                user: _basic.getSession(_basic.USER_NAME)
                            });
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

    // 返回
    $scope.return = function () {
        // console.log($stateParams.mark);
        if ($stateParams.mark == 1) {
            $state.go($stateParams.from, {reload: true})
        } else {
            $state.go($stateParams.from, {
                id: $scope.vincodeList.make_id,
                form: $stateParams._form,
                status: $stateParams.status
            }, {reload: true})
        }
    };

    var viewer;
    $scope.renderFinish = function () {
        viewer = new Viewer(document.getElementById('look_img'), {
            url: 'data-original'
        });
    };

}]);
