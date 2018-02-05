app.controller("vehicle_damage_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');
    // monthPicker控件
    $('#chooseRepairStart,#chooseRepairEnd').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });
    $scope.start = 0;
    $scope.size = 20;
    var month;
    var week;
    // 商品车质损按月统计
    var carDamageCountMonth = [
        {
            name: '一般质损',
            data: [],
            color: '#FF7E7E'
        },
        {
            name: '严重质损',
            data: [],
            color: '#26C6DA'
        }
    ];
    // 商品车质损按周统计
    var carDamageCountWeek = [
        {
            name: '一般质损',
            data: [],
            color: '#FF7E7E'
        },
        {
            name: '严重质损',
            data: [],
            color: '#26C6DA'
        }
    ];
    // 显示商品车质损金额按月统计折线图
    function showVehicleDamageHistogramMonth () {
        $("#carDamageStatisticsMonth").highcharts({
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories:month,
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
    function showVehicleDamageHistogramWeek () {
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
                categories:week,
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
    // 按月
    function vehicleDamageMonth(start,end){
        var obj = {
            monthStart:start,
            monthEnd: end
        }
        _basic.get($host.api_url + "/damageTypeMonthStat?damageStatus=3&"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true){
                // data.result.reverse();
                // X轴月份
                month = [];
                // 初始化金额数
                carDamageCountMonth[0].data = [];
                carDamageCountMonth[1].data = [];
                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    if(month.indexOf(data.result[i].y_month) === -1){
                        month.push(data.result[i].y_month);
                    }
                    if(data.result[i].id==1){
                        carDamageCountMonth[0].data.push(data.result[i].damage_count);
                    }
                    else if(data.result[i].id==2){
                        carDamageCountMonth[1].data.push(data.result[i].damage_count);
                    }
                }
                showVehicleDamageHistogramMonth();
            } else{
                swal(data.msg, "", "error");
            }
        });
    }
    //通过接口获取时间
    $scope.selectDamageDate = function () {
        var monthStart = $("#chooseRepairStart").val();
        var monthEnd = $("#chooseRepairEnd").val();
        if(monthStart==''||monthStart == null||monthEnd==''||monthEnd == null){
            monthStart= $scope.startInitial;
            monthEnd=$scope.endInitial;
            swal('请输入完整的时间信息', "", "error");
        }
        vehicleRepairMonth(monthStart, monthEnd);
    };
    //按周
    function vehicleDamageWeek() {
        _basic.get($host.api_url + "/damageTypeWeekStat?damageStatus=3&start=" + $scope.start + "&size=" + $scope.size).then(function (data) {
            if (data.success == true) {
                data.result.reverse();
                // X轴月份
                week = [];
                // 初始化金额数
                carDamageCountWeek[0].data = [];
                carDamageCountWeek[1].data = [];
                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    if(week.indexOf(data.result[i].y_week) === -1){
                        week.push(data.result[i].y_week);
                    }
                    if(data.result[i].id==1){
                        carDamageCountWeek[0].data.push(data.result[i].damage_count);
                    }
                    else if(data.result[i].id==2){
                        carDamageCountWeek[1].data.push(data.result[i].damage_count);
                    }
                }
                showVehicleDamageHistogramWeek();
            } else {
                swal(data.msg, "", "error");
            }
        });
    }
    // 获取数据
    $scope.queryData = function () {
        vehicleDamageMonth($scope.startInitial,$scope.endInitial);
        vehicleDamageWeek();
    };
    $scope.queryData();
}]);