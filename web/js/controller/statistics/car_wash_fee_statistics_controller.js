app.controller("car_wash_fee_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    function getMakeName(){
        // 车辆品牌
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.get_carMake = data.result;
            }
        });
    }

    // 日期初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');

    // monthPicker控件
    $('#chooseCarWashFeeStart_month,#chooseCarWashFeeEnd_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 洗车费金额按月统计
    var washMoneyCountMonth = [{
        name: '按月统计',
        data: [],
        color: '#26C6DA'
    }];

    // 洗车费金额按周统计
    var washMoneyCountWeek = [{
        name: '按周统计',
        data: [],
        color: '#FF7E7E'
    }];

    // 获取商品车洗车费按月统计数据
    $scope.getCarWashFeeMonthCount = function () {
        if($scope.car_brand==undefined){
            $scope.car_brand=''
        }
        var monthStart = $('#chooseCarWashFeeStart_month').val();
        var monthEnd = $('#chooseCarWashFeeEnd_month').val();
        if(monthStart == "" || monthStart == undefined){
            monthStart = $scope.startInitial;
        }
        if(monthEnd == "" || monthEnd == undefined){
            monthEnd = $scope.endInitial;
        }
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRelMonthStat?monthStart=" + monthStart + "&monthEnd=" + monthEnd+'&makeId='+$scope.car_brand).then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // console.log("data", data);
                $scope.carWashFeeMonthCount = [];
                washMoneyCountMonth[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    $scope.carWashFeeMonthCount.push(data.result[i].y_month);
                    washMoneyCountMonth[0].data.push(Math.ceil(data.result[i].actual_price));
                }
                $scope.showCarWashFeeStatistics_month();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取商品车洗车费按周统计数据
    $scope.getCarWashFeeWeekCount = function () {
        if($scope.car_brand==undefined){
            $scope.car_brand=''
        }
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRelWeekStat?start=0&size=10"+'&makeId='+$scope.car_brand).then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // console.log("data", data);
                $scope.carWashFeeWeekCount = [];
                washMoneyCountWeek[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    $scope.carWashFeeWeekCount.push(data.result[i].y_week);
                    washMoneyCountWeek[0].data.push(Math.ceil(data.result[i].actual_price));
                }
                $scope.showCarWashFeeStatistics_week();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取经销商洗车费按月统计排行数据
    $scope.getReceiveCarWashFeeRankingMonth = function () {
        if($scope.car_brand==undefined){
            $scope.car_brand=''
        }
        var monthStart = $('#chooseCarWashFeeStart_month').val();
        var monthEnd = $('#chooseCarWashFeeEnd_month').val();
        if(monthStart == "" || monthStart == undefined){
            monthStart = $scope.startInitial;
        }
        if(monthEnd == "" || monthEnd == undefined){
            monthEnd = $scope.endInitial;
        }
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRelReceiveMonthStat?monthStart=" + monthStart + "&monthEnd=" + monthEnd+'&makeId='+$scope.car_brand).then(function (data) {
            if (data.success === true) {
                var carWashFeeList = [];
                if(data.result.length > 0){
                    if(data.result.length > 10){
                        carWashFeeList = data.result.slice(0,10);
                    }
                    else{
                        carWashFeeList = data.result;
                    }
                    // 金额最大项即为数组第一个元素的金额
                    var maxCount = carWashFeeList[0].actual_price;
                    // 根据金额最大项来计算百分比
                    for (var i = 0; i < carWashFeeList.length; i++) {
                        carWashFeeList[i].percent = Math.floor((carWashFeeList[i].actual_price / maxCount) * 100);
                    }
                }
                $scope.carWashFeeRankingMonth = carWashFeeList;
                // console.log("data", $scope.carWashFeeRankingMonth);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取经销商洗车费按周统计排行数据
    $scope.getReceiveCarWashFeeRankingWeek = function () {
        if($scope.car_brand==undefined){
            $scope.car_brand=''
        }
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRelReceiveWeekStat?start=0&size=10"+'&makeId='+$scope.car_brand).then(function (data) {
            if (data.success === true) {
                var carWashFeeList = [];
                if(data.result.length > 0){
                    if(data.result.length > 10){
                        carWashFeeList = data.result.slice(0,10);
                    }
                    else{
                        carWashFeeList = data.result;
                    }
                    // 金额最大项即为数组第一个元素的金额
                    var maxCount = carWashFeeList[0].actual_price;
                    // 根据金额最大项来计算百分比
                    for (var i = 0; i < carWashFeeList.length; i++) {
                        carWashFeeList[i].percent = Math.floor((carWashFeeList[i].actual_price / maxCount) * 100);
                    }
                }
                $scope.carWashFeeRankingWeek = carWashFeeList;
                // console.log("data", $scope.carWashFeeRankingWeek);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };


    // 显示商品车洗车费金额按月统计柱状图
    $scope.showCarWashFeeStatistics_month = function () {
        $("#vehicleWashStatisticsMonth").highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: $scope.carWashFeeMonthCount,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '人民币(￥)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                '<td style="padding:0"><b>{point.y:.1f} 元</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            credits: {
                enabled: false
            },
            series: washMoneyCountMonth
        });
    };

    // 显示商品车洗车费金额按周统计柱状图
    $scope.showCarWashFeeStatistics_week = function () {
        $("#vehicleWashStatisticsWeek").highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: $scope.carWashFeeWeekCount,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '人民币(￥)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                '<td style="padding:0"><b>{point.y:.1f} 元</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            credits: {
                enabled: false
            },
            series: washMoneyCountWeek
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getCarWashFeeMonthCount();
        $scope.getCarWashFeeWeekCount();
        $scope.getReceiveCarWashFeeRankingMonth();
        $scope.getReceiveCarWashFeeRankingWeek();
        getMakeName();
    };
    $scope.queryData();
}]);