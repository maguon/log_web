app.controller("accident_insurance_claims_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 日期初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');
    var accidentClaimMonth;

    // monthPicker控件
    $('#accidentClaimTimeStart,#accidentClaimTimeEnd').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 理赔次数统计
    var accidentClaimCount = [
        {
            name: '理赔总次数',
            data: [],
            color: '#26C6DA'
        },
        {
            name: '交强险',
            data: [],
            color: '#FF7E7E'
        },
        {
            name: '商业险',
            data: [],
            color: '#F5AA2C'
        },
        {
            name: '货运险',
            data: [],
            color: '#BF19E1'
        }
    ];

    // 理赔金额统计
    var accidentClaimMoney = [
        {
            name: '理赔总金额',
            data: [],
            color: '#26C6DA'
        },
        {
            name: '交强险',
            data: [],
            color: '#FF7E7E'
        },
        {
            name: '商业险',
            data: [],
            color: '#F5AA2C'
        },
        {
            name: '货运险',
            data: [],
            color: '#BF19E1'
        }
    ];

    // 获取理赔统计数据
    $scope.getAllAccidentClaimInfo = function () {
        var monthStart = $('#accidentClaimTimeStart').val();
        var monthEnd = $('#accidentClaimTimeEnd').val();
        if(monthStart == "" || monthStart == undefined){
            monthStart = $scope.startInitial;
        }
        if(monthEnd == "" || monthEnd == undefined){
            monthEnd = $scope.endInitial;
        }
        _basic.get($host.api_url + "/truckAccidentInsureMonthStat?insureStatus=2&monthStart=" + monthStart + "&monthEnd=" + monthEnd).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                accidentClaimMonth = [];
                // 理赔次数初始化
                accidentClaimCount[0].data = [];
                accidentClaimCount[1].data = [];
                accidentClaimCount[2].data = [];
                accidentClaimCount[3].data = [];
                // 理赔金额初始化
                accidentClaimMoney[0].data = [];
                accidentClaimMoney[1].data = [];
                accidentClaimMoney[2].data = [];
                accidentClaimMoney[3].data = [];
                var countObj = {};
                var moneyObj = {};
                var countTotal = [];
                var moneyTotal = [];
                data.result.forEach(function (el){
                    // 滤除重复月份
                    if(accidentClaimMonth.indexOf(el.y_month) === -1){
                        accidentClaimMonth.push(el.y_month);
                    }
                    // 赋予折线图数据
                    if(el.id === 1){
                        accidentClaimCount[1].data.push(Math.ceil(el.accident_insure_count));
                        accidentClaimMoney[1].data.push(Math.ceil(el.accident_insure_actual));
                    }
                    if(el.id === 2){
                        accidentClaimCount[2].data.push(Math.ceil(el.accident_insure_count));
                        accidentClaimMoney[2].data.push(Math.ceil(el.accident_insure_actual));
                    }
                    if(el.id === 3){
                        accidentClaimCount[3].data.push(Math.ceil(el.accident_insure_count));
                        accidentClaimMoney[3].data.push(Math.ceil(el.accident_insure_actual));
                    }
                    // 计算所有险种次数总和
                    var countTemp = !countObj[el.y_month] ? [] : countObj[el.y_month];
                    var moneyTemp = !moneyObj[el.y_month] ? [] : moneyObj[el.y_month];
                    countTemp.push(el.accident_insure_count);
                    moneyTemp.push(el.accident_insure_actual);
                    countObj[el.y_month] = countTemp;
                    moneyObj[el.y_month] = moneyTemp;
                });

                for (var countKey in countObj) {
                    var countItem = countObj[countKey].reduce(function(pre, cur) {
                        return pre + cur
                    });
                    countTotal.push(countItem)
                }
                for (var moneyKey in moneyObj) {
                    var moneyItem = moneyObj[moneyKey].reduce(function(pre, cur) {
                        return pre + cur
                    });
                    moneyTotal.push(moneyItem)
                }
                accidentClaimCount[0].data = countTotal;
                accidentClaimMoney[0].data = moneyTotal;
                $scope.showAccidentClaimCountChart();
                $scope.showAccidentClaimMoneyChart();
            }
            else {
                swal(data.msg, "", "error");
            }
        });

    };

    // 显示事故保险理赔次数统计折线图
    $scope.showAccidentClaimCountChart = function () {
        $("#accidentClaimCount").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '理赔次数统计',
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
                categories: accidentClaimMonth,
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
            series: accidentClaimCount
        });
    };

    // 显示事故保险理赔金额统计折线图
    $scope.showAccidentClaimMoneyChart = function () {
        $("#accidentClaimMoney").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '理赔金额统计',
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
                categories: accidentClaimMonth,
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
            series: accidentClaimMoney
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getAllAccidentClaimInfo();
    };
    $scope.queryData();
}]);