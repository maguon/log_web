app.controller("vehicle_repair_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');
    // monthPicker控件
    $('#chooseRepairStart,#chooseRepairEnd').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });
    $scope.start = 0;
    $scope.size = 10;
    var month;
    var week;
    // 维修金额按月统计
    var repairMoneyCountMonth = [{
        name: '按月统计',
        data: [],
        color:'#26C6DA'
    }];
    // 维修金额按周统计
    var repairMoneyCountWeek = [{
        name: '按周统计',
        data: [],
        color:'#FF7E7E'
    }];
    // 显示商品车维修金额按月统计柱状图
    function showVehicleRepairHistogramMonth () {
        $("#vehicleRepairStatisticsMonth").highcharts({
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
            series: repairMoneyCountMonth
        });
    };
    // 显示商品车维修金额按周统计柱状图
    function showVehicleRepairHistogramWeek () {
        $("#vehicleRepairStatisticsWeek").highcharts({
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
            series: repairMoneyCountWeek
        });
    };
    //通过接口获取个人承担和企业按月承担数据   根据日期搜索公司赔付信息
    $scope.queryRepairDate = function () {
        var monthStart = $("#chooseRepairStart").val();
        var monthEnd = $("#chooseRepairEnd").val();
        if(monthStart==''||monthStart == null||monthEnd==''||monthEnd == null){
            monthStart= $scope.startInitial;
            monthEnd=$scope.endInitial;
            swal('请输入完整的时间信息', "", "error");
        }
        vehicleRepairMonth(monthStart, monthEnd);
    };
    function vehicleRepairMonth(start,end){
        var obj = {
            monthStart:start,
            monthEnd: end
        };
        _basic.get($host.api_url + "/damageCheckMonthStat?&"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true){
                data.result.reverse();
                // X轴月份
                // console.log(data)
                month = [];
                // 初始化金额数
                repairMoneyCountMonth[0].data = [];
                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    month.push(data.result[i].y_month);
                    repairMoneyCountMonth[0].data.push(data.result[i].repair_cost);
                }
                showVehicleRepairHistogramMonth();
            } else{
                swal(data.msg, "", "error");
            }
        });
    }
    //通过接口获取个人承担和企业按周承担数据
    function vehicleRepaiWeek() {
        _basic.get($host.api_url + "/damageCheckWeekStat?start=" + $scope.start + "&size=" + $scope.size).then(function (data) {
            if (data.success == true) {
                data.result.reverse();
                // $scope.statisticsTop10 = data.result;
                // $scope.statistics =  $scope.statisticsTop10.slice(0, 10);
                // X轴月份
                week = [];
                // 初始化金额数
                repairMoneyCountWeek[0].data = [];
                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    week.push(data.result[i].y_week);
                    repairMoneyCountWeek[0].data.push(data.result[i].repair_cost);
                }
                showVehicleRepairHistogramWeek();
            } else {
                swal(data.msg, "", "error");
            }
        });
    }
    // 获取数据
    $scope.queryData = function () {
        vehicleRepairMonth($scope.startInitial,$scope.endInitial);
        vehicleRepaiWeek();
    };
    $scope.queryData();
}]);