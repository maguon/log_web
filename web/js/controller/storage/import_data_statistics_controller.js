app.controller("import_data_statistics_controller", ["$scope", "$host", "_basic","$timeout", function ($scope, $host, _basic,$timeout) {

    // 指令计划按月统计
    var instructionPlanCountMonth = [{
        name: '指令计划按月统计',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        color: '#26C6DA'
    }];

    // 指令计划按日统计
    var instructionPlanCountDay = [{
        name: '指令计划按天统计',
        data: [25,33,46,24,37,48,29,11,17,24,18,44,12,14,15,25,33,46,24,37,48,29,11,17,24,18,44,12,14,15],
        color: '#FF7E7E'
    }];

    // 委托方按月统计
    var entrustCountMonth = [{
        name: '委托方按月统计',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        color: '#26C6DA'
    }];

    // 委托方按日统计
    var entrustCountDay = [{
        name: '委托方按日统计',
        data: [25,33,46,24,37,48,29,11,17,24,18,44,12,14,15,25,33,46,24,37,48,29,11,17,24,18,44,12,14,15],
        color: '#FF7E7E'
    }];

    // 制造商按月统计
    var manufacturerCountMonth = [{
        name: '制造商按月统计',
        data: [176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 49.9, 71.5, 106.4, 129.2, 144.0],
        color: '#26C6DA'
    }];

    // 制造商按日统计
    var manufacturerCountDay = [{
        name: '制造商按日统计',
        data: [25,33,46,24,37,48,29,11,17,24,18,44,12,14,15,25,33,46,24,37,48,29,11,17,24,18,44,12,14,15],
        color: '#FF7E7E'
    }];

    // 发运地按月统计
    var shipmentCountMonth = [{
        name: '发运地按月统计',
        data: [71.5, 129.2, 176.0, 135.6, 49.9, 216.4, 194.1, 95.6, 144.0, 148.5, 106.4, 54.4],
        color: '#26C6DA'
    }];

    // 发运地按日统计
    var shipmentCountDay = [{
        name: '发运地按日统计',
        data: [25,33,46,24,37,48,29,11,17,24,18,44,12,14,15,25,33,46,24,37,48,29,11,17,24,18,44,12,14,15],
        color: '#FF7E7E'
    }];

    // 获取委托方列表
    $scope.getEntrustList = function () {
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success === true) {
                $scope.entrustList = data.result;
                // console.log("entrustList",$scope.entrustList);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 显示指令计划按月统计柱状图
    $scope.showInstructionPlanCount_month = function () {
        $timeout(function(){
            $("#instructionPlanCountMonth").highcharts({
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
                    categories: [
                        '一月',
                        '二月',
                        '三月',
                        '四月',
                        '五月',
                        '六月',
                        '七月',
                        '八月',
                        '九月',
                        '十月',
                        '十一月',
                        '十二月'
                    ],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '辆'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                    '<td style="padding:0"><b>{point.y:.1f} 辆</b></td></tr>',
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
                series: instructionPlanCountMonth
            });
        },1)
    };

    // 显示指令计划按天统计柱状图
    $scope.showInstructionPlanCount_day = function () {
        $timeout(function(){
            $("#instructionPlanCountDay").highcharts({
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
                    categories: [
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                        "11",
                        "12",
                        "13",
                        "14",
                        "15",
                        "16",
                        "17",
                        "18",
                        "19",
                        "20",
                        "21",
                        "22",
                        "23",
                        "24",
                        "25",
                        "26",
                        "27",
                        "28",
                        "29",
                        "30"
                    ],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '辆'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}日</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                    '<td style="padding:0"><b>{point.y:.1f} 辆</b></td></tr>',
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
                series: instructionPlanCountDay
            });
        },1);
    };

    // 显示委托方按月统计折线图
    $scope.showEntrustCount_month = function () {
        $timeout(function(){
            $("#entrustCountMonth").highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: [
                        '一月',
                        '二月',
                        '三月',
                        '四月',
                        '五月',
                        '六月',
                        '七月',
                        '八月',
                        '九月',
                        '十月',
                        '十一月',
                        '十二月'
                    ],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '辆'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                    '<td style="padding:0"><b>{point.y:.1f} 辆</b></td></tr>',
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
                series: entrustCountMonth
            });
        },1);
    };

    // 显示委托方按天统计折线图
    $scope.showEntrustCount_day = function () {
        $timeout(function () {
            $("#entrustCountDay").highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: [
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                        "11",
                        "12",
                        "13",
                        "14",
                        "15",
                        "16",
                        "17",
                        "18",
                        "19",
                        "20",
                        "21",
                        "22",
                        "23",
                        "24",
                        "25",
                        "26",
                        "27",
                        "28",
                        "29",
                        "30"
                    ],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '辆'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}日</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                    '<td style="padding:0"><b>{point.y:.1f} 辆</b></td></tr>',
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
                series: entrustCountDay
            });
        },1);
    };

    // 显示制造商按月统计折线图
    $scope.showManufacturerCount_month = function () {
        $timeout(function () {
            $("#manufacturerCountMonth").highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: [
                        '一月',
                        '二月',
                        '三月',
                        '四月',
                        '五月',
                        '六月',
                        '七月',
                        '八月',
                        '九月',
                        '十月',
                        '十一月',
                        '十二月'
                    ],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '辆'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                    '<td style="padding:0"><b>{point.y:.1f} 辆</b></td></tr>',
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
                series: manufacturerCountMonth
            });
        },1);
    };

    // 显示制造商按天统计折线图
    $scope.showManufacturerCount_day = function () {
        $timeout(function () {
            $("#manufacturerCountDay").highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: [
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                        "11",
                        "12",
                        "13",
                        "14",
                        "15",
                        "16",
                        "17",
                        "18",
                        "19",
                        "20",
                        "21",
                        "22",
                        "23",
                        "24",
                        "25",
                        "26",
                        "27",
                        "28",
                        "29",
                        "30"
                    ],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '辆'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}日</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                    '<td style="padding:0"><b>{point.y:.1f} 辆</b></td></tr>',
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
                series: manufacturerCountDay
            });
        },1);
    };

    // 显示发运地按月统计折线图
    $scope.showShipmentCount_month = function () {
        $timeout(function () {
            $("#shipmentCountMonth").highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: [
                        '一月',
                        '二月',
                        '三月',
                        '四月',
                        '五月',
                        '六月',
                        '七月',
                        '八月',
                        '九月',
                        '十月',
                        '十一月',
                        '十二月'
                    ],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '辆'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                    '<td style="padding:0"><b>{point.y:.1f} 辆</b></td></tr>',
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
                series: shipmentCountMonth
            });
        },1);
    };

    // 显示发运地按天统计折线图
    $scope.showShipmentCount_day = function () {
        $timeout(function () {
            $("#shipmentCountDay").highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: [
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                        "11",
                        "12",
                        "13",
                        "14",
                        "15",
                        "16",
                        "17",
                        "18",
                        "19",
                        "20",
                        "21",
                        "22",
                        "23",
                        "24",
                        "25",
                        "26",
                        "27",
                        "28",
                        "29",
                        "30"
                    ],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '辆'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}日</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                    '<td style="padding:0"><b>{point.y:.1f} 辆</b></td></tr>',
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
                series: shipmentCountDay
            });
        },1);
    };

    // 控制统计图显示隐藏
    $scope.showInsPlan = function () {
        $scope.showInstructionPlanCount_month();
        $scope.showInstructionPlanCount_day();
    };

    $scope.showEntrust = function () {
        $scope.showEntrustCount_month();
        $scope.showEntrustCount_day();
    };

    $scope.showManufacturer = function () {
        $scope.showManufacturerCount_month();
        $scope.showManufacturerCount_day();
    };

    $scope.showShipment = function () {
        $scope.showShipmentCount_month();
        $scope.showShipmentCount_day();
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getEntrustList();
        $scope.showInsPlan();
    };
    $scope.queryData();
}]);