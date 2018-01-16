app.controller("car_wash_fee_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 日期初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');

    // monthPicker控件
    $('#chooseCarWashFeeStart_month,#chooseCarWashFeeEnd_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 维修金额按月统计
    var washMoneyCountMonth = [{
        name: '按月统计',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        color: '#26C6DA'
    }];

    // 维修金额按周统计
    var washMoneyCountWeek = [{
        name: '按周统计',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1],
        color: '#FF7E7E'
    }];

    // 模拟经销商洗车费top10假数据
    $scope.virtualDataSimulation = function () {
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
    };

    // 显示商品车维修金额按月统计柱状图
    $scope.showVehicleRepairHistogram_month = function () {
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
                categories: [
                    '一月',
                    '二月',
                    '三月',
                    '四月',
                    '五月',
                    '六月',
                    '七月',
                    '八月',
                    '九月',
                    '十月',
                    '十一月',
                    '十二月'
                ],
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

    // 显示商品车维修金额按周统计柱状图
    $scope.showVehicleRepairHistogram_week = function () {
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
                categories: [
                    '第1周',
                    '第2周',
                    '第3周',
                    '第4周',
                    '第5周',
                    '第6周',
                    '第7周',
                    '第8周',
                    '第9周',
                    '第10周'
                ],
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
        $scope.showVehicleRepairHistogram_month();
        $scope.showVehicleRepairHistogram_week();
        $scope.virtualDataSimulation();
    };
    $scope.queryData();
}]);