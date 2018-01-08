/**
 * Created by ASUS on 2017/5/5.
 */

app.controller("storage_car_details_controller", ["$state", "$stateParams", "_config", "baseService", "$scope", "$host", "_basic", function ($state, $stateParams, _config, baseService, $scope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    var val = $stateParams.id;
    var vin = $stateParams.vin;
    $scope.get_city =[];
    $(document).ready(function () {
        $('.save').tooltip({delay: 50});
        $('.displacement').tooltip({delay: 50});
        $('.logout').tooltip({delay: 50});
    });

    // 城市信息获取
    $scope.get_Msg = function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.get_city = data.result;
                // for(var i=0;i<data.result.length;i++){
                //     $scope.get_city.push({id:data.result[i].id,city_name:data.result[i].city_name})
                // }
                $('#chooseStartCity').select2({
                    containerCssClass : 'select2_dropdown'
                });
                $('#chooseEndCity').select2({
                    containerCssClass: 'select2_dropdown'
                });
            }
        });

        // 车辆品牌查询
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.makecarName = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 经销商
        _basic.get($host.api_url + "/receive").then(function (data) {
            if (data.success == true) {
                $scope.get_receive = data.result;
            }
        });

        // 委托方
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.get_entrust = data.result;
            }
        })
    };
    $scope.get_Msg();

    // 车库查询
    _basic.get($host.api_url + "/storage").then(function (data) {
        if (data.success == true) {
            $scope.storageName = data.result;
            setTimeout($('select').material_select(), 2000)
        }
        else {
            swal(data.msg, "", "error");
        }
    });

    //controller里对应的处理函数
    // 图片放大处理
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
    $scope.storage_image_i = [];

    $scope.uploadBrandImage = function (dom) {
        var filename = $(dom).val();
        if (filename) {
            // console.log($(dom).val());
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
                    // console.log(data, $scope.Picture_carId);
                    var imageId = data.imageId;
                    _basic.post($host.record_url + "/car/" + $scope.Picture_carId + "/vin/" + $scope.vin + "/storageImage", {
                        "username": _basic.getSession(_basic.USER_NAME),
                        "userId": userId,
                        "userType": _basic.getSession(_basic.USER_TYPE),
                        "url": imageId
                    }).then(function (data) {
                        if (data.success == true) {
                            $scope._id = data.result._id;
                            if ($scope.storage_imageBox.length != 0) {
                                viewer.destroy();
                            }
                            var nowDate = moment(new Date()).format("YYYY-DD-MM HH:mm");
                            $scope.storage_image_i.push($host.file_url + '/image/' + imageId);
                            // $scope.storage_imageBox.push({src: $host.file_url + '/image/' + imageId});
                            $scope.storage_imageBox.push({
                                src: $host.file_url + '/image/' + imageId,
                                record_id: $scope._id,
                                time: nowDate,
                                user: _basic.getSession(_basic.USER_NAME)
                            });
                        }
                    });
                }
                else {
                    swal('上传图片失败', "", "error");
                }
            }, function (error) {
                swal('服务器内部错误', "", "error");
            })
        }
    };

    // 存放位置联动查询--行
    $scope.changeStorageId = function (val) {
        _basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.storageParking = data.result;

                $scope.parkingArray = baseService.storageParking($scope.storageParking);
                // console.log($scope.parkingArray)

            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 存放位置联动查询--列
    $scope.changeStorageRow = function (val, array) {
        $scope.colArr = array[val - 1].col;
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
    // 车库分区查询
    // 车位转移
    $scope.changeStorageCar = function (val, storage_area_id, id, row, col) {
        $(".modal").modal();
        $("#change_storageCar").modal("open");
        _basic.get($host.api_url + "/storageArea?storageId=" + val + "&&areaStatus=1").then(function (data) {
            if (data.success == true) {
                if (data.result.length > 0) {
                    $scope.storageArea = data.result;
                    $scope.storageArea.forEach(function (i) {
                        if (i.id == storage_area_id) {
                            $scope.area = i;
                            $scope.get_area_count($scope.area.id);
                        }
                    });
                }
            }
        });
        $scope.now_row = row;
        $scope.now_col = col;
        $scope.move_carId = id;
        $scope.area_id = storage_area_id;
    };

    $scope.get_area_count = function (id) {
        _basic.get($host.api_url + "/storageParking?areaId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.self_storageParking = data.result;
                $scope.garageParkingArray = baseService.storageParking($scope.self_storageParking);
                $scope.ageParkingCol = $scope.garageParkingArray[0].col
            }
        })
    };


    // 移动位置
    $scope.move_parking = function (parkingId, row, col) {
        // console.log(parkingId, row, col);
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
                        }
                        else {
                            swal(data.msg, "", "error")
                        }
                    })
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
    // 返回
    $scope.return = function () {
        // console.log($stateParams.mark);
        if ($stateParams.mark == 1) {
            $state.go($stateParams.from, {reload: true})
        }
        else {
            $state.go($stateParams.from, {
                id: $scope.self_car.storage_id,
                form: $stateParams._form,
                status: $stateParams.status
            }, {reload: true})
        }
    };

    // 查看详情
    $scope.lookStorageCar = function (val, vin) {
        $scope.submitted = false;
        // 照片清空
        $scope.imgArr = [];
        // 预览详情照片
        $scope.storage_imageBox = [];

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
                    $scope.storage_image_i.push($host.file_url + '/image/' + $scope.storage_image[i].url);
                    $scope.storage_imageBox.push({
                        src: $host.file_url + '/image/' + $scope.storage_image[i].url,
                        record_id: $scope.operating_record._id,
                        time: $scope.storage_image[i].timez,
                        user: $scope.storage_image[i].name
                    });
                }
            }
            else {
                swal(data.msg, "", "error")
            }
        });
        _basic.get($host.api_url + "/car?carId=" + val + '&active=1').then(function (data) {
            if (data.success == true) {
                $scope.modelId = data.result[0].model_id;
                data.result[0].real_out_time = data.result[0].real_out_time == null ? '' : data.result[0].real_out_time
                $scope.self_car = data.result[0];
                // console.log("self_car",$scope.self_car);
                // modelID赋值
                $scope.look_make_id = $scope.self_car.make_id;
                $scope.look_model_id = $scope.self_car.model_id;
                $scope.look_create_time = moment($scope.self_car.pro_date).format('YYYY-MM-DD');
                if ($scope.self_car.order_date == null) {
                    $scope.order_date = "";
                }
                else {
                    $scope.order_date = $scope.self_car.order_date;
                }
                $scope.look_storageName = $scope.self_car.storage_name + $scope.self_car.area_name + $scope.self_car.row + "排" + $scope.self_car.col + "列";
                // 车辆id
                $scope.look_car_id = $scope.self_car.id;
                $scope.select_city_start = {id:$scope.self_car.route_start_id,city_name:$scope.self_car.route_start};
                $scope.select_city_end = {id:$scope.self_car.route_end_id,city_name:$scope.self_car.route_end};
                $scope.start_city = $scope.select_city_start.id;
                $scope.get_addr($scope.start_city);
                $scope.start_addr = $scope.self_car.base_addr_id;

                // 判断获取的目的地城市是否存在，不存在则默认选中目的地城市的select
                $scope.arrive_city = $scope.select_city_end.id === null ? "0" : $scope.select_city_end.id;
                // console.log("arrive_city",$scope.arrive_city);
            }
            else {
                swal(data.msg, "", "error")
            }
        })
    };

    // 删除照片
    $scope.delete_img = function (record_id, src) {
        // console.log($scope.storage_image_i);
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
                var url_array = src.split("/");
                var url = url_array[url_array.length - 1];
                _basic.delete($host.record_url + "/user/" + userId + "/record/" + record_id + "/image/" + url).then(function (data) {
                    if (data.success == true) {
                        var i = $scope.storage_image_i.indexOf(src);
                        $scope.storage_imageBox.splice(i, 1);
                        $scope.storage_image_i.splice(i, 1);
                        swal("删除成功!", "", "success");
                    }
                })
            }
        )

    };
    $scope.lookStorageCar(val, vin);
    // 修改仓库详情
    $scope.submitForm = function (isValid, id, r_id) {
        $scope.submitted = true;
        if (isValid) {
            // 如果没有选中select或是重置了初始值，则传空字符串
            var arrive_city = $scope.arrive_city == 0 ? "" : $scope.arrive_city;
            var obj = {
                "vin": $scope.self_car.vin,
                "makeId": $scope.self_car.make_id,
                "makeName": $("#look_makecarName").find("option:selected").text(),
                "orderDate": $scope.order_date,
                "remark": $scope.self_car.remark,
                "routeStartId": $scope.start_city,
                "routeStart": $scope.selectedText,
                "baseAddrId": $scope.start_addr,
                "routeEndId": arrive_city,
                "routeEnd": $scope.arrive_city_name,
                "receiveId": $scope.self_car.receive_id,
                "entrustId": $scope.self_car.entrust_id
            };
            // 修改仓库信息
            _basic.put($host.api_url + "/user/" + userId + "/car/" + id, _basic.removeNullProps(obj)).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                }
                else {
                    swal(data.msg, "", "error")
                }
            });
        }
    };

    // 目的地城市-经销商联动
    $scope.get_received = function (id) {
        $scope.arrive_city_name = $("#chooseEndCity").find("option:selected").text();
        if($scope.arrive_city == 0 || $scope.arrive_city == "" || $scope.arrive_city == null){
            $scope.get_receive = [];
        }
        else{
            _basic.get($host.api_url + "/receive?cityId=" + id).then(function (data) {
                if (data.success == true) {
                    $scope.get_receive = data.result;
                }
                else {
                    swal(data.msg, "", "error")
                }
            })
        }
    };

    // 发运地城市地质联动
    $scope.get_addr = function (id) {
        $scope.selectedText = $("#chooseStartCity").find("option:selected").text();
        _basic.get($host.api_url + "/baseAddr?cityId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.start_address = data.result;
            }
            else {
                swal(data.msg, "", "error")
            }
        })
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
                    }
                });
            });
    }
}]);