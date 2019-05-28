

app.controller("driver_exceed_oil_month_detail_controller", ["$scope", "$state","$stateParams", "_basic", "_config", "$host", function ($scope, $state,$stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var dateId = $stateParams.dateId;
    var driveId = $stateParams.driveId;
    var truckId = $stateParams.truckId;
    //获取当月第一天和最后一天
    var year = dateId.toString().slice(0,4);
    var month =dateId.toString().slice(4,6);
    var firstDay=new Date(year,month-1,1);//这个月的第一天
    var currentMonth=firstDay.getMonth(); //取得月份数
    var nextMonthFirstDay=new Date(firstDay.getFullYear(),currentMonth+1,1);//加1获取下个月第一天
    var dis=nextMonthFirstDay.getTime()-24*60*60*1000;//减去一天就是这个月的最后一天
    var lastDay=new Date(dis);
    firstDay= moment(firstDay).format("YYYY-MM-DD");//格式化 //这个格式化方法要用你们自己的，也可以用本文已经贴出来的下面的Format
    lastDay= moment(lastDay).format("YYYY-MM-DD");//格式化


    var obj={
        driveId:driveId,
        truckId:truckId
    };
    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"driver_exceed_oil_month_detail"}, {reload: true})
    };
    // 获取任务信息
    function getOilRel() {
        var url=$host.api_url + "/driveExceedOilDate?yMonth="+dateId+'&taskPlanDateStart='+firstDay+'&taskPlanDateEnd='+lastDay+'&'+_basic.objToUrl(obj);

        //司机  核油日期
        _basic.get(url).then(function (data) {
            if (data.success === true&&data.result.length>=0) {
                if(data.result.length==0){
                    $scope.exceedOilItem =[];
                }
                else {
                    $scope.exceedOilItem = data.result[0];
                    if($scope.exceedOilItem.surplus_oil==null){
                        $scope.exceedOilItem.surplus_oil=0;
                    }
                    if($scope.exceedOilItem.surplus_urea==null){
                        $scope.exceedOilItem.surplus_urea=0;
                    }
                    if($scope.exceedOilItem.subsidy_oil==null){
                        $scope.exceedOilItem.subsidy_oil=0;
                    }
                    if($scope.exceedOilItem.subsidy_urea==null){
                        $scope.exceedOilItem.subsidy_urea=0;
                    }
                    $scope.exceedOilItem.drive_name= data.result[0].drive_name;
                    dpRouteTaskOilRel(firstDay,lastDay);
                    driveExceedOilRel(firstDay,lastDay)
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });

    };

    // 加油任务
    function driveExceedOilRel(firstDay,lastDay){
        $scope.OilRelList=[];
        $scope.totalOilActal=0;
        $scope.totalUreaActal =0;
        _basic.get($host.api_url + "/driveExceedOilRel?oilDateStart="+firstDay+'&oilDateEnd='+lastDay+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.OilRelList = data.result;
                for(var i =0;i< $scope.OilRelList.length;i++){
                    $scope.totalOilActal+=  $scope.OilRelList[i].oil;
                    $scope.totalUreaActal+=  $scope.OilRelList[i].urea;

                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    // 未扣款任务
    function dpRouteTaskOilRel(firstDay,lastDay){
        $scope.unOilRelList=[];
        $scope.totalOil =0;
        $scope.totalUrea =0;
        _basic.get($host.api_url + "/dpRouteTaskOilRel?driveId=" + driveId+'&truckId='+truckId+'&taskPlanDateStart='+firstDay+"&taskPlanDateEnd="+lastDay).then(function (data) {
            if (data.success === true) {
                $scope.unOilRelList = data.result;
                for(var i =0;i< $scope.unOilRelList.length;i++){
                    $scope.totalOil+=  $scope.unOilRelList[i].total_oil;
                    $scope.totalUrea+=  $scope.unOilRelList[i].total_urea;

                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });

    }

/*
    $scope.updateActualMoney = function(){
        //添加实际用油量  实际尿素量   实际金额
        _basic.put($host.api_url + "/user/" + userId + "/exceedOilDateId/" + $scope.exceedOilItem.id+"/actualMoney/",{
            actualMoney:$scope.exceedOilItem.actual_money
        }).then(function (data) {
            if (data.success === true) {
                swal("保存成功", "", "success");
                getOilRel();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }*/

    $scope.saveCurrentInfo = function (){

        _basic.put($host.api_url + "/user/" + userId + "/exceedOilDateId/"+ $scope.exceedOilItem.id,{
            "planOilTotal": $scope.totalOil,
            "planUreaTotal": $scope.totalUrea,
            "actualOilTotal": $scope.totalOilActal,
            "actualUreaTotal": $scope.totalUreaActal,
            "surplusOil":$scope.exceedOilItem.surplus_oil,
            "surplusUrea": $scope.exceedOilItem.surplus_urea,
            "subsidyOil": $scope.exceedOilItem.subsidy_oil,
            "subsidyUrea": $scope.exceedOilItem.subsidy_urea,
            "exceedOil": $scope.totalOilActal-$scope.totalOil+$scope.exceedOilItem.subsidy_oil-$scope.exceedOilItem.surplus_oil,
            "exceedUrea": $scope.totalUreaActal-$scope.totalUrea+$scope.exceedOilItem.subsidy_urea-$scope.exceedOilItem.surplus_urea,
            "actualMoney": $scope.exceedOilItem.actual_money,
            "remark": $scope.exceedOilItem.remark
        }).then(function (data) {
            if (data.success === true) {
            }
            else {
                swal(data.msg, "", "error");
            }
        });





        putItem($scope.exceedOilItem.id)
    }


    $scope.endOfProcessing = function (){
            swal({
                title: "确定调整超油数据吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
            }).then(
                function(result){
                    if (result.value) {

                        _basic.put($host.api_url + "/user/" + userId + "/exceedOilDateId/"+ $scope.exceedOilItem.id,{
                            "planOilTotal": $scope.totalOil,
                            "planUreaTotal": $scope.totalUrea,
                            "actualOilTotal": $scope.totalOilActal,
                            "actualUreaTotal": $scope.totalUreaActal,
                            "surplusOil":$scope.exceedOilItem.surplus_oil,
                            "surplusUrea": $scope.exceedOilItem.surplus_urea,
                            "subsidyOil": $scope.exceedOilItem.subsidy_oil,
                            "subsidyUrea": $scope.exceedOilItem.subsidy_urea,
                            "exceedOil": $scope.totalOilActal-$scope.totalOil+$scope.exceedOilItem.subsidy_oil-$scope.exceedOilItem.surplus_oil,
                            "exceedUrea": $scope.totalUreaActal-$scope.totalUrea+$scope.exceedOilItem.subsidy_urea-$scope.exceedOilItem.surplus_urea,
                            "actualMoney": $scope.exceedOilItem.actual_money,
                            "remark": $scope.exceedOilItem.remark
                        }).then(function (data) {
                            if (data.success === true) {
                            }
                            else {
                                swal(data.msg, "", "error");
                            }
                        });



                        _basic.put($host.api_url + "/user/" + userId + "/exceedOilDate/" + $scope.exceedOilItem.id + '/checkStatus/3', {}).then(function (data) {
                            if (data.success === true) {
                                swal('处理结束', "", "success");
                                getOilRel();
                            }
                            else {
                                swal(data.msg, "", "error");
                            }
                        });

                    }
                });
    };
    //开始处理
    $scope.startDealInfo = function (){
        _basic.post($host.api_url + "/user/" + userId + "/driveExceedOilDate/",{
            "monthDateId": dateId,
            "driveId": driveId,
            "truckId": truckId,
            "planOilTotal": $scope.totalOil,
            "planUreaTotal": $scope.totalUrea,
            "actualOilTotal": $scope.totalOilActal,
            "actualUreaTotal": $scope.totalUreaActal,
            "surplusOil":$scope.exceedOilItem.surplus_oil,
            "surplusUrea": $scope.exceedOilItem.surplus_urea,
            "subsidyOil": $scope.exceedOilItem.subsidy_oil,
            "subsidyUrea": $scope.exceedOilItem.subsidy_urea,
            "exceedOil": $scope.totalOilActal-$scope.totalOil+$scope.exceedOilItem.subsidy_oil-$scope.exceedOilItem.surplus_oil,
            "exceedUrea": $scope.totalUreaActal-$scope.totalUrea+$scope.exceedOilItem.subsidy_urea-$scope.exceedOilItem.surplus_urea,
            "actualMoney": $scope.exceedOilItem.actual_money,
            "remark": $scope.exceedOilItem.remark
        }).then(function (data) {
            if (data.success === true) {
                $scope.id= data.id;
                putItem($scope.id);
            }
            else {
                swal(data.msg, "", "error");
            }
        });

    };

    function putItem(id){
        _basic.put($host.api_url + "/user/" + userId + "/exceedOilDate/" + id+'/checkStatus/2',{}).then(function (data) {
            if (data.success === true) {
                swal('处理中', "", "success");
                getOilRel();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    getOilRel();

}]);