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
            name: '按月统计',
            data: [],
            color: '#26C6DA'
        }
    ];

    // 货车加尿素量按月统计
    var truckUreaVolCountMonth = [
        {
            name: '按月统计',
            data: [],
            color: '#26C6DA'
        }
    ];

    // 超量金额按月统计
    var truckRefuelingMoneyCountMonth = [
        {
            name: '按月统计',
            data: [],
            color: '#26C6DA'
        }
    ];

    // 货车加油量按周统计
    var truckRefuelingVolCountWeek = [
        {
            name: '按周统计',
            data: [],
            color: '#26C6DA'
        }
    ];

    // 货车加尿素量按周统计
    var truckUreaVolCountWeek = [
        {
            name: '按周统计',
            data: [],
            color: '#26C6DA'
        }
    ];

    // 货车加油金额按周统计
    var truckRefuelingMoneyCountWeek = [
        {
            name: '按周统计',
            data: [],
            color: '#26C6DA'
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
        _basic.get($host.api_url + "/driveExceedOilRelMonthStat?paymentStatus=1&monthStart=" + start + "&monthEnd=" + end).then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // 货车加油X轴月份
                $scope.refuelingVolMonth = [];
                // 初始化统计数
                truckRefuelingVolCountMonth[0].data = [];
                truckRefuelingMoneyCountMonth[0].data = [];
                // 货车加油X轴月份
                $scope.ureaVolMonth = [];
                // 初始化统计数
                truckUreaVolCountMonth[0].data = [];
                if(data.result.length > 0){
                    for (var i = 0; i < data.result.length; i++) {
                            truckRefuelingVolCountMonth[0].data.push(Math.ceil(data.result[i].oil));
                            truckUreaVolCountMonth[0].data.push(Math.ceil(data.result[i].urea));
                            if($scope.refuelingVolMonth.indexOf(data.result[i].y_month) === -1){
                                $scope.refuelingVolMonth.push(data.result[i].y_month);
                            }
                            if($scope.ureaVolMonth.indexOf(data.result[i].y_month) === -1){
                                $scope.ureaVolMonth.push(data.result[i].y_month);
                            }
                    }
                 }

                $scope.showTruckRefueling_month();
                $scope.showTruckUrea_month();

            }
            else {
                swal(data.msg, "", "error");
            }
        });


        _basic.get($host.api_url + "/driveExceedOilMoneyMonthStat?checkStatus=3&monthStart=" + start + "&monthEnd=" + end).then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // 货车加油X轴月份
                $scope.refuelingMoneyMonth = [];
                // 初始化统计数
                truckRefuelingMoneyCountMonth[0].data = [];
                if(data.result.length > 0){
                    for (var i = 0; i < data.result.length; i++) {
                        truckRefuelingMoneyCountMonth[0].data.push(Math.ceil(data.result[i].actual_money));
                        if($scope.refuelingMoneyMonth.indexOf(data.result[i].y_month) === -1){
                            $scope.refuelingMoneyMonth.push(data.result[i].y_month);
                        }
                    }
                }
                $scope.showTruckRefuelingMoney_month();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };


    // 获取货车加油按周统计信息
    $scope.getTruckRefuelingWeekInfo = function () {
        _basic.get($host.api_url + "/driveExceedOilRelWeekStat?paymentStatus=1&start=0&size=10").then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // 货车加油X轴周数
                $scope.refuelingVolWeek = [];
                // 初始化统计数
                truckRefuelingVolCountWeek[0].data = [];
                // 货车加油X轴周数
                $scope.ureaVolWeek = [];
                // 初始化统计数
                truckUreaVolCountWeek[0].data = [];
                // 货车加油X轴周数
                $scope.refuelingMoneyWeek = [];
                // 初始化统计数
                truckRefuelingMoneyCountWeek[0].data = [];

                if(data.result.length > 0){
                    for (var i = 0; i < data.result.length; i++) {
                            truckRefuelingVolCountWeek[0].data.push(Math.ceil(data.result[i].oil));
                            truckUreaVolCountWeek[0].data.push(Math.ceil(data.result[i].urea));
                            truckRefuelingMoneyCountWeek[0].data.push(Math.ceil(data.result[i].oil_money));
                            if($scope.refuelingVolWeek.indexOf(data.result[i].y_week) === -1){
                                $scope.refuelingVolWeek.push(data.result[i].y_week);
                            }
                            if($scope.ureaVolWeek.indexOf(data.result[i].y_week) === -1){
                                $scope.ureaVolWeek.push(data.result[i].y_week);
                            }

                            if($scope.refuelingMoneyWeek.indexOf(data.result[i].y_week) === -1){
                                $scope.refuelingMoneyWeek.push(data.result[i].y_week);
                            }
                    }
                }

                $scope.showTruckRefuelingMoney_week();
                $scope.showTruckUrea_week();
                $scope.showTruckRefueling_week();
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

    // 显示货车加尿素按月统计折线图
    $scope.showTruckUrea_month =function (){
        $("#truckUreaMonth").highcharts({
            title: {
                text: '加尿素统计',
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
                categories: $scope.ureaVolMonth,
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
            series: truckUreaVolCountMonth
        });
    }


    // 显示货车加油金额按月统计折线图
    $scope.showTruckRefuelingMoney_month = function () {
        $("#truckRefuelingMoneyMonth").highcharts({
            title: {
                text: '超量金额统计',
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
              /*  min: 0,*/
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

    // 显示货车加油量按周统计折线图
    $scope.showTruckUrea_week = function () {
        $("#truckUreaWeek").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '加尿素统计',
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
                categories: $scope.ureaVolWeek,
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
            series: truckUreaVolCountWeek
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