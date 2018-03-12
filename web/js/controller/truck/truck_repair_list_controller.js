/**
 * Restructure by zcy on 2018/2/5.
 */

app.controller("truck_repair_list_controller", ['$rootScope', '$scope', '_basic', '$host', function ($rootScope, $scope, _basic, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.record_repair_start = 0;
    $scope.record_repair_size = 10;
    $scope.hasNotAccident = true;
    $scope.forbidSelect = true;

    // 数据导出
    $scope.export = function () {
        if ($scope.repair_status == 0) {
            $scope.repair_status_tx = "0";
        }
        else {
            $scope.repair_status_tx = $scope.repair_status;
        }
        var obj = {
            truckType: $scope.recordTruckType,
            truckNum: $scope.recordTruckNum,
            repairStatus: $scope.repair_status_tx,
            repairDateStart: $scope.record_startTime_start,
            repairDateEnd: $scope.record_startTime_end,
            endDateStart: $scope.record_endTime_start,
            endDateEnd: $scope.record_endTime_end
        };
        window.open($host.api_url + "/truckRepair.csv?" + _basic.objToUrl(obj));
    };

    // 获取维修记录列表
    $scope.getRepairRecordList = function () {
        _basic.get($host.api_url + "/truckRepairRel?" + _basic.objToUrl({
            relId: $scope.repairNum,
            truckType: $scope.recordTruckType,
            repairStatus: $scope.repair_status,
            repairDateStart: $scope.record_startTime_start,
            repairDateEnd: $scope.record_startTime_end,
            truckNum: $scope.recordTruckNum,
            endDateStart: $scope.record_endTime_start,
            endDateEnd: $scope.record_endTime_end,
            start: $scope.record_repair_start.toString(),
            size: $scope.record_repair_size
        })).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                if ($scope.record_repair_start > 0) {
                    $("#record_pre").show();
                }
                else {
                    $("#record_pre").hide();
                }
                if (data.result.length < $scope.record_repair_size) {
                    $("#record_next").hide();
                }
                else {
                    $("#record_next").show();
                }
                $scope.repairRecordList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 搜索维修记录
    $scope.searchRepairRecordList = function () {
        $scope.record_repair_start = 0;
        $scope.getRepairRecordList();
    };

    // 分页
    $scope.record_pre_btn = function () {
        $scope.record_repair_start = $scope.record_repair_start - $scope.record_repair_size;
        $scope.getRepairRecordList();
    };

    $scope.record_next_btn = function () {
        $scope.record_repair_start = $scope.record_repair_start + $scope.record_repair_size;
        $scope.getRepairRecordList();
    };

    // 开启新增维修记录模态框，并查询所有货车牌号
    $scope.addRepairInfo = function () {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                // console.log("truck", data);
                $scope.truckNumList = data.result;
                $('#truck_num_mod').select2({
                    placeholder: '车牌号',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $scope.modTruckNum = "";
        $scope.modRecordTruckType = "";
        $scope.associatedAccident = "";
        $scope.repairReason = "";
        $scope.hasNotAccident = true;
        $scope.forbidSelect = true;
        $('#addRepairInfoModel').modal('open');
    };

    // 根据选择的车牌号获取关联事故列表
    $scope.searchMatchAccident = function () {
        $scope.associatedAccident = "";
        _basic.get($host.api_url + "/truckAccident?truckId=" + $scope.modTruckNum).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                if(data.result.length === 0){
                    $scope.hasNotAccident = true;
                }
                else{
                    $scope.hasNotAccident = false;
                }
                $scope.accidentNumList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 检查是否允许关联事故
    $scope.isCheckAssociatedAccident = function () {
        if($scope.modRecordTruckType === "1"){
            $scope.forbidSelect = false;
        }
        else{
            $scope.associatedAccident = "";
            $scope.forbidSelect = true;
        }
    };

    // 提交新增的维修记录
    $scope.addRepairRecord = function () {
        var paramObj;
        var condition;
        // 根据不同的事故状态传不同的参数走不同的判断条件
        if($scope.forbidSelect){
            paramObj = {
                repairType: $scope.modRecordTruckType,
                repairReason: $scope.repairReason
            };
            condition = ($scope.modTruckNum !== "" && $scope.modRecordTruckType !== "" && $scope.repairReason !== "");
        }
        else{
            paramObj = {
                repairType: $scope.modRecordTruckType,
                accidentId: $scope.associatedAccident,
                repairReason: $scope.repairReason
            };
            condition = ($scope.modTruckNum !== "" && $scope.modRecordTruckType !== "" && $scope.repairReason !== "" && $scope.associatedAccident !== "");
        }
        if(condition){
            _basic.post($host.api_url + "/user/" + userId + "/truck/" + $scope.modTruckNum + "/truckRepairRel",paramObj).then(function (data) {
                if (data.success === true) {
                    swal("新增成功", "", "success");
                    $('#addRepairInfoModel').modal('close');
                    $scope.searchRepairRecordList();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getRepairRecordList();
    };
    $scope.queryData()

}]);