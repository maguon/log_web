app.controller("car_wash_fee_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

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
        var monthStart = $('#chooseCarWashFeeStart_month').val();
        var monthEnd = $('#chooseCarWashFeeEnd_month').val();
        if(monthStart == "" || monthStart == undefined){
            monthStart = $scope.startInitial;
        }
        if(monthEnd == "" || monthEnd == undefined){
            monthEnd = $scope.endInitial;
        }
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRelMonthStat?monthStart=" + monthStart + "&monthEnd=" + monthEnd).then(function (data) {
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
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRelWeekStat?start=0&size=10").then(function (data) {
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
        var monthStart = $('#chooseCarWashFeeStart_month').val();
        var monthEnd = $('#chooseCarWashFeeEnd_month').val();
        if(monthStart == "" || monthStart == undefined){
            monthStart = $scope.startInitial;
        }
        if(monthEnd == "" || monthEnd == undefined){
            monthEnd = $scope.endInitial;
        }
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRelReceiveMonthStat?monthStart=" + monthStart + "&monthEnd=" + monthEnd).then(function (data) {
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
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRelReceiveWeekStat?start=0&size=10").then(function (data) {
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

    // 模拟经销商洗车费top10假数据
    /*$scope.virtualDataSimulation = function () {
        var carWashFeeRanking = [
            {receive_name: "大连万海", money_count: 8456},
            {receive_name: "大连庞大", money_count: 4651},
            {receive_name: "大连兆远", money_count: 7764},
            {receive_name: "大连德瑞", money_count: 9963},
            {receive_name: "大连禾泰", money_count: 4619},
            {receive_name: "大连凯祥", money_count: 8512},
            {receive_name: "大连汇达", money_count: 1172},
            {receive_name: "沈阳庞大", money_count: 6731},
            {receive_name: "鑫达", money_count: 5555},
            {receive_name: "上海鸿程", money_count: 2499}
        ];

        // 求出金额最大项
        var moneyArr = [];
        for (var i = 0; i < carWashFeeRanking.length; i++) {
            moneyArr.push(carWashFeeRanking[i].money_count);
        }
        var maxCount = Math.max.apply(null,moneyArr);
        // 根据金额最大项来计算百分比
        for (var j = 0; j < carWashFeeRanking.length; j++) {
            moneyArr[j] = Math.floor((moneyArr[j] / maxCount) * 100);
            carWashFeeRanking[j].percent = moneyArr[j];
        }
        // 根据平均值进行从大到小排序
        carWashFeeRanking.sort(function (a,b) {
            var val1 = a.money_count;
            var val2 = b.money_count;
            return val2 - val1;
        });
        $scope.sortCarWashFeeRanking = carWashFeeRanking;
    };*/

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
    };
    $scope.queryData();
}]);