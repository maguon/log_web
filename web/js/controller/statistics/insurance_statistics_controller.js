/**
 * Created by zcy on 2017/7/28.
 */
app.controller("insurance_statistics_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {

    // 日期初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');

    // monthPicker日历控件
    $('#chooseCompulsoryStart,#chooseCompulsoryEnd,#chooseCommercialStart,#chooseCommercialEnd,#chooseTotalStart,#chooseTotalEnd,#chooseCargoStart,#chooseCargoEnd').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 保险金额统计
    var insuranceAmountStatistics = [
        {
            name: "交强险",
            data: [],
            color: "#4dd0e1"
        },
        {
            name: "商业险",
            data: [],
            color: "#FF7E7E"
        },
        {
            name: "货运险",
            data: [],
            color: "#BF19E1"
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
        if(monthStart == ""){
            monthStart = $scope.startInitial
        }
        if(monthEnd == ""){
            monthEnd = $scope.endInitial
        }

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
        if(monthStart == ""){
            monthStart = $scope.startInitial
        }
        if(monthEnd == ""){
            monthEnd = $scope.endInitial
        }

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

    // 获取货运险饼图数据
    $scope.searchCargoInsurance = function () {
        var monthStart = $("#chooseCargoStart").val();
        var monthEnd = $("#chooseCargoEnd").val();
        if(monthStart == ""){
            monthStart = $scope.startInitial
        }
        if(monthEnd == ""){
            monthEnd = $scope.endInitial
        }
        _basic.get($host.api_url + "/truckInsureTypeTotal?monthStart=" + monthStart + "&monthEnd=" + monthEnd).then(function (insuranceData){
            if (insuranceData.success === true) {
                // 货运险
                var cargo = [];
                for (var i = 0; i < insuranceData.result.length; i++) {
                    if(insuranceData.result[i].insure_type == "3"){
                        cargo.push(insuranceData.result[i]);
                    }
                }
                // 货运险
                $scope.cargoInfo = [];
                // 转化数据格式（货运险）
                for (var e = 0; e < cargo.length; e++) {
                    $scope.cargoInfo[e] = [
                        cargo[e].insure_name + " : ￥" + Math.ceil(cargo[e].insure_money),
                        cargo[e].insure_money
                    ]
                }
                $scope.showCargoPie();
            }
        });
    };

    // 获取总和饼图数据
    $scope.searchTotalInsurance = function () {
        var monthStart = $("#chooseTotalStart").val();
        var monthEnd = $("#chooseTotalEnd").val();
        if(monthStart == ""){
            monthStart = $scope.startInitial
        }
        if(monthEnd == ""){
            monthEnd = $scope.endInitial
        }

        _basic.get($host.api_url + "/truckInsureTypeTotal?monthStart=" + monthStart + "&monthEnd=" + monthEnd).then(function (insuranceData) {
            if (insuranceData.success === true) {
                // console.log("insuranceData",insuranceData);
                // 转化数据格式（总和）
                var temp = {};
                for (var i = 0; i < insuranceData.result.length; i++) {
                    var obj = insuranceData.result[i];
                    var key = obj["insure_name"];
                    if (temp[key] != 0 && !temp[key]) {
                        temp[key] = obj["insure_money"];
                    }
                    else {
                        temp[key] = temp[key] + obj["insure_money"];
                    }
                }

                var arr = [];
                for (key in temp) {
                    arr.push([key+ " : ￥" + Math.ceil( temp[key]), temp[key]]);
                }
                $scope.insuranceAllInfo = arr;

                // console.log("insuranceAllInfo",$scope.insuranceAllInfo);
                $scope.showTotalPie();
            }
            else {
                swal(insuranceData.msg, "", "error");
            }
        });
    };


    // 显示交强险饼图
    $scope.showCompulsoryPie = function () {
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
                headerFormat: '',
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
                headerFormat: '',
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
    
    // 显示货运险饼图
    $scope.showCargoPie = function () {
        $('#cargoInsurance').highcharts({
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
                headerFormat: '',
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
                data: $scope.cargoInfo
            }]
        });
    };

    // 显示总和饼图
    $scope.showTotalPie = function () {
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
                headerFormat: '',
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
        // 保险金额统计
        _basic.get($host.api_url + "/truckInsureMoneyTotal?insureId=" + $scope.insuranceId).then(function (currentInsuranceData) {
            if (currentInsuranceData.success === true) {
                // console.log("currentInsuranceData",currentInsuranceData);
                // X轴月份
                $scope.moneyMonth = [];
                // 初始化金额数
                insuranceAmountStatistics[0].data = [];
                insuranceAmountStatistics[1].data = [];
                insuranceAmountStatistics[2].data = [];

                for (var d = 0; d < currentInsuranceData.result.length; d++) {
                    // 滤掉相同月份
                    if($scope.moneyMonth.indexOf(currentInsuranceData.result[d].y_month) === -1){
                        $scope.moneyMonth.push(currentInsuranceData.result[d].y_month);
                    }
                    // 赋予折线图金额数组
                    if(currentInsuranceData.result[d].id === 1){
                        insuranceAmountStatistics[0].data.push(Math.ceil(currentInsuranceData.result[d].insure_money));
                    }
                    if(currentInsuranceData.result[d].id === 2){
                        insuranceAmountStatistics[1].data.push(Math.ceil(currentInsuranceData.result[d].insure_money));
                    }
                    if(currentInsuranceData.result[d].id === 3){
                        insuranceAmountStatistics[2].data.push(Math.ceil(currentInsuranceData.result[d].insure_money));
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
        $scope.searchCargoInsurance();
        $scope.searchTotalInsurance();
    };
    $scope.queryData();
}]);