app.controller("setting_settlement_controller", ["_basic", "_config", "$host", "$scope", function (_basic, _config, $host, $scope) {
    $scope.start = 0;
    $scope.size = 11;
    // 委托方
    function getEntrust(){
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.get_entrust = data.result;
                $('#client').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        // 车辆品牌
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.get_carMake = data.result;
            }
        });
        //城市
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.cityList = data.result;
                $('#startCity').select2({
                    placeholder: '始发城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#endCity').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    };

    // 发运地名称
    $scope.getAddrData = function () {
        if($scope.startCity == 0 || $scope.startCity == "" || $scope.startCity == null){
            $scope.startCity = null;
            $scope.locateList = [];
        }
        else{
            _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.startCity).then(function (data) {
                if (data.success === true) {
                    $scope.locateList = data.result;
                }
                else {
                    swal(addrData.msg, "", "error");
                }
            });
        }
    };

    //获取经销商
    $scope.getReceiveMod = function (id) {
        _basic.get($host.api_url + "/receive?cityId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.receiveList = data.result;
            }
        });
    };

    // 数据导出
    $scope.export = function () {
        var obj = {
            entrustId: $scope.entrustId,
            orderStart: $scope.instruct_starTime,
            orderEnd: $scope.instruct_endTime,
            makeId: $scope.car_brand,
            routeStartId: $scope.startCity,
            addrId: $scope.locateId,
            routeEndId: $scope.endCity,
            receiveId: $scope.receiveId
        };
        swal({
                title: "确定导出结算报表？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: true,
                closeOnCancel:true
            },
            function () {

                window.open($host.api_url + "/entrustCar.csv?" + _basic.objToUrl(obj));
            })
    };

    //查询功能
    $scope.getSettlement = function (){
        $scope.start = 0;
        getSettlementData();
    }

    //获取查询数据
    function getSettlementData(){
        if($scope.instruct_starTime==undefined||$scope.instruct_endTime==undefined){
            $scope.settlementList=[];
            $("#pre").hide();
            $("#next").hide();
        }
        else{
            _basic.get($host.api_url + "/entrustCar?" + _basic.objToUrl({
                entrustId: $scope.entrustId,
                orderStart: $scope.instruct_starTime,
                orderEnd: $scope.instruct_endTime,
                makeId: $scope.car_brand,
                routeStartId: $scope.startCity,
                addrId: $scope.locateId,
                routeEndId: $scope.endCity,
                receiveId: $scope.receiveId,
                start:$scope.start.toString(),
                size:$scope.size
            })).then(function (data) {
                if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.settlementList = $scope.boxArray.slice(0, 10);
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
        }

    }
    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getSettlementData();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getSettlementData();
    };

    getEntrust();
    getSettlementData();
}])