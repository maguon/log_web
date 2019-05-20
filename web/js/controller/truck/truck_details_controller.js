/**
 * Created by ASUS on 2017/7/10.
 */
app.controller("truck_details_controller", ["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.head_start = 0;
    $scope.head_size = 11;
    $scope.hand_start = 0;
    $scope.hand_size = 11;
    // 头车挂车跳转
    $scope.header_car = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.header_car ').addClass("active");
        $("#header_car").addClass("active");
        $("#header_car").show();
        $scope.search_truck_status = 1;
    };
    $scope.hand_car = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.hand_car ').addClass("active");
        $("#hand_car").addClass("active");
        $("#hand_car").show();
        $scope.search_truck_status = 2;
    };
    $scope.header_car();

    // 类型--公司联动
    $scope.get_company = function (type) {
        // 获取公司
        _basic.get($host.api_url + "/company?operateType=" + type).then(function (data) {
            if (data.success == true) {
                $scope.company = data.result;
            }
            else {
                swal(data.msg, "", "error")
            }
        });

    };

    $scope.getBrandList = function () {
        _basic.get($host.api_url + "/brand").then(function (data) {
            if (data.success == true) {
                $scope.brand = data.result;
            }
            else {
                swal(data.msg, "", "error")
            }
        });
    };
    $scope.getBrandList();

    //車牌号
    function getTruckNumList () {
        _basic.get($host.api_url + "/truckFirst?truckType=1").then(function (data) {
            if (data.success === true) {
                $scope.truckNumList = data.result;
                $('#search_num').select2({
                    placeholder: '车牌号',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    //車牌号
    function getTrailerNumList () {
        _basic.get($host.api_url + "/truckTrailer?truckType=2").then(function (data) {
            if (data.success === true) {
                $scope.truckTrailerNumList = data.result;
                $('#search_hand_num').select2({
                    placeholder: '车牌号',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    getTruckNumList ();
    getTrailerNumList ();








    // 头车搜索请求
    $scope.head_query = function () {

        // 基本检索URL
        var url = $host.api_url + "/truckFirst?start=" + $scope.head_start + "&size=" + $scope.head_size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "truck_details",
                    start: $scope.head_start,
                    size: $scope.head_size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.head_car_box = data.result;
                $scope.head_car = $scope.head_car_box.slice(0, 10);
                if ($scope.head_start > 0) {
                    $scope.head_pre = true;
                }
                else {
                    $scope.head_pre = false;
                }

                if ($scope.head_car_box.length < $scope.head_size) {
                    $scope.head_next = false;
                }
                else {
                    $scope.head_next = true;
                }
            }
            else {
                swal(data.msg, "", "error")
            }
        });
    };

    //导出头车信息
    $scope.export_head = function(){
        // 基本检索URL
        var url = $host.api_url + "/truckFirstCsv.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    }

    // 头车搜索事件-条件查询
    $scope.searchHead_car = function () {
        $scope.head_start = 0;
        $scope.head_query();
    };

    // 修改头车状态
    $scope.changeTruck_status = function (id, status) {
        if (status == 1) {
            status = 0
        }
        else {
            status = 1
        }
        _basic.put($host.api_url + "/user/" + userId + "/truck/" + id + "/truckStatus/" + status + "/first", {}).then(function (data) {
            if (data.success == true) {
                swal("修改成功", "", "success");
                $scope.head_query();
            }
            else {
                swal(data.msg, "", "error");
                $scope.head_query();
            }
        })

    };

    // 头车上一页
    $scope.head_pre_btn = function () {
        $scope.head_start = $scope.head_start - ($scope.head_size - 1);
        $scope.head_query ();
    };
    // 头车下一页
    $scope.head_next_btn = function () {
        $scope.head_start = $scope.head_start + ($scope.head_size - 1);
        $scope.head_query ();
    };


    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.search_num=conditions.truckNum;
        $scope.search_truck_type=conditions.operateType;
        $scope.search_company=conditions.companyId;
        $scope.search_driver=conditions.driveName;
        $scope.check_operation_startTime=conditions.licenseDateStart;
        $scope.check_operation_endTime=conditions.licenseDateEnd;
        $scope.search_checkCar_startTime=conditions.drivingDateStart;
        $scope.search_checkCar_endTime=conditions.drivingDateEnd;
        $scope.truckBrand=conditions.brandId;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            truckNum:$scope.search_num,
            operateType:$scope.search_truck_type,
            companyId:$scope.search_company,
            driveName:$scope.search_driver,
            licenseDateStart:$scope.check_operation_startTime,
            licenseDateEnd:$scope.check_operation_endTime,
            drivingDateStart:$scope.search_checkCar_startTime,
            drivingDateEnd:$scope.search_checkCar_endTime,
            brandId:$scope.truckBrand,
            truckType:1
        };
    }


    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "look_head_truck_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "truck_details") {
                // 设定画面翻页用数据
                $scope.head_start = pageItems.start;
                $scope.head_size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
                $scope.type =pageItems.conditions.operateType;
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
            $scope.type='';
        }
        // 查询数据
        $scope.get_company( $scope.type);
        $scope.head_query ();

    }
    initData();






    //挂车导出
    $scope.export_hand = function () {
        // 基本检索URL
        var url = $host.api_url + "/truckTrailerCsv.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions2();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    }
    // 挂车接口查询
    $scope.hand_query = function () {
        // 基本检索URL
        var url = $host.api_url + "/truckTrailer?start=" + $scope.hand_start + "&size=" + $scope.hand_size;
        // 检索条件
        var conditionsObj = makeConditions2();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "truck_details",
                    start: $scope.hand_start,
                    size: $scope.hand_size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj2 = {pageArray: []};
                $rootScope.refObj2.pageArray.push(pageItems);
                $scope.hand_car_box = data.result;
                $scope.hand_car_msg = $scope.hand_car_box.slice(0, 10);
                if ($scope.hand_start > 0) {
                    $scope.hand_pre = true;
                }
                else {
                    $scope.hand_pre = false;
                }

                if ($scope.hand_car_box.length < $scope.hand_size) {
                    $scope.hand_next = false;
                }
                else {
                    $scope.hand_next = true;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 挂车搜索事件-条件查询
    $scope.searchHand_car = function () {
        $scope.hand_start = 0;
        $scope.hand_query()
    };

    // 分页
    // 挂车上一页
    $scope.hand_pre_btn = function () {
        $scope.hand_start = $scope.hand_start - ($scope.hand_size - 1);
        $scope.hand_query()
    };
    // 挂车下一页
    $scope.hand_next_btn = function () {
        $scope.hand_start = $scope.hand_start + ($scope.hand_size - 1);
        $scope.hand_query()
    };
    // 修改挂车状态
    $scope.changeTruckTrailer_status = function (id, status) {
        if (status == 1) {
            status = 0
        }
        else {
            status = 1
        }
        _basic.put($host.api_url + "/user/" + userId + "/truck/" + id + "/truckStatus/" + status + "/trailer", {}).then(function (data) {
            if (data.success == true) {
                swal("修改成功", "", "success");
                $scope.hand_query();

            }
            else {
                swal(data.msg, "", "error");
                $scope.hand_query();
            }
        })
    };


    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions2(conditions) {
        $scope.search_hand_num=conditions.truckNum;
        $scope.search_hand_num_start=conditions.numberStart;
        $scope.search_hand_num_end=conditions.numberEnd;
        $scope.search_truck_hand_type=conditions.operateType;
        $scope.search_hand_company=conditions.companyId;
        $scope.check_operation_hand_startTime=conditions.licenseDateStart;
        $scope.check_operation_hand_endTime=conditions.licenseDateEnd;
        $scope.search_checkCar_hand_startTime=conditions.drivingDateStart;
        $scope.search_checkCar_hand_endTime=conditions.drivingDateEnd;
        $scope.handBrand=conditions.brandId;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions2() {
        return {
            truckNum : $scope.search_hand_num,
            numberStart : $scope.search_hand_num_start,
            numberEnd :$scope.search_hand_num_end,
            operateType: $scope.search_truck_hand_type,
            companyId : $scope.search_hand_company,
            licenseDateStart :$scope.check_operation_hand_startTime,
            licenseDateEnd : $scope.check_operation_hand_endTime,
            drivingDateStart :$scope.search_checkCar_hand_startTime,
            drivingDateEnd : $scope.search_checkCar_hand_endTime,
            brandId : $scope.handBrand,
            truckType:2

        };
    }


    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData2() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "look_hand_truck_details" && $rootScope.refObj2 !== undefined && $rootScope.refObj2.pageArray.length > 0) {
            var pageItems = $rootScope.refObj2.pageArray.pop();
            if (pageItems.pageId === "truck_details") {
                // 设定画面翻页用数据
                $scope.hand_start = pageItems.start;
                $scope.hand_size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions2(pageItems.conditions);
                $scope.type =pageItems.conditions.operateType;
                $scope.hand_car();
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj2 = {pageArray: []};
            $scope.type='';
        }
        // 查询数据
        $scope.get_company($scope.type);
        $scope.hand_query ();

    }
    initData2();








    // 显示设置车辆当前位置模态框
    $scope.showCarPositionModel = function (truckId) {
        // 获取城市信息
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                $scope.allCityList = data.result;
                $scope.truck_id = truckId;
                $('.js-example-basic-single').select2({
                    placeholder: '车辆当前位置',
                    containerCssClass : 'select2_dropdown'
                });
                $('#carPositionModel').modal('open');
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 保存位置信息
    $scope.savePositionInfo = function () {
        if($scope.currentCityId != "" && $scope.currentCityId != undefined){
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + $scope.truck_id + "/dispatch",{
                currentCity:$scope.currentCityId
            }).then(function (data) {
                if (data.success === true) {
                    $('#carPositionModel').modal('close');
                    swal("设置成功", "", "success");
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请选择车辆位置", "", "warning");
        }
    };

    $scope.closePositionModel = function () {
        $('#carPositionModel').modal('close');
    }

}]);