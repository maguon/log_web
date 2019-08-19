app.controller("finance_route_fee_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 日期初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');

    var financeInfoMonthCount;
    var financeInfoDayCount;
    $scope.financeInfoSize = "30";

    // monthPicker控件
    $('#financeTimeStart,#financeTimeEnd').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 申请笔数按月统计
    var applyCountMonth = [
        {
            name: '出车款笔数',
            data: [],
            color: '#26C6DA'
        }
    ];

    // 申请金额按月统计
    var applyMoneyMonth = [
        {
            name: '货车停车费',
            data: [],
            color: '#26C6DA'
        },
        {
            name: '商品车停车费',
            data: [],
            color: '#FF7E7E'
        },
        {
            name: '商品车加油费',
            data: [],
            color: '#F5AA2C'
        },
        {
            name: '其他费用',
            data: [],
            color: '#BF19E1'
        }

    ];

    // 申请笔数按日统计
    var applyCountDay = [
        {
            name: '出车款笔数',
            data: [],
            color: '#26C6DA'
        }
    ];

    // 申请金额按日统计
    var applyMoneyDay = [
        {
            name: '货车停车费',
            data: [],
            color: '#26C6DA'
        },
        {
            name: '商品车停车费',
            data: [],
            color: '#FF7E7E'
        },
        {
            name: '商品车加油费',
            data: [],
            color: '#F5AA2C'
        },
        {
            name: '其他费用',
            data: [],
            color: '#BF19E1'
        }
    ];

    // 获取财务按月统计数据
    $scope.getFinanceMonthInfo = function () {
        var monthStart = $('#financeTimeStart').val();
        var monthEnd = $('#financeTimeEnd').val();
        if(monthStart == "" || monthStart == undefined){
            monthStart = $scope.startInitial;
        }
        if(monthEnd == "" || monthEnd == undefined){
            monthEnd = $scope.endInitial;
        }
        _basic.get($host.api_url + "/dpRouteTaskFeeMonthStat?status=2&monthStart=" + monthStart + "&monthEnd=" + monthEnd).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                data.result.reverse();
                financeInfoMonthCount = [];
                // 申请笔数金额初始化
                applyCountMonth[0].data = [];
                applyMoneyMonth[0].data = [];
                applyMoneyMonth[1].data = [];
                applyMoneyMonth[2].data = [];
                applyMoneyMonth[3].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    // x轴月份
                    financeInfoMonthCount.push(data.result[i].y_month);
                    // 申请笔数
                    applyCountMonth[0].data.push(Math.ceil(data.result[i].refund_count));
                    // 申请金额
                    applyMoneyMonth[0].data.push(Math.ceil(data.result[i].total_price));
                    applyMoneyMonth[1].data.push(Math.ceil(data.result[i].car_total_price));
                    applyMoneyMonth[2].data.push(Math.ceil(data.result[i].car_oil_fee));
                    applyMoneyMonth[3].data.push(Math.ceil(data.result[i].other_fee));
                }
                $scope.showFinanceCountMonthChart();
                $scope.showFinanceMoneyMonthChart();
            }
            else {
                swal(data.msg, "", "error");
            }
        });

    };

    // 获取财务按日统计数据
    $scope.getFinanceDayInfo = function () {
        _basic.get($host.api_url + "/dpRouteTaskFeeDayStat?status=2&start=0&size=" + $scope.financeInfoSize).then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                financeInfoDayCount = [];
                // 申请笔数金额初始化
                applyCountDay[0].data = [];
                applyMoneyDay[0].data = [];
                applyMoneyDay[1].data = [];
                applyMoneyDay[2].data = [];
                applyMoneyDay[3].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    // x轴月份
                    financeInfoDayCount.push(data.result[i].id);
                    // 申请笔数
                    applyCountDay[0].data.push(Math.ceil(data.result[i].refund_count));
                    // 申请金额
                    applyMoneyDay[0].data.push(Math.ceil(data.result[i].total_price));
                    applyMoneyDay[1].data.push(Math.ceil(data.result[i].car_total_price));
                    applyMoneyDay[2].data.push(Math.ceil(data.result[i].car_oil_fee));
                    applyMoneyDay[3].data.push(Math.ceil(data.result[i].other_fee));
                }
                $scope.showFinanceCountDayChart();
                $scope.showFinanceMoneyDayChart();
            }
            else {
                swal(data.msg, "", "error");
            }
        });

    };

    // 显示申请笔数按月统计折线图
    $scope.showFinanceCountMonthChart = function () {
        $("#financeCountMonth").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '笔数统计',
                align: "left",
                style: {
                    color: '#616161',
                    fontWeight: 'bold'
                },
                x: 31
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: financeInfoMonthCount,
                crosshair: true
            },
            yAxis: {
               /* min: 0,*/
                title: {
                    text: '次'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} 次</b></td></tr>',
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
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: applyCountMonth
        });
    };

    // 显示申请金额按月统计折线图
    $scope.showFinanceMoneyMonthChart = function () {
        $("#financeMoneyMonth").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '金额统计',
                align: "left",
                style: {
                    color: '#616161',
                    fontWeight: 'bold'
                },
                x: 31
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: financeInfoMonthCount,
                crosshair: true
            },
            yAxis: {
             /*   min: 0,*/
                title: {
                    text: '人民币(￥)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.2f} 元</b></td></tr>',
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
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: applyMoneyMonth
        });
    };

    // 显示申请笔数按日统计折线图
    $scope.showFinanceCountDayChart = function () {
        $("#financeCountDay").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '笔数统计',
                align: "left",
                style: {
                    color: '#616161',
                    fontWeight: 'bold'
                },
                x: 31
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: financeInfoDayCount,
                crosshair: true
            },
            yAxis: {
               /* min: 0,*/
                title: {
                    text: '次'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} 次</b></td></tr>',
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
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: applyCountDay
        });
    };

    // 显示申请金额按日统计折线图
    $scope.showFinanceMoneyDayChart = function () {
        $("#financeMoneyDay").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '金额统计',
                align: "left",
                style: {
                    color: '#616161',
                    fontWeight: 'bold'
                },
                x: 31
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: financeInfoDayCount,
                crosshair: true
            },
            yAxis: {
              /*  min: 0,*/
                title: {
                    text: '人民币(￥)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.2f} 元</b></td></tr>',
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
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: applyMoneyDay
        });
    };


    // 获取数据
    $scope.queryData = function () {
        $scope.getFinanceMonthInfo();
        $scope.getFinanceDayInfo();
    };
    $scope.queryData();
}]);