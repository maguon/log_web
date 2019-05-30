app.controller("driver_salary_details_controller", ["$scope", "$host","$state", "$stateParams", "_config", "_basic","$filter", function ($scope, $host, $state,$stateParams, _config, _basic,$filter) {

    var userId = _basic.getSession(_basic.USER_ID);
    var salaryId = $stateParams.id;
    var driveId = $stateParams.driveId;
    $scope.enter = _config.enter;
    $scope.otherDeductions = 0;
    $scope.Reimbursement = 0;
    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"driver_salary_details"}, {reload: true})
    };

    // 获取当前司机基本信息
    function getSalaryDetails() {
        _basic.get($host.api_url + "/driveSalary?driveSalaryId=" + salaryId).then(function (data) {
            if (data.success === true) {
                $scope.salaryDetails = data.result[0];
                $scope.salaryDetails.month_date_id = data.result[0].month_date_id;

                //获取当月第一天和最后一天
                var year =  data.result[0].month_date_id.toString().slice(0,4);
                var month = data.result[0].month_date_id.toString().slice(4,6);
                $scope.firstDay=new Date(year,month-1,1);//这个月的第一天
                var currentMonth=$scope.firstDay.getMonth(); //取得月份数
                var nextMonthFirstDay=new Date($scope.firstDay.getFullYear(),currentMonth+1,1);//加1获取下个月第一天
                var dis=nextMonthFirstDay.getTime()-24*60*60*1000;//减去一天就是这个月的最后一天
                $scope.lastDay=new Date(dis);
                $scope.firstDay= moment($scope.firstDay).format("YYYYMMDD");//格式化 //这个格式化方法要用你们自己的，也可以用本文已经贴出来的下面的Format
                $scope.lastDay= moment($scope.lastDay).format("YYYYMMDD");//格式化


                $scope.salaryDetails.truck_id = data.result[0].truck_id;
                $scope.salaryDetails.plan_salary=data.result[0].plan_salary;
                $scope.planSalary=data.result[0].plan_salary;
                $scope.socialSecurityFee = data.result[0].social_security_fee;
                if(data.result[0].other_fee != null){
                    $scope.otherDeductions = data.result[0].other_fee;
                    $scope.Reimbursement = data.result[0].refund_fee;
                    $scope.remark = data.result[0].remark;
                }

                getCurrentSalaryInfo ()
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取当前司机结算任务
     function getCurrentSalaryInfo () {
         var obj={
             driveId:driveId,
             taskStatusArr:[9,10],
             taskPlanDateStart:$scope.firstDay,
             taskPlanDateEnd: $scope.lastDay
         }
        // 未任务
        _basic.get($host.api_url + "/dpRouteTaskBase?"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.unsettledSalaryList = data.result;


            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 已任务
        _basic.get($host.api_url + "/driveSettle?taskPlanDateStart="+ $scope.firstDay+"&taskPlanDateEnd="+ $scope.lastDay+"&driveId=" + driveId).then(function (data) {
            if (data.success === true) {
                $scope.settledSalaryList = data.result[0];
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
                $scope.unsettledDamageList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 已结算质损
        _basic.get($host.api_url + "/driveSalaryDamageRel?driveSalaryId=" + salaryId).then(function (data) {
            if (data.success === true) {
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
                $scope.unsettledAccidentList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 已结算事故责任
        _basic.get($host.api_url + "/driveSalaryAccidentRel?driveSalaryId=" + salaryId).then(function (data) {
            if (data.success === true) {
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

    //获取违章扣款信息
    $scope.getPeccancyList = function(){
        // 未结算事故责任
        _basic.get($host.api_url + "/drivePeccancy?driveId=" + driveId + "&statStatus=1").then(function (data) {
            if (data.success === true) {
                $scope.peccancyAccidentList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 已结算事故责任
        _basic.get($host.api_url + "/driveSalaryPeccancyRel?driveSalaryId=" + salaryId).then(function (data) {
            if (data.success === true) {
                $scope.peccancylAccidentPay = 0;
                for (var i = 0; i < data.result.length; i++) {
                    $scope.peccancylAccidentPay += data.result[i].under_money
                }
                $scope.settledPeccancyList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取超量扣款信息
    $scope.getExceedOilList = function (){
        var obj={
            monthDateId: $scope.salaryDetails.month_date_id,
            driveId:driveId,
            truckId: $scope.salaryDetails.truck_id
        }
        // 未结超量扣款信息
        _basic.get($host.api_url + "/driveExceedOilDate?settleStatus=1&"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.OilRelList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 已结算超量扣款信息
        _basic.get($host.api_url + "/driveExceedOilDate?settleStatus=2&"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.exceedOilRelList = data.result;
                $scope.ExceedOilAccidentPay = 0;
                for (var i = 0; i < data.result.length; i++) {
                    $scope.ExceedOilAccidentPay += data.result[i].actual_money;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

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
                cancelButtonText: "取消"
        }).then(
            function(result){
                if (result.value) {
                    _basic.delete($host.api_url + "/user/" + userId + "/driveSalary/" + salaryId + "/damage/" + damageId).then(function (data) {
                        if (data.success === true) {
                            $scope.getCarDamageInfo();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
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
                cancelButtonText: "取消"
        }).then(
            function(result){
                if (result.value) {
                    _basic.delete($host.api_url + "/user/" + userId + "/driveSalary/" + salaryId + "/accident/" + accidentId).then(function (data) {
                        if (data.success === true) {
                            $scope.getTruckAccidentInfo();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });

    };

   /* // 将未结算任务添加到结算任务
    $scope.addSettledSalary = function (taskId,car_count,truck_number,distance,flag,money) {
        var  distanceMoney= $filter('mileageSalary')(car_count+'-'+truck_number);
        var distanceTotalMoney =0;
        if(flag==1){
            distanceTotalMoney= money;
        }
        else {
            distanceTotalMoney =distanceMoney*distance;
        }
        _basic.post($host.api_url + "/user/" + userId + "/driveSalaryTaskRel",{
            driveSalaryId: salaryId,
            dpRouteTaskId: taskId,
            distanceMoney: distanceMoney,
            distanceTotalMoney: distanceTotalMoney
        }).then(function (data) {
            if (data.success === true) {
                $scope.driveSalaryTaskRel=  data.id;
                swal("操作成功", "", "success");
                getCurrentSalaryInfo();
                getChangeSalary();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };*/

    //工资变化
    function getChangeSalary(){
        // 未结算任务
        _basic.get($host.api_url + "/driveSalaryTaskRel?driveSalaryRelId=" + $scope.driveSalaryTaskRel).then(function (data) {
            if (data.success === true) {
                $scope.salaryDetails.plan_salary += data.result[0].distance_total_money;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

    }


/*    // 移除结算任务到未结算任务
    $scope.minusSettledSalary = function (taskId) {
        $scope.taskId=taskId;
        swal({
                title: "确定移除当前结算任务？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
        }).then(
            function(result){
                if (result.value) {
                    _basic.delete($host.api_url + "/user/" + userId + "/driveSalary/" + salaryId + "/dpRouteTask/" + taskId).then(function (data) {
                        if (data.success === true) {
                            getCurrentSalaryInfo();
                            getChangeSalary2();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    };*/

    //工资变化
    function getChangeSalary2(){
        // 未结算任务
        _basic.get($host.api_url + "/dpRouteTaskBase?dpRouteTaskId=" +  $scope.taskId).then(function (data) {
            if (data.success === true) {
                var distanceTotalMoney;
                var distanceMoney= $filter('mileageSalary')(data.result[0].car_count+'-'+data.result[0].truck_number);
                if(data.result[0].reverse_flag==1){
                    distanceTotalMoney=data.result[0].reverse_money;
                }
                else {
                    distanceTotalMoney =distanceMoney*data.result[0].distance;
                }


                $scope.salaryDetails.plan_salary -= distanceTotalMoney;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

    }


    // 将未结算违约扣款添加到结算扣款
    $scope.addPeccancyAccident = function (peccancyInfoId) {
        _basic.post($host.api_url + "/user/" + userId + "/driveSalaryPeccancyRel",{
            driveSalaryId: salaryId,
            peccancyId: peccancyInfoId
        }).then(function (data) {
            if (data.success === true) {
                swal("操作成功", "", "success");
                $scope.getPeccancyList();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 移除结算扣款到未结算扣款
    $scope.minusPeccancyAccident = function (peccancyId) {
        swal({
                title: "确定移除当前违章扣款？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
        }).then(
            function(result){
                if (result.value) {
                    _basic.delete($host.api_url + "/user/" + userId + "/driveSalary/" + salaryId + "/peccancy/" + peccancyId).then(function (data) {
                        if (data.success === true) {
                            $scope.getPeccancyList();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });

    };

    // 将未结算违约扣油添加到结算扣油
    $scope.addExceedOilAccident = function (OilId) {
        _basic.post($host.api_url + "/user/" + userId + "/driveSalaryExceedOilRel",{
            driveSalaryId: salaryId,
            exceedOilDateId: OilId
        }).then(function (data) {
            if (data.success === true) {
                swal("操作成功", "", "success");
                $scope.getExceedOilList ();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 移除结算扣油到未结算扣油
    $scope.minusExceedOilAccident = function (OilId) {
        swal({
                title: "确定移除当前超量扣款？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
        }).then(
            function(result){
                if (result.value) {
                    _basic.delete($host.api_url + "/user/" + userId + "/driveSalary/" + salaryId + "/exceedOilDate/" + OilId).then(function (data) {
                        if (data.success === true) {
                            $scope.getExceedOilList();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });

    };

    // 商品车质损详情
    $scope.showCarDamageModal = function (damageInfo,status) {
        $scope.damageInfo = damageInfo;
        $scope.damageHandleStatus = status;
        $("#carDamageModal").modal("open");
    };

    // 货车责任详情
    $scope.showTruckAccidentModal = function (accidentInfo,status) {
        $scope.accidentInfo = accidentInfo;
        $scope.accidentHandleStatus = status;
        $("#truckAccidentModal").modal("open");
    };


    // 获取结算工资信息
    $scope.grantWages = function () {
        $scope.getCarDamageInfo();
        $scope.getTruckAccidentInfo();
        $scope.getPeccancyList();
        $scope.getExceedOilList();
    };

    // 保存应发工资信息
    $scope.saveWagesPaidInfo = function () {
        _basic.put($host.api_url + "/user/" + userId + "/driveSalary/" + salaryId,{
            loadDistance: $scope.loadDistanceCount,
            noLoadDistance: $scope.noLoadDistanceCount,
            planSalary: $scope.salaryDetails.plan_salary
        }).then(function (data) {
            if (data.success === true) {
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 任务工资详情
    $scope.showDispatchMissionModal = function (salaryInfo,status) {
        $scope.salaryInfo = salaryInfo;
        $scope.salaryHandleStatus = status;
        // 根据结算状态取不同字段
        var currentSalaryId = status === "unsettled" ? salaryInfo.id : salaryInfo.dp_route_task_id;

        //获取装车任务信息
        _basic.get($host.api_url + "/dpRouteLoadTask?dpRouteTaskId=" + currentSalaryId).then(function (data) {
            if (data.success === true) {
                $scope.lineList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $("#dispatchMissionModal").modal("open");
    };

    // 保存结算工资信息
    $scope.saveSettlementSalary = function () {
        var grantCount = $scope.salaryDetails.plan_salary - $scope.personalCommitmentCount - $scope.personalAccidentPay - $scope.peccancylAccidentPay - $scope.ExceedOilAccidentPay-$scope.Reimbursement- $scope.socialSecurityFee-$scope.otherDeductions;
        _basic.put($host.api_url + "/user/" + userId + "/driveSalary/" + salaryId + "/driveActualSalary",{
            refundFee:$scope.Reimbursement,
            socialSecurityFee:$scope.socialSecurityFee,
            otherFee: $scope.otherDeductions,
            actualSalary: grantCount,
            remark: $scope.remark
        }).then(function (data) {
            if (data.success === true) {
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
                cancelButtonText: "取消"
        }).then(
            function(result){
                if (result.value) {
                    _basic.put(
                        $host.api_url + "/user/" + userId + "/driveSalary/" + salaryId + "/grantStatus/3", {}).then(function (data) {
                        if (data.success === true) {
                            getSalaryDetails();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    };

    // 获取数据
    $scope.queryData = function () {
        getSalaryDetails();
       /* getCurrentSalaryInfo();*/
    };
    $scope.queryData();
}]);