app.controller("car_insurance_payment_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 日期初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');

    // monthPicker控件
    $('#carInsurancePaymentStart_month,#carInsurancePaymentEnd_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 保险赔付金额按月统计
    var insurancePaymentMoneyCountMonth = [{
        name: '赔付金额统计',
        data: [],
        color: '#FF7E7E'
    }];

    // 保险赔付金额按周统计
    var insurancePaymentMoneyCountWeek = [{
        name: '赔付金额统计',
        data: [],
        color: '#FF7E7E'
    }];

    // 保险赔付次数按月统计
    var insurancePaymentNumCountMonth = [{
        name: '赔付次数统计',
        data: [],
        color: '#26C6DA'
    }];

    // 保险赔付次数按周统计
    var insurancePaymentNumCountWeek = [{
        name: '赔付次数统计',
        data: [],
        color: '#26C6DA'
    }];

    // 获取赔付次数和赔付金额月统计数据
    $scope.getDamageInsureMonthInfo = function () {
        var monthStart = $("#carInsurancePaymentStart_month").val();
        var monthEnd = $("#carInsurancePaymentEnd_month").val();
        if(monthStart == "" || monthStart == undefined){
            monthStart = $scope.startInitial;
        }
        if(monthEnd == "" || monthEnd == undefined){
            monthEnd = $scope.endInitial;
        }
        _basic.get($host.api_url + "/damageInsureMonthStat?" + _basic.objToUrl({
            insureStatus: "2",
            monthStart: monthStart,
            monthEnd: monthEnd
        })).then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // console.log("data", data);
                $scope.insurPaymentMonthCount = [];
                insurancePaymentMoneyCountMonth[0].data = [];
                insurancePaymentNumCountMonth[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    $scope.insurPaymentMonthCount.push(data.result[i].y_month);
                    insurancePaymentMoneyCountMonth[0].data.push(Math.ceil(data.result[i].damage_insure));
                    insurancePaymentNumCountMonth[0].data.push(Math.ceil(data.result[i].damage_insure_count));
                }
                $scope.showInsurancePaymentMoney_month();
                $scope.showInsurancePaymentCount_month();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取赔付次数和赔付金额周统计数据
    $scope.getDamageInsureWeekInfo = function () {
        _basic.get($host.api_url + "/damageInsureWeekStat?" + _basic.objToUrl({
            insureStatus: "2",
            start: "0",
            size: 10
        })).then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // console.log("data", data);
                $scope.insurPaymentWeekCount = [];
                insurancePaymentMoneyCountWeek[0].data = [];
                insurancePaymentNumCountWeek[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    $scope.insurPaymentWeekCount.push(data.result[i].y_week);
                    insurancePaymentMoneyCountWeek[0].data.push(Math.ceil(data.result[i].damage_insure));
                    insurancePaymentNumCountWeek[0].data.push(Math.ceil(data.result[i].damage_insure_count));
                }
                $scope.showInsurancePaymentMoney_week();
                $scope.showInsurancePaymentCount_week();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 显示保险赔付金额按月统计折线图
    $scope.showInsurancePaymentMoney_month = function () {
        $("#insurancePaymentMoneyMonth").highcharts({
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: $scope.insurPaymentMonthCount,
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
            series: insurancePaymentMoneyCountMonth
        });
    };

    // 显示保险赔付金额按周统计折线图
    $scope.showInsurancePaymentMoney_week = function () {
        $("#insurancePaymentMoneyWeek").highcharts({
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: $scope.insurPaymentWeekCount,
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
            series: insurancePaymentMoneyCountWeek
        });
    };

    // 显示保险赔付次数按月统计折线图
    $scope.showInsurancePaymentCount_month = function () {
        $("#insurancePaymentCountMonth").highcharts({
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: $scope.insurPaymentMonthCount,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '次数'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
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
            series: insurancePaymentNumCountMonth
        });
    };

    // 显示保险赔付次数按周统计折线图
    $scope.showInsurancePaymentCount_week = function () {
        $("#insurancePaymentCountWeek").highcharts({
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: $scope.insurPaymentWeekCount,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '次数'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
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
            series: insurancePaymentNumCountWeek
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getDamageInsureMonthInfo();
        $scope.getDamageInsureWeekInfo();
    };
    $scope.queryData();
}]);