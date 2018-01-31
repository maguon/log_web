app.controller("liability_compensation_statistics_controller", ["$scope", "$host", "_basic", "baseService", function ($scope, $host, _basic,baseService) {
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');
    // monthPicker控件
    $('#chooseCarWashFeeStart_month,#chooseCarWashFeeEnd_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });
    $scope.start = 0;
    $scope.size = 10;


    // 企业赔偿金额按月统计
    var companyCompensateCountMonth = [{
        name: '企业承担赔偿',
        data: [],
        color: '#26C6DA'
    }];
    // 个人责任赔偿金额按月统计
    var personalCompensateCountMonth = [{
        name: '个人承担赔偿',
        data: [],
        color: '#FF7E7E'
    }];
    // 企业赔偿金额按周统计
    var companyCompensateCountWeek = [{
        name: '企业承担赔偿',
        data: [],
        color: '#26C6DA'
    }];
    // 个人责任赔偿金额按周统计
    var personalCompensateCountWeek = [{
        name: '个人承担赔偿',
        data: [],
        color: '#FF7E7E'
    }];
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
            series: companyCompensateCountWeek
        });
    };
    //通过接口获取个人承担和企业按月承担数据
    $scope.searchColumnInfo = function (start,end) {
        if(start === undefined){
            start = $scope.startInitial
        }
        if(end === undefined){
            end = $scope.endInitial
        }
        mouth_all();
        personMonthTop();
        // 公司赔付 和个人赔付
        function mouth_all(){
            _basic.get($host.api_url + "/damageCheckMonthStat?monthStart=" + start + "&monthEnd=" + end  ).then(function (data) {
                if (data.success === true){
                    data.result.reverse();
                    // X轴月份
                    // console.log(Data)
                    $scope.moneyMonth = [];
                    // 初始化金额数
                    companyCompensateCountMonth[0].data = [];
                    personalCompensateCountMonth[0].data = [];

                    // 赋予柱状图金额数组
                    for (var i = 0; i < data.result.length; i++) {
                        if($scope.moneyMonth.indexOf(data.result[i].y_month) === -1){
                            $scope.moneyMonth.push(data.result[i].y_month);
                            //console.log( $scope.moneyMonth)
                        }
                        companyCompensateCountMonth[0].data.push(data.result[i].company_cost);
                        personalCompensateCountMonth[0].data.push(data.result[i].under_cost);
                    }
                    $scope.showCompanyLiabilityCompensation_month();
                    $scope.showPersonalLiabilityCompensation_month();
                }
                else{
                    swal(data.msg, "", "error");
                }
            });
        }
         function personMonthTop () {
            _basic.get($host.api_url + "/damageCheckUnderMonthStat?start="+ $scope.start+"&size="+ $scope.size +"&monthStart=" + start + "&monthEnd=" + end).then(function (data) {
                if (data.success === true){
                    // X轴月份
                    $scope.moneyArray = [];
                    $scope.nameArr = [];
                    // 初始化金额数
                    // companyCompensateCountMonth[0].data = [];
                    // 赋予柱状图金额数组
                    var maxCost = parseFloat(data.result[0].total_under_cost);
                    for (var i = 0; i < data.result.length; i++) {
                        var pecentage = parseInt(data.result[i].total_under_cost/maxCost*100);
                        data.result[i].percentage = pecentage;
                    }
                    $scope.personMouthList = data.result;
                    //console.log(data.result)
                }
                else{
                    swal(Data.msg, "", "error");
                }
            });
        };

    };
    // 根据日期搜索公司赔付信息
    $scope.searchRepairCount = function () {
        var monthStart = $("#chooseCarWashFeeStart_month").val();
        var monthEnd = $("#chooseCarWashFeeEnd_month").val();
        $scope.searchColumnInfo(monthStart,monthEnd);
    };
    //通过接口获取个人承担和企业按周承担数据
    _basic.get($host.api_url + "/damageCheckWeekStat?start="+ $scope.start+"&size="+ $scope.size ).then(function (data) {
        if (data.success === true){
            data.result.reverse();
            // X轴月份
            //console.log(Data)
            $scope.moneyWeek = [];
            // 初始化金额数
            companyCompensateCountWeek[0].data = [];
            personalCompensateCountWeek[0].data = [];

            // 赋予柱状图金额数组
            for (var i = 0; i < data.result.length; i++) {
                if($scope.moneyWeek.indexOf(data.result[i].y_week) === -1){
                    $scope.moneyWeek.push(data.result[i].y_week);
                    //console.log( $scope.moneyMonth)
                }
                companyCompensateCountWeek[0].data.push(data.result[i].company_cost);
                personalCompensateCountWeek[0].data.push(data.result[i].under_cost);
            }
            $scope.showCompanyLiabilityCompensation_week();
            $scope.showPersonalLiabilityCompensation_week();
        }
        else{
            swal(data.msg, "", "error");
        }
    });
    // 个人承担赔偿费top10周数据
    $scope.personWeekTop = function () {
        _basic.get($host.api_url + "/damageCheckUnderWeekStat?start="+ $scope.start+"&size="+ $scope.size+'&yWeek='+baseService.getWeek()
            ).then(function (data) {
            if (data.success === true){
                // X轴月份
                 console.log(data)
                if(data.result[0]==null||data.result[0]==undefined)
                {
                    return
                }

                $scope.moneyArray = [];
                $scope.nameArr = [];
                // 初始化金额数
                // companyCompensateCountMonth[0].data = [];
                // 赋予柱状图金额数组
                var maxCost = parseFloat(data.result[0].total_under_cost);
                for (var i = 0; i < data.result.length; i++) {
                    var pecentage = parseInt(data.result[i].total_under_cost/maxCost*100);
                    data.result[i].percentage = pecentage;
                }
                $scope.personWeekList = data.result;
                //console.log(data.result)
            }
            else{
                swal(Data.msg, "", "error");
            }
        });
    };
    // 获取数据
    $scope.queryData = function () {
        $scope.showPersonalLiabilityCompensation_month();
        $scope.showPersonalLiabilityCompensation_week();
        $scope.showCompanyLiabilityCompensation_month();
        $scope.showCompanyLiabilityCompensation_week();
        $scope.personWeekTop();
        $scope.searchColumnInfo();
    };
    $scope.queryData();
}]);