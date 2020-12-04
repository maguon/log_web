app.controller("hotspot_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    // 获取当前年月
    var currentMonth = moment(new Date()).format('YYYYMM');
    var year = currentMonth.toString().slice(0,4);
    var month =currentMonth.toString().slice(4,6);
    // 上个月
    var lastMonth = moment(new Date(year,month-2,1)).format("YYYYMM");
    // 路线TAB 月份 上个月
    $scope.routeMonth = lastMonth;
    // 经销商TAB
    $scope.dealerMonth = lastMonth;
    // 委托方TAB
    $scope.entrustMonth = lastMonth;
    
    // monthPicker控件
    $('#routeMonth,#dealerMonth,#entrustMonth').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // TAB1：路线
    $scope.showRoute = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.route').addClass("active");
        $("#route").addClass("active");
        $("#route").show();
        // 载入路线统计图
        $scope.queryRouteStatistics();
    };

    // TAB1：载入路线统计图
    $scope.queryRouteStatistics = function () {
        var routeMonth = $("#routeMonth").val();
        if(routeMonth==''||routeMonth == null){
            routeMonth= $scope.routeMonth;
        }
        getRouteStatistics(routeMonth);
    };
    function getRouteStatistics(routeMonth){
        //获取当月第一天和最后一天
        var firstDay=new Date(routeMonth.slice(0,4),routeMonth.slice(4,6)-1,1);//这个月的第一天
        var nextMonthFirstDay=new Date(firstDay.getFullYear(),firstDay.getMonth()+1,1);//加1获取下个月第一天
        var dis=nextMonthFirstDay.getTime()-24*60*60*1000;//减去一天就是这个月的最后一天
        var lastDay=new Date(dis);
        firstDay= moment(firstDay).format("YYYYMMDD");
        lastDay= moment(lastDay).format("YYYYMMDD");

        var obj = {
            dateStart:firstDay,
            dateEnd: lastDay
        };

        var url = $host.api_url + "/routeStat?start=0&size=20&"+_basic.objToUrl(obj);
        _basic.get(url).then(function (data) {
            if (data.success){
                // data.result.reverse();
                // X轴
                let xAxisData = [];
                // y轴
                let yAxisData = [{name: '次数',data: []}];

                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    xAxisData.push(data.result[i].route_start_name + ' - ' + data.result[i].route_end_name);
                    yAxisData[0].data.push(data.result[i].countRout);
                }
                createRouteChartOptions(xAxisData, yAxisData);
            } else{
                swal(data.msg, "", "error");
            }
        });
    }
    // 初始化 路线柱状图
    function createRouteChartOptions(xAxisData, yAxisData) {
        $("#routeStatisticsMonth").highcharts({
            // bar: 条形图，line：折线图，column：柱状图
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
                // xAxisData
                categories:xAxisData,
                crosshair: true
            },
            yAxis: {
                min: 0,
                // 可用的值有 "low"，"middle" 和 "high"，分别表示于最小值对齐、居中对齐、与最大值对齐。 默认是：middle.
                // align: 'middle',
                title: {
                    text: '次'
                }
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
            // yAxisData
            series: yAxisData
        });
    }

    // TAB2：经销商
    $scope.showDealer = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.dealer').addClass("active");
        $("#dealer").addClass("active");
        $("#dealer").show();
        // 选择框 默认：0-非库
        $scope.receiveFlag = 0;
        // 载入经销商统计图
        $scope.queryDealerStatistics();
    };

    // TAB2：载入经销商统计图
    $scope.queryDealerStatistics = function () {
        var dealerMonth = $("#dealerMonth").val();
        if(dealerMonth==''||dealerMonth == null){
            dealerMonth= $scope.dealerMonth;
        }
        getDealerStatistics(dealerMonth);
    };
    function getDealerStatistics(dealerMonth){
        //获取当月第一天和最后一天
        var year = dealerMonth.slice(0,4);
        var month =dealerMonth.slice(4,6);
        var firstDay=new Date(year,month-1,1);//这个月的第一天
        var currentMonth=firstDay.getMonth(); //取得月份数
        var nextMonthFirstDay=new Date(firstDay.getFullYear(),currentMonth+1,1);//加1获取下个月第一天
        var dis=nextMonthFirstDay.getTime()-24*60*60*1000;//减去一天就是这个月的最后一天
        var lastDay=new Date(dis);
        firstDay= moment(firstDay).format("YYYYMMDD");//格式化 //这个格式化方法要用你们自己的，也可以用本文已经贴出来的下面的Format
        lastDay= moment(lastDay).format("YYYYMMDD");//格式化

        var obj = {
            receiveFlag:$scope.receiveFlag,
            dateStart:firstDay,
            dateEnd: lastDay
        };

        var url = $host.api_url + "/receiveStat?start=0&size=20&"+_basic.objToUrl(obj);
        _basic.get(url).then(function (data) {
            if (data.success){
                // data.result.reverse();
                // X轴
                let xAxisData = [];
                // y轴
                let yAxisData = [{name: '次数',data: []}];

                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    xAxisData.push(data.result[i].short_name);
                    yAxisData[0].data.push(data.result[i].countRealCar);
                }
                createDealerChartOptions(xAxisData, yAxisData);
            } else{
                swal(data.msg, "", "error");
            }
        });
    }

    // 初始化 路线柱状图
    function createDealerChartOptions(xAxisData, yAxisData) {
        $("#dealerStatisticsMonth").highcharts({
            // bar: 条形图，line：折线图，column：柱状图
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
                // xAxisData
                categories:xAxisData,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '次'
                }
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
            // yAxisData
            series: yAxisData
        });
    }

    // TAB3：委托方
    $scope.showEntrust = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.entrust').addClass("active");
        $("#entrust").addClass("active");
        $("#entrust").show();
        // 载入委托方统计图
        $scope.queryEntrustStatistics();
    };

    // TAB3：载入委托方统计图
    $scope.queryEntrustStatistics = function () {
        var entrustMonth = $("#entrustMonth").val();
        if(entrustMonth==''||entrustMonth == null){
            entrustMonth= $scope.entrustMonth;
        }
        getEntrustStatistics(entrustMonth);
    };
    function getEntrustStatistics(entrustMonth){
        //获取当月第一天和最后一天
        var firstDay=new Date(entrustMonth.slice(0,4),entrustMonth.slice(4,6)-1,1);//这个月的第一天
        var nextMonthFirstDay=new Date(firstDay.getFullYear(),firstDay.getMonth()+1,1);//加1获取下个月第一天
        var dis=nextMonthFirstDay.getTime()-24*60*60*1000;//减去一天就是这个月的最后一天
        var lastDay=new Date(dis);
        firstDay= moment(firstDay).format("YYYYMMDD");
        lastDay= moment(lastDay).format("YYYYMMDD");

        var obj = {
            dateStart:firstDay,
            dateEnd: lastDay
        };

        var url = $host.api_url + "/entrustStat?start=0&size=20&"+_basic.objToUrl(obj);
        _basic.get(url).then(function (data) {
            if (data.success){
                // data.result.reverse();
                // X轴
                let xAxisData = [];
                // y轴
                let yAxisData = [{name: '金额',data: []}, {name: '次数',data: []}];

                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    xAxisData.push(data.result[i].short_name);
                    yAxisData[0].data.push(data.result[i].sumFee);
                    yAxisData[1].data.push(data.result[i].countCar);
                }
                createEntrustChartOptions(xAxisData, yAxisData);
            } else{
                swal(data.msg, "", "error");
            }
        });
    }

    // 初始化 路线柱状图
    function createEntrustChartOptions(xAxisData, yAxisData) {
        $("#entrustStatisticsMonth").highcharts({
            // bar: 条形图，line：折线图，column：柱状图
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
                // xAxisData
                categories:xAxisData,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '次'
                }
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
            // yAxisData
            series: yAxisData
        });
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 默认显示 TAB【路线】
        $scope.showRoute();
    }
    initData();
}]);