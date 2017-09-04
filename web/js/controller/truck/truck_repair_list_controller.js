/**
 * Created by ASUS on 2017/8/4.
 */

app.controller("truck_repair_list_controller", ['$rootScope', '$scope', '_basic', '$host', function ($rootScope, $scope, _basic, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.repair_start = 0;
    $scope.repair_size = 11;
    // 单条公司信息
    var companyMsg;

    // 搜索查询
    $scope.search_truck = function () {
        if($scope.repair_status==0){
            $scope.repair_status_tx=""+0;
        }
        var obj = {
            start: $scope.repair_start,
            size:  $scope.repair_size,
            truckType: $scope.truck_type,
            truckNum:$scope.truck_name,
            repairDateStart: $scope.repair_startTime_start,
            repairDateEnd: $scope.repair_startTime_end,
            endDateStart: $scope.repair_endTime_start,
            endDateEnd: $scope.repair_endTime_end,
            repairStatus: $scope.repair_status_tx,
        };
        // console.log($scope.repair_status);
        _basic.get($host.api_url + "/truckRepairRel?" + _basic.objToUrl(obj)).then(function (data) {
            // $(".shadeDowWrap").hide();
            if (data.success == true) {
                $scope.truckRepair = data.result;
                $scope.truckRepairRel= $scope.truckRepair.slice(0, 10);
                if ($scope.repair_start > 0) {
                    $scope.pre=true;
                    // $("#pre").removeClass("disabled");
                } else {
                    $scope.pre=false;
                    // $("#pre").addClass("disabled");
                }
                if ($scope.truckRepair.length < $scope.repair_size) {
                    // $("#next").addClass("disabled");
                    $scope.next=false;
                } else {
                    // $("#next").removeClass("disabled");
                    $scope.next=true;
                }
                // console.log($scope.Company);
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    $scope.search_truck();
    $scope.search_truck_msg=function () {
        $scope.repair_start=0;
        $scope.search_truck();
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


    // 分页
    // 头车上一页
    $scope.pre_btn = function () {
        $scope.repair_start  = $scope.repair_start  - ($scope.repair_size - 1);
        $scope.search_truck();
    };
    // 头车下一页
    $scope.next_btn = function () {
        $scope.repair_start  = $scope.repair_start  + ($scope.repair_size - 1);
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