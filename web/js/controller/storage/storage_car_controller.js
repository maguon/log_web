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
app.controller("storage_car_controller", ["$scope", "$rootScope", "$stateParams", "$host", "_basic", "_config", "baseService", function ($scope, $rootScope, $stateParams, $host, _basic, _config, baseService) {
    $scope.curruntId = 0;
    $scope.start = 0;
    $scope.size = 11;
    var userId = _basic.getSession(_basic.USER_ID);
    var searchAll = function () {
        // 基本检索URL
        var url = $host.api_url + "/car?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {


                conditionsObj.routeEndName = $scope.arriveCityNm;
                conditionsObj.routeStartName = $scope.sourceCityNm;

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "storage_car",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.storage_car_box = data.result;
                $scope.storage_car = $scope.storage_car_box.slice(0, 10);
                if ($scope.start > 0) {
                    $scope.pre = true;
                } else {
                    $scope.pre = false;
                }
                if ($scope.storage_car_box.length < $scope.size) {
                    $scope.next = false;
                } else {
                    $scope.next = true;
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


    function getCityInfo (sourceCity,arriveCity) {
        var url = $host.api_url + "/city";
        $('#chooseShipmentStart').select2({
            placeholder: sourceCity,
            containerCssClass: 'select2_dropdown',
            ajax: {
                type: 'GET',
                url: url,
                dataType: 'json',
                delay: 400,
                data: function (params) {
                    return {
                        cityName : params.term
                    };
                },
                processResults: function (data, params) {
                    var options = [];
                    $(data.result).each(function (i, o) {
                        options.push({
                            id: o.id,
                            text: o.city_name
                        });
                    });
                    return {
                        results: options
                    };
                },
                cache: true
            },
            allowClear: true
        }).on("select2:unselecting", function (e) {
            $scope.source_city = '';
            $scope.sourceCityNm = '发运地城市';
        }).on('change', function () {
            if ($("#chooseShipmentStart").val() != null && $("#chooseShipmentStart").val() !== "") {
                $scope.source_city = $("#chooseShipmentStart").select2("data")[0].id;
                $scope.sourceCityNm = $("#chooseShipmentStart").select2("data")[0].text;
            }
        });
        $('#chooseEndCity').select2({
            placeholder: arriveCity,
            containerCssClass: 'select2_dropdown',
            ajax: {
                type: 'GET',
                url: url,
                dataType: 'json',
                delay: 400,
                data: function (params) {
                    return {
                        cityName: params.term
                    };
                },
                processResults: function (data, params) {
                    var options = [];
                    $(data.result).each(function (i, o) {
                        options.push({
                            id: o.id,
                            text: o.city_name
                        });
                    });
                    return {
                        results: options
                    };
                },
                cache: true
            },
            allowClear: true
        }).on('change', function () {
            if ($("#chooseEndCity").val() != null && $("#chooseEndCity").val() !== "") {
                $scope.arrive_city = $("#chooseEndCity").select2("data")[0].id;
                $scope.arriveCityNm = $("#chooseEndCity").select2("data")[0].text;
            }
        });
    };


     // 信息获取
     $scope.get_Msg = function () {

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
         _basic.get($host.api_url + "/receive").then(function (data) {
             if (data.success == true) {
                 $scope.get_receive = data.result;
                 $('#search_dealer').select2({
                     placeholder: '经销商',
                     containerCssClass: 'select2_dropdown',
                     allowClear: true
                 });
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

    // 清除城市id
    $scope.eliminateCityId = function () {
        if($scope.source_city == 0 || $scope.source_city == "" || $scope.source_city == null){
            $scope.source_city = null;
        }
        if($scope.arrive_city == 0 || $scope.arrive_city == "" || $scope.arrive_city == null){
            $scope.arrive_city = null;
        }
    };

    // 车库查询
    _basic.get($host.api_url + "/storage").then(function (data) {
        if (data.success == true) {
            $scope.storageName = data.result;
        }
        else {
            swal(data.msg, "", "error");
        }
    });

    // 存放位置联动查询--区域
    $scope.changeStorageId = function (val) {
        _basic.get($host.api_url + "/storageArea?storageId=" + val + "&&areaStatus=1").then(function (data) {
            if (data.success == true) {
                if (data.result.length > 0) {
                    $scope.storageArea = data.result;
                }
            }
        });
    };

    // 存放位置联动查询--位
    $scope.changeStorageRow = function (val, array) {
        if (val) {
            $scope.colArr = array[val - 1].col;
        }
    };

    // 立刻出库
    $scope.outStorageCar = function (rel_id, relSta, p_id, s_id, car_id) {
        swal({
                title: "该车辆确定要出库吗?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
        }).then(
            function (result) {
                if (result.value) {
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
            });
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
        swal({
                title: "该车辆确定移位到" + row + "道" + col + "位？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
        }).then(
            function (result) {
                if (result.value) {
                    if (parkingId != null) {
                        _basic.put($host.api_url + "/user/" + userId + "/storageParking/" + parkingId, {
                            carId: $scope.move_carId
                        }).then(function (data) {
                            if (data.success == true) {
                                swal("移位成功", "", "success");
                                searchAll();
                                $("#change_storageCar").modal("close");
                            }
                            else {
                                swal(data.msg, "", "error")
                            }
                        })
                    }
                }
            })
    };

    // 车辆重新入库
    $scope.loginStorageCar = function (el, id) {
        $scope.self_vin = el;
        $scope.self_car_id = id;
        $(".modal").modal();
        $("#loginStorageCar").modal("open");
    };

    $scope.login_submit = function (valid, id, name, p_id) {
        $scope.submitted = true;
        if (valid) {
            var obj = {
                "parkingId": p_id,
                "storageId": id,
                "storageName": name,
                // "planOutTime": p_time
            };
            _basic.put($host.api_url + "/user/" + userId + "/car/" + $scope.self_car_id + "/carStorageRel", obj).then(function (data) {
                if (data.success == true) {
                    swal('成功', "", "success");
                    $("#loginStorageCar").modal("close");
                    searchAll();
                }
                else {
                    swal(data.msg, "", "error")
                }
            })
        }
    };
    // 关闭车辆重新入库
    $scope.close_rel = function () {
        $("#loginStorageCar").modal("close");
        searchAll();
        $scope.parkingArray = [];
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
                cancelButtonText: "取消"
        }).then(
            function (result) {
                if (result.value) {
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
            });
    };



    //导入

    // 主体原始错误数据
    $scope.tableContentErrorFilter = [];
    // 主体原始成功数据
    $scope.tableContentFilter = [];
    // 过滤条件数据
    var colObjs = [
        {name: 'vin', type: 'string', length: 17, require: true},
        {name: 'entrustId', type: 'number', length: 3},
        {name: 'storageId', type: 'number', length: 3, require: true}];
    // 头部条件判断
    $scope.titleFilter = function (headerArray) {
        if (colObjs.length != headerArray.length) {
            return false;
        } else {
            for (i = 0; i < headerArray.length; i++) {
                if (colObjs[i].name != headerArray[i]) {
                    return false
                }
            }
        }
    };
    // 主体条件判断
    $scope.ContentFilter = function (contentArray) {

        for (var i = 0; i < contentArray.length; i++) {
            var flag = true;
            var isNumber;
            for (var j = 0; j < colObjs.length; j++) {

                if (colObjs[j].require) {
                    if (contentArray[i][j] == null && contentArray[i][j].length == 0) {
                        $scope.errorNumber = $scope.errorNumber + 1;
                        $scope.tableContentErrorFilter.push(contentArray[i]);

                        break;
                    }
                }


                if (contentArray[i][j] == '' || isNaN(contentArray[i][j])) {
                    isNumber = "string"
                } else {
                    isNumber = "number"
                }
                if (colObjs[j].type != isNumber && contentArray[i][j] != '' &&colObjs[j].require ) {
                    $scope.errorNumber = $scope.errorNumber + 1;
                    $scope.tableContentErrorFilter.push(contentArray[i]);

                    break;
                }
                //check length
                if (colObjs[j].type=='string'&&(colObjs[j].length && colObjs[j].length != contentArray[i][j].length)) {
                    $scope.errorNumber = $scope.errorNumber + 1;
                    $scope.tableContentErrorFilter.push(contentArray[i]);

                    break;
                }

            }
            if (flag == true) {
                $scope.rightNumber = $scope.rightNumber + 1;
                $scope.tableContentFilter.push(contentArray[i]);
            }


        }

    };



    $scope.fileChange = function (file) {
        // 表头原始数据
        $scope.tableHeadeArray = [];
        // 主体原始错误数据
        $scope.tableContentErrorFilter = [];
        // 主体原始成功数据
        $scope.tableContentFilter = [];
        $scope.rightNumber = 0;
        $scope.errorNumber = 0;
        $(file).parse({
            config: {
                complete: function (result) {
                    $scope.$apply(function () {
                        if(result==null ||result.data==null ||result.data.length ==0){
                            swal("文件类型错误");
                        } else {
                            $scope.tableHeadeArray = result.data[0];
                            // 表头校验
                            if ($scope.titleFilter($scope.tableHeadeArray) != false) {
                                // 主体内容校验
                                var content_filter_array = result.data.slice(1, result.data.length);
                                var con_line = [];

                                for (var i = 0; i < content_filter_array.length; i++) {
                                    if (content_filter_array[i].length == 1 && content_filter_array[i][0] == "") {
                                        break;
                                    } else {
                                        con_line.push(content_filter_array[i]);
                                    }
                                }
                                $scope.ContentFilter(con_line);
                                fileUpload();
                                $scope.tableHeader = result.data[0];
                            }
                            else {
                                swal("表头格式错误", "", "error");
                            }

                        }

                    });

                }
            },
            before: function (file, inputElem) {
                $scope.fileType = file.type;
            },
            error: function (err, file, inputElem, reason) {
                console.log(err)
            },
            complete: function (val) {
            }
        })
    };


    function fileUpload() {
        $(".shadeDowWrap").show();
        _basic.formPost($("#file_upload_form"), $host.api_url + '/user/' + userId + '/carExportsFile', function (data) {
            if (data.success == true) {
                    $(".shadeDowWrap").hide();
                    swal("出库车辆数" +data.result.successedInsert);

            }
            else {
                $(".shadeDowWrap").hide();
                swal(data.msg, "", "error")
            }
        },function(error){
            $(".shadeDowWrap").hide();
            swal('服务器异常', "", "error")
        });

    };




    // 数据导出
    $scope.export = function () {
        // 基本检索URL
        var url = $host.api_url + "/carRel.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };
    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
          $scope.search_vin=conditions.vinCode;
          $scope.search_makeId=conditions.makeId;
          $scope.search_relStatus=conditions.relStatus;
          $scope.search_storage=conditions.storageId;
          $scope.search_dealer=conditions.receiveId;
          $scope.client=conditions.entrustId;
          $scope.source_city=conditions.routeStartId;
          $scope.arrive_city=conditions.routeEndId;
          $scope.put_in_time_start=conditions.enterStart;
          $scope.put_in_time_end=conditions.enterEnd;
          $scope.out_time_start=conditions.realStart;
          $scope.out_time_end=conditions.realEnd;
          $scope.order_time_start=conditions.orderStart;
          $scope.order_time_end=conditions.orderEnd;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            active: 1,
            vinCode: $scope.search_vin,
            makeId: $scope.search_makeId,
            relStatus: $scope.search_relStatus,
            storageId: $scope.search_storage,
            receiveId: $scope.search_dealer,
            entrustId: $scope.client,
            routeStartId: $scope.source_city,
            routeEndId: $scope.arrive_city,
            enterStart: $scope.put_in_time_start,
            enterEnd: $scope.put_in_time_end,
            realStart: $scope.out_time_start,
            realEnd: $scope.out_time_end,
            orderStart: $scope.order_time_start,
            orderEnd: $scope.order_time_end
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "storageCar_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "storage_car") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
                $scope.arriveCityNm = pageItems.conditions.routeEndName;
                $scope.sourceCityNm = pageItems.conditions.routeStartName;
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};

            $scope.arriveCityNm = "目的地城市";
            $scope.sourceCityNm = "发运地城市";
        }
        getCityInfo ($scope.arriveCityNm,$scope.sourceCityNm)
      /*  // 查询数据
        searchAll();*/
    }
    initData();

}]);