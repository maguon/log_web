app.controller("operating_vehicles_controller", ['$scope', "$host", '_basic', '$rootScope','$state','$stateParams',function ($scope, $host, _basic, $rootScope,$state,$stateParams) {
    $scope.size = 11;
    $scope.start = 0;

    // 获取公司
     function get_company() {
        _basic.get($host.api_url + "/company").then(function (data) {
            if (data.success == true) {
                $scope.company = data.result;
            }
            else {
                swal(data.msg, "", "error")
            }
        });

    };
    // 获取货车品牌信息
    function getTruckBrandList() {
        _basic.get($host.api_url + "/brand").then(function (data) {
            if (data.success === true) {
                $scope.brandList = data.result;
            }
            else {
                swal(data.msg, "", "error");
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

    // 获取列表
    function getOperatingVehiclesList () {
        // 基本检索URL
        var url = $host.api_url + "/truckOperate?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "operating_vehicles",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.boxArray = data.result;
                $scope.responseData = $scope.boxArray.slice(0, 20);
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

    // 点击搜索
    $scope.searchOperatingVehicles = function () {
        $scope.start=0;
        getOperatingVehiclesList();
    };

    $scope.export = function (){
        // 基本检索URL
        var url = $host.api_url + "/truckOperate.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    }


    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.search_num=conditions.truckId;
        $scope.search_driver=conditions.driveName;
        $scope.search_company=conditions.companyId;
        $scope.dispatchFlag=conditions.dispatchFlag;
        $scope.truckBrand=conditions.brandId;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            truckId:$scope.search_num,
            truckType:1,
            driveName:$scope.search_driver,
            companyId:$scope.search_company,
            brandId:$scope.truckBrand,
            dispatchFlag:$scope.dispatchFlag
        };
    }


    // 分页
    $scope.getPrePage = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getOperatingVehiclesList();
    };
    $scope.getNextPage = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getOperatingVehiclesList();
    };



    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "look_head_truck_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "operating_vehicles") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }
        $scope.searchOperatingVehicles();
        getTruckNumList ();
        get_company();
        getTruckBrandList();
    }
    initData();











}])