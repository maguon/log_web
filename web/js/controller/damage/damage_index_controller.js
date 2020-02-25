app.controller("damage_index_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    // 当月日期
    var currentMonth = moment(new Date()).format('YYYYMM');

    //获取当月第一天和最后一天
    var year = currentMonth.toString().slice(0,4);
    var month =currentMonth.toString().slice(4,6);
    var firstDay=new Date(year,month-1,1);//这个月的第一天
    var currentMonth1=firstDay.getMonth(); //取得月份数
    var nextMonthFirstDay=new Date(firstDay.getFullYear(),currentMonth1+1,1);//加1获取下个月第一天
    var dis=nextMonthFirstDay.getTime()-24*60*60*1000;//减去一天就是这个月的最后一天
    var lastDay=new Date(dis);
    firstDay= moment(firstDay).format("YYYY-MM-DD");//格式化 //这个格式化方法要用你们自己的，也可以用本文已经贴出来的下面的Format
    lastDay= moment(lastDay).format("YYYY-MM-DD");//格式化


    $scope.waitingHandleDamageCount = 0;
    $scope.handlingDamageCount = 0;
    $scope.getCompanyCount=0;
    $scope.getPersonCount=0;
    $scope.getCleanPrice=0;
    $scope.getCleanCount=0;
    $scope.getInsurNum=0;
    $scope.getInsurCount=0;
    $scope.damageInsureCount=0;
    $scope.damageInsure=0;


    // 获取当月待完成处理质损信息
    $scope.getHangDamageCount = function () {
        _basic.get($host.api_url + "/damageNotCheckCount").then(function (data) {
            if (data.success === true) {
                for (var i = 0; i < data.result.length; i++) {
                    if(data.result[i].damage_status === 1){
                        $scope.waitingHandleDamageCount += data.result[i].damage_count;
                    }
                    if(data.result[i].damage_status === 2){
                        $scope.handlingDamageCount += data.result[i].damage_count;
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 企业和个人总额
    $scope.getComAndPerCount = function () {
        _basic.get($host.api_url + "/damageTotalCost?yearMonth="+ currentMonth+'&damageStatus=3').then(function (data) {
            if (data.success === true) {
                for (var i = 0; i < data.result.length; i++) {
                    $scope.getCompanyCount += data.result[i].company_cost;
                    $scope.getPersonCount += data.result[i].under_cost;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    //待完成保险赔付
    $scope.getInsuranceCount = function () {
        _basic.get($host.api_url + "/damageInsureMonthStat?insureStatus=1").then(function (data) {
            if (data.success === true) {
                for (var i = 0; i < data.result.length; i++) {
                    $scope.damageInsureCount += data.result[i].damage_insure_count;
                    $scope.damageInsure += data.result[i].insure_plan;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 当月洗车数/量
    $scope.getCleanPriceAndCount = function () {
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRelCount?loadDateStart="+ firstDay +'&loadDateEnd='+lastDay ).then(function (data) {
            if (data.success === true) {
                if(data.result[0].total_clean_fee==null){
                    $scope.getCleanPrice =0;
                }
                else {
                    $scope.getCleanPrice = data.result[0].total_clean_fee;
                }
                if(data.result[0].car_count==null){
                    $scope.getCleanCount=0;
                }
                else {
                    $scope.getCleanCount = data.result[0].car_count;
                }

            }
            else {
                swal(data.msg, "", "error");
            }
        });

    };
    // 当月保险赔付
    $scope.getInsurNumAndCount = function () {
        _basic.get($host.api_url + "/damageInsureMonthStat?yearMonth="+currentMonth+"&insureStatus=2").then(function (data) {
            if (data.success === true) {
                for (var i = 0; i < data.result.length; i++) {
                        $scope.getInsurCount += data.result[i].damage_insure;
                        $scope.getInsurNum += data.result[i].damage_insure_count;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 获取数据
    $scope.queryData = function () {
        $scope.getHangDamageCount();
        $scope.getComAndPerCount();
        $scope.getCleanPriceAndCount();
        $scope.getInsurNumAndCount();
        $scope.getInsuranceCount();
    };
    $scope.queryData();
}]);