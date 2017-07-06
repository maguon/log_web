/**
 * Created by ASUS on 2017/6/27.
 */
/**
 * Created by ASUS on 2017/5/4.
 */
// var Storage_carController = angular.module("Storage_carController", []);
app.controller("add_storage_car_controller", ["$scope", "$rootScope","$state","$stateParams","$host", "_basic", "_config", "baseService", function ($scope, $rootScope,$state,$stateParams,$host, _basic,  _config, baseService) {
    var userId=_basic.getSession(_basic.USER_ID);
    var Picture_carId
    $scope.vin=$stateParams.vin;
    // $scope.vin = "";
    $scope.make_name = "";
    $scope.order_time = "";
    $scope.start_city = "";
    $scope.arrive_city = "";
    $scope.client = "";
    $scope.dealer = "";
    // $scope.create_time = "";
    // $scope.car_color = "";
    // $scope.engineNum = "";
    $scope.remark = "";
    $scope.storage_name = "";
    // 存放位置清空
    $scope.parkingArray = "";
    $scope.parking_id = "";
    // 信息获取
    $scope.get_Msg=function () {
        // 城市
        _basic.get($host.api_url+"/city").then(function (data) {
            if(data.success==true){
                $scope.get_city=data.result;
            }
        });
        // 车辆品牌查询
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.makecarName = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
        // 经销商
        _basic.get($host.api_url+"/receive").then(function (data) {
            if(data.success==true){
                $scope.get_receive=data.result;
            }
        });
        // 委托方
        _basic.get($host.api_url+"/entrust").then(function (data) {
            if(data.success==true){
                $scope.get_entrust=data.result;
            }
        });
        // 车库查询
        _basic.get($host.api_url + "/storage").then(function (data) {
            if (data.success == true) {
                $scope.storageName = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .test1').addClass("active");
        $("#test1").addClass("active");
        $("#test1").show();
    };
    $scope.get_Msg();
    
    $scope.start_city_change=function (val) {
        _basic.get($host.api_url + "/baseAddr?cityId=" + val).then(function (data) {
            if(data.success==true){
                // console.log(data.result)
                $scope.baseAddr=data.result;
            }
        })
    };
    // 存放位置联动查询--行
    $scope.changeStorageId = function (val) {
        if (val) {
            _basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
                if (data.success == true) {
                    $scope.storageParking = data.result;

                    $scope.parkingArray = baseService.storageParking($scope.storageParking);
                    // console.log($scope.parkingArray)

                } else {
                    swal(data.msg, "", "error");
                }
            });
        }

    },
    // 存放位置联动查询--列
    $scope.changeStorageRow = function (val, array) {

        if (val) {
            // console.log(val);
            $scope.colArr = array[val - 1].col;
            // console.log($scope.colArr)
        }


    };

    // 新增信息
    $scope.newsubmitForm = function (isValid) {
        $scope.submitted = true;
        if (isValid) {

            var obj_car = {
                "vin": $scope.vin,
                "makeId": $scope.make_name.id,
                "makeName": $scope.make_name.make_name,
                "orderDate": $scope.order_time,
                "routeStartId": $scope.start_city.id,
                "routeStart": $scope.start_city.city_name,
                "routeEndId": $scope.arrive_city.id,
                "routeEnd": $scope.arrive_city.city_name,
                "receiveId":$scope.dealer,
                "entrustId": $scope.client,
                "baseAddrId":$scope.base_addr.id,
                "remark": $scope.remark,
                "storageId": $scope.storage_name.id,
                "storageName": $scope.storage_name.storage_name,
                // "enterTime":$scope.enter_time,
                "parkingId": $scope.parking_id,
                // "planOutTime": $scope.plan_out_time
            };
            _basic.post($host.api_url + "/user/" + userId + "/carStorageRel", _basic.removeNullProps(obj_car)).then(function (data) {
                if (data.success == true) {
                    $('.tabWrap .tab').removeClass("active");
                    $(".tab_box ").removeClass("active");
                    $(".tab_box ").hide();
                    $('.tabWrap .test2').addClass("active");
                    $("#test2").addClass("active");
                    $("#test2").show();
                    $scope.Picture_carId = data.result.carId;
                } else {
                    swal(data.msg, "", "error")
                }
            });
        }

    };


    // // 图片上传
    // 图片
    $scope.storage_imageBox = [];
    $scope.storage_image_i=[];

    $scope.uploadBrandImage = function (dom,Picture_carId) {
        var filename = $(dom).val();
        // console.log($(dom).val());
        if(filename){
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
            // $currentDom = $(dom).prev();
            _basic.formPost($(dom).parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=4', function (data) {

                if (data.success) {
                    // console.log(data,Picture_carId);
                    var imageId = data.imageId;
                    _basic.post($host.record_url + "/car/" + $scope.Picture_carId + "/vin/" + $scope.vin + "/storageImage", {
                        "username": _basic.getSession(_basic.USER_NAME),
                        "userId": userId,
                        "userType": _basic.getSession(_basic.USER_TYPE),
                        "url": imageId
                    }).then(function (data) {
                        if (data.success == true) {
                            $scope._id=data.result._id;
                            var nowDate=moment(new Date()).format("YYYY-DD-MM HH:mm");
                            $scope.storage_image_i.push($host.file_url + '/image/' +imageId);
                            $scope.storage_imageBox.push({src: $host.file_url + '/image/' + imageId,record_id:$scope._id,time:nowDate,user:_basic.getSession(_basic.USER_NAME)});
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

    // 删除照片
    $scope.delete_img=function (record_id,src) {
        swal({
                title: "确认删除该照片？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
            function () {
                // console.log(src);
                var url_array=src.split("/");
                var url=url_array[url_array.length-1];
                _basic.delete($host.record_url+"/user/"+userId+"/record/"+record_id+"/image/"+url).then(function (data) {
                    if(data.success==true){
                        var i=$scope.storage_image_i.indexOf(src);
                        $scope.storage_imageBox.splice(i,1);
                        $scope.storage_image_i.splice(i,1);
                        swal("删除成功!", "", "success");
                        // $scope.lookStorageCar(data.result.id,data.result.vin)
                    }
                })
            }
        )

    };
    // 返回
    $scope.return = function () {
        // console.log($stateParams.mark);
            $state.go($stateParams.from, {reload: true})

    };
}]);