/**
 * Created by zcy on 2017/7/28.
 */
app.controller("insurance_statistics_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {

    // monthPicker日历控件
    $('#chooseCompulsoryStart,#chooseCompulsoryEnd,#chooseCommercialStart,#chooseCommercialEnd,#chooseTotalStart,#chooseTotalEnd').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 保险金额统计
    var insuranceAmountStatistics = [
        {
            name: "交强险",
            data: [],
            color: "#4dd0e1"
        }, {
            name: "商业险",
            data: [],
            color: "#ff5252"
        }
    ];

    // 保险车次统计
    var moneyAmountStatistics = [
        {
            name: "车次",
            data: [],
            color: "#4dd0e1"
        }
    ];


    // 获取交强险饼图数据
    $scope.searchCompulsoryInsurance = function () {
        var monthStart = $("#chooseCompulsoryStart").val();
        var monthEnd = $("#chooseCompulsoryEnd").val();
        // if($("#chooseCompulsoryStart").val() == ""){
        //     monthStart = ""
        // }
        // else{
        //     monthStart = moment($("#chooseCompulsoryStart").val(),'MM/YYYY').format("YYYYMM");
        // }
        //
        // if($("#chooseCompulsoryEnd").val() == ""){
        //     monthEnd = ""
        // }
        // else{
        //     monthEnd = moment($("#chooseCompulsoryEnd").val(),'MM/YYYY').format("YYYYMM");
        // }


        _basic.get($host.api_url + "/truckInsureTypeTotal?monthStart=" + monthStart + "&monthEnd=" + monthEnd).then(function (insuranceData) {
            if (insuranceData.success === true) {
                // console.log("insuranceData",insuranceData);
                // 交强险
                var compulsory = [];
                for (var c = 0; c < insuranceData.result.length; c++) {
                    if(insuranceData.result[c].insure_type == "1"){
                        compulsory.push(insuranceData.result[c]);
                    }
                }
                // 交强险
                $scope.compulsoryInfo = [];
                // 转化数据格式（交强险）
                for (var e = 0; e < compulsory.length; e++) {
                    $scope.compulsoryInfo[e] = [
                        compulsory[e].insure_name + " : ￥" + Math.ceil(compulsory[e].insure_money),
                        compulsory[e].insure_money
                    ]
                }
                $scope.showCompulsoryPie();
            }
            else {
                swal(insuranceData.msg, "", "error");
            }
        });
    };

    // 获取商业险饼图数据
    $scope.searchCommercialInsurance = function () {
        var monthStart = $("#chooseCommercialStart").val();
        var monthEnd = $("#chooseCommercialEnd").val();

        _basic.get($host.api_url + "/truckInsureTypeTotal?monthStart=" + monthStart + "&monthEnd=" + monthEnd).then(function (insuranceData) {
            if (insuranceData.success === true) {
                // console.log("insuranceData",insuranceData);
                // 商业险
                var commercial = [];
                for (var f = 0; f < insuranceData.result.length; f++) {
                    if(insuranceData.result[f].insure_type == "2"){
                        commercial.push(insuranceData.result[f]);
                    }
                }
                // 商业险
                $scope.commercialInfo = [];
                // 转化数据格式（商业险）
                for (var e = 0; e < commercial.length; e++) {
                    $scope.commercialInfo[e] = [
                        commercial[e].insure_name + " : ￥" + Math.ceil(commercial[e].insure_money),
                        commercial[e].insure_money
                    ]
                }
                $scope.showCommercialPie();
            }
            else {
                swal(insuranceData.msg, "", "error");
            }
        });
    };

    // 获取总和饼图数据
    $scope.searchTotalInsurance = function () {
        var monthStart = $("#chooseCommercialStart").val();
        var monthEnd = $("#chooseCommercialEnd").val();

        _basic.get($host.api_url + "/truckInsureTypeTotal?monthStart=" + monthStart + "&monthEnd=" + monthEnd).then(function (insuranceData) {
            if (insuranceData.success === true) {
                // console.log("insuranceData",insuranceData);
                // 总和
                $scope.insuranceAllInfo = [];
                // 转化数据格式（总和）
                for (var i = 0; i < insuranceData.result.length; i++) {
                    $scope.insuranceAllInfo[i] = [
                        insuranceData.result[i].insure_name + " : ￥" + Math.ceil(insuranceData.result[i].insure_money),
                        insuranceData.result[i].insure_money
                    ]
                }
                $scope.showTotalPie();
            }
            else {
                swal(insuranceData.msg, "", "error");
            }
        });
    };


    // 显示交强险饼图
    $scope.showCompulsoryPie = function () {
        // 显示交强险饼图
        $('#compulsoryInsurance').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            credits: {
                enabled: "false",
                text: '',
                href: ''
            },
            tooltip: {
                headerFormat: '{series.name}<br>',
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: '保险公司金额占比',
                data: $scope.compulsoryInfo
            }]
        });
    };

    // 显示商业险饼图
    $scope.showCommercialPie = function () {
        // 显示商业险饼图
        $('#commercialInsurance').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            credits: {
                enabled: "false",
                text: '',
                href: ''
            },
            tooltip: {
                headerFormat: '{series.name}<br>',
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: '保险公司金额占比',
                data: $scope.commercialInfo
            }]
        });
    };

    // 显示总和
    $scope.showTotalPie = function () {
        // 显示总数饼图
        $('#insuranceTotal').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            credits: {
                enabled: "false",
                text: '',
                href: ''
            },
            tooltip: {
                headerFormat: '{series.name}<br>',
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: '保险公司金额占比',
                data: $scope.insuranceAllInfo
            }]
        });
    };


    // 获取保险公司
    $scope.getInsuranceInfo = function () {
        // 获取折线图的保险公司列表
        _basic.get($host.api_url + "/truckInsure").then(function (insuranceListData) {
            if (insuranceListData.success === true) {
                $scope.insuranceList = insuranceListData.result;
                // console.log("insuranceListData",$scope.insuranceList)
            }
            else {
                swal(insuranceListData.msg, "", "error");
            }
        });
    };

    // 显示保险金额统计折线图
    $scope.showMoneyLineChart = function () {
        var chart = new Highcharts.Chart('insureMoney', {
            title: {
                text: '保险金额统计',
                align: "left",
                style: {
                    color: '#616161',
                    fontWeight: 'bold'
                },
                x: 31
            },
            credits: {
                enabled: "false",
                text: '',
                href: ''
            },
            xAxis: {
                categories: $scope.moneyMonth
            },
            yAxis: {
                title: {
                    text: '人民币(￥)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '￥'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: insuranceAmountStatistics
        });

    };

    // 显示保险车次统计折线图
    $scope.showTruckLineChart = function () {
        var chart = new Highcharts.Chart('insureTruck', {
            title: {
                text: '保险车次统计',
                align: "left",
                style: {
                    color: '#616161',
                    fontWeight: 'bold'
                },
                x: 31
            },
            credits: {
                enabled: "false",
                text: '',
                href: ''
            },
            xAxis: {
                categories: $scope.truckMonth
            },
            yAxis: {
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '辆'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: moneyAmountStatistics
        });

    };

    // 根据选择的保险公司获取相应信息
    $scope.changeInsurance = function () {
        console.log("insuranceId",$scope.insuranceId);
        // 保险金额统计
        _basic.get($host.api_url + "/truckInsureMoneyTotal?insureId=" + $scope.insuranceId).then(function (currentInsuranceData) {
            if (currentInsuranceData.success === true) {
                // console.log("currentInsuranceData",currentInsuranceData);
                // X轴月份
                $scope.moneyMonth = [];
                // 初始化金额数
                insuranceAmountStatistics[0].data = [];
                insuranceAmountStatistics[1].data = [];

                for (var d = 0; d < currentInsuranceData.result.length; d++) {
                    // 滤掉相同月份
                    if($scope.moneyMonth.indexOf(currentInsuranceData.result[d].y_month) === -1){
                        $scope.moneyMonth.push(currentInsuranceData.result[d].y_month);
                    }
                    // 赋予折线图金额数组
                    if(currentInsuranceData.result[d].id === 1){
                        insuranceAmountStatistics[0].data.push(Math.ceil(currentInsuranceData.result[d].insure_money));
                    }
                    else{
                        insuranceAmountStatistics[1].data.push(Math.ceil(currentInsuranceData.result[d].insure_money));
                    }
                }
                // console.log("moneyMonth",$scope.moneyMonth);
                $scope.showMoneyLineChart();
            }
            else {
                swal(currentInsuranceData.msg, "", "error");
            }
        });

        // 保险车次统计
        _basic.get($host.api_url + "/truckInsureCountTotal?insureId=" + $scope.insuranceId).then(function (totalMonthData) {
            if (totalMonthData.success === true){
                // console.log("totalMonthData",totalMonthData);
                // X轴月份
                $scope.truckMonth = [];
                // 初始化车次数
                moneyAmountStatistics[0].data = [];

                for (var s = 0; s < totalMonthData.result.length; s++) {
                    // 滤掉相同月份
                    if($scope.truckMonth.indexOf(totalMonthData.result[s].y_month) === -1){
                        $scope.truckMonth.push(totalMonthData.result[s].y_month);
                    }
                    moneyAmountStatistics[0].data.push(totalMonthData.result[s].insure_count)
                }
                // console.log("truckMonth",$scope.truckMonth);

                $scope.showTruckLineChart();
            }
            else{
                swal(totalMonthData.msg, "", "error");
            }
        });
    };

    // 获取所有数据
    $scope.queryData = function () {
        $scope.getInsuranceInfo();
        $scope.insuranceId = "";
        $scope.changeInsurance();
        $scope.searchCompulsoryInsurance();
        $scope.searchCommercialInsurance();
        $scope.searchTotalInsurance();
    };
    $scope.queryData();
}]);