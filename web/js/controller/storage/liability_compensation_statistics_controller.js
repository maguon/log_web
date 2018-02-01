app.controller("liability_compensation_statistics_controller", ["$scope", "$host", "_basic", "baseService", function ($scope, $host, _basic,baseService) {
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');
    // monthPicker控件
    $('#chooseCarWashFeeStartMonth,#chooseCarWashFeeEndMonth').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });
    $scope.start = 0;
    $scope.size = 10;
    // 企业赔偿金额按月统计
    var companyCountMonth = [{
        name: '企业承担赔偿',
        data: [],
        color: '#26C6DA'
    }];
    // 个人责任赔偿金额按月统计
    var personalCountMonth = [{
        name: '个人承担赔偿',
        data: [],
        color: '#FF7E7E'
    }];
    // 企业赔偿金额按周统计
    var companyCountWeek = [{
        name: '企业承担赔偿',
        data: [],
        color: '#26C6DA'
    }];
    // 个人责任赔偿金额按周统计
    var personalCountWeek = [{
        name: '个人承担赔偿',
        data: [],
        color: '#FF7E7E'
    }];
    // 显示个人责任赔偿金额按月统计柱状图
    function createPersonMonthChart() {
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
                categories:$scope.moneyMonth,
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
            series: personalCountMonth
        });
    };
    // 显示个人责任赔偿金额按周统计柱状图
     function createPersonWeekChart () {
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
                categories:$scope.moneyWeek,
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
            series: personalCountWeek
        });
    };
    // 显示企业责任赔偿金额按月统计柱状图
    function createCompanyMonthChart () {
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
                categories:$scope.moneyMonth,
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
            series: companyCountMonth
        });
    };
    // 显示企业责任赔偿金额按周统计柱状图
    function createCompanyWeekChart() {
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
                categories: $scope.moneyWeek,
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
            series: companyCountWeek
        });
    };
    //通过接口获取个人承担和企业按月承担数据   根据日期搜索公司赔付信息
    $scope.queryCount = function () {
        var monthStart = $("#chooseCarWashFeeStartMonth").val();
        var monthEnd = $("#chooseCarWashFeeEndMonth").val();
        if(monthStart==''||monthStart == null||monthEnd==''||monthEnd == null){
            monthStart= $scope.startInitial;
            monthEnd=$scope.endInitial;
            swal('请输入完整的时间信息', "", "error");
        }
        companyAndPersonMonth(monthStart, monthEnd);
        $scope.personMonthTop(monthStart, monthEnd);
    };
    // 公司赔付 和个人赔付
    function companyAndPersonMonth(start,end){
        var obj = {
            monthStart:start,
            monthEnd: end
        }
        _basic.get($host.api_url + "/damageCheckMonthStat?"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true){
                data.result.reverse();
                // X轴月份
                // console.log(data)
                $scope.moneyMonth = [];
                // 初始化金额数
                companyCountMonth[0].data = [];
                personalCountMonth[0].data = [];
                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    $scope.moneyMonth.push(data.result[i].y_month);
                    companyCountMonth[0].data.push(data.result[i].company_cost);
                    personalCountMonth[0].data.push(data.result[i].under_cost);
                }
                createCompanyMonthChart();
                createPersonMonthChart();
            } else{
                swal(data.msg, "", "error");
            }
        });
    }
    $scope.personMonthTop  = function(start,end) {
         var obj = {
             monthStart:start,
             monthEnd: end
         }
        _basic.get($host.api_url + "/damageCheckUnderMonthStat?"+_basic.objToUrl(obj)+"&start="+ $scope.start+"&size="+ $scope.size ).then(function (data) {
            if (data.success === true){
                //console.log(data)
                console.log($host.api_url + "/damageCheckUnderMonthStat?"+_basic.objToUrl(obj)+"&start="+ $scope.start+"&size="+ $scope.size )
                var maxCost = parseFloat(data.result[0].total_under_cost);
                for (var i = 0; i < data.result.length; i++) {
                    var pecentage = parseInt(data.result[i].total_under_cost/maxCost*100);
                    data.result[i].percentage = pecentage;
                }
                $scope.personMouthList = data.result;
            } else{
                swal(Data.msg, "", "error");
            }
        });
    };
    //通过接口获取个人承担和企业按周承担数据
    function companyAndPersonWeek() {
     _basic.get($host.api_url + "/damageCheckWeekStat?start=" + $scope.start + "&size=" + $scope.size).then(function (data) {
         if (data.success == true) {
             data.result.reverse();
             $scope.statisticsTop10 = data.result;
             $scope.statistics =  $scope.statisticsTop10.slice(0, 10);
             console.log($scope.statistics)
            // $scope.statistics.reverse();
        // X轴月份
        //console.log(Data)
        $scope.moneyWeek = [];
        // 初始化金额数
        companyCountWeek[0].data = [];
        personalCountWeek[0].data = [];
        // 赋予柱状图金额数组
        for (var i = 0; i < data.result.length; i++) {
            $scope.moneyWeek.push(data.result[i].y_week);
            companyCountWeek[0].data.push(data.result[i].company_cost);
            personalCountWeek[0].data.push(data.result[i].under_cost);
        }
        createCompanyWeekChart();
        createPersonWeekChart();
    } else {
        swal(data.msg, "", "error");
    }
});
}
    // 个人承担赔偿费top10周数据
    $scope.personWeekTop = function () {
            _basic.get($host.api_url + "/damageCheckUnderWeekStat?start="+ $scope.start+"&size="+ $scope.size+'&yWeek='+baseService.getWeek()
                ).then(function (data) {
                if (data.success === true){
                    // X轴月份
                    if(data.result[0]==null||data.result[0]==undefined)
                    {
                        return
                    }
                    // 初始化金额数
                    // 赋予柱状图金额数组
                    var maxCost = parseFloat(data.result[0].total_under_cost);
                    for (var i = 0; i < data.result.length; i++) {
                        var pecentage = parseInt(data.result[i].total_under_cost/maxCost*100);
                        data.result[i].percentage = pecentage;
                    }
                    $scope.personWeekList = data.result;
                }
                else{
                    swal(data.msg, "", "error");
                }
            });
        };
        // 获取数据
    $scope.queryData = function () {
        createPersonMonthChart();
        createPersonWeekChart();
        createCompanyMonthChart();
        createCompanyWeekChart();
        $scope.personWeekTop($scope.startInitial,$scope.endInitial);
        companyAndPersonWeek();
        companyAndPersonMonth($scope.startInitial,$scope.endInitial);
    };
    $scope.queryData();
}]);