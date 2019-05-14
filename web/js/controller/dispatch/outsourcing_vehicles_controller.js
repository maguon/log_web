app.controller("outsourcing_vehicles_controller", ["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.licenseType = _config.licenseType;
    var hand_truck_msg;
    $scope.head_start = 0;
    $scope.head_size = 11;
    $scope.hand_start = 0;
    $scope.hand_size = 11;
    $scope.start = 0;
    $scope.size = 21;
    // 头车挂车跳转
    $scope.header_car = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.header_car ').addClass("active");
        $("#header_car").addClass("active");
        $("#header_car").show();
    };
    $scope.hand_car = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.hand_car ').addClass("active");
        $("#hand_car").addClass("active");
        $("#hand_car").show();
    };
    $scope.divider =function (){
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.divider ').addClass("active");
        $("#divider").addClass("active");
        $("#divider").show();
    }


    //品牌
    function getBrandList() {
        _basic.get($host.api_url + "/brand").then(function (data) {
            if (data.success == true) {
                $scope.brand = data.result;
            }
            else {
                swal(data.msg, "", "error")
            }
        });
    };
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
                    pageId: "outsourcing_vehicles",
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
        $scope.truckBrand=conditions.brandId;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            truckNum:$scope.search_num,
            operateType:2,
            companyId:$scope.search_company,
            driveName:$scope.search_driver,
            brandId:$scope.truckBrand,
            truckType:1
        };
    }


    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "look_head_detail" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "outsourcing_vehicles") {
                // 设定画面翻页用数据
                $scope.head_start = pageItems.start;
                $scope.head_size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
                $scope.type =pageItems.conditions.operateType;
                $scope.header_car()
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
            $scope.type='';
        }
        $scope.head_query ();

    }
    initData();




    getTruckNumList ();
    getTrailerNumList ();
    getBrandList();
    $scope.header_car()



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
                    pageId: "outsourcing_vehicles",
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
                $scope.hand_query()

            }
            else {
                swal(data.msg, "", "error");
                $scope.hand_query()
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
        $scope.search_hand_company=conditions.companyId;
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
            operateType: 2,
            companyId : $scope.search_hand_company,
            brandId : $scope.handBrand,
            truckType:2

        };
    }


    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData2() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "look_hand_detail" && $rootScope.refObj2 !== undefined && $rootScope.refObj2.pageArray.length > 0) {
            var pageItems = $rootScope.refObj2.pageArray.pop();
            if (pageItems.pageId === "outsourcing_vehicles") {
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
        $scope.hand_query ();

    }
    initData2();





    // 搜索指定司机信息
    function searchDriver() {

        // 基本检索URL
        var url = $host.api_url + "/drive?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions3();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "outsourcing_vehicles",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj3 = {pageArray: []};
                $rootScope.refObj3.pageArray.push(pageItems);
                $scope.boxArray = data.result;
                $scope.driveList = $scope.boxArray.slice(0, 20);
                if ($scope.start > 0) {
                    $("#pre").show();
                }
                else {
                    $("#pre").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next").hide();
                }
                else {
                    $("#next").show();
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 数据导出
    $scope.export = function () {
        // 基本检索URL
        var url = $host.api_url + "/drive.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions3();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };



    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions3(conditions) {
        $scope.driveName = conditions.driveName;
        $scope.driverType = conditions.operateType;
        $scope.driverCompany = conditions.companyId;
        $scope.workStatus = conditions.driveStatus;
        $scope.driveTel = conditions.mobile;
        $scope.truckNumber = conditions.truckNum;
        $scope.drivingLicense = conditions.licenseType;
        $scope.operateFlag = conditions.operateFlag;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions3() {
        return {
            driveName:$scope.driveName,
            operateType:2,
            companyId:$scope.driverCompany,
            driveStatus:$scope.workStatus,
            mobile: $scope.driveTel,
            truckNum:$scope.truckNumber,
            licenseType:$scope.drivingLicense,
            operateFlag:$scope. operateFlag
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData3() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "look_driver_detail" && $rootScope.refObj3 !== undefined && $rootScope.refObj3.pageArray.length > 0) {
            var pageItems = $rootScope.refObj3.pageArray.pop();
            if (pageItems.pageId === "outsourcing_vehicles") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions3(pageItems.conditions);
                $scope.driverType = pageItems.conditions.operateType;
                $scope.divider();
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj3 = {pageArray: []};
        }
        // 查询数据
        searchDriver();

    }
    initData3();




    // 点击查询司机
    $scope.showDriverInfo = function () {
        $scope.start = 0;
        searchDriver();
    };

    // 停用或启用司机
    $scope.disableDriver = function (driverStatus,driverId) {
        if(driverStatus == "1"){
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId + "/driveStatus/0",{}).then(function (disableData) {
                if (disableData.success === true) {
                    searchDriver($scope.queryParams);
                    swal("已停用该司机", "", "success");
                }
                else{
                    swal("司机已被关联，请先解绑", "", "warning");
                    searchDriver($scope.queryParams);
                }
            });
        }
        else{
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId + "/driveStatus/1",{}).then(function (activeData) {
                if (activeData.success === true) {
                   searchDriver($scope.queryParams);
                    swal("已启用该司机", "", "success");
                }
                else{
                    swal("司机已被关联，请先解绑", "", "warning");
                    searchDriver($scope.queryParams);
                }
            });
        }
    };

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.searchDriver();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.searchDriver();
    };








    // 获取司机信息
    $scope.queryData = function () {
        _basic.get($host.api_url + "/truckFirst?truckType=1").then(function (truckData) {
            if (truckData.success === true) {
                $scope.truckList = truckData.result;
            }
            else {
                swal(truckData.msg, "", "error");
            }
        });
    };
    $scope.queryData();




    // 所属类型--公司联动
   function getCompany() {
        _basic.get($host.api_url + "/company?operateType=2").then(function (data) {
            if (data.success == true) {
                $scope.company = data.result;
            } else {
                swal(data.msg, "", "error")
            }
        });
    };
    getCompany()

    function getTotalData(){
        // 获取车头
        _basic.get($host.api_url + "/truckFirst?truckType=1&operateType=2").then(function (data) {
            if (data.success == true) {
                head_car_msg= data.result;
                $scope.head_car_msg = data.result;

            } else {
                swal(data.msg, "", "error")
            }
        });
        // 获取挂车
        _basic.get($host.api_url + "/truckTrailer?truckType=2&operateType=2").then(function (data) {
            if (data.success == true) {
                hand_truck_msg = data.result;
                $scope.hand_truck_msg = data.result;
            } else {
                swal(data.msg, "", "error")
            }
        });
        // 获取主驾司机
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                hand_driver_msg = data.result;

                // 主驾
                $scope.drive = hand_driver_msg;
                // 副驾
                $scope.copilot = hand_driver_msg;
            } else {
                swal(data.msg, "", "error")
            }
        });
    }

    getTotalData();


}]);