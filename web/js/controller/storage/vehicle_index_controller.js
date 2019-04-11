/**
 * Created by zcy on 2017/8/8.
 */
app.controller("vehicle_index_controller", ['$scope', "$host", "_basic", function ($scope, $host, _basic) {

    // 日期查询值
    var searchEnd = moment(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).format('YYYYMMDD');

    // 变量初始值

    //自营头车数
    $scope.headCarCount = 0;

    //自营挂车数
    $scope.trailerCarCount = 0;

    //司机总数
    $scope.totalDriver = 0;

    //在职司机总数
    $scope.haveTotalDriver = 0;

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
    $scope.onRoadCount = 0;

    // 获取车辆信息
    $scope.getTruckCountInfo = function () {
        // 所属类型信息1自营车
        _basic.get($host.api_url + "/operateTypeCount?truckType=1").then(function (data) {
            if (data.success === true) {
                if(data.result.length !== 0){
                    for (var i = 0; i < data.result.length; i++) {
                        if (data.result[i].operate_type === 1) {
                            $scope.headCarCount = data.result[i].truck_count
                        }
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 自营挂车数量
        _basic.get($host.api_url + "/truckCount?truckType=2&operateType=1").then(function (data) {
            if (data.success === true) {
                if(data.result.length !== 0){
                    $scope.trailerCarCount = data.result[0].truck_count;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        //司机总数  在职司机总数
        _basic.get($host.api_url + "/driveTruckCount").then(function (data) {
            if (data.success === true) {
                if(data.result.length !== 0){
                    $scope.totalDriver = data.result[0].total_drive;
                    $scope.haveTotalDriver = data.result[0].drive_truck_count+data.result[0].vice_drive_count;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        })
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
                    $scope.accidentBearCompany = data.result[0].company_cost;
                    $scope.accidentBearPersonal = data.result[0].under_cost;
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
                if(data.result.length !== 0){
                    $scope.insurePlanCount = data.result[0].insure_plan_count;
                    $scope.insurePlanMoney = data.result[0].insure_plan;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    $scope.queryData = function () {
        $scope.getTruckCountInfo();
        $scope.getRepairCountInfo();
        $scope.getAccidentInfo();
    };
    $scope.queryData();
}]);
