app.controller("car_settlement_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    $scope.startAlready = 0;
    $scope.sizeAlready = 11;
    $scope.start = 0;
    $scope.size = 11;
    $("#pre").hide();
    $("#next").hide();
    $("#preCar").hide();
    $("#nextCar").hide();
    // 跳转
    $scope.alreadySettled = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.alreadySettled ').addClass("active");
        $("#alreadySettled").addClass("active");
        $("#alreadySettled").show();
    };
    $scope.unsettled = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.unsettled ').addClass("active");
        $("#unsettled").addClass("active");
        $("#unsettled").show();
    };
    $scope.alreadySettled();

    function getCity(){
        //起始城市 目的城市
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.cityList = data.result;
                $('#startCity').select2({
                    placeholder: '起始城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#endCity').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#carStartCity').select2({
                    placeholder: '起始城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#carEndCity').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
        });

        //获取委托方
        _basic.get($host.api_url + "/entrust").then(function (entrustData) {
            if (entrustData.success === true) {
                $scope.entrustList = entrustData.result;
                $('#client').select2({
                    placeholder: '委托方',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#carClient').select2({
                    placeholder: '委托方',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(entrustData.msg, "", "error");
            }
        });
    }

    // 城市-经销商联动(未结算)
    $scope.getCarDealer = function () {
        if($scope.carEndCity == 0 || $scope.carEndCity == "" || $scope.carEndCity == null){
            $scope.carEndCity = null;
            $scope.getReceive = [];
        }
        else{
            // 经销商下拉列表
            _basic.get($host.api_url + "/receive?cityId=" + $scope.carEndCity).then(function (data) {
                if (data.success === true) {
                    $scope.getReceive = data.result;
                }
            });
        }
    };

    <!--已结算车辆 查找-->
    function getCarList () {
        if ($scope.orderStart == null || $scope.orderEnd == null || $scope.orderStart == "" || $scope.orderEnd == "") {
            swal('请输入完整的查询时间', "", "error");
        }
        else{
            _basic.get($host.api_url + "/settleCar?" + _basic.objToUrl({
                settleStatus:2,
                vin: $scope.VIN,
                entrustId:$scope.enstrustId,
                routeStartId:$scope.routeStartId,
                routeEndId:$scope.routeEndId,
                orderStart:$scope.orderStart,
                orderEnd:$scope.orderEnd,
                start:$scope.startAlready.toString(),
                size:$scope.sizeAlready
            })).then(function (data) {
                if (data.success === true) {
                    $scope.appBoxArray = data.result;
                    $scope.carList = $scope.appBoxArray.slice(0, 10);
                    if ($scope.startAlready > 0) {
                        $("#pre").show();
                    }
                    else {
                        $("#pre").hide();
                    }
                    if (data.result.length < $scope.sizeAlready) {
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
        }
    };
    // 点击搜索
    $scope.searchCarSettlment = function () {
        $scope.startAlready=0;
        getCarList();
    };

    // 分页
    $scope.getPrePage = function () {
        $scope.startAlready = $scope.startAlready - ($scope.sizeAlready-1);
        getCarList();
    };
    $scope.getNextPage = function () {
        $scope.startAlready = $scope.startAlready + ($scope.sizeAlready-1);
        getCarList();
    };


    <!--未结算车辆 查找-->
    function getCarListS () {
        if ($scope.orderStartCar == null || $scope.orderEndCar == null || $scope.orderStartCar == "" || $scope.orderEndCar == "") {
            swal('请输入完整的查询时间', "", "error");
        }
        else {
            _basic.get($host.api_url + "/settleCar?" + _basic.objToUrl({
                settleStatus:1,
                vin: $scope.carVIN,
                entrustId: $scope.carClient,
                routeStartId: $scope.carStartCity,
                routeEndId: $scope.carEndCity,
                receiveId: $scope.carDealer,
                orderStart:$scope.orderStartCar,
                orderEnd:$scope.orderEndCar,
                start: $scope.start.toString(),
                size: $scope.size
            })).then(function (data) {
                if (data.success === true) {
                    $scope.appBoxArray = data.result;
                    $scope.carLists = $scope.appBoxArray.slice(0, 10);
                    if ($scope.start > 0) {
                        $("#preCar").show();
                    }
                    else {
                        $("#preCar").hide();
                    }
                    if (data.result.length < $scope.size) {
                        $("#nextCar").hide();
                    }
                    else {
                        $("#nextCar").show();
                    }

                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    };
    // 点击搜索
    $scope.searchCar = function () {
        $scope.start=0;
        getCarListS();
    };

    // 分页
    $scope.getPrePageCar = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getCarListS();
    };
    $scope.getNextPageCar = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getCarListS();
    };

    function settleCarCount(){
        _basic.get($host.api_url + "/settleCarCount").then(function (entrustData) {
            if (entrustData.success === true) {
                $scope.settleCarCountList = entrustData.result[0];
            }
            else {
                swal(entrustData.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/notSettleCarCount").then(function (entrustData) {
            if (entrustData.success === true) {
                $scope.notSettleCarCountList = entrustData.result[0];
            }
            else {
                swal(entrustData.msg, "", "error");
            }
        });
    }


    getCity();
    settleCarCount();

}]);