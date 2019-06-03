app.controller("driver_salary_details_controller", ["$scope", "$host","$state", "$stateParams", "_config", "_basic","$filter", function ($scope, $host, $state,$stateParams, _config, _basic,$filter) {

    var userId = _basic.getSession(_basic.USER_ID);
    var salaryId = $stateParams.id;
    var monthId = $stateParams.monthId;
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
        _basic.get($host.api_url + "/driveSalary?driveSalaryId=" + salaryId+'&monthDateId='+monthId).then(function (data) {
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
         var url= $host.api_url + "/driveSettle?taskPlanDateStart="+ $scope.firstDay+"&taskPlanDateEnd="+ $scope.lastDay+"&driveId=" + driveId;
        _basic.get(url).then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.settledSalaryList=[];
                    $scope.settledSalaryList.distance_salary=0;
                    $scope.settledSalaryList.reverse_salary=0;
                    $scope.settledSalaryList.not_storage_car_count=0;

                }
                else {
                    $scope.settledSalaryList = data.result[0];
                    if( $scope.settledSalaryList.distance_salary==null){
                        $scope.settledSalaryList.distance_salary=0;
                    }
                    if( $scope.settledSalaryList.reverse_salary==null){
                        $scope.settledSalaryList.reverse_salary=0;
                    }
                }

            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取商品车质损任务信息
    $scope.getCarDamageInfo = function () {
        $scope.damageTotalMoney=0;
        // 未结算质损
        _basic.get($host.api_url + "/damage?driveId=" + driveId+'&endDateStart='+$scope.firstDay +'&endDateEnd='+$scope.lastDay+'&damageStuts=3').then(function (data) {
            if (data.success === true) {
                $scope.unsettledDamageList = data.result;
                for (var i = 0; i < data.result.length; i++) {
                    $scope.damageTotalMoney+= $scope.unsettledDamageList[i].under_cost;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取货车事故信息
    $scope.getTruckAccidentInfo = function () {
        $scope.accidentTotalMoney=0;
        // 未结算事故责任
        _basic.get($host.api_url + "/truckAccident?driveId=" + driveId +'&endDateStart='+$scope.firstDay +'&endDateEnd='+$scope.lastDay+'&accidentStatus=3').then(function (data) {
            if (data.success === true) {
                $scope.unsettledAccidentList = data.result;
                for (var i = 0; i < data.result.length; i++) {
                    $scope.accidentTotalMoney+= $scope.unsettledAccidentList[i].under_cost;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });

    };

    //获取违章扣款信息
    $scope.getPeccancyList = function(){
        $scope.peccancyTotalMoney=0;
        // 未结算事故责任
        _basic.get($host.api_url + "/drivePeccancy?driveId=" + driveId+'&dateIdStart='+$scope.firstDay +'&dateIdEnd='+$scope.lastDay).then(function (data) {
            if (data.success === true) {
                $scope.peccancyAccidentList = data.result;
                for (var i = 0; i < data.result.length; i++) {
                    $scope.peccancyTotalMoney+= $scope.peccancyAccidentList[i].under_money;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取超量扣款信息
    $scope.getExceedOilList = function (){
        $scope.exceedOilTotalMoney=0;
        var obj={
            yMonth:$scope.salaryDetails.month_date_id,
            taskPlanDateStart: $scope.firstDay,
            taskPlanDateEnd:$scope.lastDay,
            driveId:driveId
          /*  checkStatus:3*/
        }
        // 未结超量扣款信息
        _basic.get($host.api_url + "/driveExceedOilDate?"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.OilRelList = data.result;
                for (var i = 0; i < data.result.length; i++) {
                    $scope.exceedOilTotalMoney+= $scope.OilRelList[i].actual_money;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }


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
        var grantCount = $scope.salaryDetails.plan_salary - $scope.damageTotalMoney - $scope.accidentTotalMoney - $scope.peccancyTotalMoney - $scope.exceedOilTotalMoney-$scope.Reimbursement- $scope.socialSecurityFee-$scope.otherDeductions;
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
    };
    $scope.queryData();
}]);