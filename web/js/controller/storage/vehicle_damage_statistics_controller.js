app.controller("vehicle_damage_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 商品车质损按月统计
    var carDamageCountMonth = [
        {
            name: '一般质损',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            color: '#FF7E7E'
        },
        {
            name: '严重质损',
            data: [71.5, 148.5, 129.2, 95.6, 124.0, 54.4, 216.4, 176.0, 135.6, 106.4, 49.9, 194.1],
            color: '#26C6DA'
        }
    ];

    // 商品车质损按周统计
    var carDamageCountWeek = [
        {
            name: '一般质损',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1],
            color: '#FF7E7E'
        },
        {
            name: '严重质损',
            data: [71.5, 148.5, 129.2, 95.6, 124.0, 54.4, 216.4, 176.0, 135.6, 106.4],
            color: '#26C6DA'
        }
    ];

    // 显示商品车质损金额按月统计折线图
    $scope.showVehicleRepairHistogram_month = function () {
        $("#carDamageStatisticsMonth").highcharts({
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
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
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
            series: carDamageCountMonth
        });
    };

    // 显示商品车质损金额按周统计折线图
    $scope.showVehicleRepairHistogram_week = function () {
        $("#carDamageStatisticsWeek").highcharts({
            chart: {
                type: 'line'
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
            series: carDamageCountWeek
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.showVehicleRepairHistogram_month();
        $scope.showVehicleRepairHistogram_week();
    };
    $scope.queryData();
}]);