app.controller("vehicle_damage_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');
    // monthPicker控件
    $('#chooseRepairStart,#chooseRepairEnd').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });
    var monthArr;
    var weekArr;

    function getMakeName(){
        // 车辆品牌
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.get_carMake = data.result;
            }
        });
    }

    // 商品车质损按月统计
    var carDamageCountMonth = [
        {
            name: 'A级',
            data: [],
            color: '#FF7E7E'
        },
        {
            name: 'B级',
            data: [],
            color: '#26C6DA'
        },
        {
            name: 'C级',
            data: [],
            color: '#F5AA2C'
        },
        {
            name: 'D级',
            data: [],
            color: '#BF19E1'
        },
        {
            name: 'F级',
            data: [],
            color: '#40da49'
        },
        {
            name: '买断车',
            data: [],
            color: '#0000ff'
        },
        {
            name: '退库车',
            data: [],
            color: '#ffff33'
        }
    ];

    // 获取饼图数据
    function searchCompulsory(monthStart,monthEnd) {
        _basic.get($host.api_url + "/damageLinkTypeMonthStat?damageStatus=3&monthStart=" + monthStart + "&monthEnd=" + monthEnd).then(function (data) {
            if (data.success === true) {
                // 饼图初始数据
                $scope.truckCountInfo = [
                    ["不可抗力因素: 0 辆", 0],
                    ["基层漏检: 0 辆", 0],
                    ["基层违规操作: 0 辆", 0],
                    ["驾驶员漏检: 0 辆", 0],
                    ["驾驶员违规操作: 0 辆", 0],
                    ["交通事故: 0 辆", 0],
                    ["经销商恶意刁难: 0 辆", 0],
                    ["前端责任: 0 辆", 0],
                    ["强判: 0 辆", 0],
                    ["人为破坏: 0 辆", 0],
                    ["设备故障: 0 辆", 0],
                    ["索赔: 0 辆", 0],
                    ["其他: 0 辆", 0],
                    ["仓储责任: 0 辆", 0]

                ];
                // 转化饼图数据格式
                for (var i = 0; i <data.result.length; i++) {
                    if(data.result[i].damage_link_type === 1){
                        $scope.truckCountInfo[0][0] = "不可抗力因素: " + data.result[i].damage_count + " 辆";
                        $scope.truckCountInfo[0][1] = data.result[i].damage_count;
                    }
                    if(data.result[i].damage_link_type === 2){
                        $scope.truckCountInfo[1][0] = "基层漏检: " + data.result[i].damage_count + " 辆";
                        $scope.truckCountInfo[1][1] = data.result[i].damage_count
                    }
                    if(data.result[i].damage_link_type === 3){
                        $scope.truckCountInfo[2][0] = "基层违规操作: " + data.result[i].damage_count + " 辆";
                        $scope.truckCountInfo[2][1] = data.result[i].damage_count
                    }
                    if(data.result[i].damage_link_type === 4){
                        $scope.truckCountInfo[3][0] = "驾驶员漏检: " + data.result[i].damage_count + " 辆";
                        $scope.truckCountInfo[3][1] = data.result[i].damage_count
                    }
                    if(data.result[i].damage_link_type === 5){
                        $scope.truckCountInfo[4][0] = "驾驶员违规操作: " + data.result[i].damage_count + " 辆";
                        $scope.truckCountInfo[4][1] = data.result[i].damage_count
                    }
                    if(data.result[i].damage_link_type === 6){
                        $scope.truckCountInfo[5][0] = "交通事故: " + data.result[i].damage_count + " 辆";
                        $scope.truckCountInfo[5][1] = data.result[i].damage_count
                    }
                    if(data.result[i].damage_link_type === 7){
                        $scope.truckCountInfo[6][0] = "经销商恶意刁难: " + data.result[i].damage_count + " 辆";
                        $scope.truckCountInfo[6][1] = data.result[i].damage_count
                    }
                    if(data.result[i].damage_link_type === 8){
                        $scope.truckCountInfo[7][0] = "前端责任: " + data.result[i].damage_count + " 辆";
                        $scope.truckCountInfo[7][1] = data.result[i].damage_count
                    }
                    if(data.result[i].damage_link_type === 9){
                        $scope.truckCountInfo[8][0] = "强判: " + data.result[i].damage_count + " 辆";
                        $scope.truckCountInfo[8][1] = data.result[i].damage_count
                    }
                    if(data.result[i].damage_link_type === 10){
                        $scope.truckCountInfo[9][0] = "人为破坏: " + data.result[i].damage_count + " 辆";
                        $scope.truckCountInfo[9][1] = data.result[i].damage_count
                    }
                    if(data.result[i].damage_link_type === 11){
                        $scope.truckCountInfo[10][0] = "设备故障: " + data.result[i].damage_count + " 辆";
                        $scope.truckCountInfo[10][1] = data.result[i].damage_count
                    }
                    if(data.result[i].damage_link_type === 12){
                        $scope.truckCountInfo[11][0] = "索赔: " + data.result[i].damage_count + " 辆";
                        $scope.truckCountInfo[11][1] = data.result[i].damage_count
                    }
                    if(data.result[i].damage_link_type === 13){
                        $scope.truckCountInfo[12][0] = "其他: " + data.result[i].damage_count + " 辆";
                        $scope.truckCountInfo[12][1] = data.result[i].damage_count
                    }
                    if(data.result[i].damage_link_type === 14){
                        $scope.truckCountInfo[13][0] = "仓储责任: " + data.result[i].damage_count + " 辆";
                        $scope.truckCountInfo[13][1] = data.result[i].damage_count
                    }
                }
                $scope.showCompulsoryPie();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 显示饼图
    $scope.showCompulsoryPie = function () {
        $('#damageLinkType').highcharts({
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
                name: '质损环节占比',
                data:  $scope.truckCountInfo
            }]
        });
    };




    // 商品车质损按周统计
    var carDamageCountWeek = [
        {
            name: 'A级',
            data: [],
            color: '#FF7E7E'
        },
        {
            name: 'B级',
            data: [],
            color: '#26C6DA'
        },
        {
            name: 'C级',
            data: [],
            color: '#F5AA2C'
        },
        {
            name: 'D级',
            data: [],
            color: '#BF19E1'
        },
        {
            name: 'F级',
            data: [],
            color: '#40da49'
        },
        {
            name: '买断车',
            data: [],
            color: '#0000ff'
        },
        {
            name: '退库车',
            data: [],
            color: '#ffff33'
        }
    ];

    // 显示商品车质损金额按月统计折线图
    function showVehicleDamageHistogramMonth() {
        $("#carDamageStatisticsMonth").highcharts({
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: monthArr,
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
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
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
            series: carDamageCountMonth
        });
    }

    // 显示商品车质损金额按周统计折线图
    function showVehicleDamageHistogramWeek() {
        $("#carDamageStatisticsWeek").highcharts({
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
                categories: weekArr,
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
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
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
            series: carDamageCountWeek
        });
    }

    // 按月
    function vehicleDamageMonth(start, end) {
        if($scope.car_brand==undefined){
            $scope.car_brand=''
        }
        var obj = {
            monthStart: start,
            monthEnd: end
        };
        _basic.get($host.api_url + "/damageTypeMonthStat?damageStatus=3&makeId="+$scope.car_brand +'&'+ _basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                // console.log("data",data);
                data.result.reverse();
                // X轴月份
                monthArr = [];
                // 初始化金额数
                carDamageCountMonth[0].data = [];
                carDamageCountMonth[1].data = [];
                carDamageCountMonth[2].data = [];
                carDamageCountMonth[3].data = [];
                carDamageCountMonth[4].data = [];
                carDamageCountMonth[5].data = [];
                carDamageCountMonth[6].data = [];
                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    if (monthArr.indexOf(data.result[i].y_month) === -1) {
                        monthArr.push(data.result[i].y_month);
                    }
                    if (data.result[i].id === 1) {
                        carDamageCountMonth[0].data.push(data.result[i].damage_count);
                    }
                    if (data.result[i].id === 2) {
                        carDamageCountMonth[1].data.push(data.result[i].damage_count);
                    }
                    if (data.result[i].id === 3) {
                        carDamageCountMonth[2].data.push(data.result[i].damage_count);
                    }
                    if (data.result[i].id === 4) {
                        carDamageCountMonth[3].data.push(data.result[i].damage_count);
                    }
                    if (data.result[i].id === 6) {
                        carDamageCountMonth[4].data.push(data.result[i].damage_count);
                    }
                    if (data.result[i].id === 7) {
                        carDamageCountMonth[5].data.push(data.result[i].damage_count);
                    }
                    if (data.result[i].id === 8) {
                        carDamageCountMonth[6].data.push(data.result[i].damage_count);
                    }
                }
                showVehicleDamageHistogramMonth();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //通过接口获取时间
    $scope.selectDamageDate = function () {
        if($scope.car_brand==undefined){
            $scope.car_brand=''
        }
        var monthStart = $("#chooseRepairStart").val();
        var monthEnd = $("#chooseRepairEnd").val();
        if (monthStart == '' || monthStart == null || monthEnd == '' || monthEnd == null) {
            monthStart = $scope.startInitial;
            monthEnd = $scope.endInitial;
        }
        vehicleDamageMonth(monthStart, monthEnd);
        vehicleDamageWeek(monthStart, monthEnd);
        searchCompulsory(monthStart, monthEnd)
    };

    //按周
    function vehicleDamageWeek() {
        if($scope.car_brand==undefined){
            $scope.car_brand=''
        }
        _basic.get($host.api_url + "/damageTypeWeekStat?damageStatus=3&start=0&size=50"+'&makeId='+$scope.car_brand).then(function (data) {
            if (data.success == true) {
                // console.log("data",data);
                data.result.reverse();
                // X轴月份
                weekArr = [];
                // 初始化金额数
                carDamageCountWeek[0].data = [];
                carDamageCountWeek[1].data = [];
                carDamageCountWeek[2].data = [];
                carDamageCountWeek[3].data = [];
                carDamageCountWeek[4].data = [];
                carDamageCountWeek[5].data = [];
                carDamageCountWeek[6].data = [];
                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    if (weekArr.indexOf(data.result[i].y_week) === -1) {
                        weekArr.push(data.result[i].y_week);
                    }
                    if (data.result[i].id == 1) {
                        carDamageCountWeek[0].data.push(data.result[i].damage_count);
                    }
                    if (data.result[i].id == 2) {
                        carDamageCountWeek[1].data.push(data.result[i].damage_count);
                    }
                    if (data.result[i].id == 3) {
                        carDamageCountWeek[2].data.push(data.result[i].damage_count);
                    }
                    if (data.result[i].id == 4) {
                        carDamageCountWeek[3].data.push(data.result[i].damage_count);
                    }
                    if (data.result[i].id == 6) {
                        carDamageCountWeek[4].data.push(data.result[i].damage_count);
                    }
                    if (data.result[i].id == 7) {
                        carDamageCountWeek[5].data.push(data.result[i].damage_count);
                    }
                    if (data.result[i].id == 8) {
                        carDamageCountWeek[6].data.push(data.result[i].damage_count);
                    }
                }
                showVehicleDamageHistogramWeek();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    // 获取数据
    $scope.queryData = function () {
        vehicleDamageMonth($scope.startInitial, $scope.endInitial);
        vehicleDamageWeek();
        getMakeName();
        $scope.selectDamageDate();
    };
    $scope.queryData();
}]);