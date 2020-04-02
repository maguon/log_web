app.controller("driver_exceed_oil_month_detail_controller", ["$scope", "$state","$stateParams", "_basic", "_config", "$host", function ($scope, $state,$stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var dateId = $stateParams.dateId;
    $scope.monthDateId=$stateParams.dateId;
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
    firstDay= moment(firstDay).format("YYYYMMDD");//格式化 //这个格式化方法要用你们自己的，也可以用本文已经贴出来的下面的Format
    lastDay= moment(lastDay).format("YYYYMMDD");//格式化


    /*计划用油量*/
    $scope.totalOil =0;
    /*计划尿素量*/
    $scope.totalUrea =0;
    /*计划重载*/
    $scope.totalOilDistance=0;
    /*计划空载*/
    $scope.totalNoOilDistance=0;
    /*GPS用油量*/
    $scope.totalOilGPS =0;
    /*GPS尿素量*/
    $scope.totalUreaGPS =0;

    $scope.unOilRelList=[];
    $scope.OilRelList=[];
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
                    if($scope.exceedOilItem.actual_money==null){
                        $scope.exceedOilItem.actual_money=0;
                    }
                    if($scope.exceedOilItem.gps_load_oil_distance==null){
                        $scope.exceedOilItem.gps_load_oil_distance=0;
                    }
                    if($scope.exceedOilItem.gps_no_load_oil_distance==null){
                        $scope.exceedOilItem.gps_no_load_oil_distance=0;
                    }
                    if($scope.exceedOilItem.gps_actual_money==null){
                        $scope.exceedOilItem.gps_actual_money=0;
                    }
                    $scope.exceedOilItem.drive_name= data.result[0].drive_name;


                    $scope.totalOilGPS =$scope.exceedOilItem.gps_oil_total;
                    $scope.totalUreaGPS=$scope.exceedOilItem.gps_urea_total;

                    dpRouteTaskOilRel(firstDay,lastDay);

                }
            }
        else {
            swal(data.msg, "", "error");
        }

        });

        _basic.get($host.api_url + "/driveExceedOilPrice").then(function (data) {
            if (data.success === true) {
                $scope.singleItem = data.result[0];
                if( $scope.singleItem.oil_single_price==undefined|| $scope.singleItem.oil_single_price==''){
                    $scope.singleItem.oil_single_price=0;
                }
                if( $scope.singleItem.urea_single_price==undefined|| $scope.singleItem.urea_single_price==''){
                    $scope.singleItem.urea_single_price=0;
                }
                if( $scope.singleItem.surplus_oil_single_price==undefined|| $scope.singleItem.surplus_oil_single_price==''){
                    $scope.singleItem.surplus_oil_single_price=0;
                }
                if( $scope.singleItem.surplus_urea_single_price==undefined|| $scope.singleItem.surplus_urea_single_price==''){
                    $scope.singleItem.surplus_urea_single_price=0;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });



    };

    $scope.putSinleInfo = function (){
        if($scope.singleItem.oil_single_price==null|| $scope.singleItem.urea_single_price==null||
            $scope.singleItem.surplus_oil_single_price==null|| $scope.singleItem.surplus_urea_single_price==null){
            getOilRel();
          swal("请输入完整信息!", "", "error");
        }
        else {
            _basic.put($host.api_url + "/user/" + userId + "/driveExceedOilPrice/"+  $scope.singleItem.id,{
                "oilSinglePrice": $scope.singleItem.oil_single_price,
                "ureaSinglePrice": $scope.singleItem.urea_single_price,
                "surplusOilSinglePrice": $scope.singleItem.surplus_oil_single_price,
                "surplusUreaSinglePrice":$scope.singleItem.surplus_urea_single_price
            }).then(function (data) {
                if (data.success === true) {
                    swal("修改成功", "", "success");
                    getOilRel();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }

    }

    // 加油任务
    function driveExceedOilRel(firstDay,lastDay){
        $scope.OilRelList=[];
        //实际用油量
        $scope.totalOilActal=0;
        //实际尿素量
        $scope.totalUreaActal =0;
        _basic.get($host.api_url + "/driveExceedOilRel?oilDateStart="+firstDay+'&oilDateEnd='+lastDay+'&'+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.OilRelList=[];
                    $scope.totalOilActal=0;
                    $scope.totalUreaActal=0;

                }
                else {
                    $scope.OilRelList = data.result;
                    for(var i =0;i< $scope.OilRelList.length;i++){
                        $scope.totalOilActal+=  $scope.OilRelList[i].oil;
                        $scope.totalUreaActal+=  $scope.OilRelList[i].urea;
                    }
                }

                startData();


                }
            else {
                swal(data.msg, "", "error");
            }
        });
    }


    function startData(){

        //计划超量油
        var exceedOil = ($scope.totalOilActal - $scope.totalOil - $scope.exceedOilItem.surplus_oil + $scope.exceedOilItem.subsidy_oil).toFixed(2);
        //计划超量尿素
        var exceedUrea = ($scope.totalUreaActal-$scope.totalUrea+$scope.exceedOilItem.subsidy_urea-$scope.exceedOilItem.surplus_urea).toFixed(2);
        var exceedOilMoney = exceedOil>0? exceedOil*$scope.singleItem.oil_single_price : exceedOil*$scope.singleItem.surplus_oil_single_price;
        var exceedUreaMoney = exceedUrea>0?exceedUrea*$scope.singleItem.urea_single_price : exceedUrea*$scope.singleItem.surplus_urea_single_price;
        $scope.oilSinglePrice=exceedOil>0? $scope.singleItem.oil_single_price :$scope.singleItem.surplus_oil_single_price;
        $scope.ureaSinglePrice=exceedUrea>0?$scope.singleItem.urea_single_price : $scope.singleItem.surplus_urea_single_price;
        $scope.overMoney = (exceedOilMoney + exceedUreaMoney).toFixed(2);

        //GPS用油量
        $scope.totalOilG =($scope.exceedOilItem.gps_no_load_oil_distance*$scope.exceedOilItem.no_load_distance_oil+$scope.exceedOilItem.gps_load_oil_distance*$scope.exceedOilItem.load_distance_oil)/100;
        console.log($scope.totalOilG)
        //GPS尿素量
        $scope.totalUreaG= ($scope.exceedOilItem.gps_no_load_oil_distance+$scope.exceedOilItem.gps_load_oil_distance)*$scope.exceedOilItem.urea/100;
        //GPS超量油
        $scope.GPSExceedOil = ($scope.totalOilActal-$scope.totalOilG+$scope.exceedOilItem.subsidy_oil-$scope.exceedOilItem.surplus_oil).toFixed(2);
        //GPS超量尿素
        $scope.GPSExceedUrea = ($scope.totalUreaActal-$scope.totalUreaG+$scope.exceedOilItem.subsidy_urea-$scope.exceedOilItem.surplus_urea).toFixed(2);

        var exceedOilMoneyGPS =  $scope.GPSExceedOil>0?  $scope.GPSExceedOil*$scope.singleItem.oil_single_price :  $scope.GPSExceedOil*$scope.singleItem.surplus_oil_single_price;
        var exceedUreaMoneyGPS =  $scope.GPSExceedUrea>0? $scope.GPSExceedUrea*$scope.singleItem.urea_single_price :  $scope.GPSExceedUrea*$scope.singleItem.surplus_urea_single_price;

        $scope.overMoneyGPS = (exceedOilMoneyGPS + exceedUreaMoneyGPS).toFixed(2);
    }


    $scope.resetExceedMoney = function(){
        startData()
    }


    // 未扣款任务
    function dpRouteTaskOilRel(firstDay,lastDay){
        $scope.unOilRelList=[];
        _basic.get($host.api_url + "/dpRouteTaskOilRel?driveId=" + driveId+'&truckId='+truckId+'&taskPlanDateStart='+firstDay+"&taskPlanDateEnd="+lastDay).then(function (dataOil) {
            if (dataOil.success === true) {
                $scope.unOilRelList = dataOil.result;
                $scope.totalOil =0;
                $scope.totalUrea =0;
                $scope.totalOilDistance=0;
                $scope.totalNoOilDistance=0;
                for(var i =0;i< $scope.unOilRelList.length;i++){
                    $scope.totalOil+=  $scope.unOilRelList[i].total_oil;
                    $scope.totalUrea+=  $scope.unOilRelList[i].total_urea;
                    if($scope.unOilRelList[i].oil_load_flag==1){
                        $scope.totalOilDistance+=  $scope.unOilRelList[i].oil_distance;
                    }
                    else {
                        $scope.totalNoOilDistance+=  $scope.unOilRelList[i].oil_distance;
                    }

                }
            }
            else {
                swal(dataOil.msg, "", "error");
            }
            driveExceedOilRel(firstDay,lastDay)
        });

    }

    /*保存*/
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
            "loadOilDistance":  $scope.totalOilDistance,
            "noLoadOilDistance":  $scope.totalNoOilDistance,
            "oilSinglePrice":  $scope.oilSinglePrice,
            "ureaSinglePrice":$scope.ureaSinglePrice,
            "actualMoney": $scope.overMoney,
            "gpsNoLoadOilDistance": $scope.exceedOilItem.gps_no_load_oil_distance,
            "gpsLoadOilDistance": $scope.exceedOilItem.gps_load_oil_distance,
            "gpsOilTotal": $scope.totalOilG,
            "gpsUreaTotal":$scope.totalUreaG,
            "gpsExceedOil":  $scope.GPSExceedOil,
            "gpsExceedUrea": $scope.GPSExceedUrea,
            "gpsActualMoney":  $scope.overMoneyGPS,
            "remark": $scope.exceedOilItem.remark
        }).then(function (data) {
            if (data.success === true) {

            }
            else {
                swal(data.msg, "", "error");
            }
        });
        _basic.put($host.api_url + "/user/" + userId + "/exceedOilDate/" + $scope.exceedOilItem.id+'/checkStatus/2',{}).then(function (data) {
            if (data.success === true) {
                swal('保存成功', "", "success");
                getOilRel()
            }
            else {
                swal(data.msg, "", "error");
            }
        });

    }

    /*处理结束*/
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
                            "loadOilDistance":  $scope.totalOilDistance,
                            "noLoadOilDistance":  $scope.totalNoOilDistance,
                            "oilSinglePrice":  $scope.oilSinglePrice,
                            "ureaSinglePrice":$scope.ureaSinglePrice,
                            "actualMoney": $scope.overMoney,
                            "gpsNoLoadOilDistance": $scope.exceedOilItem.gps_no_load_oil_distance,
                            "gpsLoadOilDistance": $scope.exceedOilItem.gps_load_oil_distance,
                            "gpsOilTotal": $scope.totalOilG,
                            "gpsUreaTotal":$scope.totalUreaG,
                            "gpsExceedOil":  $scope.GPSExceedOil,
                            "gpsExceedUrea": $scope.GPSExceedUrea,
                            "gpsActualMoney":  $scope.overMoneyGPS,
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

    /*开始处理*/
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
            "loadOilDistance":  $scope.totalOilDistance,
            "noLoadOilDistance":  $scope.totalNoOilDistance,
            "oilSinglePrice":  $scope.oilSinglePrice,
            "ureaSinglePrice":$scope.ureaSinglePrice,
            "actualMoney": $scope.overMoney,
            "gpsNoLoadOilDistance": $scope.exceedOilItem.gps_no_load_oil_distance,
            "gpsLoadOilDistance": $scope.exceedOilItem.gps_load_oil_distance,
            "gpsOilTotal": $scope.totalOilG,
            "gpsUreaTotal":$scope.totalUreaG,
           "gpsExceedOil":  $scope.GPSExceedOil,
           "gpsExceedUrea": $scope.GPSExceedUrea,
            "gpsActualMoney":  $scope.overMoneyGPS,
            "remark": $scope.exceedOilItem.remark
        }).then(function (data) {
            if (data.success === true) {
                $scope.id= data.id;
                putItem($scope.id);
                getOilRel();
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
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    getOilRel();
}]);