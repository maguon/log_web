app.controller("accident_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 日期初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');
    var accidentCountMonth;
    var accidentAmountMoneyMonth;

    // monthPicker控件
    $('#accidentTimeStart,#accidentTimeEnd').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 货车事故统计
    var truckAccidentCount = [
        {
            name: '事故总数',
            data: [],
            color: '#26C6DA'
        },
        {
            name: '普通事故',
            data: [],
            color: '#FF7E7E'
        },
        {
            name: '严重事故',
            data: [],
            color: '#BF19E1'
        }
    ];

    // 货车事故统计
    var truckAccidentMoney = [
        {
            name: '承担金额总数',
            data: [],
            color: '#26C6DA'
        },
        {
            name: '企业承担',
            data: [],
            color: '#FF7E7E'
        },
        {
            name: '个人承担',
            data: [],
            color: '#BF19E1'
        }
    ];

    // 获取货车事故统计数据
    $scope.getTruckAccidentInfo = function () {
        var monthStart = $('#accidentTimeStart').val();
        var monthEnd = $('#accidentTimeEnd').val();
        if(monthStart == "" || monthStart == undefined){
            monthStart = $scope.startInitial;
        }
        if(monthEnd == "" || monthEnd == undefined){
            monthEnd = $scope.endInitial;
        }
        _basic.get($host.api_url + "/truckAccidentTypeMonthStat?accidentStatus=2&monthStart=" + monthStart + "&monthEnd=" + monthEnd).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                accidentCountMonth = [];
                // 货车事故统计初始化
                truckAccidentCount[0].data = [];
                truckAccidentCount[1].data = [];
                truckAccidentCount[2].data = [];
                var countObj = {};
                var countTotal = [];
                data.result.forEach(function (el) {
                    // 滤除重复月份
                    if(accidentCountMonth.indexOf(el.y_month) === -1){
                        accidentCountMonth.push(el.y_month);
                    }
                    // 赋予折线图数据
                    if(el.id === 1){
                        truckAccidentCount[1].data.push(Math.ceil(el.accident_count))
                    }
                    if(el.id === 2){
                        truckAccidentCount[2].data.push(Math.ceil(el.accident_count))
                    }
                    // 计算所有险种次数总和
                    var countTemp = !countObj[el.y_month] ? [] : countObj[el.y_month];
                    countTemp.push(el.accident_count);
                    countObj[el.y_month] = countTemp;
                });

                for (var countKey in countObj) {
                    var countItem = countObj[countKey].reduce(function(pre, cur) {
                        return pre + cur
                    });
                    countTotal.push(countItem);
                }
                truckAccidentCount[0].data = countTotal;
                $scope.showAccidentCountChart();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取事故承担金额数据
    $scope.getAccidentAmountMoneyInfo = function () {
        var monthStart = $('#accidentTimeStart').val();
        var monthEnd = $('#accidentTimeEnd').val();
        if(monthStart == "" || monthStart == undefined){
            monthStart = $scope.startInitial;
        }
        if(monthEnd == "" || monthEnd == undefined){
            monthEnd = $scope.endInitial;
        }
        _basic.get($host.api_url + "/truckAccidentCostMonthStat?accidentStatus=2&monthStart=" + monthStart + "&monthEnd=" + monthEnd).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                accidentAmountMoneyMonth = [];
                // 事故承担金额初始化
                truckAccidentMoney[0].data = [];
                truckAccidentMoney[1].data = [];
                truckAccidentMoney[2].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    // x轴月份
                    accidentAmountMoneyMonth.push(data.result[i].y_month);
                    // 计算承担金额总数
                    truckAccidentMoney[0].data[i] = Math.ceil(data.result[i].company_cost) + Math.ceil(data.result[i].under_cost);
                    // 企业承担
                    truckAccidentMoney[1].data.push(Math.ceil(data.result[i].company_cost));
                    truckAccidentMoney[2].data.push(Math.ceil(data.result[i].under_cost));
                }
                $scope.showAccidentAmountMoneyChart();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 显示事故保险理赔次数统计折线图
    $scope.showAccidentCountChart = function () {
        $("#accidentCount").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '货车事故统计',
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
                categories: accidentCountMonth,
                crosshair: true
            },
            yAxis: {
                min: 0,
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
            series: truckAccidentCount
        });
    };

    // 显示事故保险理赔金额统计折线图
    $scope.showAccidentAmountMoneyChart = function () {
        $("#accidentMoney").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '事故承担金额统计',
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
                categories: accidentAmountMoneyMonth,
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
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
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
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: truckAccidentMoney
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getTruckAccidentInfo();
        $scope.getAccidentAmountMoneyInfo();
    };
    $scope.queryData();
}]);