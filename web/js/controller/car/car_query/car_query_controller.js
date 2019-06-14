/**
 * Created by zcy on 2017/6/27.
 */
app.controller("car_query_controller", ["$scope", "$rootScope","$state","$stateParams", "$host", "_basic", "_config", "baseService", function ($scope, $rootScope,$state,$stateParams, $host, _basic, _config, baseService) {
    $scope.start = 0;
    $scope.size = 21;
    // 车辆品牌
    $scope.getCarMakeData = function () {
        _basic.get($host.api_url + "/carMake").then(function (carMakeData) {
            if (carMakeData.success === true) {
                $scope.carMakeList = carMakeData.result;
            }
            else {
                swal(carMakeData.msg, "", "error");
            }
        });
    };

    // 发运地名称
    $scope.getAddrData = function () {
        if($scope.addrCity == 0 || $scope.addrCity == "" || $scope.addrCity == null){
            $scope.addrCity = null;
            $scope.addrList = [];
        }
        else{
            _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.addrCity).then(function (addrData) {
                if (addrData.success === true) {
                    $scope.addrList = addrData.result;
                    $('#addrId').select2({
                        placeholder: '发运地',
                        containerCssClass : 'select2_dropdown'
                    });
                }
                else {
                    swal(addrData.msg, "", "error");
                }
            });
        }
    };

    // 目的地城市
    $scope.getCityData = function () {
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.cityList = cityData.result;
                $('#start_city_list').select2({
                    placeholder: '发运地城市',
                    containerCssClass : 'select2_dropdown'
                });
                $('#end_city_list').select2({
                    placeholder: '目的地城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
    };

    // 委托方
    $scope.getEntrustData = function () {
        _basic.get($host.api_url + "/entrust").then(function (entrustData) {
            if (entrustData.success === true) {
                $scope.entrustList = entrustData.result;
                // console.log("委托方:", entrustData);
            }
            else {
                swal(entrustData.msg, "", "error");
            }
        });
    };

    // 经销商
    $scope.getReceiveData = function () {
        if($scope.destinationId == 0 || $scope.destinationId == "" || $scope.destinationId == null){
            $scope.destinationId = null;
            $scope.receiveList = [];
        }
        else{
            _basic.get($host.api_url + "/receive?cityId=" + $scope.destinationId).then(function (receiveData) {
                if (receiveData.success === true) {
                    $scope.receiveList = receiveData.result;
                    $('#receiveId').select2({
                        placeholder: '经销商',
                        containerCssClass : 'select2_dropdown'
                    });

                }
                else {
                    swal(receiveData.msg, "", "error");
                }
            });
        }
    };

     /*导出*/
    $scope.export = function(){
        // 基本检索URL
        var url = $host.api_url + "/carList.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    }


    // 根据条件搜索车辆
    $scope.search_car = function () {
        // 基本检索URL
        var url = $host.api_url + "/carList?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "car_query",
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

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.search_car();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.search_car();
    };

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.vin_code=conditions.vinCode;
        $scope.brandId=conditions.makeId;
        $scope.addrCity=conditions.routeStartId;
        $scope.addrId=conditions.addrId;
        $scope.instructionsStart=conditions.orderStart;
        $scope.instructionsEnd=conditions.orderEnd;
        $scope.entrustId=conditions.entrustId;
        $scope.receiveId=conditions.receiveId;
        $scope.destinationId=conditions.routeEndId;
        $scope.createdStart=conditions.createdStart;
        $scope.createdEnd=conditions.createdEnd;
        $scope.carStatus=conditions.carStatus;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            vinCode: $scope.vin_code,
            makeId: $scope.brandId,
            routeStartId:$scope.addrCity,
            addrId: $scope.addrId,
            orderStart: $scope.instructionsStart,
            orderEnd: $scope.instructionsEnd,
            entrustId: $scope.entrustId,
            receiveId: $scope.receiveId,
            routeEndId:$scope.destinationId,
            createdStart:$scope.createdStart,
            createdEnd:$scope.createdEnd,
            carStatus:$scope.carStatus
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "car_query_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "car_query") {
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
        $scope.getAddrData();
        $scope.getReceiveData();
        // 查询数据
        $scope.search_car();

    }
    initData();

    // 点击车辆查询
    $scope.searchMatchCar = function () {
        // 点击查询的时候让分页起始条数初始化
        $scope.start = 0;
        $scope.search_car();
    };

    // 获取所有数据
    $scope.queryData = function () {
        $scope.getCarMakeData();
        $scope.getCityData();
        $scope.getEntrustData();
        // 默认显示所有数据
        $scope.search_car();
    };
    $scope.queryData();

}]);