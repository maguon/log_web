app.controller("settlement_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 日期初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');
    $scope.settlementInfoSize = "30";
    // monthPicker控件
    $('#chooseMileageStart,#chooseMileageEnd').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 交接单数按月统计
    var settlementCountMonth = [
        {
            name: '交接单数',
            data: [],
            color: '#26C6DA'
        }
    ];

    // 交接车辆按月统计
    var carCountMonth = [
        {
            name: '交接车辆',
            data: [],
            color: '#FF7E7E'
        }
    ];

    // 交接单数按日统计
    var settlementCountDay = [
        {
            name: '交接单数',
            data: [],
            color: '#26C6DA'
        }
    ];

    //交接车辆按日统计
    var carCountDay = [
        {
            name: '交接车辆',
            data: [],
            color: '#FF7E7E'
        }
    ];

    // 点击搜索按钮根据日期搜索
    $scope.searchSettlementMonCount = function () {
        var monthStart = $("#chooseMileageStart").val();
        var monthEnd = $("#chooseMileageEnd").val();
        getMonthInfo(monthStart, monthEnd);
    };

    // 获取按月统计信息
     function getMonthInfo(start, end) {
        if (start === undefined) {
            start = $scope.startInitial
        }
        if (end === undefined) {
            end = $scope.endInitial
        }
        _basic.get($host.api_url + "/settleHandoverMonthCount?monthStart=" + start + "&monthEnd=" + end).then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // X轴月份
                $scope.settlementMonth = [];
                // 初始化统计数
                settlementCountMonth[0].data = [];
                carCountMonth[0].data = [];
                if(data.result.length > 0){
                    for (var i = 0; i < data.result.length; i++) {
                        $scope.settlementMonth.push(data.result[i].y_month);
                        settlementCountMonth[0].data.push(Math.ceil(data.result[i].settle_handover_count));
                        carCountMonth[0].data.push(Math.ceil(data.result[i].car_count));
                    }
                }
                $scope.showSettlementMonth();
                $scope.showCarMonth();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取按日统计信息
    $scope.getDayInfo = function () {
        _basic.get($host.api_url + "/settleHandoverDayCount?start=0&size="+ $scope.settlementInfoSize).then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                $scope.settlementDay = [];
                settlementCountDay[0].data = [];
                carCountDay[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    // x轴月份
                    $scope.settlementDay.push(data.result[i].id);
                    settlementCountDay[0].data.push(Math.ceil(data.result[i].settle_handover_count));
                    carCountDay[0].data.push(Math.ceil(data.result[i].car_count));
                }
                $scope.showCountDayChart();
                $scope.showDayChart();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 显示交接单数按月统计折线图
    $scope.showSettlementMonth = function () {
        $("#settlementMonth").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '交接单数统计',
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
                categories: $scope.settlementMonth,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
                '<td style="padding:0"><b>{point.y}笔 </b></td></tr>',
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
            series: settlementCountMonth
        });
    };

    // 显示交接车辆按月统计折线图
    $scope.showCarMonth = function () {
        $("#carMonth").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '交接车辆统计',
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
                categories:$scope.settlementMonth,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
                '<td style="padding:0"><b>{point.y}辆</b></td></tr>',
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
            series: carCountMonth
        });
    };

    // 显示交接单数按日统计折线图
    $scope.showCountDayChart = function () {
        $("#settlementDay").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '交接单数统计',
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
                categories: $scope.settlementDay,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
                '<td style="padding:0"><b>{point.y} 笔</b></td></tr>',
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
            series: settlementCountDay
        });
    };

    // 显示交接车辆按日统计折线图
    $scope.showDayChart = function () {
        $("#carDay").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '交接车辆统计',
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
                categories:$scope.settlementDay,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
                '<td style="padding:0"><b>{point.y} 辆</b></td></tr>',
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
            series: carCountDay
        });
    };

    // 获取数据
    $scope.queryData = function () {
        getMonthInfo();
        $scope.getDayInfo();
    };
    $scope.queryData();
}]);