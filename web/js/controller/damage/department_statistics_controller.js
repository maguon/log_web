app.controller("department_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    // 用户ID
    let userId = _basic.getSession(_basic.USER_ID);
    // 默认12个月，每月初始数据
    let defaultData = [0,0,0,0,0,0,0,0,0,0,0,0];

    // 组装年列表
    function createYearList() {
        // 获取当前年月
        let myDate = new Date();
        let year = myDate.getFullYear();
        let month = myDate.getMonth() + 1;
        // 上个月
        let lastMonthDate = new Date(year, month - 2, 1);
        // 上个月的年
        let lastYear = lastMonthDate.getFullYear();

        // 组装画面选择年份列表，最早2019年
        $scope.yearList = [];
        // 上个月的年
        $scope.yearList.push({key: lastYear, value: lastYear});
        while (lastYear > 2019) {
            lastYear = lastYear - 1;
            $scope.yearList.push({key: lastYear, value: lastYear});
        }
        // 反转
        $scope.yearList.reverse();

        // X轴
        $scope.xAxisData = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        // y轴
        $scope.yAxisData = [];
        // 组装初始数据
        $scope.yearList.forEach(function (year) {
            // y轴
            $scope.yAxisData.push({
                name: year.key,
                show: false,
                // 产值  output 外协产值 outer_output  单车产值 per_truck_output 单公里产值 per_km_output
                data_output: defaultData,
                data_outer: defaultData,
                data_per_truck: defaultData,
                data_per_km: defaultData
            });
        });
    }

    // TAB1：结算
    $scope.showSettle = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.settle').addClass("active");
        $("#settle").addClass("active");
        $("#settle").show();
        // 默认显示最后一个年的数据
        let index = $scope.yearList.length - 1;
        // 默认：显示年列表最后一个年的数据
        getSettleStatistics(true, $scope.yearList[index].key, index,'');
    };

    // 图1：年列表 选中/取消 操作
    $scope.checkOutputStat = function (event, year, index) {
        // 查询接口数据
        getSettleStatistics(event.target.checked, year, index, 'outPut');
    };

    // 图2：年列表 选中/取消 操作
    $scope.checkOuterStat = function (event, year, index) {
        // 查询接口数据
        getSettleStatistics(event.target.checked, year, index, 'outer');
    };

    // 图3：年列表 选中/取消 操作
    $scope.checkPerTruckStat = function (event, year, index) {
        // 查询接口数据
        getSettleStatistics(event.target.checked, year, index, 'perTruck');
    };

    // 图4：年列表 选中/取消 操作
    $scope.checkPerKmStat = function (event, year, index) {
        // 查询接口数据
        getSettleStatistics(event.target.checked, year, index, 'perKm');
    };

    // 调用接口 取得数据
    function getSettleStatistics(showFlag, year, index, type){
        // 先清空 指定索引 y轴 数据
        $scope.yAxisData[index].show = false;
        // 如果单独某图，则只操作单图
        switch (type) {
            case 'outPut':
                $scope.yAxisData[index].data_output = defaultData;
                break;
            case 'outer':
                $scope.yAxisData[index].data_outer = defaultData;
                break;
            case 'perTruck':
                $scope.yAxisData[index].data_per_truck = defaultData;
                break;
            case 'perKm':
                $scope.yAxisData[index].data_per_km = defaultData;
                break;
            default:
                $scope.yAxisData[index].data_output = defaultData;
                $scope.yAxisData[index].data_outer = defaultData;
                $scope.yAxisData[index].data_per_truck = defaultData;
                $scope.yAxisData[index].data_per_km = defaultData;
        }

        // 如果是checkbox是取消，则直接重载chart
        if (!showFlag) {
            // 如果单独某图，则只操作单图
            switch (type) {
                case 'outPut':
                    createOutputChartOptions('column');
                    break;
                case 'outer':
                    createOuterChartOptions('column');
                    break;
                case 'perTruck':
                    createPerTruckChartOptions('column');
                    break;
                case 'perKm':
                    createPerKmChartOptions('column');
                    break;
                default:
                    createOutputChartOptions('column');
                    createOuterChartOptions('column');
                    createPerTruckChartOptions('column');
                    createPerKmChartOptions('column');
            }
            return;
        }

        // 根据年 取得当前年的数据
        let obj = {
            yMonthStart: year + '01',
            yMonthEnd: year + '12'
        };
        _basic.get($host.api_url + "/user/" + userId + "/settleStat?" + _basic.objToUrl(obj)).then(function (data) {
            if (data.success){
                data.result.reverse();
                $scope.yAxisData[index].show = true;
                // 给指定月份数据 赋值
                // 产值  output 外协产值 outer_output  单车产值 per_truck_output 单公里产值 per_km_output
                for (var i = 0; i < data.result.length; i++) {
                    switch (data.result[i].y_month.toString().slice(4,6)) {
                        case '01':
                            $scope.yAxisData[index].data_output[0] = data.result[i].output;
                            $scope.yAxisData[index].data_outer[0] = data.result[i].outer_output;
                            $scope.yAxisData[index].data_per_truck[0] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].data_per_km[0] = data.result[i].per_km_output;
                            break;
                        case '02':
                            $scope.yAxisData[index].data_output[1] = data.result[i].output;
                            $scope.yAxisData[index].data_outer[1] = data.result[i].outer_output;
                            $scope.yAxisData[index].data_per_truck[1] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].data_per_km[1] = data.result[i].per_km_output;
                            break;
                        case '03':
                            $scope.yAxisData[index].data_output[2] = data.result[i].output;
                            $scope.yAxisData[index].data_outer[2] = data.result[i].outer_output;
                            $scope.yAxisData[index].data_per_truck[2] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].data_per_km[2] = data.result[i].per_km_output;
                            break;
                        case '04':
                            $scope.yAxisData[index].data_output[3] = data.result[i].output;
                            $scope.yAxisData[index].data_outer[3] = data.result[i].outer_output;
                            $scope.yAxisData[index].data_per_truck[3] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].data_per_km[3] = data.result[i].per_km_output;
                            break;
                        case '05':
                            $scope.yAxisData[index].data_output[4] = data.result[i].output;
                            $scope.yAxisData[index].data_outer[4] = data.result[i].outer_output;
                            $scope.yAxisData[index].data_per_truck[4] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].data_per_km[4] = data.result[i].per_km_output;
                            break;
                        case '06':
                            $scope.yAxisData[index].data_output[5] = data.result[i].output;
                            $scope.yAxisData[index].data_outer[5] = data.result[i].outer_output;
                            $scope.yAxisData[index].data_per_truck[5] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].data_per_km[5] = data.result[i].per_km_output;
                            break;
                        case '07':
                            $scope.yAxisData[index].data_output[6] = data.result[i].output;
                            $scope.yAxisData[index].data_outer[6] = data.result[i].outer_output;
                            $scope.yAxisData[index].data_per_truck[6] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].data_per_km[6] = data.result[i].per_km_output;
                            break;
                        case '08':
                            $scope.yAxisData[index].data_output[7] = data.result[i].output;
                            $scope.yAxisData[index].data_outer[7] = data.result[i].outer_output;
                            $scope.yAxisData[index].data_per_truck[7] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].data_per_km[7] = data.result[i].per_km_output;
                            break;
                        case '09':
                            $scope.yAxisData[index].data_output[8] = data.result[i].output;
                            $scope.yAxisData[index].data_outer[8] = data.result[i].outer_output;
                            $scope.yAxisData[index].data_per_truck[8] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].data_per_km[8] = data.result[i].per_km_output;
                            break;
                        case '10':
                            $scope.yAxisData[index].data_output[9] = data.result[i].output;
                            $scope.yAxisData[index].data_outer[9] = data.result[i].outer_output;
                            $scope.yAxisData[index].data_per_truck[9] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].data_per_km[9] = data.result[i].per_km_output;
                            break;
                        case '11':
                            $scope.yAxisData[index].data_output[10] = data.result[i].output;
                            $scope.yAxisData[index].data_outer[10] = data.result[i].outer_output;
                            $scope.yAxisData[index].data_per_truck[10] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].data_per_km[10] = data.result[i].per_km_output;
                            break;
                        case '12':
                            $scope.yAxisData[index].data_output[11] = data.result[i].output;
                            $scope.yAxisData[index].data_outer[11] = data.result[i].outer_output;
                            $scope.yAxisData[index].data_per_truck[11] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].data_per_km[11] = data.result[i].per_km_output;
                            break;
                    }
                }
                // 如果单独某图，则只操作单图
                switch (type) {
                    case 'outPut':
                        createOutputChartOptions('column');
                        break;
                    case 'outer':
                        createOuterChartOptions('column');
                        break;
                    case 'perTruck':
                        createPerTruckChartOptions('column');
                        break;
                    case 'perKm':
                        createPerKmChartOptions('column');
                        break;
                    default:
                        createOutputChartOptions('column');
                        createOuterChartOptions('column');
                        createPerTruckChartOptions('column');
                        createPerKmChartOptions('column');
                }
            } else{
                swal(data.msg, "", "error");
            }
        });
    }

    // 初始化 chart图1
    function createOutputChartOptions(chartType) {
        // 只显示 选中的年数据
        let yAxisData = [];
        for (let i = 0; i < $scope.yAxisData.length; i++) {
            if ($scope.yAxisData[i].show) {
                yAxisData.push({name: $scope.yAxisData[i].name, data: $scope.yAxisData[i].data_output});
            }
        }
        $("#outputStatistics").highcharts({
            // bar: 条形图，line：折线图，column：柱状图
            chart: {
                type: chartType
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                // xAxisData
                categories:$scope.xAxisData,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '元'
                }
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
            // yAxisData
            series: yAxisData
        });
    }

    // 初始化 chart图2
    function createOuterChartOptions(chartType) {
        // 只显示 选中的年数据
        let yAxisData = [];
        for (let i = 0; i < $scope.yAxisData.length; i++) {
            if ($scope.yAxisData[i].show) {
                yAxisData.push({name: $scope.yAxisData[i].name, data: $scope.yAxisData[i].data_outer});
            }
        }
        $("#outerOutputStatistics").highcharts({
            // bar: 条形图，line：折线图，column：柱状图
            chart: {
                type: chartType
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                // xAxisData
                categories:$scope.xAxisData,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '元'
                }
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
            // yAxisData
            series: yAxisData
        });
    }

    // 初始化 chart图3
    function createPerTruckChartOptions(chartType) {
        // 只显示 选中的年数据
        let yAxisData = [];
        for (let i = 0; i < $scope.yAxisData.length; i++) {
            if ($scope.yAxisData[i].show) {
                yAxisData.push({name: $scope.yAxisData[i].name, data: $scope.yAxisData[i].data_per_truck});
            }
        }

        $("#perTruckOutputStatistics").highcharts({
            // bar: 条形图，line：折线图，column：柱状图
            chart: {
                type: chartType
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                // xAxisData
                categories:$scope.xAxisData,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '元'
                }
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
            // yAxisData
            series: yAxisData
        });
    }

    // 初始化 chart图4
    function createPerKmChartOptions(chartType) {
        // 只显示 选中的年数据
        let yAxisData = [];
        for (let i = 0; i < $scope.yAxisData.length; i++) {
            if ($scope.yAxisData[i].show) {
                yAxisData.push({name:$scope.yAxisData[i].name,data:$scope.yAxisData[i].data_per_km});
            }
        }

        $("#perKmOutputStatistics").highcharts({
            // bar: 条形图，line：折线图，column：柱状图
            chart: {
                type: chartType
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                // xAxisData
                categories:$scope.xAxisData,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '元'
                }
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
            // yAxisData
            series: yAxisData
        });
    }

    // TAB2：tttt
    $scope.showTemp = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.temp').addClass("active");
        $("#temp").addClass("active");
        $("#temp").show();
    };

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 组装画面基本数据
        createYearList();
        // 默认显示 TAB【结算】
        $scope.showSettle();
    }
    initData();
}]);