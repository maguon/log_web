 /**
 * Created by ASUS on 2017/5/5.
 */
// var storageCar_detailsController = angular.module("storageCar_detailsController", []);
app.controller("storage_car_details_controller", [ "$state", "$stateParams", "_config", "baseService", "$scope", "$host", "_basic", function ( $state, $stateParams, _config, baseService, $scope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    var val = $stateParams.id;
    var vin = $stateParams.vin;

    // var name= $stateParams.name;

    // console.log($stateParams.from);
    // 车辆品牌查询
    _basic.get($host.api_url + "/carMake").then(function (data) {
        if (data.success == true) {
            $scope.makecarName = data.result;
        } else {
            swal(data.msg, "", "error");
        }
    });
    // 车库查询
    _basic.get($host.api_url + "/storage").then(function (data) {
        if (data.success == true) {
            $scope.storageName = data.result;
            setTimeout($('select').material_select(), 2000)
        } else {
            swal(data.msg,"", "error");
        }
    });

    //controller里对应的处理函数
    var viewer;
    // var add_viewer;
    $scope.renderFinish = function () {
        viewer = new Viewer(document.getElementById('look_img'), {
            url: 'data-original'
        });
    };

    // 图片上传
    $scope.imgArr = [];
    // 预览详情照片
    $scope.storage_imageBox = [];

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
                        if($scope.storage_imageBox.length!=0){
                            viewer.destroy();
                        }
                        var nowDate=moment(new Date()).format("YYYY-DD-MM hh:ss");
                        // $scope.storage_imageBox.push({src: $host.file_url + '/image/' + imageId});
                        $scope.storage_imageBox.push({src: $host.file_url + '/image/' + imageId,time:nowDate,user:_basic.getSession(_basic.USER_NAME)});


                        // console.log($scope.storage_imageBox);
                    }
                });
            } else {
                swal('上传图片失败', "", "error");
            }
        }, function (error) {
            swal('服务器内部错误', "", "error");
        })

    };

    // 存放位置联动查询--行
    $scope.changeStorageId = function (val) {
        _basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.storageParking = data.result;

                $scope.parkingArray = baseService.storageParking($scope.storageParking);
                console.log($scope.parkingArray)

            } else {
                swal(data.msg, "", "error");
            }
        });
    },
        // 存放位置联动查询--列
        $scope.changeStorageRow = function (val, array) {

            // console.log(val);
            $scope.colArr = array[val - 1].col;

        };

    // 车辆型号联动查询
    $scope.changeMakeId = function (val) {
        // console.log(val);


        if ($scope.curruntId == val) {

        } else {
            $scope.curruntId = val;
            _basic.get($host.api_url + "/carMake/" + val + "/carModel").then(function (data) {
                if (data.success == true) {
                    $scope.carModelName = data.result;
                    // console.log($scope.carModelName);
                    // $scope.look_model_id=id;
                } else {
                    swal(data.msg, "", "error")
                }
            })
        }

    };
    // 颜色
    $scope.color = _config.config_color;

    // modelId全局变量
    $scope.change_model_id = "";


    // 立刻出库
    $scope.outStorageCar = function (rel_id, relSta, p_id, s_id, car_id) {
        swal({
                title: "该车辆确定要出库吗?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
            function () {
                _basic.put($host.api_url + "/user/" + userId + "/carStorageRel/" + rel_id + "/relStatus/" + relSta, {
                    parkingId: p_id,
                    storageId: s_id,
                    carId: car_id
                }).then(function (data) {
                    if (data.success = true) {
                        swal("出库成功!", "", "success");
                    }
                });
            }
        );
    };
    // 车位转移
    $scope.changeStorageCar = function (val, id, row, col) {
        $(".modal").modal();
        $("#change_storageCar").modal("open");
        $scope.now_row = row;
        $scope.now_col = col;
        $scope.move_carId = id;
        _basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.self_storageParking = data.result;
                $scope.garageParkingArray = baseService.storageParking($scope.self_storageParking);
                $scope.ageParkingCol = $scope.garageParkingArray[0].col
                // console.log($scope.ageParkingCol,$scope.garageParkingArray)

            }
        })
    };


    // 车辆照片跳转
    $scope.look_car_img = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_car_img ').addClass("active");
        $("#look_car_img").addClass("active");
        $("#look_car_img").show();
    };
    $scope.look_msg = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_msg ').addClass("active");
        $("#look_msg").addClass("active");
        $("#look_msg").show();
    };


    // 仓库车辆详情


    // 关闭模态按钮
    // $scope.close_storageCar=function () {
    //     searchAll();
    // };



    // 返回
    $scope.return = function () {
            console.log($stateParams.mark);
            if($stateParams.mark==1){
                $state.go($stateParams.from, {reload: true})
            }else {
                $state.go($stateParams.from, {id: $scope.self_car.storage_id, form: $stateParams._form}, {reload: true})

            }
    };

    // 查看详情
    $scope.lookStorageCar = function (val, vin) {
        $scope.submitted = false;
        // 照片清空
        $scope.imgArr = [];
        // 预览详情照片
        $scope.storage_imageBox = [];

        // console.log(val);
        // $(".modal").modal({
        //     // dismissible: false
        // });
        $(".main_storage_car").hide();
        $("#look_StorageCar").show();


        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_msg').addClass("active");
        $("#look_msg").addClass("active");
        $("#look_msg").show();

        $scope.Picture_carId = val;
        $scope.vin = vin;
        _basic.get($host.record_url + "/user/" + userId + "/car/" + val + "/record").then(function (data) {
            if (data.success == true) {
                // console.log(data);
                $scope.operating_record = data.result[0];
                $scope.comment = $scope.operating_record.comment;
                $scope.storage_image = $scope.operating_record.storage_image;
                for (var i in $scope.storage_image) {
                    $scope.storage_imageBox.push({src: $host.file_url + '/image/' + $scope.storage_image[i].url,time:$scope.storage_image[i].timez,user:$scope.storage_image[i].name});
                }

                // $scope.imgArr.push({src:$host.file_url+'/image/'+imageId});
            } else {
                swal(data.msg, "", "error")
            }
        });
        _basic.get($host.api_url + "/user/" + userId + "/car?carId=" + val + '&active=1').then(function (data) {
            if (data.success == true) {
                $scope.modelId = data.result[0].model_id;
                $scope.self_car = data.result[0];
                // modelID赋值
                $scope.look_make_id = $scope.self_car.make_id,
                    // console.log($scope.look_make_id);
                    $scope.changeMakeId($scope.look_make_id);
                $scope.look_model_id = $scope.self_car.model_id,
                $scope.look_create_time = moment($scope.self_car.pro_date).format('YYYY-MM-DD');
                $scope.look_storageName = $scope.self_car.storage_name + "  " + $scope.self_car.row + "排" + $scope.self_car.col + "列";

                // 车辆id
                $scope.look_car_id = $scope.self_car.id;
            } else {
                swal(data.msg, "", "error")
            }
        })

    };
    $scope.lookStorageCar(val, vin);
    // 修改仓库详情
    $scope.submitForm = function (isValid, id, r_id) {
        $scope.submitted = true;
        var obj = {
            "vin": $scope.self_car.vin,
            "makeId": $scope.self_car.make_id,
            "makeName": $("#look_makecarName").find("option:selected").text(),
            "modelId": $scope.self_car.model_id,
            "modelName": $("#look_model_name").find("option:selected").text(),
            "proDate": $scope.self_car.pro_date,
            "colour": $scope.self_car.colour,
            "engineNum": $scope.self_car.engine_num,
            "remark": $scope.self_car.remark
        };
        if (isValid) {
            // 修改计划出库时间
            _basic.put($host.api_url + "/user/" + userId + "/carStorageRel/" + r_id + "/planOutTime", {
                "planOutTime": $scope.self_car.plan_out_time
            }).then(function (data) {
                console.log(data)
            });
            // 修改仓库信息
            _basic.put($host.api_url + "/user/" + userId + "/car/" + id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    // $("#look_StorageCar").modal("close");
                    // searchAll();
                } else {
                    swal(data.msg, "", "error")
                }
            });

        }

        // $basic.put($host.api_url+"/user/"+userId+"/car/"+id,obj).then(function (data) {
        //
        // })
    };
    // 仓库移位
    $scope.move_box = function (val) {
        if ($(".move_box").attr("flag") == 'true') {
            $(".move_box").show();
            $(".move_box").attr("flag", false);
            _basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
                if (data.success == true) {
                    $scope.move_storageParking = data.result;
                    $scope.move_parkingArray = baseService.storageParking($scope.move_storageParking);
                }
            })
        } else {
            $(".move_box").hide();
            $(".move_box").attr("flag", true);
        }
    };
    $scope.close_move_box = function () {
        $(".move_box").hide();
        $(".move_box").attr("flag", true);
    };
    // 移动位置
    $scope.move_parking = function (parkingId, row, col) {
        // console.log(parkingId,$scope.move_carId);

        swal({
                title: "该车辆确定移位到" + row + "排" + col + "列？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
            function () {
                if (parkingId != null) {
                    _basic.put($host.api_url + "/user/" + userId + "/storageParking/" + parkingId, {
                        carId: $scope.move_carId
                    }).then(function (data) {
                        if (data.success == true) {
                            swal("移位成功", "", "success");
                            $scope.lookStorageCar(val, vin);
                            $("#change_storageCar").modal("close");
                        } else {
                            swal(data.msg, "", "error")
                        }
                    })
                }
            }
        )


    };
    // 车辆出库
    $scope.out_storage = function (rel_id, p_id, s_id, car_id) {
        swal({
                title: "该车辆确定要出库吗?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
            function () {

                _basic.put($host.api_url + "/user/" + userId + "/carStorageRel/" + rel_id + "/relStatus/" + 2, {
                    parkingId: p_id,
                    storageId: s_id,
                    carId: car_id
                }).then(function (data) {
                    if (data.success = true) {
                        swal("出库成功!", "", "success");
                        $scope.self_car.rel_status = 2;
                        // searchAll();
                        // $("#look_StorageCar").modal("close");
                    }
                });
            }
        );
    }
}]);