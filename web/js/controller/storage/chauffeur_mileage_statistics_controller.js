app.controller("chauffeur_mileage_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 日期初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');

    // monthPicker控件
    $('#chooseMileageStart,#chooseMileageEnd').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 司机里程按月统计
    var chauffeurMileageCountMonth = [
        {
            name: '重载里程',
            data: [],
            color: '#26C6DA'
        },
        {
            name: '空载里程',
            data: [],
            color: '#FF7E7E'
        }
    ];

    // 司机里程按周统计
    var chauffeurMileageCountWeek = [
        {
            name: '重载里程',
            data: [],
            color: '#26C6DA'
        },
        {
            name: '空载里程',
            data: [],
            color: '#FF7E7E'
        }
    ];

    // 点击搜索按钮根据日期搜索司机里程信息
    $scope.searchMileageCount = function () {
        var monthStart = $("#chooseMileageStart").val();
        var monthEnd = $("#chooseMileageEnd").val();
        $scope.getMileageCountMonthInfo(monthStart, monthEnd)
    };

    // 获取司机里程按月统计信息
    $scope.getMileageCountMonthInfo = function (start, end) {
        if (start === undefined) {
            start = $scope.startInitial
        }
        if (end === undefined) {
            end = $scope.endInitial
        }
        _basic.get($host.api_url + "/distanceMonthStat?monthStart=" + start + "&monthEnd=" + end).then(function (data) {
            if (data.success === true) {
                // 司机里程X轴月份
                $scope.mileageMonth = [];
                // 初始化统计数
                chauffeurMileageCountMonth[0].data = [];
                chauffeurMileageCountMonth[1].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    if($scope.mileageMonth.indexOf(data.result[i].y_month) === -1){
                        $scope.mileageMonth.push(data.result[i].y_month);
                    }
                    chauffeurMileageCountMonth[0].data.push(Math.ceil(data.result[i].load_distance));
                    chauffeurMileageCountMonth[1].data.push(Math.ceil(data.result[i].no_load_distance));
                }
                $scope.showChauffeurMileage_month();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取司机里程按周统计信息
    $scope.getMileageCountWeekInfo = function () {
        _basic.get($host.api_url + "/distanceWeekStat?start=0&size=10").then(function (data) {
            if (data.success === true) {
                // 司机里程X轴按周统计
                $scope.mileageWeek = [];
                // 初始化统计数
                chauffeurMileageCountWeek[0].data = [];
                chauffeurMileageCountWeek[1].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    if($scope.mileageWeek.indexOf(data.result[i].y_week) === -1){
                        $scope.mileageWeek.push(data.result[i].y_week);
                    }
                    chauffeurMileageCountWeek[0].data.push(Math.ceil(data.result[i].load_distance));
                    chauffeurMileageCountWeek[1].data.push(Math.ceil(data.result[i].no_load_distance));
                }
                $scope.showChauffeurMileage_week();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 显示司机里程按月统计折线图
    $scope.showChauffeurMileage_month = function () {
        $("#chauffeurMileageMonth").highcharts({
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: $scope.mileageMonth,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '里程(km)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
                '<td style="padding:0"><b>{point.y:.1f} km</b></td></tr>',
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
            series: chauffeurMileageCountMonth
        });
    };

    // 显示司机里程按周统计折线图
    $scope.showChauffeurMileage_week = function () {
        $("#chauffeurMileageWeek").highcharts({
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
                categories: $scope.mileageWeek,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '里程(km)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                '<td style="padding:0"><b>{point.y:.1f} km</b></td></tr>',
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
            series: chauffeurMileageCountWeek
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getMileageCountMonthInfo();
        $scope.getMileageCountWeekInfo()
    };
    $scope.queryData();
}]);