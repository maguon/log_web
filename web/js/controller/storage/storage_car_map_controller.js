/**
 * Created by ASUS on 2017/5/5.
 */
app.controller("storage_car_map_controller", ["$state", "$rootScope", "$stateParams", "_config", "baseService", "$scope", "$host", "_basic", function ( $state, $rootScope, $stateParams, _config, baseService, $scope, $host, _basic) {
    var val = $stateParams.id;
    $scope._form=$stateParams.form;
    var data = new Date();
    var now_date = moment(data).format('YYYYMMDD');
    var userId = _basic.getSession(_basic.USER_NAME);

    // 获取仓储分区
    _basic.get($host.api_url + "/storageDate?storageId=" + val + "&dateStart=" + now_date + "&dateEnd=" + now_date).then(function (data) {
        if (data.success == true) {
            $scope.storage = data.result[0];
        }
    });
    _basic.get($host.api_url + "/storageArea?storageId=" + val+"&&areaStatus=1").then(function (data) {
        if (data.success == true) {
            if(data.result.length>0){
                $scope.storageArea = data.result;
                $scope.area=$scope.storageArea[0];
                $scope.get_area_count($scope.area.id);
                $scope.show_area=true;
            }else {
                $scope.show_area=false;
            }

        }
    });
    $scope.get_area_count=function (id) {
        _basic.get($host.api_url + "/storageArea?areaId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.self_storageArea = data.result[0];
            }
        });
        _basic.get($host.api_url + "/storageParking?areaId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.self_storageParking = data.result;
                $scope.garageParkingArray = baseService.storageParking($scope.self_storageParking);
                $scope.ageParkingCol = $scope.garageParkingArray[0].col
            }

        })
    };
    // 到仓储车辆图
    $scope.LookGarage = function (val) {
        _basic.get($host.api_url + "/storageDate?storageId=" + val + "&dateStart=" + now_date + "&dateEnd=" + now_date).then(function (data) {
            if (data.success == true) {
                $scope.storage = data.result[0];
            }
        });
        _basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.self_storageParking = data.result;
                $scope.garageParkingArray = baseService.storageParking($scope.self_storageParking);
                $scope.ageParkingCol = $scope.garageParkingArray[0].col

            }

        })
    };
    $scope.LookGarage(val);


    // 存放位置联动查询--行
    $scope.changeStorageId = function (val) {
        _basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.storageParking = data.result;

                $scope.parkingArray = baseService.storageParking($scope.storageParking);

            } else {
                swal(data.msg, "", "error");
            }
        });
    },
        // 存放位置联动查询--位
        $scope.changeStorageRow = function (val, array) {

            // console.log(val);
            $scope.colArr = array[val - 1].col;

        };

    // 新增车辆
    $scope.new_garage_parking = function (storage_name, storage_id, row, col, p_id) {
        swal("该车位暂时无车辆","","error");
        // // 车辆品牌查询
      /*  _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.makecarName = data.result;
                // console.log($scope.makecarName)
            } else {
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

        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .test1').addClass("active");
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
        // "enterTime":$scope.enter_time,
        $scope.col_id = "";
        $scope.plan_out_time = "";
        $(".modal").modal({});
        $("#newStorage_car").modal("open");*/

    };

    // // 新增信息
    /*$scope.submitForm = function (isValid) {
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
                // "enterTime":$scope.enter_time,
                "parkingId": $scope.parking_id,
                // "planOutTime": $scope.plan_out_time
            };
            _basic.post($host.api_url + "/user/" + userId + "/carStorageRel", _basic.removeNullProps(obj_car)).then(function (data) {
                if (data.success == true) {
                    // swal("新增成功","","success");
                    // $("#newStorage_car").modal("close");
                    // $('ul.tabs').tabs('select_tab', 'test2');
                    $('.tabWrap .tab').removeClass("active");
                    $(".tab_box ").removeClass("active");
                    $(".tab_box ").hide();
                    $('.tabWrap .test2').addClass("active");
                    $("#test2").addClass("active");
                    $("#test2").show();
                    // searchAll();
                    $scope.LookGarage($scope.private_storageId);
                    $scope.Picture_carId = data.result.carId;
                    // $scope.carPicture_vin=data.win;
                    // console.log($scope.win);
                } else {
                    swal(data.msg, "", "error")
                }
            });
        }
    };*/

    // 返回
    $scope.return = function () {
        $state.go($stateParams.form, {}, {reload: true})
    };

    // // 图片上传
/*    $scope.imgArr = [];
    $scope.car_image_i=[];
    $scope.uploadBrandImage = function (dom) {
        var filename = $(dom).val();
        console.log($(dom).val());
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
                console.log(data, $scope.Picture_carId);
                var imageId = data.imageId;
                _basic.post($host.record_url + "/car/" + $scope.Picture_carId + "/vin/" + $scope.vin + "/storageImage", {
                    "username": _basic.getSession(_basic.USER_NAME),
                    "userId": userId,
                    "userType": _basic.getSession(_basic.USER_TYPE),
                    "url": imageId
                }).then(function (data) {
                    if (data.success == true) {
                        $scope._id=data.result._id;
                        var nowDate=moment(new Date()).format("YYYY-MM-DD h:mm");
                        $scope.car_image_i.push($host.file_url + '/image/' + imageId);
                        $scope.imgArr.push({src: $host.file_url + '/image/' + imageId,time:nowDate,record_id:$scope._id,user:_basic.getSession(_basic.USER_NAME)});
                    }
                });
            } else {
                swal('上传图片失败', "", "error");
            }
        }, function (error) {
            swal('服务器内部错误', "", "error");
        })
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
                        var i=$scope.car_image_i.indexOf(src);
                        $scope.imgArr.splice(i,1);
                        $scope.car_image_i.splice(i,1);
                        swal("删除成功!", "", "success");
                        // $scope.lookStorageCar(data.result.id,data.result.vin)
                    }
                })
            }
        )

    };*/
}]);
