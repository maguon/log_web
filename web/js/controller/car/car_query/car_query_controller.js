
/**
 * 主菜单：公共数据 -> 商品车信息 控制器
 */
app.controller("car_query_controller", ["$scope", "$rootScope","$state","$stateParams", "$host", "_basic", "_config", "baseService", function ($scope, $rootScope,$state,$stateParams, $host, _basic, _config, baseService) {

    // 翻页用
    $scope.start = 0;
    $scope.size = 21;


    //商品车状态
    $scope.carStatusList = _config.carStatus;



    /*
    * 获取起始城市  目的城市
    * */
    function getCity() {
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.cityList = cityData.result;
                $('#start').select2({
                    placeholder: '起始城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#end').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
    };



    /*
    * 获取发运地
    * */
    $scope.changeStartCity = function () {
        if($scope.conStartCity == 0 || $scope.conStartCity == "" || $scope.conStartCity == null){
            $scope.conStartCity = null;
            $scope.addrList = [];
        }
        else{
            _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.conStartCity).then(function (addrData) {
                if (addrData.success === true) {
                    $scope.addrList = addrData.result;
                    $('#addr').select2({
                        placeholder: '发运地',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(addrData.msg, "", "error");
                }
            });
        }
    };



    /*
    * 获取经销商
    * */
    $scope.changeEndCity = function () {
        if($scope.conEndCity == 0 || $scope.conEndCity == "" || $scope.conEndCity == null){
            $scope.conEndCity = null;
            $scope.receiveList = [];
        }
        else{
            _basic.get($host.api_url + "/receive?cityId=" + $scope.conEndCity).then(function (receiveData) {
                if (receiveData.success === true) {
                    $scope.receiveList = receiveData.result;
                    $('#receive').select2({
                        placeholder: '经销商',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });

                }
                else {
                    swal(receiveData.msg, "", "error");
                }
            });
        }
    };



    /*
    * 获取车辆品牌
    * */
   function getCarMake() {
        _basic.get($host.api_url + "/carMake").then(function (carMakeData) {
            if (carMakeData.success === true) {
                $scope.carMakeList = carMakeData.result;
            }
            else {
                swal(carMakeData.msg, "", "error");
            }
        });
    };



    /*
    * 获取委托方
    * */
    function getEntrust() {
        _basic.get($host.api_url + "/entrust").then(function (entrustData) {
            if (entrustData.success === true) {
                $scope.entrustList = entrustData.result;
            }
            else {
                swal(entrustData.msg, "", "error");
            }
        });
    };





    /**
     * 查询按钮
     */
    $scope.getCar = function () {
        $scope.start = 0;
        $scope.searchCar();
    };




    /**
     * 根据条件搜索
     */
    $scope.searchCar = function () {
        // 基本检索URL
        var url = $host.api_url + "/carList?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objNewTo2Url(conditionsObj);
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
                $scope.carList = $scope.boxArray.slice(0, 20);
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





    
    
     /*导出*/
    $scope.export = function(){
        // 基本检索URL
        var url = $host.api_url + "/carList.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objNewTo2Url(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    }






    /*
    * 分页
    * */
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.searchCar();
    };

    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.searchCar();
    };





    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.conVin=conditions.vinCode;
        $scope.conBrand=conditions.makeId;
        $scope.conStartCity=conditions.routeStartId;
        $scope.conAddr=conditions.addrId;
        $scope.conInstructionsStart=conditions.orderStart;
        $scope.conInstructionsEnd=conditions.orderEnd;
        $scope.conEntrust=conditions.entrustId;
        $scope.conReceive=conditions.receiveId;
        $scope.conEndCity=conditions.routeEndId;
        $scope.conCreatedStart=conditions.createdStart;
        $scope.conCreatedEnd=conditions.createdEnd;
        $scope.conStatus=conditions.carStatus;
        $scope.conPerateType=conditions.outerFlag;
    }





    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            vinCode: $scope.conVin,
            makeId: $scope.conBrand,
            routeStartId:$scope.conStartCity,
            addrId: $scope.conAddr,
            orderStart: $scope.conInstructionsStart,
            orderEnd: $scope.conInstructionsEnd,
            entrustId: $scope.conEntrust,
            receiveId: $scope.conReceive,
            routeEndId:$scope.conEndCity,
            createdStart:$scope.conCreatedStart,
            createdEnd:$scope.conCreatedEnd,
            carStatus:$scope.conStatus,
            outerFlag:$scope.conPerateType
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
        $scope.changeStartCity();
        $scope.changeEndCity();


        // 查询数据
        $scope.searchCar();

    }
    initData();



    getCarMake();
    getCity();
    getEntrust();

}]);