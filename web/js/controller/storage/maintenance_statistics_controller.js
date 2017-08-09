/**
 * Created by zcy on 2017/8/2.
 */
app.controller("maintenance_statistics_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    // 日期初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYY') + "12";

    // monthPicker控件
    $('#chooseRepairStart,#chooseRepairEnd,#chooseMoneyStart,#chooseMoneyEnd').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 维修数量统计
    var repairCount = [
        {
            name: "维修数量",
            data: [],
            color: "#4dd0e1"
        }
    ];

    // 维修金额统计
    var moneyCount = [
        {
            name: "维修金额",
            data: [],
            color: "#4dd0e1"
        }
    ];


    // 获取所有饼图数据
    $scope.searchPieInfo = function () {
        // 车头统计
        _basic.get($host.api_url + "/truckOperateTypeCountTotal?truckType=1").then(function (truckData) {
            if (truckData.success === true) {
                // console.log("truckData",truckData);
                // 饼图初始数据
                $scope.truckCountInfo = [
                    ["自营: 0 辆", 0],
                    ["外协: 0 辆", 0],
                    ["供方: 0 辆", 0],
                    ["承包: 0 辆", 0]
                ];
                // 转化饼图数据格式
                for (var i = 0; i < truckData.result.length; i++) {
                    if(truckData.result[i].operate_type === 1){
                        $scope.truckCountInfo[0][0] = "自营: " + truckData.result[i].truck_count + " 辆";
                        $scope.truckCountInfo[0][1] = truckData.result[i].truck_count;
                    }
                    if(truckData.result[i].operate_type === 2){
                        $scope.truckCountInfo[1][0] = "外协: " + truckData.result[i].truck_count + " 辆";
                        $scope.truckCountInfo[1][1] = truckData.result[i].truck_count
                    }
                    if(truckData.result[i].operate_type === 3){
                        $scope.truckCountInfo[2][0] = "供方: " + truckData.result[i].truck_count + " 辆";
                        $scope.truckCountInfo[2][1] = truckData.result[i].truck_count
                    }
                    if(truckData.result[i].operate_type === 4){
                        $scope.truckCountInfo[3][0] = "承包: " + truckData.result[i].truck_count + " 辆";
                        $scope.truckCountInfo[3][1] = truckData.result[i].truck_count
                    }
                }
                // console.log("truckCountInfo",$scope.truckCountInfo);
                $scope.showTruckPie();
            }
            else {
                swal(truckData.msg, "", "error");
            }
        });

        // 公司车辆统计
        _basic.get($host.api_url + "/companyTruckCountTotal").then(function (companyData) {
            if (companyData.success === true) {
                // console.log("companyData",companyData);
                $scope.companyCountInfo = [];
                // 转化饼图数据格式
                for(var i = 0;i < companyData.result.length;i++){
                    $scope.companyCountInfo[i] = [
                        companyData.result[i].company_name + " : " + companyData.result[i].truck_count + " 辆",
                        companyData.result[i].truck_count
                    ]
                }
                $scope.showCompanyPie();
            }
            else {
                swal(companyData.msg, "", "error");
            }
        });
    };

    // 显示车头统计饼图
    $scope.showTruckPie = function () {
        $('#truckOperateCount').highcharts({
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
                name: '车头数量',
                data: $scope.truckCountInfo
            }]
        });
    };

    // 显示公司车辆统计饼图
    $scope.showCompanyPie = function () {
        $('#companyTruckCount').highcharts({
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
                name: '公司车辆数量',
                data: $scope.companyCountInfo
            }]
        });
    };

    // 显示维修数量统计折线图
    $scope.showRepairCountLineChart = function () {
        var chart = new Highcharts.Chart('repairStatistics', {
            title: {
                text: '维修数量统计',
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
                categories: $scope.repairMonth
            },
            yAxis: {
                title: {
                    text: '单位:（辆）'
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
            series: repairCount
        });

    };

    // 显示维修金额统计折线图
    $scope.showRepairMoneyLineChart = function () {
        var chart = new Highcharts.Chart('moneyStatistics', {
            title: {
                text: '维修金额统计',
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
            series: moneyCount
        });
    };

    // 根据选择的车辆类型获取维修相关数据
    $scope.changeRepairTruckType = function (start,end) {
        // console.log("type",$scope.repairTruckType);
        // console.log(start === undefined);
        // console.log("startInitial",$scope.startInitial);
        // console.log("endInitial",$scope.endInitial);
        // console.log("start",start,"end",end);
        // 问题在于数据正常但是点击select以后view的日期没有初始化
        if(start === undefined){
            start = $scope.startInitial
        }
        if(end === undefined){
            end = $scope.endInitial
        }
        // 维修数量
        _basic.get($host.api_url + "/truckRepairCountTotal?monthStart=" + start + "&monthEnd=" + end + "&truckType=" + $scope.repairTruckType).then(function (fixData) {
            if (fixData.success === true){
                // X轴月份
                $scope.repairMonth = [];
                // 初始化金额数
                repairCount[0].data = [];
                // 赋予折线图金额数组
                for (var i = 0; i < fixData.result.length; i++) {
                    if($scope.repairMonth.indexOf(fixData.result[i].y_month) === -1){
                        $scope.repairMonth.push(fixData.result[i].y_month);
                    }
                    repairCount[0].data.push(fixData.result[i].repair_count);
                }
                $scope.showRepairCountLineChart();
            }
            else{
                swal(fixData.msg, "", "error");
            }
        });
    };

    // 根据选择的车辆类型获取金额相关数据
    $scope.changeMoneyTruckType = function (start,end) {
        // console.log("type",$scope.moneyTruckType);
        // console.log(start === undefined);
        // console.log("startInitial",$scope.startInitial);
        // console.log("endInitial",$scope.endInitial);
        // console.log("start",start,"end",end);

        // 问题在于数据是正常的但是点击select以后输入框的日期没有初始化
        if(start === undefined){
            start = $scope.startInitial
        }
        if(end === undefined){
            end = $scope.endInitial
        }

        // 维修金额
        _basic.get($host.api_url + "/truckRepairMoneyTotal?monthStart=" + start + "&monthEnd=" + end + "&truckType=" + $scope.repairTruckType).then(function (moneyData) {
            if (moneyData.success === true){
                // X轴月份
                $scope.moneyMonth = [];
                // 初始化金额数
                moneyCount[0].data = [];
                for (var i = 0; i < moneyData.result.length; i++) {
                    if($scope.moneyMonth.indexOf(moneyData.result[i].y_month) === -1){
                        $scope.moneyMonth.push(moneyData.result[i].y_month);
                    }
                    moneyCount[0].data.push(Math.ceil(moneyData.result[i].repair_money));
                }
                $scope.showRepairMoneyLineChart();
            }
            else{
                swal(moneyData.msg, "", "error");
            }
        });
    };

    // 根据日期搜索维修信息
    $scope.searchRepairCount = function () {
        var monthStart = $("#chooseRepairStart").val();
        var monthEnd = $("#chooseRepairEnd").val();
        // console.log("monthStart",monthStart);
        // console.log("monthEnd",monthEnd);
        $scope.changeRepairTruckType(monthStart,monthEnd);
    };

    // 根据日期搜索金额信息
    $scope.searchMoneyCount = function () {
        var monthStart = $("#chooseMoneyStart").val();
        var monthEnd = $("#chooseMoneyEnd").val();
        // console.log("monthStart",monthStart);
        // console.log("monthEnd",monthEnd);
        $scope.changeMoneyTruckType(monthStart,monthEnd);
    };


    // 获取所有数据
    $scope.queryData = function () {
        $scope.repairTruckType = "";
        $scope.changeRepairTruckType();
        $scope.moneyTruckType = "";
        $scope.changeMoneyTruckType();
        $scope.searchPieInfo();
    };
    $scope.queryData();

}]);