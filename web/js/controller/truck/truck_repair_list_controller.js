/**
 * Created by ASUS on 2017/8/4.
 */

app.controller("truck_repair_list_controller", ['$rootScope', '$scope', '_basic', '$host', function ($rootScope, $scope, _basic, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    // 单条公司信息
    var companyMsg;

    // 搜索查询
    $scope.search_truck = function () {

        var obj = {
            truckType: $scope.truck_type,
            truckNum:$scope.truck_name,
            repairDateStart: $scope.repair_startTime_start,
            repairDateEnd: $scope.repair_startTime_end,
            endDateStart: $scope.repair_endTime_start,
            endDateEnd: $scope.repair_endTime_end,
            repairStatus: $scope.repair_status,
        };
        console.log(_basic.objToUrl(obj));
        _basic.get($host.api_url + "/truckRepairRel?" + _basic.objToUrl(obj)).then(function (data) {
            // $(".shadeDowWrap").hide();
            if (data.success == true) {
                $scope.truckRepairRel = data.result;
                // console.log($scope.Company);
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 整体查询读取
    var searchAll = function () {
        _basic.get($host.api_url + "/truckRepairRel").then(function (data) {
            if (data.success == true) {
                $scope.truckRepairRel = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });

    };
    searchAll();


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
                // "cityId": companyMsg.city_id,
                "remark": companyMsg.remark
            }

            _basic.put($host.api_url + "/user/" + userId + "/company/" + id, subParam).then(function (data) {
                // $(".shadeDowWrap").hide();
                if (data.success == true) {
                    // console.log(data);
                    $('#LookCompany').modal('close');
                    swal("修改成功", "", "success");
                    searchAll();
                } else {
                    swal(data.msg, "", "error");
                }
            });
        }

    }
}]);