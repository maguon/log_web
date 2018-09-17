app.controller("driver_settlement_controller", ["_basic", "_config", "$host", "$scope", function (_basic, _config, $host, $scope) {
    $scope.start = 0;
    $scope.size = 11;
    //司机 公司
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive?driveName=").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#driveName').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/company").then(function (data) {
            if (data.success === true) {
                $scope.companyList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取货车牌号
    function getTruckNum() {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAllList = data.result;
                $('#truckNum').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    }

    // 根据select选择的所属类型获取所属公司信息
    $scope.chooseOperateType = function () {
        _basic.get($host.api_url + "/company?operateType=" + $scope.operateType).then(function (companyData) {
            if (companyData.success === true) {
                $scope.companyList = companyData.result;
            }
            else {
                swal(companyData.msg, "", "error");
            }
        });
    };

    // 数据导出
    $scope.export = function () {
        var obj = {
            orderStart: $scope.instruct_starTime,
            orderEnd: $scope.instruct_endTime,
            driveId: $scope.drivderId,
            companyId: $scope.searchCompany,
            operateType:$scope.operateType,
            truckId:$scope.truckNum

        };
        swal({
                title: "确定导出司机结算表？",
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
                window.open($host.api_url + "/driveSettle.csv?" + _basic.objToUrl(obj));
            })

    };

    //查询功能
    $scope.getSettlement = function (){
        $scope.start = 0;
        getSettlementData();
    }

    //获取查询数据
    function getSettlementData(){
        _basic.get($host.api_url + "/driveSettle?" + _basic.objToUrl({
            orderStart: $scope.instruct_starTime,
            orderEnd: $scope.instruct_endTime,
            driveId: $scope.drivderId,
            companyId: $scope.searchCompany,
            operateType:$scope.operateType,
            truckId:$scope.truckNum,
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
    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getSettlementData();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getSettlementData();
    };
    getTruckNum();
    getDriveNameList ();
    getSettlementData();
}])
