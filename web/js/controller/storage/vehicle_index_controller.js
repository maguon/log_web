/**
 * Created by zcy on 2017/8/8.
 */
app.controller("vehicle_index_controller", ['$scope', "$host", "_basic", function ($scope, $host, _basic) {

    // 日期查询值
    var searchEnd = moment(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).format('YYYYMMDD');

    // 变量初始值
    $scope.type_1_count = 0;
    $scope.type_2_count = 0;
    $scope.type_3_count = 0;
    $scope.type_4_count = 0;
    $scope.driver_type_1_count = 0;
    $scope.driver_type_2_count = 0;
    $scope.driver_type_3_count = 0;
    $scope.driver_type_4_count = 0;
    $scope.trailer = 0;
    $scope.truckRepairCount = 0;
    $scope.quarantineTruck = 0;
    $scope.useCar = 0;
    $scope.accidentTreatedCount = 0;
    $scope.accidentTreatmentCount = 0;
    $scope.accidentBearCompany = 0;
    $scope.accidentBearPersonal = 0;
    $scope.accidentBearTotal = 0;
    $scope.insurePlanCount = 0;
    $scope.insurePlanMoney = 0;
    $scope.totalDriver = 0;
    $scope.haveTotalDriver = 0;
    $scope.onRoadCount = 0;

    // 获取车辆信息
    $scope.getTruckCountInfo = function () {
        // 所属类型信息
        _basic.get($host.api_url + "/operateTypeCount?truckType=1").then(function (data) {
            if (data.success === true) {
                if(data.result.length !== 0){
                    for (var i = 0; i < data.result.length; i++) {
                        if (data.result[i].operate_type === 1) {
                            $scope.type_1_count = data.result[i].truck_count
                        }
                        if (data.result[i].operate_type === 2) {
                            $scope.type_2_count = data.result[i].truck_count
                        }
                        if (data.result[i].operate_type === 3) {
                            $scope.type_3_count = data.result[i].truck_count
                        }
                        if (data.result[i].operate_type === 4) {
                            $scope.type_4_count = data.result[i].truck_count
                        }
                    }
                }
                // console.log("truckData", data);
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 自营挂车数量
        _basic.get($host.api_url + "/truckCount?truckType=2&operateType=1").then(function (data) {
            if (data.success === true) {
                if(data.result.length !== 0){
                    $scope.trailer = data.result[0].truck_count;
                }
                // console.log("data", data);
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 在职司机数量
        _basic.get($host.api_url + "/driveOperateTypeCount?driveStatus=1").then(function (data) {
            if (data.success === true) {
                if(data.result.length !== 0){
                    $scope.driverTotal = 0;
                    for (var i = 0; i < data.result.length; i++) {
                        if (data.result[i].operate_type === 1) {
                            $scope.driver_type_1_count = data.result[i].drive_count
                        }
                        if (data.result[i].operate_type === 2) {
                            $scope.driver_type_2_count = data.result[i].drive_count
                        }
                        if (data.result[i].operate_type === 3) {
                            $scope.driver_type_3_count = data.result[i].drive_count
                        }
                        if (data.result[i].operate_type === 4) {
                            $scope.driver_type_4_count = data.result[i].drive_count
                        }
                        $scope.driverTotal = $scope.driverTotal + data.result[i].drive_count;
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取维修车辆数量，待检车辆和待检司机信息
    $scope.getRepairCountInfo = function () {
        // 维修车辆数量
        _basic.get($host.api_url + "/truckRepairRelCount?repairStatus=0").then(function (data) {
            if (data.success === true) {
                if(data.result.length !== 0){
                    $scope.truckRepairCount = data.result[0].repair_count;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 待检车辆
        _basic.get($host.api_url + "/truckFirst?drivingDateEnd=" + searchEnd).then(function (data) {
            if (data.success === true) {
                if(data.result.length !== 0){
                    $scope.quarantineTruck = data.result.length;
                }
                // console.log("dateData", data)
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 可用车辆
        _basic.get($host.api_url + "/truckDispatchCount?dispatchFlag=1").then(function (data) {
            if (data.success === true) {
                $scope.onRoadCount =data.result[0].on_road_count;
                $scope.useCar =data.result[0].on_road_count+data.result[0].ready_accept_count;
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };

    // 获取本月事故，事故承担总额和待完成保险赔付信息
    $scope.getAccidentInfo = function () {
        // 本月事故
        _basic.get($host.api_url + "/truckAccidentNotCheckCount").then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                if(data.result.length !== 0){
                    for (var i = 0; i < data.result.length; i++) {
                        if(data.result[i].accident_status === 1){
                            $scope.accidentTreatedCount = data.result[i].truck_accident_count;
                        }
                        if(data.result[i].accident_status === 2){
                            $scope.accidentTreatmentCount = data.result[i].truck_accident_count;
                        }
                    }
                    $scope.accidentTotal = $scope.accidentTreatedCount + $scope.accidentTreatmentCount;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 事故承担总额
        _basic.get($host.api_url + "/truckAccidentTotalCost?accidentStatus=3").then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                if(data.result.length !== 0){
                    $scope.accidentBearCompany = data.result[0].company_cost.toFixed(2);
                    $scope.accidentBearPersonal = data.result[0].under_cost.toFixed(2);
                    $scope.accidentBearTotal = (data.result[0].company_cost + data.result[0].under_cost).toFixed(2);
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 待完成保险赔付
        _basic.get($host.api_url + "/truckAccidentInsurePlanTotal?insureStatus=1").then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                if(data.result.length !== 0){
                    $scope.insurePlanCount = data.result[0].insure_plan_count;
                    $scope.insurePlanMoney = data.result[0].insure_plan.toFixed(2)
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };



    //获取司机总数在职司机数
    function getDriveTotal(){
        _basic.get($host.api_url + "/driveTruckCount").then(function (data) {
            if (data.success === true) {
                if(data.result.length !== 0){
                    $scope.totalDriver = data.result[0].total_drive;
                    $scope.haveTotalDriver = data.result[0].drive_truck_count;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    }

    $scope.queryData = function () {
        $scope.getTruckCountInfo();
        $scope.getRepairCountInfo();
        $scope.getAccidentInfo();
        getDriveTotal();
    };
    $scope.queryData();
}]);
