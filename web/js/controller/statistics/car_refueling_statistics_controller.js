app.controller("car_refueling_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 日期初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');

    // monthPicker控件
    $('#chooseMileageStart,#chooseMileageEnd').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 货车加油量按月统计
    var truckRefuelingVolCountMonth = [
        {
            name: '内部加油',
            data: [],
            color: '#26C6DA'
        },
        {
            name: '外部加油',
            data: [],
            color: '#FF7E7E'
        }
    ];

    // 货车加油金额按月统计
    var truckRefuelingMoneyCountMonth = [
        {
            name: '内部加油',
            data: [],
            color: '#26C6DA'
        },
        {
            name: '外部加油',
            data: [],
            color: '#FF7E7E'
        }
    ];

    // 货车加油量按周统计
    var truckRefuelingVolCountWeek = [
        {
            name: '内部加油',
            data: [],
            color: '#26C6DA'
        },
        {
            name: '外部加油',
            data: [],
            color: '#FF7E7E'
        }
    ];

    // 货车加油金额按周统计
    var truckRefuelingMoneyCountWeek = [
        {
            name: '内部加油',
            data: [],
            color: '#26C6DA'
        },
        {
            name: '外部加油',
            data: [],
            color: '#FF7E7E'
        }
    ];

    // 点击搜索按钮根据日期搜索货车加油信息
    $scope.searchTruckRefuelingCount = function () {
        var monthStart = $("#chooseMileageStart").val();
        var monthEnd = $("#chooseMileageEnd").val();
        $scope.getTruckRefuelingMonthInfo(monthStart, monthEnd)
    };

    // 获取货车加油按月统计信息
    $scope.getTruckRefuelingMonthInfo = function (start, end) {
        if (start === undefined) {
            start = $scope.startInitial
        }
        if (end === undefined) {
            end = $scope.endInitial
        }
        _basic.get($host.api_url + "/refuelMonthStat?monthStart=" + start + "&monthEnd=" + end).then(function (data) {
            if (data.success === true) {
                // 货车加油X轴月份
                $scope.refuelingVolMonth = [];
                $scope.refuelingMoneyMonth = [];
                // 初始化统计数
                truckRefuelingVolCountMonth[0].data = [];
                truckRefuelingVolCountMonth[1].data = [];
                truckRefuelingMoneyCountMonth[0].data = [];
                truckRefuelingMoneyCountMonth[1].data = [];
                if(data.result.length > 0){
                    for (var i = 0; i < data.result.length; i++) {
                        if(data.result[i].refuel_address_type === 1){
                            truckRefuelingVolCountMonth[0].data.push(Math.ceil(data.result[i].total_vol));
                            truckRefuelingMoneyCountMonth[0].data.push(Math.ceil(data.result[i].total_money));
                            if($scope.refuelingVolMonth.indexOf(data.result[i].y_month) === -1){
                                $scope.refuelingVolMonth.push(data.result[i].y_month);
                            }
                        }
                        else{
                            truckRefuelingVolCountMonth[1].data.push(Math.ceil(data.result[i].total_vol));
                            truckRefuelingMoneyCountMonth[1].data.push(Math.ceil(data.result[i].total_money));
                            if($scope.refuelingMoneyMonth.indexOf(data.result[i].y_month) === -1){
                                $scope.refuelingMoneyMonth.push(data.result[i].y_month);
                            }
                        }
                    }
                }
                $scope.showTruckRefueling_month();
                $scope.showTruckRefuelingMoney_month();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取货车加油按周统计信息
    $scope.getTruckRefuelingWeekInfo = function () {
        _basic.get($host.api_url + "/refuelWeekStat?start=0&size=10").then(function (data) {
            if (data.success === true) {
                // 货车加油X轴周数
                $scope.refuelingVolWeek = [];
                $scope.refuelingMoneyWeek = [];
                // 初始化统计数
                truckRefuelingVolCountWeek[0].data = [];
                truckRefuelingVolCountWeek[1].data = [];
                truckRefuelingMoneyCountWeek[0].data = [];
                truckRefuelingMoneyCountWeek[1].data = [];
                if(data.result.length > 0){
                    for (var i = 0; i < data.result.length; i++) {
                        if(data.result[i].refuel_address_type === 1){
                            truckRefuelingVolCountWeek[0].data.push(Math.ceil(data.result[i].total_vol));
                            truckRefuelingMoneyCountWeek[0].data.push(Math.ceil(data.result[i].total_money));
                            if($scope.refuelingVolWeek.indexOf(data.result[i].y_week) === -1){
                                $scope.refuelingVolWeek.push(data.result[i].y_week);
                            }
                        }
                        else{
                            truckRefuelingVolCountWeek[1].data.push(Math.ceil(data.result[i].total_vol));
                            truckRefuelingMoneyCountWeek[1].data.push(Math.ceil(data.result[i].total_money));
                            if($scope.refuelingMoneyWeek.indexOf(data.result[i].y_week) === -1){
                                $scope.refuelingMoneyWeek.push(data.result[i].y_week);
                            }
                        }
                    }
                }
                $scope.showTruckRefueling_week();
                $scope.showTruckRefuelingMoney_week();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 显示货车加油量按月统计折线图
    $scope.showTruckRefueling_month = function () {
        $("#truckRefuelingMonth").highcharts({
            title: {
                text: '加油量统计',
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
                categories: $scope.refuelingVolMonth,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '升(L)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
                '<td style="padding:0"><b>{point.y:.1f} 升</b></td></tr>',
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
            series: truckRefuelingVolCountMonth
        });
    };

    // 显示货车加油金额按月统计折线图
    $scope.showTruckRefuelingMoney_month = function () {
        $("#truckRefuelingMoneyMonth").highcharts({
            title: {
                text: '加油金额统计',
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
                categories: $scope.refuelingMoneyMonth,
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
            series: truckRefuelingMoneyCountMonth
        });
    };

    // 显示货车加油量按周统计折线图
    $scope.showTruckRefueling_week = function () {
        $("#truckRefuelingWeek").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '加油量统计',
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
                categories: $scope.refuelingVolWeek,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '升(L)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
                '<td style="padding:0"><b>{point.y:.1f} 升</b></td></tr>',
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
            series: truckRefuelingVolCountWeek
        });
    };

    // 显示货车加油金额按周统计折线图
    $scope.showTruckRefuelingMoney_week = function () {
        $("#truckRefuelingMoneyWeek").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '加油金额统计',
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
                categories: $scope.refuelingMoneyWeek,
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
            series: truckRefuelingMoneyCountWeek
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getTruckRefuelingMonthInfo();
        $scope.getTruckRefuelingWeekInfo()
    };
    $scope.queryData();
}]);