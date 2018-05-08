app.controller("car_indemnity_payment_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 日期初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');

    var paymentInfoMonthCount;

    // monthPicker控件
    $('#paymentTimeStart,#paymentTimeEnd').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 打款笔数按月统计
    var paymentCountMonth = [
        {
            name: '打款笔数',
            data: [],
            color: '#26C6DA'
        }
    ];

    // 打款金额按月统计
    var paymentMoneyMonth = [
        {
            name: '打款金额',
            data: [],
            color: '#FF7E7E'
        }
    ];

    $scope.getPaymentMonthInfo = function () {
        var monthStart = $('#paymentTimeStart').val();
        var monthEnd = $('#paymentTimeEnd').val();
        if(monthStart == "" || monthStart == undefined){
            monthStart = $scope.startInitial;
        }
        if(monthEnd == "" || monthEnd == undefined){
            monthEnd = $scope.endInitial;
        }
        _basic.get($host.api_url + "/indemnityMonthStat?monthStart=" + monthStart + "&monthEnd=" + monthEnd).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                data.result.reverse();
                paymentInfoMonthCount = [];
                // 申请笔数金额初始化
                paymentCountMonth[0].data = [];
                paymentMoneyMonth[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    // x轴月份
                    paymentInfoMonthCount.push(data.result[i].y_month);
                    // 打款笔数
                    paymentCountMonth[0].data.push(Math.ceil(data.result[i].indemnity_count));
                    // 打款金额
                    paymentMoneyMonth[0].data.push(Math.ceil(data.result[i].indemnity_money));
                }
                $scope.showPaymentCountMonthChart();
                $scope.showPaymentMoneyMonthChart();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 显示打款笔数按日统计折线图
    $scope.showPaymentCountMonthChart = function () {
        $("#paymentCountMonth").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '打款笔数统计',
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
                categories: paymentInfoMonthCount,
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
                '<td style="padding:0"><b>{point.y} 笔</b></td></tr>',
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
            series: paymentCountMonth
        });
    };

    // 显示打款金额按月统计折线图
    $scope.showPaymentMoneyMonthChart = function () {
        $("#paymentMoneyMonth").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '打款金额统计',
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
                categories: paymentInfoMonthCount,
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
                '<td style="padding:0"><b>{point.y:.2f} 元</b></td></tr>',
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
            series: paymentMoneyMonth
        });
    };


    // 获取数据
    $scope.queryData = function () {
        $scope.getPaymentMonthInfo();
    };
    $scope.queryData();
}]);