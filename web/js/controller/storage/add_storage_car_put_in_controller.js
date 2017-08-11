/**
 * Created by ASUS on 2017/6/28.
 */
app.controller("add_storage_car_put_in_controller", ["$scope", "$rootScope","$state","$stateParams","$host", "_basic", "_config", "baseService", function ($scope, $rootScope,$state,$stateParams,$host, _basic,  _config, baseService) {
    var userId=_basic.getSession(_basic.USER_ID);
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

        // vin码查询
        var obj={
            vin:$scope.vin,
        };
        _basic.get($host.api_url+"/car?"+_basic.objToUrl(obj)).then(function (data) {
                if(data.success==true){
                    // 品牌默认选中
                    // console.log($scope.makecarName)
                    for(var i in $scope.makecarName){
                        if($scope.makecarName[i].id==data.result[0].make_id){
                            $scope.make_name=$scope.makecarName[i]
                        }
                    }
                    // 城市默认选中
                    for(var i in $scope.get_city){
                        if($scope.get_city[i].id==data.result[0].route_start_id){
                            $scope.start_city=$scope.get_city[i]
                        }
                        if($scope.get_city[i].id==data.result[0].route_end_id){
                            $scope.arrive_city=$scope.get_city[i]
                        }
                    }
                    $scope.srorage_car_details=data.result[0];
                    $scope.id=data.result[0].id;
                    $scope.client=$scope.srorage_car_details.entrust_id;
                    $scope.dealer=$scope.srorage_car_details.receive_id;
                    $scope.remark=$scope.srorage_car_details.remark
                }
        })
    };
    $scope.get_Msg();

        // 存放位置联动查询--区域
        $scope.changeStorageId = function (val) {
            _basic.get($host.api_url + "/storageArea?storageId=" + val).then(function (data) {
                if (data.success == true) {
                    if(data.result.length>0){
                        $scope.storageArea = data.result;
                    }else {
                    }

                }
            });

        },
            // 区域--行
        $scope.get_area_count=function (id) {
            _basic.get($host.api_url + "/storageParking?areaId=" + id).then(function (data) {
                if (data.success == true) {
                    $scope.storageParking = data.result;
                    $scope.parkingArray = baseService.storageParking($scope.storageParking);
                    // console.log($scope.garageParkingArray);
                }

            })
        };
        // 存放位置联动查询--列
        $scope.changeStorageRow = function (val, array) {

            if (val) {
                // console.log(val);
                $scope.colArr = array[val - 1].col;
                // console.log($scope.colArr)
            }


        };

    // 直接送达
    $scope.delivery=function () {
        swal({
                title: "确认直接送达该车辆？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
            function () {
                _basic.put($host.api_url+"/user/"+userId+"/car/"+$scope.id+"/carStatus/"+9,{}).then(function (data) {
                    if(data.success==true){
                        $state.go("car_query", {reload: true});
                        swal("送达成功!", "", "success");
                    }
                })
            }
        )
    }
    // 新增信息
    $scope.newsubmitForm = function (isValid) {
        $scope.submitted = true;
        // if (isValid) {
            var obj_car = {
                "storageId":$scope.storage_name.id,
                "storageName":$scope.storage_name.storage_name,
                "parkingId": $scope.parking_id,
            };
            _basic.put($host.api_url + "/user/" + userId + "/car/"+ $scope.srorage_car_details.id+"/carStorageRel?vin="+$scope.srorage_car_details.vin, _basic.removeNullProps(obj_car)).then(function (data) {
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
        $state.go("add_storage_car_vin", {reload: true})

    };
}]);