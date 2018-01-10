app.controller("liability_compensation_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 个人责任赔偿金额按月统计
    var personalCompensateCountMonth = [{
        name: '个人承担赔偿',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        color: '#FF7E7E'
    }];

    // 个人责任赔偿金额按周统计
    var personalCompensateCountWeek = [{
        name: '个人承担赔偿',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1],
        color: '#FF7E7E'
    }];

    // 企业赔偿金额按月统计
    var companyCompensateCountMonth = [{
        name: '企业承担赔偿',
        data: [194.1, 144.0, 49.9, 95.6, 106.4, 129.2, 135.6, 176.0, 148.5, 216.4, 71.5, 54.4],
        color: '#26C6DA'
    }];

    // 企业赔偿金额按周统计
    var companyCompensateCountWeek = [{
        name: '企业承担赔偿',
        data: [95.6, 194.1, 49.9, 135.6, 148.5, 106.4, 144.0, 216.4, 71.5, 176.0],
        color: '#26C6DA'
    }];

    // 模拟个人承担赔偿费top10假数据
    $scope.virtualDataSimulation = function () {
        var personalCompensate = [
            {person_name: "张狗蛋", money_count: 8456},
            {person_name: "吴老二", money_count: 4651},
            {person_name: "于雷", money_count: 7764},
            {person_name: "宋天开", money_count: 9963},
            {person_name: "李磊", money_count: 4619},
            {person_name: "韩梅梅", money_count: 8512},
            {person_name: "王二狗", money_count: 1172},
            {person_name: "李强", money_count: 6731},
            {person_name: "王伟", money_count: 5555},
            {person_name: "王建军", money_count: 2499}
        ];

        // 求出金额最大项
        var moneyArr = [];
        for (var i = 0; i < personalCompensate.length; i++) {
            moneyArr.push(personalCompensate[i].money_count);
        }
        var maxCount = Math.max.apply(null, moneyArr);
        // 根据金额最大项来计算百分比
        for (var j = 0; j < personalCompensate.length; j++) {
            moneyArr[j] = Math.floor((moneyArr[j] / maxCount) * 100);
            personalCompensate[j].percent = moneyArr[j];
        }
        // 根据平均值进行从大到小排序
        personalCompensate.sort(function (a, b) {
            var val1 = a.money_count;
            var val2 = b.money_count;
            return val2 - val1;
        });
        $scope.sortPersonalCompensate = personalCompensate;
    };

    // 显示个人责任赔偿金额按月统计柱状图
    $scope.showPersonalLiabilityCompensation_month = function () {
        $("#personalLiabilityStatisticsMonth").highcharts({
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
            series: personalCompensateCountMonth
        });
    };

    // 显示个人责任赔偿金额按周统计柱状图
    $scope.showPersonalLiabilityCompensation_week = function () {
        $("#personalLiabilityStatisticsWeek").highcharts({
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
            series: personalCompensateCountWeek
        });
    };

    // 显示企业责任赔偿金额按月统计柱状图
    $scope.showCompanyLiabilityCompensation_month = function () {
        $("#companyLiabilityStatisticsMonth").highcharts({
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
            series: companyCompensateCountMonth
        });
    };

    // 显示企业责任赔偿金额按周统计柱状图
    $scope.showCompanyLiabilityCompensation_week = function () {
        $("#companyLiabilityStatisticsWeek").highcharts({
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
            series: companyCompensateCountWeek
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.showPersonalLiabilityCompensation_month();
        $scope.showPersonalLiabilityCompensation_week();
        $scope.showCompanyLiabilityCompensation_month();
        $scope.showCompanyLiabilityCompensation_week();
        $scope.virtualDataSimulation();
    };
    $scope.queryData();
}]);