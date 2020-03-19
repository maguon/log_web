app.controller("driver_salary_details_controller", ["$scope", "$host","$state", "$stateParams", "_config", "_basic","$filter", function ($scope, $host, $state,$stateParams, _config, _basic,$filter) {

    var userId = _basic.getSession(_basic.USER_ID);
    var salaryId = $stateParams.id;
    var monthId = $stateParams.monthId;
    $scope.monthId = $stateParams.monthId;
    var driveId = $stateParams.driveId;
    $scope.enter = _config.enter;
    $scope.otherDeductions = 0;
    $scope.foodFee = 0;
    $scope.singleFee = 0;
    $scope.user_id='';

    //获取当月第一天和最后一天
    var year =  monthId.toString().slice(0,4);
    var month = monthId.toString().slice(4,6);
    $scope.firstDay=new Date(year,month-1,1);//这个月的第一天
    var currentMonth=$scope.firstDay.getMonth(); //取得月份数
    var nextMonthFirstDay=new Date($scope.firstDay.getFullYear(),currentMonth+1,1);//加1获取下个月第一天
    var dis=nextMonthFirstDay.getTime()-24*60*60*1000;//减去一天就是这个月的最后一天
    $scope.lastDay=new Date(dis);
    $scope.firstDay= moment($scope.firstDay).format("YYYYMMDD");//格式化 //这个格式化方法要用你们自己的，也可以用本文已经贴出来的下面的Format
    $scope.lastDay= moment($scope.lastDay).format("YYYYMMDD");//格式化

    $scope.creatStartDay= moment($scope.firstDay).format("YYYY-MM-DD");//格式化 //这个格式化方法要用你们自己的，也可以用本文已经贴出来的下面的Format
    $scope.creatEndDay= moment($scope.lastDay).format("YYYY-MM-DD");//格式化

    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"driver_salary_details"}, {reload: true})
    };

    // 获取当前司机基本信息
    function getSalaryDetails() {
        var url;
        if(salaryId==''||salaryId==undefined){
            url = $host.api_url + "/driveSalary?driveId="+driveId+'&monthDateId='+monthId;
        }
      else{
            url = $host.api_url + "/driveSalary?driveSalaryId=" + salaryId+'&monthDateId='+monthId+'&driveId'+driveId;
        }
        _basic.get(url).then(function (data) {
            if (data.success === true) {
                $scope.salaryDetails = data.result[0];
                $scope.user_id = data.result[0].user_id;
                $scope.otherDeductions = data.result[0].other_fee==null?0: data.result[0].other_fee;
                $scope.foodFee  = data.result[0].food_fee==null?0: data.result[0].food_fee;
                $scope.singleFee = data.result[0].loan_fee==null?0: data.result[0].loan_fee;
                $scope.remark = data.result[0].remark;
                getCurrentSalaryInfo ()
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/driveSocialSecurity?"+ _basic.objToUrl({
            driveId:driveId,
            yMonth:monthId
        })).then(function (data) {
            if (data.success === true) {
                if( data.result.length==0){
                    $scope.socialSecurityFee=0.00;
                }
                else {
                    $scope.socialSecurityFee = data.result[0].social_security_fee;
                }

            }

        })

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

/*        // 已任务
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
        });*/
    };

    $scope.export =function (){

        // 基本检索URL
        var url = $host.api_url + "/dpRouteTaskBase.csv?";
        // 检索条件

        var conditions = _basic.objToUrl({
            driveId:driveId,
            taskStatusArr:[9,10],
            taskPlanDateStart:$scope.firstDay,
            taskPlanDateEnd: $scope.lastDay
        });
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);

    }

    // 获取商品车质损任务信息
    $scope.getCarDamageInfo = function () {
        // 未结算质损
        _basic.get($host.api_url + "/damage?underUserId=" +  $scope.user_id+'&endDateStart='+$scope.firstDay +'&endDateEnd='+$scope.lastDay+'&damageStuts=3').then(function (data) {
            if (data.success === true) {
                $scope.unsettledDamageList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取货 车事故信息
    $scope.getTruckAccidentInfo = function () {
        // 未结算事故责任
        _basic.get($host.api_url + "/truckAccident?underUserId=" + $scope.user_id +'&endDateStart='+$scope.firstDay +'&endDateEnd='+$scope.lastDay+'&accidentStatus=3').then(function (data) {
            if (data.success === true) {
                $scope.unsettledAccidentList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

    };

    //获取违章扣款信息
    $scope.getPeccancyList = function(){
        // 未结算事故责任
        _basic.get($host.api_url + "/drivePeccancy?driveId=" + driveId+'&dateIdStart='+$scope.firstDay +'&dateIdEnd='+$scope.lastDay).then(function (data) {
            if (data.success === true) {
                $scope.peccancyAccidentList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取超量扣款信息
    $scope.getExceedOilList = function (){
        var obj={
            yMonth:monthId,
            taskPlanDateStart: $scope.firstDay,
            taskPlanDateEnd:$scope.lastDay,
            driveId:driveId,
            checkStatus:3
        }
        // 未结超量扣款信息
        _basic.get($host.api_url + "/driveExceedOilDate?"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.OilRelList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取补贴
    $scope.getAttendanceList = function(){
        var conditions ={
            driveId:driveId,
            yMonth:monthId
        };
        _basic.get($host.api_url+"/driveWork?"+ _basic.objToUrl(conditions)).then(function (data) {

            if (data.success == true) {
                $scope.driverAttendanceList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取杂费
    $scope.getIncidentalList = function(){
        var conditions ={
            driveId:driveId,
            yMonth:monthId
        };
        _basic.get($host.api_url+"/driveSundryFee?"+ _basic.objToUrl(conditions)).then(function (data) {

            if (data.success == true) {
                $scope.incidentalList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取扣款
    $scope.getRetainList = function(){
        var conditions ={
            driveId:driveId,
            yMonth:monthId
        };
        _basic.get($host.api_url+"/driveSalaryRetain?"+ _basic.objToUrl(conditions)).then(function (data) {

            if (data.success == true) {
                $scope.securityList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取现金
    $scope.getApplicationList = function(){
        var conditions ={
            driveId:driveId,
            createdOnStart:$scope.creatStartDay,
            createdOnEnd:$scope.creatEndDay,
            status:2,
        };
        _basic.get($host.api_url+"/dpRouteTaskFee?"+ _basic.objToUrl(conditions)).then(function (data) {

            if (data.success == true) {
                $scope.applicationList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取洗车费
    $scope.getWashList = function(){
        var conditions ={
            driveId:driveId,
            loadDateStart:$scope.creatStartDay,
            loadDateEnd:$scope.creatEndDay,
            status:2,
        };
        _basic.get($host.api_url+"/dpRouteLoadTaskCleanRel?"+ _basic.objToUrl(conditions)).then(function (data) {

            if (data.success == true) {
                $scope.carWashFeeList = data.result;
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
    $scope.saveSettlementSalary = function (id) {
        var grantCount =$scope.salaryDetails.distance_salary+$scope.salaryDetails.reverse_salary+$scope.salaryDetails.enter_fee
            - $scope.salaryDetails.damage_under_fee - $scope.salaryDetails.accident_fee - $scope.salaryDetails.peccancy_under_fee - $scope.salaryDetails.exceed_oil_fee
            +$scope.salaryDetails.full_work_bonus+$scope.salaryDetails.other_bonus-$scope.salaryDetails.hotel_bonus-$scope.salaryDetails.social_security_fee-$scope.salaryDetails.food_fee
            -$scope.salaryDetails.loan_fee -$scope.salaryDetails.other_fee -$scope.salaryDetails.damage_retain_fee -$scope.salaryDetails.damage_op_fee -$scope.salaryDetails.truck_retain_fee
            +$scope.salaryDetails.car_oil_fee+$scope.salaryDetails.truck_parking_fee+$scope.salaryDetails.car_parking_fee+$scope.salaryDetails.dp_other_fee+$scope.salaryDetails.clean_fee
            +$scope.salaryDetails.railer_fee+$scope.salaryDetails.run_fee+$scope.salaryDetails.lead_fee+$scope.salaryDetails.car_pick_fee-$scope.salaryDetails.personal_tax;

        if(id==undefined){
            _basic.post($host.api_url + "/user/" + userId + "/driveSalary",{
                "monthDateId": monthId,
                "driveId": driveId,
                "truckId": $scope.salaryDetails.truck_id,
                "companyId": $scope.salaryDetails.company_id,
                "userId": userId,
                "distanceSalary": $scope.salaryDetails.distance_salary,
                "reverseSalary": $scope.salaryDetails.reverse_salary,
                "enterFee": $scope.salaryDetails.enter_fee,
                "damageUnderFee": $scope.salaryDetails.damage_under_fee,
                "accidentFee": $scope.salaryDetails.accident_fee,
                "peccancyUnderFee":$scope.salaryDetails.peccancy_under_fee,
                "exceedOilFee": $scope.salaryDetails.exceed_oil_fee,
                "damageRetainFee":  $scope.salaryDetails.damage_retain_fee,
                "damageOpFee":  $scope.salaryDetails.damage_op_fee,
                "truckRetainFee":  $scope.salaryDetails.truck_retain_fee,
                "personalTax":  $scope.salaryDetails.personal_tax,
                "hotelBonus":  $scope.salaryDetails.hotel_bonus,
                "fullWorkBonus":  $scope.salaryDetails.full_work_bonus,
                "otherBonus":  $scope.salaryDetails.other_bonus,
                "carOilFee":  $scope.salaryDetails.car_oil_fee,
                "truckParkingFee":  $scope.salaryDetails.truck_parking_fee,
                "carParkingFee": $scope.salaryDetails.car_parking_fee,
                "dpOtherFee":  $scope.salaryDetails.lead_fee,
                "cleanFee":  $scope.salaryDetails.clean_fee,
                "trailerFee":  $scope.salaryDetails.trailer_fee,
                "carPickFee":  $scope.salaryDetails.car_pick_fee,
                "runFee":  $scope.salaryDetails.run_fee,
                "leadFee":  $scope.salaryDetails.lead_fee,
                "socialSecurityFee":  $scope.salaryDetails.social_security_fee,
                "foodFee":  $scope.salaryDetails.food_fee,
                "loanFee":  $scope.salaryDetails.loan_fee,
                "otherFee":  $scope.salaryDetails.other_fee,
                "actualSalary": grantCount,
                "remark": $scope.remark

            }).then(function (data) {
                if (data.success === true) {
                    $scope.addId= data.id;
                    getSalaryDetails()
                    swal("保存成功", "", "success");
                }
                else {
                    swal(data.msg, "", "error");
                }
            });

        }
        else {
            _basic.put($host.api_url + "/user/" + userId + "/driveSalary/" + id + "/driveActualSalary",{
                otherFee: $scope.salaryDetails.other_fee,
                foodFee:$scope.salaryDetails.food_fee,
                loanFee:$scope.salaryDetails.loan_fee,
                actualSalary: grantCount,
                remark: $scope.remark
            }).then(function (data) {
                if (data.success === true) {
                    getSalaryDetails()
                    swal("保存成功", "", "success");
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }

    };



    // 发放结算工资
    $scope.grantSettlementSalary = function (id) {
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
                    var grantCount =$scope.salaryDetails.distance_salary+$scope.salaryDetails.reverse_salary+$scope.salaryDetails.enter_fee
                        - $scope.salaryDetails.damage_under_fee - $scope.salaryDetails.accident_fee - $scope.salaryDetails.peccancy_under_fee - $scope.salaryDetails.exceed_oil_fee
                        +$scope.salaryDetails.full_work_bonus+$scope.salaryDetails.other_bonus-$scope.salaryDetails.hotel_bonus-$scope.salaryDetails.social_security_fee-$scope.salaryDetails.food_fee
                        -$scope.salaryDetails.loan_fee -$scope.salaryDetails.other_fee -$scope.salaryDetails.damage_retain_fee -$scope.salaryDetails.damage_op_fee -$scope.salaryDetails.truck_retain_fee
                        +$scope.salaryDetails.car_oil_fee+$scope.salaryDetails.truck_parking_fee+$scope.salaryDetails.car_parking_fee+$scope.salaryDetails.dp_other_fee+$scope.salaryDetails.clean_fee
                        +$scope.salaryDetails.railer_fee+$scope.salaryDetails.run_fee+$scope.salaryDetails.lead_fee+$scope.salaryDetails.car_pick_fee-$scope.salaryDetails.personal_tax;
                    ;
                    if(id==undefined){
                        _basic.post($host.api_url + "/user/" + userId + "/driveSalary",{
                            "monthDateId": monthId,
                            "driveId": driveId,
                            "truckId": $scope.salaryDetails.truck_id,
                            "companyId": $scope.salaryDetails.company_id,
                            "userId": userId,
                            "distanceSalary": $scope.salaryDetails.distance_salary,
                            "reverseSalary": $scope.salaryDetails.reverse_salary,
                            "enterFee": $scope.salaryDetails.enter_fee,
                            "damageUnderFee": $scope.salaryDetails.damage_under_fee,
                            "accidentFee": $scope.salaryDetails.accident_fee,
                            "peccancyUnderFee":$scope.salaryDetails.peccancy_under_fee,
                            "exceedOilFee": $scope.salaryDetails.exceed_oil_fee,
                            "damageRetainFee":  $scope.salaryDetails.damage_retain_fee,
                            "damageOpFee":  $scope.salaryDetails.damage_op_fee,
                            "truckRetainFee":  $scope.salaryDetails.truck_retain_fee,
                            "personalTax":  $scope.salaryDetails.personal_tax,
                            "hotelBonus":  $scope.salaryDetails.hotel_bonus,
                            "fullWorkBonus":  $scope.salaryDetails.full_work_bonus,
                            "otherBonus":  $scope.salaryDetails.other_bonus,
                            "carOilFee":  $scope.salaryDetails.car_oil_fee,
                            "truckParkingFee":  $scope.salaryDetails.truck_parking_fee,
                            "carParkingFee": $scope.salaryDetails.car_parking_fee,
                            "dpOtherFee":  $scope.salaryDetails.lead_fee,
                            "cleanFee":  $scope.salaryDetails.clean_fee,
                            "trailerFee":  $scope.salaryDetails.trailer_fee,
                            "carPickFee":  $scope.salaryDetails.car_pick_fee,
                            "runFee":  $scope.salaryDetails.run_fee,
                            "leadFee":  $scope.salaryDetails.lead_fee,
                            "socialSecurityFee":  $scope.salaryDetails.social_security_fee,
                            "foodFee":  $scope.salaryDetails.food_fee,
                            "loanFee":  $scope.salaryDetails.loan_fee,
                            "otherFee":  $scope.salaryDetails.other_fee,
                            "actualSalary": grantCount,
                            "remark": $scope.remark
                        }).then(function (data) {
                            if (data.success === true) {
                                $scope.addId= data.id;
                                putStatus()
                                swal("保存成功", "", "success");
                            }
                            else {
                                swal(data.msg, "", "error");
                            }
                        });

                    }
                    else {
                        _basic.put($host.api_url + "/user/" + userId + "/driveSalary/" + id + "/driveActualSalary",{
                            otherFee: $scope.salaryDetails.other_fee,
                            foodFee:$scope.salaryDetails.food_fee,
                            loanFee:$scope.salaryDetails.loan_fee,
                            actualSalary: grantCount,
                            remark: $scope.remark
                        }).then(function (data) {
                            if (data.success === true) {
                                $scope.addId=id;
                                putStatus();
                                swal("保存成功", "", "success");
                            }
                            else {
                                swal(data.msg, "", "error");
                            }
                        });
                    }
                }
            });
    };


    function putStatus(){
        _basic.put(
            $host.api_url + "/user/" + userId + "/driveSalary/" + $scope.addId + "/grantStatus/3", {}).then(function (data) {
            if (data.success === true) {
                $scope.salaryDetails.grant_status=3;
            }
            else {
                swal('发放失败', "", "error");
            }
        });
    }


    getSalaryDetails();
}]);