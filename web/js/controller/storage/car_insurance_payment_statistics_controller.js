app.controller("car_insurance_payment_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 保险赔付金额按月统计
    var personalCompensateCountMonth = [{
        name: '赔付金额统计',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        color: '#FF7E7E'
    }];

    // 保险赔付金额按周统计
    var personalCompensateCountWeek = [{
        name: '赔付金额统计',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        color: '#FF7E7E'
    }];

    // 保险赔付次数按月统计
    var companyCompensateCountMonth = [{
        name: '赔付次数统计',
        data: [5,9,4,2,3,6,4,8,7,2,11,9],
        color: '#26C6DA'
    }];

    // 保险赔付次数按月统计
    var companyCompensateCountWeek = [{
        name: '赔付次数统计',
        data: [9,9,8,2,4,11,8,6,3,7,5,2],
        color: '#26C6DA'
    }];

    // 显示保险赔付金额按月统计折线图
    $scope.showInsurancePaymentMoney_month = function () {
        $("#insurancePaymentMoneyMonth").highcharts({
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
            series: personalCompensateCountMonth
        });
    };

    // 显示保险赔付金额按周统计折线图
    $scope.showInsurancePaymentMoney_week = function () {
        $("#insurancePaymentMoneyWeek").highcharts({
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
                    '第10周',
                    '第11周',
                    '第12周'
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
            series: personalCompensateCountWeek
        });
    };

    // 显示保险赔付次数按月统计折线图
    $scope.showInsurancePaymentCount_month = function () {
        $("#insurancePaymentCountMonth").highcharts({
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
                    text: '次数'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                '<td style="padding:0"><b>{point.y:.1f} 次</b></td></tr>',
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
            series: companyCompensateCountMonth
        });
    };

    // 显示保险赔付次数按周统计折线图
    $scope.showInsurancePaymentCount_week = function () {
        $("#insurancePaymentCountWeek").highcharts({
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
                    '第10周',
                    '第11周',
                    '第12周'
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '次数'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                '<td style="padding:0"><b>{point.y:.1f} 次</b></td></tr>',
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
            series: companyCompensateCountWeek
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.showInsurancePaymentMoney_month();
        $scope.showInsurancePaymentMoney_week();
        $scope.showInsurancePaymentCount_month();
        $scope.showInsurancePaymentCount_week();
    };
    $scope.queryData();
}]);