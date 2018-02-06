app.controller("import_data_statistics_controller", ["$scope", "$host", "_basic","$timeout", function ($scope, $host, _basic,$timeout) {

    // 日期初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');

    // monthPicker控件
    $('#chooseInstructionPlanStart_month,#chooseInstructionPlanEnd_month,#chooseEntrustStart_month,#chooseEntrustEnd_month,#chooseManufacturerStart_month,#chooseManufacturerEnd_month,#chooseShipmentStart_month,#chooseShipmentEnd_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 指令计划按月统计
    var instructionPlanCountMonth = [{
        name: '指令计划按月统计',
        data: [],
        color: '#26C6DA'
    }];

    // 指令计划按日统计
    var instructionPlanCountDay = [{
        name: '指令计划按天统计',
        data: [],
        color: '#FF7E7E'
    }];

    // 委托方按月统计
    var entrustCountMonth = [{
        name: '委托方按月统计',
        data: [],
        color: '#26C6DA'
    }];

    // 委托方按日统计
    var entrustCountDay = [{
        name: '委托方按日统计',
        data: [],
        color: '#FF7E7E'
    }];

    // 制造商按月统计
    var manufacturerCountMonth = [{
        name: '制造商按月统计',
        data: [],
        color: '#26C6DA'
    }];

    // 制造商按日统计
    var manufacturerCountDay = [{
        name: '制造商按日统计',
        data: [],
        color: '#FF7E7E'
    }];

    // 发运地按月统计
    var shipmentCountMonth = [{
        name: '发运地按月统计',
        data: [],
        color: '#26C6DA'
    }];

    // 发运地按日统计
    var shipmentCountDay = [{
        name: '发运地按日统计',
        data: [],
        color: '#FF7E7E'
    }];

    // 获取委托方列表
    $scope.getEntrustList = function () {
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success === true) {
                $scope.entrustList = data.result;
                $scope.searchEntrustMonth = data.result[0].id;
                $scope.searchEntrustDay = data.result[0].id;
                // console.log("entrustList",$scope.entrustList);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取制造商列表
    $scope.getCarMakeList = function () {
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success === true) {
                $scope.carMakeList = data.result;
                $scope.searchManufacturerMonth = data.result[0].id;
                $scope.searchManufacturerDay = data.result[0].id;
                // console.log("carMakeList",$scope.carMakeList);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取发运地列表
    $scope.getAddrList = function () {
        _basic.get($host.api_url + "/baseAddr").then(function (data) {
            if (data.success === true) {
                $scope.addrList = data.result;
                // 设定下拉选款初始值
                $scope.searchShipmentMonth = data.result[0].id;
                $scope.searchShipmentDay = data.result[0].id;

                $('#addrCityMonth').select2({
                    containerCssClass : 'select2_dropdown'
                });
                $('#addrCityDay').select2({
                    containerCssClass : 'select2_dropdown'
                });
                // console.log("addrList",$scope.addrList);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取指令计划按月统计数据
    $scope.getInstructionMonthInfo = function () {
        // console.log("chooseInstructionPlanStart_month",$('#chooseInstructionPlanStart_month').val());
        var monthStart = $('#chooseInstructionPlanStart_month').val();
        var monthEnd = $('#chooseInstructionPlanEnd_month').val();
        if(monthStart == "" || monthStart == undefined){
            monthStart = $scope.startInitial;
        }
        if(monthEnd == "" || monthEnd == undefined){
            monthEnd = $scope.endInitial;
        }
        // console.log(monthStart,monthEnd);
        _basic.get($host.api_url + "/carMonthStat?monthStart=" + monthStart + "&monthEnd=" + monthEnd).then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // console.log("data",data);
                $scope.instructionMonthCount = [];
                instructionPlanCountMonth[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    $scope.instructionMonthCount.push(data.result[i].y_month);
                    instructionPlanCountMonth[0].data.push(Math.ceil(data.result[i].car_count));
                }
                $scope.showInstructionPlanCount_month()
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取指令计划按天统计数据
    $scope.getInstructionDayInfo = function () {
        _basic.get($host.api_url + "/carDayStat?start=0&size=20").then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // console.log("data",data);
                $scope.instructionDayCount = [];
                instructionPlanCountDay[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    $scope.instructionDayCount.push(data.result[i].id);
                    instructionPlanCountDay[0].data.push(Math.ceil(data.result[i].car_count));
                }
                $scope.showInstructionPlanCount_day()
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取委托方按月统计数据
    $scope.getEntrustCountMonthInfo = function () {
        var monthStart = $('#chooseEntrustStart_month').val();
        var monthEnd = $('#chooseEntrustEnd_month').val();
        _basic.get($host.api_url + "/carMonthStat?monthStart=" + monthStart + "&monthEnd=" + monthEnd + "&entrustId=" + $scope.searchEntrustMonth).then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // console.log("data",data);
                $scope.entrustMonthCount = [];
                entrustCountMonth[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    $scope.entrustMonthCount.push(data.result[i].y_month);
                    entrustCountMonth[0].data.push(Math.ceil(data.result[i].car_count));
                }
                $scope.showEntrustCount_month()
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    
    // 获取委托方按天统计数据
    $scope.getEntrustCountDayInfo = function () {
        _basic.get($host.api_url + "/carDayStat?entrustId=" + $scope.searchEntrustDay + "&start=0&size=20").then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // console.log("data",data);
                $scope.entrustDayCount = [];
                entrustCountDay[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    $scope.entrustDayCount.push(data.result[i].id);
                    entrustCountDay[0].data.push(Math.ceil(data.result[i].car_count));
                }
                $scope.showEntrustCount_day()
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取制造商按月统计数据
    $scope.getManufacturerCountMonthInfo = function () {
        var monthStart = $('#chooseManufacturerStart_month').val();
        var monthEnd = $('#chooseManufacturerEnd_month').val();
        _basic.get($host.api_url + "/carMonthStat?monthStart=" + monthStart + "&monthEnd=" + monthEnd + "&makeId=" + $scope.searchManufacturerMonth).then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // console.log("data",data);
                $scope.manufacturerMonthCount = [];
                manufacturerCountMonth[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    $scope.manufacturerMonthCount.push(data.result[i].y_month);
                    manufacturerCountMonth[0].data.push(Math.ceil(data.result[i].car_count));
                }
                $scope.showManufacturerCount_month()
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取制造商按天统计数据
    $scope.getManufacturerCountDayInfo = function () {
        _basic.get($host.api_url + "/carDayStat?makeId=" + $scope.searchManufacturerDay + "&start=0&size=20").then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // console.log("data",data);
                $scope.manufacturerDayCount = [];
                manufacturerCountDay[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    $scope.manufacturerDayCount.push(data.result[i].id);
                    manufacturerCountDay[0].data.push(Math.ceil(data.result[i].car_count));
                }
                $scope.showManufacturerCount_day()
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取发运地按月统计数据
    $scope.getShipmentCountMonthInfo = function () {
        var monthStart = $('#chooseShipmentStart_month').val();
        var monthEnd = $('#chooseShipmentEnd_month').val();
        _basic.get($host.api_url + "/carMonthStat?monthStart=" + monthStart + "&monthEnd=" + monthEnd + "&baseAddrId=" + $scope.searchShipmentMonth).then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // console.log("data",data);
                $scope.shipmentMonthCount = [];
                shipmentCountMonth[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    $scope.shipmentMonthCount.push(data.result[i].y_month);
                    shipmentCountMonth[0].data.push(Math.ceil(data.result[i].car_count));
                }
                $scope.showShipmentCount_month()
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取发运地按天统计数据
    $scope.getShipmentCountDayInfo = function () {
        _basic.get($host.api_url + "/carDayStat?baseAddrId=" + $scope.searchShipmentDay + "&start=0&size=20").then(function (data) {
            if (data.success === true) {
                data.result.reverse();
                // console.log("data",data);
                $scope.shipmentDayCount = [];
                shipmentCountDay[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    $scope.shipmentDayCount.push(data.result[i].id);
                    shipmentCountDay[0].data.push(Math.ceil(data.result[i].car_count));
                }
                $scope.showShipmentCount_day()
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
                    categories: $scope.instructionMonthCount,
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
                    categories: $scope.instructionDayCount,
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
                    categories: $scope.entrustMonthCount,
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
                    categories: $scope.entrustDayCount,
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
                    categories: $scope.manufacturerMonthCount,
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
                    categories: $scope.manufacturerDayCount,
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
                    categories: $scope.shipmentMonthCount,
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
                    categories: $scope.shipmentDayCount,
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

    // 点击tab获取不同统计图数据
    $scope.showInsPlan = function () {
        $scope.getInstructionMonthInfo();
        $scope.getInstructionDayInfo();
    };

    $scope.showEntrust = function () {
        $scope.getEntrustCountMonthInfo();
        $scope.getEntrustCountDayInfo();
    };

    $scope.showManufacturer = function () {
        $scope.getManufacturerCountMonthInfo();
        $scope.getManufacturerCountDayInfo();
    };

    $scope.showShipment = function () {
        $scope.getShipmentCountMonthInfo();
        $scope.getShipmentCountDayInfo();
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getEntrustList();
        $scope.getCarMakeList();
        $scope.getAddrList();
        $scope.showInsPlan();
    };
    $scope.queryData();
}]);