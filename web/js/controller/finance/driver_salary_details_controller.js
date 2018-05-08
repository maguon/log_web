app.controller("driver_salary_details_controller", ["$scope", "$host", "$stateParams", "_config", "_basic", function ($scope, $host, $stateParams, _config, _basic) {

    var userId = _basic.getSession(_basic.USER_ID);
    var salaryId = $stateParams.id;
    var driveId = $stateParams.driveId;
    var heavyLoad = _config.heavyLoad;
    $scope.otherDeductions = 0;

    // 获取当前司机基本信息
    $scope.getSalaryDetails = function () {
        _basic.get($host.api_url + "/driveSalary?driveSalaryId=" + salaryId).then(function (data) {
            if (data.success === true) {
                // console.log("salaryDetails", data);
                $scope.salaryDetails = data.result[0];
                if(data.result[0].other_fee != null){
                    $scope.otherDeductions = data.result[0].other_fee;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取当前司机结算任务
    $scope.getCurrentSalaryInfo = function () {
        // 未结算任务
        _basic.get($host.api_url + "/dpRouteTaskBase?driveId=" + driveId + "&taskStatus=10&loadDistance=6&noLoadDistance=6&statStatus=1").then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.unsettledSalaryList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 已结算任务
        _basic.get($host.api_url + "/driveSalaryTaskRel?driveSalaryId=" + salaryId + "&loadDistance=6&noLoadDistance=6").then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.noLoadDistanceCount = 0;
                $scope.loadDistanceCount = 0;
                // 计算重载和空载里程
                for (var i = 0; i < data.result.length; i++) {
                    if(data.result[i].car_count <= heavyLoad){
                        $scope.noLoadDistanceCount += data.result[i].distance
                    }
                    else{
                        $scope.loadDistanceCount += data.result[i].distance
                    }
                }
                $scope.settledSalaryList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取商品车质损任务信息
    $scope.getCarDamageInfo = function () {
        // 未结算质损
        _basic.get($host.api_url + "/damage?damageStatus=3&driveId=" + driveId + "&statStatus=1").then(function (data) {
            if (data.success === true) {
                // console.log("unsettled", data);
                $scope.unsettledDamageList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 已结算质损
        _basic.get($host.api_url + "/driveSalaryDamageRel?driveSalaryId=" + salaryId).then(function (data) {
            if (data.success === true) {
                // console.log("settled", data);
                // 计算个人合计承担金额
                $scope.personalCommitmentCount = 0;
                for (var i = 0; i < data.result.length; i++) {
                    $scope.personalCommitmentCount += data.result[i].under_cost
                }
                $scope.settledDamageList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取货车事故信息
    $scope.getTruckAccidentInfo = function () {
        // 未结算事故责任
        _basic.get($host.api_url + "/truckAccident?driveId=" + driveId + "&accidentStatus=3&statStatus=1").then(function (data) {
            if (data.success === true) {
                // console.log("unsettled", data);
                $scope.unsettledAccidentList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 已结算事故责任
        _basic.get($host.api_url + "/driveSalaryAccidentRel?driveSalaryId=" + salaryId).then(function (data) {
            if (data.success === true) {
                // console.log("settled", data);
                $scope.personalAccidentPay = 0;
                for (var i = 0; i < data.result.length; i++) {
                    $scope.personalAccidentPay += data.result[i].under_cost
                }
                $scope.settledAccidentList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取结算工资信息
    $scope.grantWages = function () {
        $scope.getCarDamageInfo();
        $scope.getTruckAccidentInfo();
    };

    // 将未结算任务添加到结算任务
    $scope.addSettledSalary = function (taskId) {
        _basic.post($host.api_url + "/user/" + userId + "/driveSalaryTaskRel",{
            driveSalaryId: salaryId,
            dpRouteTaskId: taskId
        }).then(function (data) {
            if (data.success === true) {
                swal("操作成功", "", "success");
                $scope.getCurrentSalaryInfo()
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 移除结算任务到未结算任务
    $scope.minusSettledSalary = function (taskId) {
        swal({
                title: "确定移除当前结算任务？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                _basic.delete($host.api_url + "/user/" + userId + "/driveSalary/" + salaryId + "/dpRouteTask/" + taskId).then(function (data) {
                    if (data.success === true) {
                        $scope.getCurrentSalaryInfo()
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });

    };

    // 保存应发工资信息
    $scope.saveWagesPaidInfo = function () {
        _basic.put($host.api_url + "/user/" + userId + "/driveSalary/" + salaryId,{
            loadDistance: $scope.loadDistanceCount,
            noLoadDistance: $scope.noLoadDistanceCount,
            planSalary: $scope.salaryDetails.plan_salary
        }).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 将未结算质损添加到结算质损
    $scope.addSettledDamage = function (damageId) {
        _basic.post($host.api_url + "/user/" + userId + "/driveSalaryDamageRel",{
            driveSalaryId: salaryId,
            damageId: damageId
        }).then(function (data) {
            if (data.success === true) {
                swal("操作成功", "", "success");
                $scope.getCarDamageInfo();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 移除结算质损到未结算质损
    $scope.minusSettledDamage = function (damageId) {
        swal({
                title: "确定移除当前结算质损？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                _basic.delete($host.api_url + "/user/" + userId + "/driveSalary/" + salaryId + "/damage/" + damageId).then(function (data) {
                    if (data.success === true) {
                        $scope.getCarDamageInfo();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });

    };

    // 将未结算事故添加到结算事故
    $scope.addSettledAccident = function (accidentId) {
        _basic.post($host.api_url + "/user/" + userId + "/driveSalaryAccidentRel",{
            driveSalaryId: salaryId,
            accidentId: accidentId
        }).then(function (data) {
            if (data.success === true) {
                swal("操作成功", "", "success");
                $scope.getTruckAccidentInfo();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 移除结算事故到未结算事故
    $scope.minusSettledAccident = function (accidentId) {
        swal({
                title: "确定移除当前质损责任？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                _basic.delete($host.api_url + "/user/" + userId + "/driveSalary/" + salaryId + "/accident/" + accidentId).then(function (data) {
                    if (data.success === true) {
                        $scope.getTruckAccidentInfo();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });

    };

    // 任务工资详情
    $scope.showDispatchMissionModal = function (salaryInfo,status) {
        $scope.salaryInfo = salaryInfo;
        $scope.salaryHandleStatus = status;
        // console.log("salaryInfo",salaryInfo);
        // 根据结算状态取不同字段
        var currentSalaryId = status === "unsettled" ? salaryInfo.id : salaryInfo.dp_route_task_id;

        //获取装车任务信息
        _basic.get($host.api_url + "/dpRouteLoadTask?dpRouteTaskId=" + currentSalaryId).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.lineList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $("#dispatchMissionModal").modal("open");
    };

    // 商品车质损详情
    $scope.showCarDamageModal = function (damageInfo,status) {
        $scope.damageInfo = damageInfo;
        $scope.damageHandleStatus = status;
        // console.log("damageInfo",damageInfo);
        $("#carDamageModal").modal("open");
    };

    // 货车责任详情
    $scope.showTruckAccidentModal = function (accidentInfo,status) {
        $scope.accidentInfo = accidentInfo;
        $scope.accidentHandleStatus = status;
        // console.log("accidentInfo",accidentInfo);
        $("#truckAccidentModal").modal("open");
    };

    // 保存结算工资信息
    $scope.saveSettlementSalary = function () {
        var grantCount = $scope.salaryDetails.plan_salary - $scope.personalCommitmentCount - $scope.personalAccidentPay - $scope.otherDeductions;
        _basic.put($host.api_url + "/user/" + userId + "/driveSalary/" + salaryId + "/driveActualSalary",{
            otherFee: $scope.otherDeductions,
            actualSalary: grantCount
        }).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                swal("保存成功", "", "success");
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 发放结算工资
    $scope.grantSettlementSalary = function () {
        swal({
                title: "确定发放结算工资吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                _basic.put($host.api_url + "/user/" + userId + "/driveSalary/" + salaryId + "/grantStatus/3",{}).then(function (data) {
                    if (data.success === true) {
                        $scope.getSalaryDetails();
                    }
                    else{
                        swal(data.msg, "", "error");
                    }
                });
            });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getSalaryDetails();
        $scope.getCurrentSalaryInfo();
    };
    $scope.queryData();
}]);