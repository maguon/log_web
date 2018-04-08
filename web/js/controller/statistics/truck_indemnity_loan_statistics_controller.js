app.controller("truck_indemnity_loan_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 日期初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');

    var loanInfoMonthCount;

    // monthPicker控件
    $('#loanTimeStart,#loanTimeEnd').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 借款笔数按月统计
    var loanCountMonth = [
        {
            name: '借款笔数',
            data: [],
            color: '#26C6DA'
        }
    ];

    // 借款金额按月统计
    var loanMoneyMonth = [
        {
            name: '借款金额',
            data: [],
            color: '#FF7E7E'
        }
    ];

    // 获取借款笔数金额数据
    $scope.getLoanMonthInfo = function () {
        var monthStart = $('#loanTimeStart').val();
        var monthEnd = $('#loanTimeEnd').val();
        if(monthStart == "" || monthStart == undefined){
            monthStart = $scope.startInitial;
        }
        if(monthEnd == "" || monthEnd == undefined){
            monthEnd = $scope.endInitial;
        }
        _basic.get($host.api_url + "/truckAccidentInsureLoanMonthStat?monthStart=" + monthStart + "&monthEnd=" + monthEnd).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                data.result.reverse();
                loanInfoMonthCount = [];
                // 借款笔数金额初始化
                loanCountMonth[0].data = [];
                loanMoneyMonth[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    // x轴月份
                    loanInfoMonthCount.push(data.result[i].y_month);
                    // 借款笔数
                    loanCountMonth[0].data.push(Math.ceil(data.result[i].loan_count));
                    // 借款金额
                    loanMoneyMonth[0].data.push(Math.ceil(data.result[i].loan_money));
                }
                $scope.showLoanCountMonthChart();
                $scope.showLoanMoneyMonthChart();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 显示借款笔数按日统计折线图
    $scope.showLoanCountMonthChart = function () {
        $("#loanCountMonth").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '借款笔数统计',
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
                categories: loanInfoMonthCount,
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
            series: loanCountMonth
        });
    };

    // 显示借款金额按月统计折线图
    $scope.showLoanMoneyMonthChart = function () {
        $("#loanMoneyMonth").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '借款金额统计',
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
                categories: loanInfoMonthCount,
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
            series: loanMoneyMonth
        });
    };


    // 获取数据
    $scope.queryData = function () {
        $scope.getLoanMonthInfo();
    };
    $scope.queryData();
}]);