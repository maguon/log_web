/**
 * Created by ASUS on 2017/5/4.
 */
app.controller("storage_store_controller", ["$scope", "$host", "_basic", "$state", "$rootScope", "_config",  "baseService", function ($scope, $host, _basic, $state, $rootScope, _config, baseService) {
  /*  var userId = _basic.getSession(_basic.USER_ID);*/
    var now_date = moment(new Date()).format('YYYYMMDD');
    var searchAll = function () {
        var obj = {
            dateStart: now_date,
            dateEnd: now_date
        };

        _basic.get($host.api_url + "/storageDate?" + _basic.objToUrl(obj)).then(function (data) {
            if (data.success == true) {
                $scope.store_storage = data.result;
            }

        })
    };
    searchAll();

   /* // 车辆品牌查询
    _basic.get($host.api_url + "/carMake").then(function (data) {
        if (data.success == true) {
            $scope.makecarName = data.result;
        }
        else {
            swal(data.msg, "", "error");
        }
    });*/

  /*  // 车辆型号联动查询
    $scope.changeMakeId = function (val) {
        if ($scope.curruntId == val) {

        }
        else {
            $scope.curruntId = val;
            _basic.get($host.api_url + "/carMake/" + val + "/carModel").then(function (data) {
                if (data.success == true) {
                    $scope.carModelName = data.result;

                } else {
                    swal(data.msg, "", "error")
                }
            })
        }
    };*/

    // 颜色
    $scope.color = _config.config_color;
/*

    // 存放位置联动查询--行
    $scope.changeStorageId = function (val) {
        _basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.storageParking = data.result;

                $scope.parkingArray = baseService.storageParking($scope.storageParking);

            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 存放位置联动查询--位
    $scope.changeStorageRow = function (val, array) {
        $scope.colArr = array[val - 1].col;
    };

    $scope.new_garage_parking = function (storage_name, storage_id, row, col, p_id) {
        // 车辆品牌查询
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.makecarName = data.result;
                // console.log($scope.makecarName)
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 车库查询
        $scope.private_storageName = storage_name;
        $scope.private_storageId = storage_id;

        // 车位置
        $scope.private_row = row;
        $scope.private_col = col;
        $scope.parking_id = p_id;
        $scope.submitted = false;
        $('ul.tabs li a').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabs li.test1 a').addClass("active");
        $("#test1").addClass("active");
        $("#test1").show();
        $scope.vin = "";
        $scope.make_name = "";
        $scope.model_name = "";
        $scope.create_time = "";
        $scope.car_color = "";
        $scope.engineNum = "";
        $scope.remark = "";
        $scope.storage_name = "";

        // 照片清空
        $scope.imgArr = [];
        $scope.col_id = "";
        $scope.plan_out_time = "";
        $(".modal").modal({});
        $("#newStorage_car").modal("open");
    };

    // 新增信息
    $scope.submitForm = function (isValid) {
        $scope.submitted = true;
        if (isValid) {
            var obj_car = {
                "vin": $scope.vin,
                "makeId": $scope.make_name.id,
                "makeName": $scope.make_name.make_name,
                "modelId": $scope.model_name.id,
                "modelName": $scope.model_name.model_name,
                "proDate": $scope.create_time,
                "colour": $scope.car_color,
                "engineNum": $scope.engineNum,
                "remark": $scope.remark,
                "storageId": $scope.private_storageId,
                "storageName": $scope.private_storageName,
                "parkingId": $scope.parking_id,
                "planOutTime": $scope.plan_out_time
            };
            _basic.post($host.api_url + "/user/" + userId + "/carStorageRel", obj_car).then(function (data) {
                if (data.success == true) {
                    $('ul.tabs li a').removeClass("active");
                    $(".tab_box").removeClass("active");
                    $(".tab_box").hide();
                    $('ul.tabs li.test2 a').addClass("active");
                    $("#test2").addClass("active");
                    $("#test2").show();
                    $scope.LookGarage($scope.private_storageId);
                    $scope.Picture_carId = data.id;
                }
                else {
                    swal(data.msg, "", "error")
                }
            });
        }
    };

    // 图片上传
    $scope.imgArr = [];
    $scope.uploadBrandImage = function (dom) {
        var filename = $(dom).val();
        if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
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
                var imageId = data.imageId;
                _basic.post($host.record_url + "/car/" + $scope.Picture_carId + "/vin/" + $scope.vin + "/storageImage", {
                    "username": _basic.getSession(_basic.USER_NAME),
                    "userId": userId,
                    "userType": _basic.getSession(_basic.USER_TYPE),
                    "url": imageId
                }).then(function (data) {
                    if (data.success == true) {
                        $scope.imgArr.push({src: $host.file_url + '/image/' + imageId});
                    }
                });
            }
            else {
                swal('上传图片失败', "", "error");
            }
        }, function (error) {
            swal('服务器内部错误', "", "error");
        })
    };
*/


   /* // 当汽车详情页
    $scope.lookStorageCar = function (val) {
        $state.go("storageCar_details", {}, {reload: true})
    };*/
}]);