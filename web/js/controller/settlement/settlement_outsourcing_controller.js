app.controller("settlement_outsourcing_controller", ["_basic", "_config", "$host", "$scope", "$state", "$stateParams",function (_basic, _config, $host, $scope,$state, $stateParams) {
    $scope.start = 0;
    $scope.size = 11;
    $("#pre").hide();
    $("#next").hide();
    $scope.receiveList=[];
    // 获取所有公司列表
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
        _basic.get($host.api_url + "/company?operateType=2").then(function (data) {
            if (data.success === true) {
                $scope.companyList = data.result;
            }
            else {
                swal(data.msg, "", "error");
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
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success === true) {
                $scope.brandList = data.result;
            }
            else {
                swal(data.msg, "", "error");
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
                    swal(data.msg, "", "error");
                }
            });
        }
    };

    //获取经销商
    $scope.getReceiveMod = function (id) {
        _basic.get($host.api_url + "/receive?cityId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.receiveList = data.result;
                $('#receiveId').select2({
                    placeholder: '经销商',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    };




    //结算车辆数 结算金额
    function getCarMsg () {
        if ($scope.instruct_starTime == undefined || $scope.instruct_endTime == undefined) {
            swal('请输入完整的指令时间', "", "error");
            $scope.settlementList = [];
            $scope.carMsg ='';
            $("#pre").hide();
            $("#next").hide();

        }
        else {
            var obj = {
                entrustId: $scope.entrustId,
                orderStart: $scope.instruct_starTime,
                orderEnd: $scope.instruct_endTime,
                makeId: $scope.car_brand,
                routeStartId: $scope.startCity,
                addrId: $scope.locateId,
                routeEndId: $scope.endCity,
                receiveId: $scope.receiveId,
                vin:$scope.vin,
                operateType:2,
                companyId:$scope.companyId
            };
            _basic.get($host.api_url + "/settleOuterTruckCarCount?" + _basic.objToUrl(obj)).then(function (data) {
                if (data.success == true) {
                    if (data.result.length > 0) {
                        $scope.carMsg = data.result[0];
                    }
                    else {
                        $scope.carMsg = [];
                    }

                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }



    // 数据导出
    $scope.export = function () {
        if($scope.instruct_starTime==undefined||$scope.instruct_endTime==undefined){
            swal('请输入完整的指令时间', "", "error");
            $scope.settlementList=[];
            $("#pre").hide();
            $("#next").hide();
        }
        else {
            var obj = {
                entrustId: $scope.entrustId,
                orderStart: $scope.instruct_starTime,
                orderEnd: $scope.instruct_endTime,
                makeId: $scope.car_brand,
                routeStartId: $scope.startCity,
                addrId: $scope.locateId,
                routeEndId: $scope.endCity,
                receiveId: $scope.receiveId,
                vin:$scope.vin,
                operateType:2,
                companyId:$scope.companyId
            };
            swal({
                title: "确定导出外协结算报表？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(
                function (result) {
                    if (result.value) {
                        window.open($host.api_url + "/settleOuterTruck.csv?" + _basic.objToUrl(obj));
                    }
                })

        }
    };

    //查询功能
    $scope.getSettlement = function (){
        $scope.start = 0;
        getSettlementData();
        getCarMsg ();
    }

    //获取查询数据
    function getSettlementData(){
        if($scope.instruct_starTime==undefined||$scope.instruct_endTime==undefined){
            swal('请输入完整的指令时间', "", "error");
            $scope.settlementList=[];
        }
        else{
            _basic.get($host.api_url + "/settleOuterTruckList?" + _basic.objToUrl({
                entrustId: $scope.entrustId,
                orderStart: $scope.instruct_starTime,
                orderEnd: $scope.instruct_endTime,
                makeId: $scope.car_brand,
                routeStartId: $scope.startCity,
                addrId: $scope.locateId,
                routeEndId: $scope.endCity,
                receiveId: $scope.receiveId,
                vin:$scope.vin,
                operateType:2,
                companyId:$scope.companyId,
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
}])