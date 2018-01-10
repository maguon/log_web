/**
 * Created by ASUS on 2017/8/4.
 */

app.controller("truck_repair_list_controller", ['$rootScope', '$scope', '_basic', '$host', function ($rootScope, $scope, _basic, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.repair_start = 0;
    $scope.repair_size = 11;

    // 数据导出
    $scope.export = function () {
        if ($scope.repair_status == 0) {
            $scope.repair_status_tx = "" + 0;
        }
        else {
            $scope.repair_status_tx = $scope.repair_status;
        }
        var obj = {
            truckType: $scope.truck_type,
            truckNum: $scope.truck_name,
            repairStatus: $scope.repair_status_tx,
            repairDateStart: $scope.repair_startTime_start,
            repairDateEnd: $scope.repair_startTime_end,
            endDateStart: $scope.repair_endTime_start,
            endDateEnd: $scope.repair_endTime_end
        };
        window.open($host.api_url + "/truckRepair.csv?" + _basic.objToUrl(obj));
    };
    // 单条公司信息
    var companyMsg;

    // 基础条件
    $scope.query_params = {
        start: $scope.repair_start,
        size: $scope.repair_size
    };
    // 查询接口事件
    $scope.query = function (params) {
        _basic.get($host.api_url + "/truckRepairRel?" + _basic.objToUrl(params)).then(function (data) {
            // $(".shadeDowWrap").hide();
            if (data.success == true) {
                $scope.truckRepair = data.result;
                $scope.truckRepairRel = $scope.truckRepair.slice(0, 10);
                if ($scope.repair_start > 0) {
                    $scope.pre = true;
                }
                else {
                    $scope.pre = false;
                }
                if ($scope.truckRepair.length < $scope.repair_size) {
                    $scope.next = false;
                }
                else {
                    $scope.next = true;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 普通查询
    $scope.search_truck = function () {
        $scope.query_params.start = $scope.repair_start;
        $scope.query($scope.query_params);
    };
    $scope.search_truck();

    // 赋值
    $scope.setParams = function () {
        // 挂车控制查询参数逻辑
        if ($scope.truck_type) {
            $scope.query_params.truckType = $scope.truck_type;
        }
        else {
            $scope.query_params.truckType = null;
        }

        if ($scope.truck_name) {
            $scope.query_params.truckNum = $scope.truck_name;
        }
        else {
            $scope.query_params.truckNum = null;
        }

        if ($scope.repair_startTime_start) {
            $scope.query_params.repairDateStart = $scope.repair_startTime_start;
        }
        else {
            $scope.query_params.repairDateStart = null;
        }

        if ($scope.repair_startTime_end) {
            $scope.query_params.repairDateEnd = $scope.repair_startTime_end;
        }
        else {
            $scope.query_params.repairDateEnd = null;
        }

        if ($scope.repair_endTime_start) {
            $scope.query_params.endDateStart = $scope.repair_endTime_start;
        }
        else {
            $scope.query_params.endDateStart = null;
        }

        if ($scope.repair_endTime_end) {
            $scope.query_params.endDateEnd = $scope.repair_endTime_end;
        }
        else {
            $scope.query_params.endDateEnd = null;
        }

        if ($scope.repair_status_tx) {
            $scope.query_params.repairStatus = $scope.repair_status_tx;
        }
        else {
            $scope.query_params.repairStatus = null;
        }

    };
    // 条件查询
    $scope.search_truck_msg = function () {
        $scope.repair_start = 0;
        if ($scope.repair_status == 0) {
            $scope.repair_status_tx = "" + 0;
        }
        else {
            $scope.repair_status_tx = $scope.repair_status;
        }
        $scope.setParams();
        $scope.query($scope.query_params)
    };


    // 分页
    // 头车上一页
    $scope.pre_btn = function () {
        $scope.repair_start = $scope.repair_start - ($scope.repair_size - 1);
        $scope.search_truck();
    };
    // 头车下一页
    $scope.next_btn = function () {
        $scope.repair_start = $scope.repair_start + ($scope.repair_size - 1);
        $scope.search_truck();
    };


    // 查看本次维修记录
    $scope.open_now_repair = function (id) {
        $('.modal').modal();
        $('#look_now_repair').modal('open');

        _basic.get($host.api_url + "/truckRepairRel?relId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.now_truckRepair = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 修改公司详情
    $scope.look_submitForm = function (id, isValid) {
        // console.log(companyMsg);
        $scope.look_submitted = true;
        if (isValid) {
            var subParam = {
                "companyName": companyMsg.company_name,
                "operateType": companyMsg.operate_type,
                "cooperationTime": $scope.look_cooperation_time,
                "contacts": companyMsg.contacts,
                "tel": companyMsg.tel,
                "remark": companyMsg.remark
            };

            _basic.put($host.api_url + "/user/" + userId + "/company/" + id, subParam).then(function (data) {
                if (data.success == true) {
                    $('#LookCompany').modal('close');
                    swal("修改成功", "", "success");
                    searchAll();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }

    }
}]);