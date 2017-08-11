/**
 * Created by ASUS on 2017/7/7.
                            _ooOoo_
                           o8888888o
                           88" . "88
                           (| -_- |)
                            O\ = /O
                        ____/`---'\____
                      .   ' \\| |// `.
                       / \\||| : |||// \
                     / _||||| -:- |||||- \
                       | | \\\ - /// | |
                     | \_| ''\---/'' | |
                      \ .-\__ `-` ___/-. /
                   ___`. .' /--.--\ `. . __
                ."" '< `.___\_<|>_/___.' >'"".
               | | : `- \`.;`\ _ /`;.`/ - ` : | |
                 \ \ `-. \_ __\ /__ _/ .-` / /
         ======`-.____`-.___\_____/___.-`____.-'======
                            `=---='

         .............................................
                  佛祖保佑             永无BUG
          佛曰:
                  写字楼里写字间，写字间里程序员；
                  程序人员写程序，又拿程序换酒钱。
                  酒醒只在网上坐，酒醉还来网下眠；
                  酒醉酒醒日复日，网上网下年复年。
                  但愿老死电脑间，不愿鞠躬老板前；
                  奔驰宝马贵者趣，公交自行程序员。
                  别人笑我忒疯癫，我笑自己命太贱；
                  不见满街漂亮妹，哪个归得程序员？
 */
/*
*
* */
// var Storage_carController = angular.module("Storage_carController", []);
app.controller("storage_car_controller", ["$scope", "$rootScope","$stateParams","$host", "_basic", "_config", "baseService", function ($scope, $rootScope,$stateParams,$host, _basic,  _config, baseService) {
    $scope.curruntId = 0;
    $scope.start = 0;
    $scope.size = 11;
    var userId = _basic.getSession(_basic.USER_ID);
    // $pass_parameter.setter("jiangsen");

    var searchAll = function () {
        var obj={
            active:1,
            start:$scope.start,
            size:$scope.size,
            vinCode:$scope.search_vin,
            makeId:$scope.search_makeId,
            relStatus:$scope.search_relStatus,
            storageId:$scope.search_storage,
            receiveId:$scope.search_dealer,
            entrustId:$scope.client,
            routeStartId:$scope.source_city,
            routeEndId:$scope.arrive_city,
            enterStart:$scope.put_in_time_start,
            enterEnd:$scope.put_in_time_end,
            realStart:$scope.out_time_start,
            realEnd:$scope.out_time_end,
            orderStart:$scope.order_time_start,
            orderEnd:$scope.order_time_end
        };
        _basic.get($host.api_url + "/car?"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success == true) {
                $scope.storage_car_box = data.result;
                $scope.storage_car = $scope.storage_car_box.slice(0, 10);
                if ($scope.start > 0) {
                    $scope.pre=true;
                    // $("#pre").removeClass("disabled");
                } else {
                    $scope.pre=false;
                    // $("#pre").addClass("disabled");
                }
                if ($scope.storage_car_box.length < $scope.size) {
                    // $("#next").addClass("disabled");
                    $scope.next=false;
                } else {
                    // $("#next").removeClass("disabled");
                    $scope.next=true;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 条件查询
    $scope.searchStorage_car = function () {
        $scope.start = 0;
        searchAll();
    };

    // 分页
    // 上一页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        searchAll();
    };
    // 下一页
    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        searchAll();
    };

    // 車庫狀態
    $scope.rel_status = _config.car_rel_status;
    $scope.search_relStatus = 1;

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
        // 仓库查询
        _basic.get($host.api_url + "/storage").then(function (data) {
            if (data.success == true) {
                $scope.storage = data.result;
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
        })
    };
    $scope.get_Msg();

    // 车库查询
    _basic.get($host.api_url + "/storage").then(function (data) {
        if (data.success == true) {
            $scope.storageName = data.result;
        } else {
            swal(data.msg, "", "error");
        }
    });
    // $scope.newStorage_car = function (){
    //     $scope.submitted = false;
    //     $('.tabWrap .tab').removeClass("active");
    //     $(".tab_box ").removeClass("active");
    //     $(".tab_box ").hide();
    //     $('.tabWrap .test1').addClass("active");
    //     $("#test1").addClass("active");
    //     $("#test1").show();
    //     $scope.vin = "";
    //     $scope.make_name = "";
    //     // $scope.model_name = "";
    //     $scope.arrive_time = "";
    //     $scope.start_city = "";
    //     $scope.arrive_city = "";
    //     $scope.client = "";
    //     $scope.dealer = "";
    //     // $scope.create_time = "";
    //     // $scope.car_color = "";
    //     // $scope.engineNum = "";
    //     $scope.remark = "";
    //     $scope.storage_name = "";
    //     // 照片清空
    //     $scope.imgArr = [];
    //     // 车辆型号清空
    //     $scope.carModelName = "";
    //     // 存放位置清空
    //     $scope.parkingArray = "";
    //     $scope.parking_id = "";
    //     $scope.colArr = "";
    //     // "enterTime":$scope.enter_time,
    //
    //     $scope.plan_out_time = "";
    //     $(".modal").modal({
    //         height: 500
    //     });
    //     $("#newStorage_car").modal("open");
    //
    // };
    // // // 图片上传
    // // 图片
    // $scope.storage_imageBox = [];
    //
    //
    // $scope.uploadBrandImage = function (dom) {
    //     var filename = $(dom).val();
    //     console.log($(dom).val());
    //     if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
    //         //check size
    //         //$file_input[0].files[0].size
    //         var max_size_str = $(dom).attr('max_size');
    //         var max_size = 4 * 1024 * 1024; //default: 4M
    //         var re = /\d+m/i;
    //         if (re.test(max_size_str)) {
    //             max_size = parseInt(max_size_str.substring(0, max_size_str.length - 1)) * 1024 * 1024;
    //         }
    //
    //         if ($(dom)[0].files[0].size > max_size) {
    //             swal('图片文件最大: ' + max_size_str, "", "error");
    //             return false;
    //         }
    //
    //     }
    //     else if (filename && filename.length > 0) {
    //         $(dom).val('');
    //         swal('支持的图片类型为. (jpeg,jpg,png,gif,svg,bmp,tiff)', "", "error");
    //     }
    //     // $currentDom = $(dom).prev();
    //     _basic.formPost($(dom).parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=4', function (data) {
    //
    //         if (data.success) {
    //             console.log(data, $scope.Picture_carId);
    //             var imageId = data.imageId;
    //             _basic.post($host.record_url + "/car/" + $scope.Picture_carId + "/vin/" + $scope.vin + "/storageImage", {
    //                 "username": _basic.getSession(_basic.USER_NAME),
    //                 "userId": userId,
    //                 "userType": _basic.getSession(_basic.USER_TYPE),
    //                 "url": imageId
    //             }).then(function (data) {
    //                 if (data.success == true) {
    //                     $scope.storage_imageBox.push({src: $host.file_url + '/image/' + imageId});
    //                 }
    //             });
    //         } else {
    //             swal('上传图片失败', "", "error");
    //         }
    //     }, function (error) {
    //         swal('服务器内部错误', "", "error");
    //     })
    //
    // };
    //
    // 存放位置联动查询--行

    // // 存放位置联动查询--区域
    $scope.changeStorageId = function (val) {
        _basic.get($host.api_url + "/storageArea?storageId=" + val+"&&areaStatus=1").then(function (data) {
            if (data.success == true) {
                if(data.result.length>0){
                    $scope.storageArea = data.result;

                }else {
                }

            }
        });

    },

    // 存放位置联动查询--列
    $scope.changeStorageRow = function (val, array) {

        if (val) {
            // console.log(val);
            $scope.colArr = array[val - 1].col;
            // console.log($scope.colArr)
        }


    };



    // };
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
                        searchAll();
                    }
                });
            }
        );
    };
    // 车库分区查询
    // 车位转移
    $scope.changeStorageCar = function (val,storage_area_id, id, row, col) {
        $(".modal").modal();
        $("#change_storageCar").modal("open");
        _basic.get($host.api_url + "/storageArea?storageId=" + val+"&&areaStatus=1").then(function (data) {
            if (data.success == true) {
                if(data.result.length>0){
                    $scope.storageArea = data.result;
                    $scope.storageArea.forEach(function (i) {
                        if(i.id==storage_area_id){
                            $scope.area=i;
                            $scope.get_area_count($scope.area.id);
                        }
                    });

                    // console.log($scope.storage)

                }else {
                }
            }
        });
        $scope.now_row = row;
        $scope.now_col = col;
        $scope.move_carId = id;
        $scope.area_id=storage_area_id;

    };
    $scope.get_area_count=function (id) {
        _basic.get($host.api_url + "/storageParking?areaId="+id).then(function (data) {
            if (data.success == true) {
                $scope.self_storageParking = data.result;
                $scope.garageParkingArray = baseService.storageParking($scope.self_storageParking);
                $scope.ageParkingCol = $scope.garageParkingArray[0].col
            }

        })
    };
    // 移动位置
    $scope.move_parking = function (parkingId, row, col) {

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
                            searchAll();
                            $("#change_storageCar").modal("close");
                        } else {
                            swal(data.msg, "", "error")
                        }
                    })
                }
            }
        )


    };

    // 车辆重新入库
    $scope.loginStorageCar = function (el, id) {
        $scope.self_vin = el;
        $scope.self_car_id = id;
        console.log(el,id)
        $(".modal").modal();
        $("#loginStorageCar").modal("open");

    };

    $scope.login_submit = function (valid, id, name,p_id) {
        $scope.submitted = true;
        if (valid) {
            var obj = {
                "parkingId": p_id,
                "storageId": id,
                "storageName": name,
                // "planOutTime": p_time
            };
            _basic.put($host.api_url + "/user/" + userId +"/car/" + $scope.self_car_id+"/carStorageRel", obj).then(function (data) {
                if (data.success == true) {
                    swal('成功', "", "success");
                    $("#loginStorageCar").modal("close");
                    searchAll();
                } else {
                    swal(data.msg, "", "error")
                }
            })
        }
    };
    // 关闭车辆重新入库
    $scope.close_rel=function () {
        $("#loginStorageCar").modal("close");
        searchAll();
        $scope.parkingArray=[];
    };

    // 车辆出库
    $scope.out_storage = function (rel_id, relSta, p_id, s_id, car_id) {
        // swal("该车辆确定要出库吗","","warning")
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
                        searchAll();
                        $("#look_StorageCar").modal("close");
                    }
                });
            }
        );
    };
    searchAll();
}]);