app.controller("damage_index_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    // 当月日期
    var currentMonth = moment(new Date()).format('YYYYMM');
    $scope.waitingHandleDamageCount = 0;
    $scope.handlingDamageCount = 0;
    $scope.getCompanyCount=0;
    $scope.getPersonCount=0;
    $scope.getCleanPrice=0;
    $scope.getCleanCount=0;
    $scope.getInsurNum=0;
    $scope.getInsurCount=0;
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
    // 当月洗车数/量
    $scope.getCleanPriceAndCount = function () {
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRelMonthStat?yearMonth="+currentMonth).then(function (data) {
            if (data.success === true) {
                for (var i = 0; i < data.result.length; i++) {
                    $scope.getCleanPrice += data.result[i].actual_price;
                    $scope.getCleanCount += data.result[i].car_count;
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