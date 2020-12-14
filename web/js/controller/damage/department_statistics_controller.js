app.controller("department_statistics_controller", ["$scope", "$host", "_basic", "_config", function ($scope, $host, _basic, _config) {
    // bar: 条形图，line：折线图，column：柱状图
    $scope.chartTypeList =_config.highchartType;
    // 用户ID
    let userId = _basic.getSession(_basic.USER_ID);

    /**
     * 组装年列表
     */
    function createYearList() {
        // 获取当前年月
        let myDate = new Date();
        let year = myDate.getFullYear();
        let month = myDate.getMonth() + 1;
        // 上个月
        let lastMonthDate = new Date(year, month - 2, 1);
        // 上个月的年
        let lastYear = lastMonthDate.getFullYear();
        $scope.defaultYear = lastYear;

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
    }

    /**
     * high-chart 参数设定
     * @param node 节点
     * @param chartType 图表类型
     * @param yAxisText 图表Y轴单位
     * @param yAxisData 数据
     */
    function createChartOptions(node, chartType, yAxisText, yAxisData) {
        node.highcharts({
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
                    text: yAxisText
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

    // TAB1：结算
    $scope.showSettle = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.settle').addClass("active");
        $("#settle").addClass("active");
        $("#settle").show();
        // 清空选中状态
        $(".settle").prop('checked', false);
        // 默认年全部选中
        $("#" + $scope.defaultYear).prop('checked', true);
        $("#" + $scope.defaultYear + "_out").prop('checked', true);
        $("#" + $scope.defaultYear + "_per_truck").prop('checked', true);
        $("#" + $scope.defaultYear + "_per_km").prop('checked', true);
        // 初始化：图标类型
        $scope.outputChartType = $scope.chartTypeList[0].key;
        $scope.outerChartType = $scope.chartTypeList[0].key;
        $scope.perTruckChartType = $scope.chartTypeList[0].key;
        $scope.perKmChartType = $scope.chartTypeList[0].key;

        // 初始化 y轴 数据
        $scope.yAxisData = [];
        // 组装初始数据
        $scope.yearList.forEach(function (year) {
            // y轴
            $scope.yAxisData.push({
                name: year.key,
                showOutput: false,
                showOuter: false,
                showPerTruck: false,
                showPerKm: false,
                // 产值  output 外协产值 outer_output  单车产值 per_truck_output 单公里产值 per_km_output
                dataOutput: [0,0,0,0,0,0,0,0,0,0,0,0],
                dataOuter: [0,0,0,0,0,0,0,0,0,0,0,0],
                dataPerTruck: [0,0,0,0,0,0,0,0,0,0,0,0],
                dataPerKm: [0,0,0,0,0,0,0,0,0,0,0,0]
            });
        });

        // 默认显示最后一个年的数据
        let index = $scope.yearList.length - 1;
        // 默认：显示年列表最后一个年的数据
        getSettleStatistics(true, $scope.yearList[index].key, index,'');
    };

    // TAB1：图1：年列表 选中/取消 操作
    $scope.checkOutputStat = function (event, year, index) {
        // 查询接口数据
        getSettleStatistics(event.target.checked, year, index, 'outPut');
    };

    // TAB1：图2：年列表 选中/取消 操作
    $scope.checkOuterStat = function (event, year, index) {
        // 查询接口数据
        getSettleStatistics(event.target.checked, year, index, 'outer');
    };

    // TAB1：图3：年列表 选中/取消 操作
    $scope.checkPerTruckStat = function (event, year, index) {
        // 查询接口数据
        getSettleStatistics(event.target.checked, year, index, 'perTruck');
    };

    // TAB1：图4：年列表 选中/取消 操作
    $scope.checkPerKmStat = function (event, year, index) {
        // 查询接口数据
        getSettleStatistics(event.target.checked, year, index, 'perKm');
    };

    /**
     * TAB1：初始化 图表数据
     * @param index 操作年份索引
     * @param type 操作chart图的区分
     */
    function initSettleChartData(index, type){
        // 先清空 指定索引 y轴 数据
        switch (type) {
            case 'outPut':
                $scope.yAxisData[index].showOutput = false;
                $scope.yAxisData[index].dataOutput = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'outer':
                $scope.yAxisData[index].showOuter = false;
                $scope.yAxisData[index].dataOuter = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'perTruck':
                $scope.yAxisData[index].showPerTruck = false;
                $scope.yAxisData[index].dataPerTruck = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'perKm':
                $scope.yAxisData[index].showPerKm = false;
                $scope.yAxisData[index].dataPerKm = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            default:
                break;
        }
    }

    /**
     * TAB1：根据区分 刷新指定图表
     * @param type 操作chart图的区分
     */
    $scope.refreshChart = function (type) {
        switch (type) {
            case 'outPut':
                createSettleChartData($("#outputStatistics"), 'outPut', $scope.outputChartType);
                break;
            case 'outer':
                createSettleChartData($("#outerOutputStatistics"), 'outer', $scope.outerChartType);
                break;
            case 'perTruck':
                createSettleChartData($("#perTruckOutputStatistics"), 'perTruck', $scope.perTruckChartType);
                break;
            case 'perKm':
                createSettleChartData($("#perKmOutputStatistics"), 'perKm', $scope.perKmChartType);
                break;
            default:
                createSettleChartData($("#outputStatistics"), 'outPut', $scope.outputChartType);
                // TODO 暂时不显示
                // createSettleChartData($("#outerOutputStatistics"), 'outer', $scope.outerChartType);
                createSettleChartData($("#perTruckOutputStatistics"), 'perTruck', $scope.perTruckChartType);
                createSettleChartData($("#perKmOutputStatistics"), 'perKm', $scope.perKmChartType);
        }
    };

    /**
     * 数据赋值
     * @param yAxisDataIndex y轴索引
     * @param month 月份索引
     * @param data 接口数据
     */
    function setSettleStat(yAxisDataIndex, month, data){
        $scope.yAxisData[yAxisDataIndex].dataOutput[month] = data.output;
        $scope.yAxisData[yAxisDataIndex].dataOuter[month] = data.outer_output;
        $scope.yAxisData[yAxisDataIndex].dataPerTruck[month] = data.per_truck_output;
        $scope.yAxisData[yAxisDataIndex].dataPerKm[month] = data.per_km_output;
    }

    /**
     * TAB1：调用接口 取得数据
     * @param showFlag 显示数据/清除数据
     * @param year 操作年份
     * @param index 操作年份索引
     * @param type 操作chart图的区分
     */
    function getSettleStatistics(showFlag, year, index, type){
        // 初始化 图表数据
        initSettleChartData(index, type);

        // 如果是checkbox是取消，则直接刷新chart
        if (!showFlag) {
            // 刷新图表
            $scope.refreshChart(type);
            return;
        }

        // 根据年 取得当前年的数据
        let obj = {
            yMonthStart: year + '01',
            yMonthEnd: year + '12'
        };
        let url = $host.api_url + "/user/" + userId + "/settleStat?" + _basic.objToUrl(obj);
        _basic.get(url).then(function (data) {
            if (data.success){
                data.result.reverse();

                switch (type) {
                    case 'outPut':
                        $scope.yAxisData[index].showOutput = true;
                        break;
                    case 'outer':
                        $scope.yAxisData[index].showOuter = true;
                        break;
                    case 'perTruck':
                        $scope.yAxisData[index].showPerTruck = true;
                        break;
                    case 'perKm':
                        $scope.yAxisData[index].showPerKm = true;
                        break;
                    default:
                        $scope.yAxisData[index].showOutput = true;
                        $scope.yAxisData[index].showOuter = true;
                        $scope.yAxisData[index].showPerTruck = true;
                        $scope.yAxisData[index].showPerKm = true;
                }

                // 给指定月份数据 赋值
                // 产值  output 外协产值 outer_output  单车产值 per_truck_output 单公里产值 per_km_output
                for (var i = 0; i < data.result.length; i++) {
                    switch (data.result[i].y_month.toString().slice(4,6)) {
                        case '01':
                            setSettleStat(index, 0, data.result[i]);
                            break;
                        case '02':
                            setSettleStat(index, 1, data.result[i]);
                            break;
                        case '03':
                            setSettleStat(index, 2, data.result[i]);
                            break;
                        case '04':
                            setSettleStat(index, 3, data.result[i]);
                            break;
                        case '05':
                            setSettleStat(index, 4, data.result[i]);
                            break;
                        case '06':
                            setSettleStat(index, 5, data.result[i]);
                            break;
                        case '07':
                            setSettleStat(index, 6, data.result[i]);
                            break;
                        case '08':
                            setSettleStat(index, 7, data.result[i]);
                            break;
                        case '09':
                            setSettleStat(index, 8, data.result[i]);
                            break;
                        case '10':
                            setSettleStat(index, 9, data.result[i]);
                            break;
                        case '11':
                            setSettleStat(index, 10, data.result[i]);
                            break;
                        case '12':
                            setSettleStat(index, 11, data.result[i]);
                            break;
                    }
                }
                // 刷新图表
                $scope.refreshChart(type);
            } else{
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * TAB1：初始化 chart图
     * @param node 图例节点
     * @param type 图例区分
     * @param chartType 图表显示类型：bar: 条形图，line：折线图，column：柱状图
     */
    function createSettleChartData(node, type, chartType) {
        // 只显示 选中的年数据
        let yAxisData = [];
        for (let i = 0; i < $scope.yAxisData.length; i++) {
            switch (type) {
                case 'outPut':
                    if ($scope.yAxisData[i].showOutput) {
                        yAxisData.push({name: $scope.yAxisData[i].name, data: $scope.yAxisData[i].dataOutput});
                    }
                    break;
                case 'outer':
                    if ($scope.yAxisData[i].showOuter) {
                        yAxisData.push({name: $scope.yAxisData[i].name, data: $scope.yAxisData[i].dataOuter});
                    }
                    break;
                case 'perTruck':
                    if ($scope.yAxisData[i].showPerTruck) {
                        yAxisData.push({name: $scope.yAxisData[i].name, data: $scope.yAxisData[i].dataPerTruck});
                    }
                    break;
                case 'perKm':
                    if ($scope.yAxisData[i].showPerKm) {
                        yAxisData.push({name: $scope.yAxisData[i].name, data: $scope.yAxisData[i].dataPerKm});
                    }
                    break;
                default:
                    break;
            }
        }
        // high-chart 参数设定
        createChartOptions(node, chartType, '元', yAxisData);
    }

    // TAB2：调度
    $scope.showDispatch = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.dispatch').addClass("active");
        $("#dispatch").addClass("active");
        $("#dispatch").show();
        // 清空选中状态
        $(".dispatch").prop('checked', false);
        // 默认年全部选中
        $("#" + $scope.defaultYear + "_truck_count").prop('checked', true);
        $("#" + $scope.defaultYear + "_car_count").prop('checked', true);
        $("#" + $scope.defaultYear + "_total_distance").prop('checked', true);
        $("#" + $scope.defaultYear + "_load_distance").prop('checked', true);
        $("#" + $scope.defaultYear + "_load_ratio").prop('checked', true);

        // 初始化图表类型
        $scope.truckCountChartType = $scope.chartTypeList[0].key;
        $scope.carCountChartType = $scope.chartTypeList[0].key;
        $scope.totalDistanceChartType = $scope.chartTypeList[0].key;
        $scope.loadDistanceChartType = $scope.chartTypeList[0].key;
        $scope.loadRatioChartType = $scope.chartTypeList[0].key;

        // 初始化 y轴 数据
        $scope.yAxisDataDispatch = [];
        // 组装初始数据
        $scope.yearList.forEach(function (year) {
            // y轴
            $scope.yAxisDataDispatch.push({
                name: year.key,
                showTruckCount: false,
                showCarCount: false,
                showTotalDistance: false,
                showLoadDistance: false,
                showLoadRatio: false,
                // 出车数 truck_count 发运量 car_count 总里程 total_distance 重载里程 load_distance 重载率 load_ratio
                truckCount: [0,0,0,0,0,0,0,0,0,0,0,0],
                carCount: [0,0,0,0,0,0,0,0,0,0,0,0],
                totalDistance: [0,0,0,0,0,0,0,0,0,0,0,0],
                loadDistance: [0,0,0,0,0,0,0,0,0,0,0,0],
                loadRatio: [0,0,0,0,0,0,0,0,0,0,0,0]
            });
        });

        // 默认显示最后一个年的数据
        let index = $scope.yearList.length - 1;
        // 默认：显示年列表最后一个年的数据
        getDispatchStatistics(true, $scope.yearList[index].key, index,'');
    };

    // TAB2：图1：年列表 选中/取消 操作
    $scope.checkTruckCount = function (event, year, index) {
        // 查询接口数据
        getDispatchStatistics(event.target.checked, year, index, 'truck_count');
    };

    // TAB2：图2：年列表 选中/取消 操作
    $scope.checkCarCount = function (event, year, index) {
        // 查询接口数据
        getDispatchStatistics(event.target.checked, year, index, 'car_count');
    };

    // TAB2：图3：年列表 选中/取消 操作
    $scope.checkTotalDistance = function (event, year, index) {
        // 查询接口数据
        getDispatchStatistics(event.target.checked, year, index, 'total_distance');
    };

    // TAB2：图4：年列表 选中/取消 操作
    $scope.checkLoadDistance = function (event, year, index) {
        // 查询接口数据
        getDispatchStatistics(event.target.checked, year, index, 'load_distance');
    };

    // TAB2：图5：年列表 选中/取消 操作
    $scope.checkLoadRatio = function (event, year, index) {
        // 查询接口数据
        getDispatchStatistics(event.target.checked, year, index, 'load_ratio');
    };

    /**
     * TAB2：初始化 图表数据
     * @param index 操作年份索引
     * @param type 操作chart图的区分
     */
    function initDispatchChartData(index, type){
        // 先清空 指定索引 y轴 数据
        switch (type) {
            case 'truck_count':
                $scope.yAxisDataDispatch[index].showTruckCount = false;
                $scope.yAxisDataDispatch[index].truckCount = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'car_count':
                $scope.yAxisDataDispatch[index].showCarCount = false;
                $scope.yAxisDataDispatch[index].carCount = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'total_distance':
                $scope.yAxisDataDispatch[index].showTotalDistance = false;
                $scope.yAxisDataDispatch[index].totalDistance = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'load_distance':
                $scope.yAxisDataDispatch[index].showLoadDistance = false;
                $scope.yAxisDataDispatch[index].loadDistance = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'load_ratio':
                $scope.yAxisDataDispatch[index].showLoadRatio = false;
                $scope.yAxisDataDispatch[index].loadRatio = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            default:
                break;
        }
    }

    /**
     * TAB2：根据区分 刷新指定图表
     * @param type 操作chart图的区分
     */
    $scope.refreshDispatchChart = function (type) {
        switch (type) {
            case 'truck_count':
                createDispatchChartData($("#truckCountStatistics"), 'truck_count', '辆', $scope.truckCountChartType);
                break;
            case 'car_count':
                createDispatchChartData($("#carCountStatistics"), 'car_count', '辆', $scope.carCountChartType);
                break;
            case 'total_distance':
                createDispatchChartData($("#totalDistanceStatistics"), 'total_distance', '公里', $scope.totalDistanceChartType);
                break;
            case 'load_distance':
                createDispatchChartData($("#loadDistanceStatistics"), 'load_distance', '公里', $scope.loadDistanceChartType);
                break;
            case 'load_ratio':
                createDispatchChartData($("#loadRatioStatistics"), 'load_ratio', '', $scope.loadRatioChartType);
                break;
            default:
                createDispatchChartData($("#truckCountStatistics"), 'truck_count', '辆', $scope.truckCountChartType);
                createDispatchChartData($("#carCountStatistics"), 'car_count', '辆', $scope.carCountChartType);
                createDispatchChartData($("#totalDistanceStatistics"), 'total_distance', '公里', $scope.totalDistanceChartType);
                createDispatchChartData($("#loadDistanceStatistics"), 'load_distance', '公里', $scope.loadDistanceChartType);
                createDispatchChartData($("#loadRatioStatistics"), 'load_ratio', '', $scope.loadRatioChartType);
        }
    };

    /**
     * 数据赋值
     * @param index y轴索引
     * @param month 月份索引
     * @param data 接口数据
     */
    function setDispatchStat(index, month, data){
        $scope.yAxisDataDispatch[index].truckCount[month] = data.truck_count;
        $scope.yAxisDataDispatch[index].carCount[month] = data.car_count;
        $scope.yAxisDataDispatch[index].totalDistance[month] = data.total_distance;
        $scope.yAxisDataDispatch[index].loadDistance[month] = data.load_distance;
        $scope.yAxisDataDispatch[index].loadRatio[month] = data.load_ratio;
    }

    /**
     * TAB2：调用接口 取得数据
     * @param showFlag 显示数据/清除数据
     * @param year 操作年份
     * @param index 操作年份索引
     * @param type 操作chart图的区分
     */
    function getDispatchStatistics(showFlag, year, index, type){
        // 初始化 图表数据
        initDispatchChartData(index, type);

        // 如果是checkbox是取消，则直接刷新chart
        if (!showFlag) {
            // 刷新图表
            $scope.refreshDispatchChart(type);
            return;
        }

        // 根据年 取得当前年的数据
        let obj = {
            yMonthStart: year + '01',
            yMonthEnd: year + '12'
        };
        let url = $host.api_url + "/user/" + userId + "/dispatchStat?" + _basic.objToUrl(obj);
        _basic.get(url).then(function (data) {
            if (data.success){
                data.result.reverse();
                switch (type) {
                    case 'truck_count':
                        $scope.yAxisDataDispatch[index].showTruckCount = true;
                        break;
                    case 'car_count':
                        $scope.yAxisDataDispatch[index].showCarCount = true;
                        break;
                    case 'total_distance':
                        $scope.yAxisDataDispatch[index].showTotalDistance = true;
                        break;
                    case 'load_distance':
                        $scope.yAxisDataDispatch[index].showLoadDistance = true;
                        break;
                    case 'load_ratio':
                        $scope.yAxisDataDispatch[index].showLoadRatio = true;
                        break;
                    default:
                        $scope.yAxisDataDispatch[index].showTruckCount = true;
                        $scope.yAxisDataDispatch[index].showCarCount = true;
                        $scope.yAxisDataDispatch[index].showTotalDistance = true;
                        $scope.yAxisDataDispatch[index].showLoadDistance = true;
                        $scope.yAxisDataDispatch[index].showLoadRatio = true;
                }

                // 给指定月份数据 赋值
                // 出车数 truck_count 发运量 car_count 总里程 total_distance 重载里程 load_distance 重载率 load_ratio
                for (var i = 0; i < data.result.length; i++) {
                    switch (data.result[i].y_month.toString().slice(4,6)) {
                        case '01':
                            setDispatchStat(index, 0, data.result[i]);
                            break;
                        case '02':
                            setDispatchStat(index, 1, data.result[i]);
                            break;
                        case '03':
                            setDispatchStat(index, 2, data.result[i]);
                            break;
                        case '04':
                            setDispatchStat(index, 3, data.result[i]);
                            break;
                        case '05':
                            setDispatchStat(index, 4, data.result[i]);
                            break;
                        case '06':
                            setDispatchStat(index, 5, data.result[i]);
                            break;
                        case '07':
                            setDispatchStat(index, 6, data.result[i]);
                            break;
                        case '08':
                            setDispatchStat(index, 7, data.result[i]);
                            break;
                        case '09':
                            setDispatchStat(index, 8, data.result[i]);
                            break;
                        case '10':
                            setDispatchStat(index, 9, data.result[i]);
                            break;
                        case '11':
                            setDispatchStat(index, 10, data.result[i]);
                            break;
                        case '12':
                            setDispatchStat(index, 11, data.result[i]);
                            break;
                    }
                }
                // 刷新图表
                $scope.refreshDispatchChart(type);
            } else{
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * TAB2：初始化 chart图
     * @param node 节点
     * @param type 操作chart图的区分
     * @param yAxisText 图表Y轴单位
     * @param chartType 图表显示类型：bar: 条形图，line：折线图，column：柱状图
     */
    function createDispatchChartData(node, type, yAxisText, chartType) {
        // 只显示 选中的年数据
        let yAxisData = [];
        for (let i = 0; i < $scope.yAxisDataDispatch.length; i++) {
            switch (type) {
                case 'truck_count':
                    if ($scope.yAxisDataDispatch[i].showTruckCount) {
                        yAxisData.push({name: $scope.yAxisDataDispatch[i].name, data: $scope.yAxisDataDispatch[i].truckCount});
                    }
                    break;
                case 'car_count':
                    if ($scope.yAxisDataDispatch[i].showCarCount) {
                        yAxisData.push({name: $scope.yAxisDataDispatch[i].name, data: $scope.yAxisDataDispatch[i].carCount});
                    }
                    break;
                case 'total_distance':
                    if ($scope.yAxisDataDispatch[i].showTotalDistance) {
                        yAxisData.push({name: $scope.yAxisDataDispatch[i].name, data: $scope.yAxisDataDispatch[i].totalDistance});
                    }
                    break;
                case 'load_distance':
                    if ($scope.yAxisDataDispatch[i].showLoadDistance) {
                        yAxisData.push({name: $scope.yAxisDataDispatch[i].name, data: $scope.yAxisDataDispatch[i].loadDistance});
                    }
                    break;
                case 'load_ratio':
                    if ($scope.yAxisDataDispatch[i].showLoadRatio) {
                        yAxisData.push({name: $scope.yAxisDataDispatch[i].name, data: $scope.yAxisDataDispatch[i].loadRatio});
                    }
                    break;
                default:
                    break;
            }
        }
        createChartOptions(node, chartType, yAxisText, yAxisData);
    }

    // TAB3：质量
    $scope.showQuality = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.quality').addClass("active");
        $("#quality").addClass("active");
        $("#quality").show();
        // 清空选中状态
        $(".quality").prop('checked', false);
        // 默认年全部选中
        $("#" + $scope.defaultYear + "_damage_count").prop('checked', true);
        $("#" + $scope.defaultYear + "_total_damge_money").prop('checked', true);
        $("#" + $scope.defaultYear + "_company_money").prop('checked', true);
        $("#" + $scope.defaultYear + "_per_car_damage_money").prop('checked', true);
        $("#" + $scope.defaultYear + "_per_car_c_damage_money").prop('checked', true);
        $("#" + $scope.defaultYear + "_clean_fee").prop('checked', true);
        $("#" + $scope.defaultYear + "_per_car_clean_fee").prop('checked', true);
        $("#" + $scope.defaultYear + "_damage_ratio").prop('checked', true);

        // 初始化图表类型
        $scope.damageCountChartType = $scope.chartTypeList[0].key;
        $scope.totalDamgeMoneyChartType = $scope.chartTypeList[0].key;
        $scope.companyMoneyChartType = $scope.chartTypeList[0].key;
        $scope.perCarDamageMoneyChartType = $scope.chartTypeList[0].key;
        $scope.perCarCDamageMoneyChartType = $scope.chartTypeList[0].key;
        $scope.cleanFeeChartType = $scope.chartTypeList[0].key;
        $scope.perCarCleanFeeChartType = $scope.chartTypeList[0].key;
        $scope.damageRatioChartType = $scope.chartTypeList[0].key;

        // 初始化 y轴 数据
        $scope.yAxisDataQuality = [];
        // 组装初始数据
        $scope.yearList.forEach(function (year) {
            // y轴
            $scope.yAxisDataQuality.push({
                name: year.key,
                showDamageCount: false,
                showTotalDamgeMoney: false,
                showCompanyMoney: false,
                showPerCarDamageMoney: false,
                showPerCarCDamageMoney: false,
                showCleanFee: false,
                showPerCarCleanFee: false,
                showDamageRatio: false,
                // 质损次数 damage_count 总体质损成本 total_damge_money 公司承担质损成本 company_money 单车质损成本 per_car_damage_money
                // 单车公司质损成本 per_car_c_damage_money 洗车费 clean_fee 单车洗车费 per_car_clean_fee 质损率 damage_ratio
                damageCount: [0,0,0,0,0,0,0,0,0,0,0,0],
                totalDamgeMoney: [0,0,0,0,0,0,0,0,0,0,0,0],
                companyMoney: [0,0,0,0,0,0,0,0,0,0,0,0],
                perCarDamageMoney: [0,0,0,0,0,0,0,0,0,0,0,0],
                perCarCDamageMoney: [0,0,0,0,0,0,0,0,0,0,0,0],
                cleanFee: [0,0,0,0,0,0,0,0,0,0,0,0],
                perCarCleanFee: [0,0,0,0,0,0,0,0,0,0,0,0],
                damageRatio: [0,0,0,0,0,0,0,0,0,0,0,0]
            });
        });

        // 默认显示最后一个年的数据
        let index = $scope.yearList.length - 1;
        // 默认：显示年列表最后一个年的数据
        getQualityStatistics(true, $scope.yearList[index].key, index,'');
    };

    // TAB3：图1：年列表 选中/取消 操作
    $scope.checkDamageCount = function (event, year, index) {
        // 查询接口数据
        getQualityStatistics(event.target.checked, year, index, 'damage_count');
    };

    // TAB3：图2：年列表 选中/取消 操作
    $scope.checkTotalDamgeMoney = function (event, year, index) {
        // 查询接口数据
        getQualityStatistics(event.target.checked, year, index, 'total_damge_money');
    };

    // TAB3：图3：年列表 选中/取消 操作
    $scope.checkCompanyMoney = function (event, year, index) {
        // 查询接口数据
        getQualityStatistics(event.target.checked, year, index, 'company_money');
    };

    // TAB3：图4：年列表 选中/取消 操作
    $scope.checkPerCarDamageMoney = function (event, year, index) {
        // 查询接口数据
        getQualityStatistics(event.target.checked, year, index, 'per_car_damage_money');
    };

    // TAB3：图5：年列表 选中/取消 操作
    $scope.checkPerCarCDamageMoney = function (event, year, index) {
        // 查询接口数据
        getQualityStatistics(event.target.checked, year, index, 'per_car_c_damage_money');
    };

    // TAB3：图6：年列表 选中/取消 操作
    $scope.checkCleanFee = function (event, year, index) {
        // 查询接口数据
        getQualityStatistics(event.target.checked, year, index, 'clean_fee');
    };

    // TAB3：图7：年列表 选中/取消 操作
    $scope.checkPerCarCleanFee = function (event, year, index) {
        // 查询接口数据
        getQualityStatistics(event.target.checked, year, index, 'per_car_clean_fee');
    };

    // TAB3：图8：年列表 选中/取消 操作
    $scope.checkDamageRatio = function (event, year, index) {
        // 查询接口数据
        getQualityStatistics(event.target.checked, year, index, 'damage_ratio');
    };

    /**
     * TAB3：初始化 图表数据
     * @param index 操作年份索引
     * @param type 操作chart图的区分
     */
    function initQualityChartData(index, type){
        // 先清空 指定索引 y轴 数据
        switch (type) {
            case 'damage_count':
                $scope.yAxisDataQuality[index].showDamageCount = false;
                $scope.yAxisDataQuality[index].damageCount = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'total_damge_money':
                $scope.yAxisDataQuality[index].showTotalDamgeMoney = false;
                $scope.yAxisDataQuality[index].totalDamgeMoney = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'company_money':
                $scope.yAxisDataQuality[index].showCompanyMoney = false;
                $scope.yAxisDataQuality[index].companyMoney = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'per_car_damage_money':
                $scope.yAxisDataQuality[index].showPerCarDamageMoney = false;
                $scope.yAxisDataQuality[index].perCarDamageMoney = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;

            case 'per_car_c_damage_money':
                $scope.yAxisDataQuality[index].showPerCarCDamageMoney = false;
                $scope.yAxisDataQuality[index].perCarCDamageMoney = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'clean_fee':
                $scope.yAxisDataQuality[index].showCleanFee = false;
                $scope.yAxisDataQuality[index].cleanFee = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'per_car_clean_fee':
                $scope.yAxisDataQuality[index].showPerCarCleanFee = false;
                $scope.yAxisDataQuality[index].perCarCleanFee = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'damage_ratio':
                $scope.yAxisDataQuality[index].showDamageRatio = false;
                $scope.yAxisDataQuality[index].damageRatio = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            default:
                break;
        }
    }

    /**
     * TAB3：根据区分 刷新指定图表
     * @param type 操作chart图的区分
     */
    $scope.refreshQualityChart = function (type) {
        switch (type) {
            case 'damage_count':
                createQualityChartData($("#damageCountStatistics"), 'damage_count', '次', $scope.damageCountChartType);
                break;
            case 'total_damge_money':
                createQualityChartData($("#totalDamgeMoneyStatistics"), 'total_damge_money', '元', $scope.totalDamgeMoneyChartType);
                break;
            case 'company_money':
                createQualityChartData($("#companyMoneyStatistics"), 'company_money', '元', $scope.companyMoneyChartType);
                break;
            case 'per_car_damage_money':
                createQualityChartData($("#perCarDamageMoneyStatistics"), 'per_car_damage_money', '元', $scope.perCarDamageMoneyChartType);
                break;
            case 'per_car_c_damage_money':
                createQualityChartData($("#perCarCDamageMoneyStatistics"), 'per_car_c_damage_money', '元', $scope.perCarCDamageMoneyChartType);
                break;
            case 'clean_fee':
                createQualityChartData($("#cleanFeeStatistics"), 'clean_fee', '元', $scope.cleanFeeChartType);
                break;
            case 'per_car_clean_fee':
                createQualityChartData($("#perCarCleanFeeStatistics"), 'per_car_clean_fee', '元', $scope.perCarCleanFeeChartType);
                break;
            case 'damage_ratio':
                createQualityChartData($("#damageRatioStatistics"), 'damage_ratio', '', $scope.damageRatioChartType);
                break;
            default:
                createQualityChartData($("#damageCountStatistics"), 'damage_count', '次', $scope.damageCountChartType);
                createQualityChartData($("#totalDamgeMoneyStatistics"), 'total_damge_money', '元', $scope.totalDamgeMoneyChartType);
                createQualityChartData($("#companyMoneyStatistics"), 'company_money', '元', $scope.companyMoneyChartType);
                createQualityChartData($("#perCarDamageMoneyStatistics"), 'per_car_damage_money', '元', $scope.perCarDamageMoneyChartType);
                createQualityChartData($("#perCarCDamageMoneyStatistics"), 'per_car_c_damage_money', '元', $scope.perCarCDamageMoneyChartType);
                createQualityChartData($("#cleanFeeStatistics"), 'clean_fee', '元', $scope.cleanFeeChartType);
                createQualityChartData($("#perCarCleanFeeStatistics"), 'per_car_clean_fee', '元', $scope.perCarCleanFeeChartType);
                createQualityChartData($("#damageRatioStatistics"), 'damage_ratio', '', $scope.damageRatioChartType);
        }
    };

    /**
     * 数据赋值
     * @param index y轴索引
     * @param month 月份索引
     * @param data 接口数据
     */
    function setQualityStat(index, month, data){
        $scope.yAxisDataQuality[index].damageCount[month] = data.damage_count;
        $scope.yAxisDataQuality[index].totalDamgeMoney[month] = data.total_damange_money;
        $scope.yAxisDataQuality[index].companyMoney[month] = data.company_damage_money;
        $scope.yAxisDataQuality[index].perCarDamageMoney[month] = data.per_car_damage_money;

        $scope.yAxisDataQuality[index].perCarCDamageMoney[month] = data.per_car_c_damange_money;
        $scope.yAxisDataQuality[index].cleanFee[month] = data.clean_fee;
        $scope.yAxisDataQuality[index].perCarCleanFee[month] = data.per_car_clean_fee;
        $scope.yAxisDataQuality[index].damageRatio[month] = data.damage_ratio;
    }

    /**
     * TAB3：调用接口 取得数据
     * @param showFlag 显示数据/清除数据
     * @param year 操作年份
     * @param index 操作年份索引
     * @param type 操作chart图的区分
     */
    function getQualityStatistics(showFlag, year, index, type){
        // 初始化 图表数据
        initQualityChartData(index, type);

        // 如果是checkbox是取消，则直接刷新chart
        if (!showFlag) {
            // 刷新图表
            $scope.refreshQualityChart(type);
            return;
        }

        // 根据年 取得当前年的数据
        let obj = {
            yMonthStart: year + '01',
            yMonthEnd: year + '12'
        };
        let url = $host.api_url + "/user/" + userId + "/qualityStat?" + _basic.objToUrl(obj);
        _basic.get(url).then(function (data) {
            if (data.success){
                data.result.reverse();
                switch (type) {
                    case 'damage_count':
                        $scope.yAxisDataQuality[index].showDamageCount = true;
                        break;
                    case 'total_damge_money':
                        $scope.yAxisDataQuality[index].showTotalDamgeMoney = true;
                        break;
                    case 'company_money':
                        $scope.yAxisDataQuality[index].showCompanyMoney = true;
                        break;
                    case 'per_car_damage_money':
                        $scope.yAxisDataQuality[index].showPerCarDamageMoney = true;
                        break;
                    case 'per_car_c_damage_money':
                        $scope.yAxisDataQuality[index].showPerCarCDamageMoney = true;
                        break;
                    case 'clean_fee':
                        $scope.yAxisDataQuality[index].showCleanFee = true;
                        break;
                    case 'per_car_clean_fee':
                        $scope.yAxisDataQuality[index].showPerCarCleanFee = true;
                        break;
                    case 'damage_ratio':
                        $scope.yAxisDataQuality[index].showDamageRatio = true;
                        break;
                    default:
                        $scope.yAxisDataQuality[index].showDamageCount = true;
                        $scope.yAxisDataQuality[index].showTotalDamgeMoney = true;
                        $scope.yAxisDataQuality[index].showCompanyMoney = true;
                        $scope.yAxisDataQuality[index].showPerCarDamageMoney = true;
                        $scope.yAxisDataQuality[index].showPerCarCDamageMoney = true;
                        $scope.yAxisDataQuality[index].showCleanFee = true;
                        $scope.yAxisDataQuality[index].showPerCarCleanFee = true;
                        $scope.yAxisDataQuality[index].showDamageRatio = true;
                }

                // 给指定月份数据 赋值
                // 出车数 truck_count 发运量 car_count 总里程 total_distance 重载里程 load_distance 重载率 load_ratio
                for (let i = 0; i < data.result.length; i++) {
                    switch (data.result[i].y_month.toString().slice(4,6)) {
                        case '01':
                            setQualityStat(index, 0, data.result[i]);
                            break;
                        case '02':
                            setQualityStat(index, 1, data.result[i]);
                            break;
                        case '03':
                            setQualityStat(index, 2, data.result[i]);
                            break;
                        case '04':
                            setQualityStat(index, 3, data.result[i]);
                            break;
                        case '05':
                            setQualityStat(index, 4, data.result[i]);
                            break;
                        case '06':
                            setQualityStat(index, 5, data.result[i]);
                            break;
                        case '07':
                            setQualityStat(index, 6, data.result[i]);
                            break;
                        case '08':
                            setQualityStat(index, 7, data.result[i]);
                            break;
                        case '09':
                            setQualityStat(index, 8, data.result[i]);
                            break;
                        case '10':
                            setQualityStat(index, 9, data.result[i]);
                            break;
                        case '11':
                            setQualityStat(index, 10, data.result[i]);
                            break;
                        case '12':
                            setQualityStat(index, 11, data.result[i]);
                            break;
                    }
                }
                // 刷新图表
                $scope.refreshQualityChart(type);
            } else{
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * TAB3：初始化 chart图
     * @param node 节点
     * @param type 操作chart图的区分
     * @param yAxisText 图表Y轴单位
     * @param chartType 图表显示类型：bar: 条形图，line：折线图，column：柱状图
     */
    function createQualityChartData(node, type, yAxisText, chartType) {
        // 只显示 选中的年数据
        let yAxisData = [];
        for (let i = 0; i < $scope.yAxisDataQuality.length; i++) {
            switch (type) {
                case 'damage_count':
                    if ($scope.yAxisDataQuality[i].showDamageCount) {
                        yAxisData.push({name: $scope.yAxisDataQuality[i].name, data: $scope.yAxisDataQuality[i].damageCount});
                    }
                    break;
                case 'total_damge_money':
                    if ($scope.yAxisDataQuality[i].showTotalDamgeMoney) {
                        yAxisData.push({name: $scope.yAxisDataQuality[i].name, data: $scope.yAxisDataQuality[i].totalDamgeMoney});
                    }
                    break;
                case 'company_money':
                    if ($scope.yAxisDataQuality[i].showCompanyMoney) {
                        yAxisData.push({name: $scope.yAxisDataQuality[i].name, data: $scope.yAxisDataQuality[i].companyMoney});
                    }
                    break;
                case 'per_car_damage_money':
                    if ($scope.yAxisDataQuality[i].showPerCarDamageMoney) {
                        yAxisData.push({name: $scope.yAxisDataQuality[i].name, data: $scope.yAxisDataQuality[i].perCarDamageMoney});
                    }
                    break;
                case 'per_car_c_damage_money':
                    if ($scope.yAxisDataQuality[i].showPerCarCDamageMoney) {
                        yAxisData.push({name: $scope.yAxisDataQuality[i].name, data: $scope.yAxisDataQuality[i].perCarCDamageMoney});
                    }
                    break;
                case 'clean_fee':
                    if ($scope.yAxisDataQuality[i].showCleanFee) {
                        yAxisData.push({name: $scope.yAxisDataQuality[i].name, data: $scope.yAxisDataQuality[i].cleanFee});
                    }
                    break;
                case 'per_car_clean_fee':
                    if ($scope.yAxisDataQuality[i].showPerCarCleanFee) {
                        yAxisData.push({name: $scope.yAxisDataQuality[i].name, data: $scope.yAxisDataQuality[i].perCarCleanFee});
                    }
                    break;
                case 'damage_ratio':
                    if ($scope.yAxisDataQuality[i].showDamageRatio) {
                        yAxisData.push({name: $scope.yAxisDataQuality[i].name, data: $scope.yAxisDataQuality[i].damageRatio});
                    }
                    break;
                default:
                    break;
            }
        }
        createChartOptions(node, chartType, yAxisText, yAxisData);
    }

    // TAB4：车管
    $scope.showTruck = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.truck').addClass("active");
        $("#truck").addClass("active");
        $("#truck").show();
        // 清空选中状态
        $(".truck").prop('checked', false);
        // 默认年全部选中
        // 过路费 etc_fee 油量 oil_vol 油费 oil_fee 尿素量 urea_vol 尿素费 urea_fee
        // 修理费 repair_fee 保养费 maintian_fee 配件费 part_fee 买分金额 buy_score_fee 交通罚款 traffic_fine_fee
        // 个人承担违章  driver_under_money 公司承担违章 company_under_money  在外维修次数 outer_repair_count 在外维修金额 outer_repair_fee
        $("#" + $scope.defaultYear + "_etc_fee").prop('checked', true);
        $("#" + $scope.defaultYear + "_oil_vol").prop('checked', true);
        $("#" + $scope.defaultYear + "_oil_fee").prop('checked', true);
        $("#" + $scope.defaultYear + "_urea_vol").prop('checked', true);
        $("#" + $scope.defaultYear + "_urea_fee").prop('checked', true);
        $("#" + $scope.defaultYear + "_repair_fee").prop('checked', true);
        $("#" + $scope.defaultYear + "_part_fee").prop('checked', true);
        $("#" + $scope.defaultYear + "_maintian_fee").prop('checked', true);
        $("#" + $scope.defaultYear + "_outer_repair_count").prop('checked', true);
        $("#" + $scope.defaultYear + "_outer_repair_fee").prop('checked', true);
        $("#" + $scope.defaultYear + "_buy_score_fee").prop('checked', true);
        $("#" + $scope.defaultYear + "_traffic_fine_fee").prop('checked', true);
        $("#" + $scope.defaultYear + "_driver_under_money").prop('checked', true);
        $("#" + $scope.defaultYear + "_company_under_money").prop('checked', true);

        // 初始化图表类型
        $scope.etcFeeChartType = $scope.chartTypeList[0].key;
        $scope.oilVolChartType = $scope.chartTypeList[0].key;
        $scope.oilFeeChartType = $scope.chartTypeList[0].key;
        $scope.ureaVolChartType = $scope.chartTypeList[0].key;
        $scope.ureaFeeChartType = $scope.chartTypeList[0].key;
        $scope.repairFeeChartType = $scope.chartTypeList[0].key;
        $scope.maintianFeeChartType = $scope.chartTypeList[0].key;
        $scope.partFeeChartType = $scope.chartTypeList[0].key;
        $scope.buyScoreFeeChartType = $scope.chartTypeList[0].key;
        $scope.trafficFineFeeChartType = $scope.chartTypeList[0].key;
        $scope.driverUnderMoneyChartType = $scope.chartTypeList[0].key;
        $scope.companyUnderMoneyChartType = $scope.chartTypeList[0].key;
        $scope.outerRepairCountChartType = $scope.chartTypeList[0].key;
        $scope.outerRepairFeeChartType = $scope.chartTypeList[0].key;
        // 初始化 y轴 数据
        $scope.yAxisDataTruck = [];
        // 组装初始数据
        $scope.yearList.forEach(function (year) {
            // y轴
            $scope.yAxisDataTruck.push({
                name: year.key,
                showEtcFee: false,
                showOilVol: false,
                showOilFee: false,
                showUreaVol: false,
                showUreaFee: false,
                showRepairFee: false,
                showPartFee: false,
                showMaintianFee: false,
                showOuterRepairCount: false,
                showOuterRepairFee: false,
                showBuyScoreFee: false,
                showTrafficFineFee: false,
                showDriverUnderMoney: false,
                showCompanyUnderMoney: false,
                etcFee: [0,0,0,0,0,0,0,0,0,0,0,0],
                oilVol: [0,0,0,0,0,0,0,0,0,0,0,0],
                oilFee: [0,0,0,0,0,0,0,0,0,0,0,0],
                ureaVol: [0,0,0,0,0,0,0,0,0,0,0,0],
                ureaFee: [0,0,0,0,0,0,0,0,0,0,0,0],
                repairFee: [0,0,0,0,0,0,0,0,0,0,0,0],
                partFee: [0,0,0,0,0,0,0,0,0,0,0,0],
                maintianFee: [0,0,0,0,0,0,0,0,0,0,0,0],
                outerRepairCount: [0,0,0,0,0,0,0,0,0,0,0,0],
                outerRepairFee: [0,0,0,0,0,0,0,0,0,0,0,0],
                buyScoreFee: [0,0,0,0,0,0,0,0,0,0,0,0],
                trafficFineFee: [0,0,0,0,0,0,0,0,0,0,0,0],
                driverUnderMoney: [0,0,0,0,0,0,0,0,0,0,0,0],
                companyUnderMoney: [0,0,0,0,0,0,0,0,0,0,0,0]
            });
        });

        // 默认显示最后一个年的数据
        let index = $scope.yearList.length - 1;
        // 默认：显示年列表最后一个年的数据
        getTruckStatistics(true, $scope.yearList[index].key, index,'');
    };

    // TAB4：图1：年列表 选中/取消 操作
    $scope.checkEtcFee = function (event, year, index) {
        // 查询接口数据
        getTruckStatistics(event.target.checked, year, index, 'etc_fee');
    };

    // TAB4：图2：年列表 选中/取消 操作
    $scope.checkOilVol = function (event, year, index) {
        // 查询接口数据
        getTruckStatistics(event.target.checked, year, index, 'oil_vol');
    };
    $scope.checkOilFee = function (event, year, index) {
        // 查询接口数据
        getTruckStatistics(event.target.checked, year, index, 'oil_fee');
    };

    // TAB4：图3：年列表 选中/取消 操作
    $scope.checkUreaVol = function (event, year, index) {
        // 查询接口数据
        getTruckStatistics(event.target.checked, year, index, 'urea_vol');
    };
    $scope.checkUreaFee = function (event, year, index) {
        // 查询接口数据
        getTruckStatistics(event.target.checked, year, index, 'urea_fee');
    };

    // TAB4：图4：年列表 选中/取消 操作
    $scope.checkRepairFee = function (event, year, index) {
        // 查询接口数据
        getTruckStatistics(event.target.checked, year, index, 'repair_fee');
    };
    $scope.checkMaintianFee = function (event, year, index) {
        // 查询接口数据
        getTruckStatistics(event.target.checked, year, index, 'maintian_fee');
    };

    // TAB4：图5：年列表 选中/取消 操作
    $scope.checkPartFee = function (event, year, index) {
        // 查询接口数据
        getTruckStatistics(event.target.checked, year, index, 'part_fee');
    };

    // TAB4：图6：年列表 选中/取消 操作
    $scope.checkBuyScoreFee = function (event, year, index) {
        // 查询接口数据
        getTruckStatistics(event.target.checked, year, index, 'buy_score_fee');
    };
    $scope.checkTrafficFineFee = function (event, year, index) {
        // 查询接口数据
        getTruckStatistics(event.target.checked, year, index, 'traffic_fine_fee');
    };

    // TAB4：图7：年列表 选中/取消 操作
    $scope.checkDriverUnderMoney = function (event, year, index) {
        // 查询接口数据
        getTruckStatistics(event.target.checked, year, index, 'driver_under_money');
    };
    $scope.checkCompanyUnderMoney = function (event, year, index) {
        // 查询接口数据
        getTruckStatistics(event.target.checked, year, index, 'company_under_money');
    };
    // TAB4：图8：年列表 选中/取消 操作
    $scope.checkOuterRepairCount = function (event, year, index) {
        // 查询接口数据
        getTruckStatistics(event.target.checked, year, index, 'outer_repair_count');
    };
    $scope.checkOuterRepairFee = function (event, year, index) {
        // 查询接口数据
        getTruckStatistics(event.target.checked, year, index, 'outer_repair_fee');
    };

    /**
     * TAB4：初始化 图表数据
     * @param index 操作年份索引
     * @param type 操作chart图的区分
     */
    function initTruckChartData(index, type){
        // 先清空 指定索引 y轴 数据
        switch (type) {
            case 'etc_fee':
                $scope.yAxisDataTruck[index].showEtcFee = false;
                $scope.yAxisDataTruck[index].etcFee = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'oil_vol':
                $scope.yAxisDataTruck[index].showOilVol = false;
                $scope.yAxisDataTruck[index].oilVol = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'oil_fee':
                $scope.yAxisDataTruck[index].showOilFee = false;
                $scope.yAxisDataTruck[index].oilFee = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'urea_vol':
                $scope.yAxisDataTruck[index].showUreaVol = false;
                $scope.yAxisDataTruck[index].ureaVol = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'urea_fee':
                $scope.yAxisDataTruck[index].showUreaFee = false;
                $scope.yAxisDataTruck[index].ureaFee = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'repair_fee':
                $scope.yAxisDataTruck[index].showRepairFee = false;
                $scope.yAxisDataTruck[index].repairFee = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'part_fee':
                $scope.yAxisDataTruck[index].showPartFee = false;
                $scope.yAxisDataTruck[index].partFee = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'maintian_fee':
                $scope.yAxisDataTruck[index].showMaintianFee = false;
                $scope.yAxisDataTruck[index].maintianFee = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'buy_score_fee':
                $scope.yAxisDataTruck[index].showMaintianFee = false;
                $scope.yAxisDataTruck[index].buyScoreFee = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'traffic_fine_fee':
                $scope.yAxisDataTruck[index].showMaintianFee = false;
                $scope.yAxisDataTruck[index].trafficFineFee = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'driver_under_money':
                $scope.yAxisDataTruck[index].showDriverUnderMoney = false;
                $scope.yAxisDataTruck[index].driverUnderMoney = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'company_under_money':
                $scope.yAxisDataTruck[index].showCompanyUnderMoney = false;
                $scope.yAxisDataTruck[index].companyUnderMoney = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            // 在外维修次数  在外维修金额
            case 'outer_repair_count':
                $scope.yAxisDataTruck[index].showOuterRepairCount = false;
                $scope.yAxisDataTruck[index].outerRepairCount = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            case 'outer_repair_fee':
                $scope.yAxisDataTruck[index].showOuterRepairFee = false;
                $scope.yAxisDataTruck[index].outerRepairFee = [0,0,0,0,0,0,0,0,0,0,0,0];
                break;
            default:
                break;
        }
    }

    /**
     * TAB4：根据区分 刷新指定图表
     * @param type 操作chart图的区分
     */
    $scope.refreshTruckChart = function (type) {
        switch (type) {
            // 过路费
            case 'etc_fee':
                createTruckChartData($("#etcFeeStatistics"), 'etc_fee', '元', $scope.etcFeeChartType);
                break;
            case 'oil_vol':
                createTruckChartData($("#oilVolStatistics"), 'oil_vol', '升',$scope.oilVolChartType);
                break;
            case 'oil_fee':
                createTruckChartData($("#oilFeeStatistics"), 'oil_fee','元', $scope.oilFeeChartType);
                break;
            // 尿素量 urea_vol 尿素费 urea_fee
            case 'urea_vol':
                createTruckChartData($("#ureaVolStatistics"), 'urea_vol','升', $scope.ureaVolChartType);
                break;
            case 'urea_fee':
                createTruckChartData($("#ureaFeeStatistics"), 'urea_fee','元', $scope.ureaFeeChartType);
                break;
            // 修理费 repair_fee 保养费 maintian_fee
            case 'repair_fee':
                createTruckChartData($("#repairFeeStatistics"), 'repair_fee','元', $scope.repairFeeChartType);
                break;
            case 'maintian_fee':
                createTruckChartData($("#maintianFeeStatistics"), 'maintian_fee','元', $scope.maintianFeeChartType);
                break;
            // 配件费 part_fee
            case 'part_fee':
                createTruckChartData($("#partFeeStatistics"), 'part_fee', '元',$scope.partFeeChartType);
                break;
            // 买分金额 buy_score_fee 交通罚款 traffic_fine_fee
            case 'buy_score_fee':
                createTruckChartData($("#buyScoreFeeStatistics"), 'buy_score_fee','元', $scope.buyScoreFeeChartType);
                break;
            case 'traffic_fine_fee':
                createTruckChartData($("#trafficFineFeeStatistics"), 'traffic_fine_fee', '元',$scope.trafficFineFeeChartType);
                break;
            // 个人承担违章  driver_under_money 公司承担违章 company_under_money
            case 'driver_under_money':
                createTruckChartData($("#driverUnderMoneyStatistics"), 'driver_under_money','元', $scope.driverUnderMoneyChartType);
                break;
            case 'company_under_money':
                createTruckChartData($("#companyUnderMoneyStatistics"), 'company_under_money','元', $scope.companyUnderMoneyChartType);
                break;
            // 在外维修次数 outer_repair_count 在外维修金额 outer_repair_fee
            case 'outer_repair_count':
                createTruckChartData($("#outerRepairCountStatistics"), 'outer_repair_count', '次',$scope.outerRepairCountChartType);
                break;
            case 'outer_repair_fee':
                createTruckChartData($("#outerRepairFeeStatistics"), 'outer_repair_fee', '元',$scope.outerRepairFeeChartType);
                break;
            default:
                createTruckChartData($("#etcFeeStatistics"), 'etc_fee', '元', $scope.etcFeeChartType);
                createTruckChartData($("#oilVolStatistics"), 'oil_vol', '升',$scope.oilVolChartType);
                createTruckChartData($("#oilFeeStatistics"), 'oil_fee', '元',$scope.oilFeeChartType);
                createTruckChartData($("#ureaVolStatistics"), 'urea_vol','升', $scope.ureaVolChartType);
                createTruckChartData($("#ureaFeeStatistics"), 'urea_fee', '元',$scope.ureaFeeChartType);
                createTruckChartData($("#repairFeeStatistics"), 'repair_fee','元', $scope.repairFeeChartType);
                createTruckChartData($("#maintianFeeStatistics"), 'maintian_fee','元', $scope.maintianFeeChartType);
                createTruckChartData($("#partFeeStatistics"), 'part_fee','元', $scope.partFeeChartType);
                createTruckChartData($("#buyScoreFeeStatistics"), 'buy_score_fee','元', $scope.buyScoreFeeChartType);
                createTruckChartData($("#trafficFineFeeStatistics"), 'traffic_fine_fee','元', $scope.trafficFineFeeChartType);
                createTruckChartData($("#driverUnderMoneyStatistics"), 'driver_under_money','元', $scope.driverUnderMoneyChartType);
                createTruckChartData($("#companyUnderMoneyStatistics"), 'company_under_money','元', $scope.companyUnderMoneyChartType);
                createTruckChartData($("#outerRepairCountStatistics"), 'outer_repair_count', '次',$scope.outerRepairCountChartType);
                createTruckChartData($("#outerRepairFeeStatistics"), 'outer_repair_fee', '元',$scope.outerRepairFeeChartType);
        }
    };

    /**
     * TAB4：初始化 chart图
     * @param node 节点
     * @param type 操作chart图的区分
     * @param yAxisText 图表Y轴单位
     * @param chartType 图表显示类型：bar: 条形图，line：折线图，column：柱状图
     */
    function createTruckChartData(node, type, yAxisText, chartType) {
        // 只显示 选中的年数据
        let yAxisData = [];
        for (let i = 0; i < $scope.yAxisDataTruck.length; i++) {
            switch (type) {
                case 'etc_fee':
                    if ($scope.yAxisDataTruck[i].showEtcFee) {
                        yAxisData.push({name: $scope.yAxisDataTruck[i].name, data: $scope.yAxisDataTruck[i].etcFee});
                    }
                    break;
                case 'oil_vol':
                    if ($scope.yAxisDataTruck[i].showOilVol) {
                        yAxisData.push({name: $scope.yAxisDataTruck[i].name, data: $scope.yAxisDataTruck[i].oilVol});
                    }
                    break;
                case 'oil_fee':
                    if ($scope.yAxisDataTruck[i].showOilFee) {
                        yAxisData.push({name: $scope.yAxisDataTruck[i].name, data: $scope.yAxisDataTruck[i].oilFee});
                    }
                    break;
                case 'urea_vol':
                    if ($scope.yAxisDataTruck[i].showUreaVol) {
                        yAxisData.push({name: $scope.yAxisDataTruck[i].name, data: $scope.yAxisDataTruck[i].ureaVol});
                    }
                    break;
                case 'urea_fee':
                    if ($scope.yAxisDataTruck[i].showUreaFee) {
                        yAxisData.push({name: $scope.yAxisDataTruck[i].name, data: $scope.yAxisDataTruck[i].ureaFee});
                    }
                    break;
                case 'repair_fee':
                    if ($scope.yAxisDataTruck[i].showRepairFee) {
                        yAxisData.push({name: $scope.yAxisDataTruck[i].name, data: $scope.yAxisDataTruck[i].repairFee});
                    }
                    break;
                case 'maintian_fee':
                    if ($scope.yAxisDataTruck[i].showMaintianFee) {
                        yAxisData.push({name: $scope.yAxisDataTruck[i].name, data: $scope.yAxisDataTruck[i].maintianFee});
                    }
                    break;
                case 'part_fee':
                    if ($scope.yAxisDataTruck[i].showPartFee) {
                        yAxisData.push({name: $scope.yAxisDataTruck[i].name, data: $scope.yAxisDataTruck[i].partFee});
                    }
                    break;
                case 'buy_score_fee':
                    if ($scope.yAxisDataTruck[i].showBuyScoreFee) {
                        yAxisData.push({name: $scope.yAxisDataTruck[i].name, data: $scope.yAxisDataTruck[i].buyScoreFee});
                    }
                    break;
                case 'traffic_fine_fee':
                    if ($scope.yAxisDataTruck[i].showTrafficFineFee) {
                        yAxisData.push({name: $scope.yAxisDataTruck[i].name, data: $scope.yAxisDataTruck[i].trafficFineFee});
                    }
                    break;
                case 'driver_under_money':
                    if ($scope.yAxisDataTruck[i].showDriverUnderMoney) {
                        yAxisData.push({name: $scope.yAxisDataTruck[i].name, data: $scope.yAxisDataTruck[i].driverUnderMoney});
                    }
                    break;
                case 'company_under_money':
                    if ($scope.yAxisDataTruck[i].showCompanyUnderMoney) {
                        yAxisData.push({name: $scope.yAxisDataTruck[i].name, data: $scope.yAxisDataTruck[i].companyUnderMoney});
                    }
                    break;
                case 'outer_repair_count':
                    if ($scope.yAxisDataTruck[i].showOuterRepairCount) {
                        yAxisData.push({name: $scope.yAxisDataTruck[i].name, data: $scope.yAxisDataTruck[i].outerRepairCount});
                    }
                    break;
                case 'outer_repair_fee':
                    if ($scope.yAxisDataTruck[i].showOuterRepairFee) {
                        yAxisData.push({name: $scope.yAxisDataTruck[i].name, data: $scope.yAxisDataTruck[i].outerRepairFee});
                    }
                    break;
                default:
                    break;
            }
        }
        createChartOptions(node, chartType, yAxisText, yAxisData);
    }

    /**
     * 数据赋值
     * @param index y轴索引
     * @param month 月份索引
     * @param data 接口数据
     */
    function setTruckStat(index, month, data){
        // 过路费 etc_fee
        // 油量 oil_vol 油费 oil_fee
        // 尿素量 urea_vol 尿素费 urea_fee
        // 修理费 repair_fee 保养费 maintian_fee
        // 配件费 part_fee
        // 买分金额 buy_score_fee 交通罚款 traffic_fine_fee
        // 个人承担违章  driver_under_money 公司承担违章 company_under_money
        // 在外维修次数 outer_repair_count 在外维修金额 outer_repair_fee
        $scope.yAxisDataTruck[index].etcFee[month] = data.etc_fee;
        $scope.yAxisDataTruck[index].oilVol[month] = data.oil_vol;
        $scope.yAxisDataTruck[index].oilFee[month] = data.oil_fee;
        $scope.yAxisDataTruck[index].ureaVol[month] = data.urea_vol;
        $scope.yAxisDataTruck[index].ureaFee[month] = data.urea_fee;
        $scope.yAxisDataTruck[index].repairFee[month] = data.repair_fee;
        $scope.yAxisDataTruck[index].partFee[month] = data.part_fee;
        $scope.yAxisDataTruck[index].maintianFee[month] = data.maintain_fee;
        $scope.yAxisDataTruck[index].outerRepairCount[month] = data.outer_repair_count;
        $scope.yAxisDataTruck[index].outerRepairFee[month] = data.outer_repair_fee;
        $scope.yAxisDataTruck[index].buyScoreFee[month] = data.buy_score_fee;
        $scope.yAxisDataTruck[index].trafficFineFee[month] = data.traffic_fine_fee;
        $scope.yAxisDataTruck[index].driverUnderMoney[month] = data.driver_under_money;
        $scope.yAxisDataTruck[index].companyUnderMoney[month] = data.company_under_money;
    }

    /**
     * TAB4：调用接口 取得数据
     * @param showFlag 显示数据/清除数据
     * @param year 操作年份
     * @param index 操作年份索引
     * @param type 操作chart图的区分
     */
    function getTruckStatistics(showFlag, year, index, type){
        // 初始化 图表数据
        initTruckChartData(index, type);

        // 如果是checkbox是取消，则直接刷新chart
        if (!showFlag) {
            // 刷新图表
            $scope.refreshTruckChart(type);
            return;
        }

        // 根据年 取得当前年的数据
        let obj = {
            yMonthStart: year + '01',
            yMonthEnd: year + '12'
        };
        let url = $host.api_url + "/user/" + userId + "/truckStat?" + _basic.objToUrl(obj);
        _basic.get(url).then(function (data) {
            if (data.success){
                data.result.reverse();
                switch (type) {
                    case 'etc_fee':
                        $scope.yAxisDataTruck[index].showEtcFee = true;
                        break;
                    case 'oil_vol':
                        $scope.yAxisDataTruck[index].showOilVol = true;
                        break;
                    case 'oil_fee':
                        $scope.yAxisDataTruck[index].showOilFee = true;
                        break;
                    // 尿素量 urea_vol 尿素费 urea_fee
                    case 'urea_vol':
                        $scope.yAxisDataTruck[index].showUreaVol = true;
                        break;
                    case 'urea_fee':
                        $scope.yAxisDataTruck[index].showUreaFee = true;
                        break;
                    // 修理费 repair_fee 保养费 maintian_fee
                    case 'repair_fee':
                        $scope.yAxisDataTruck[index].showRepairFee = true;
                        break;
                    case 'maintian_fee':
                        $scope.yAxisDataTruck[index].showMaintianFee = true;
                        break;
                    // 配件费 part_fee
                    case 'part_fee':
                        $scope.yAxisDataTruck[index].showPartFee = true;
                        break;
                    // 买分金额 buy_score_fee 交通罚款 traffic_fine_fee
                    case 'buy_score_fee':
                        $scope.yAxisDataTruck[index].showBuyScoreFee = true;
                        break;
                    case 'traffic_fine_fee':
                        $scope.yAxisDataTruck[index].showTrafficFineFee = true;
                        break;
                    // 个人承担违章  driver_under_money 公司承担违章 company_under_money
                    case 'driver_under_money':
                        $scope.yAxisDataTruck[index].showDriverUnderMoney = true;
                        break;
                    case 'company_under_money':
                        $scope.yAxisDataTruck[index].showCompanyUnderMoney = true;
                        break;
                    // 在外维修次数 outer_repair_count 在外维修金额 outer_repair_fee
                    case 'outer_repair_count':
                        $scope.yAxisDataTruck[index].showOuterRepairCount = true;
                        break;
                    case 'outer_repair_fee':
                        $scope.yAxisDataTruck[index].showOuterRepairFee = true;
                        break;
                    default:
                        $scope.yAxisDataTruck[index].showEtcFee = true;
                        $scope.yAxisDataTruck[index].showOilVol = true;
                        $scope.yAxisDataTruck[index].showOilFee = true;
                        $scope.yAxisDataTruck[index].showUreaVol = true;
                        $scope.yAxisDataTruck[index].showUreaFee = true;
                        $scope.yAxisDataTruck[index].showRepairFee = true;
                        $scope.yAxisDataTruck[index].showMaintianFee = true;
                        $scope.yAxisDataTruck[index].showPartFee = true;
                        $scope.yAxisDataTruck[index].showBuyScoreFee = true;
                        $scope.yAxisDataTruck[index].showTrafficFineFee = true;
                        $scope.yAxisDataTruck[index].showDriverUnderMoney = true;
                        $scope.yAxisDataTruck[index].showCompanyUnderMoney = true;
                        $scope.yAxisDataTruck[index].showOuterRepairCount = true;
                        $scope.yAxisDataTruck[index].showOuterRepairFee = true;
                }

                // 给指定月份数据 赋值
                for (let i = 0; i < data.result.length; i++) {
                    switch (data.result[i].y_month.toString().slice(4,6)) {
                        case '01':
                            setTruckStat(index, 0, data.result[i]);
                            break;
                        case '02':
                            setTruckStat(index, 1, data.result[i]);
                            break;
                        case '03':
                            setTruckStat(index, 2, data.result[i]);
                            break;
                        case '04':
                            setTruckStat(index, 3, data.result[i]);
                            break;
                        case '05':
                            setTruckStat(index, 4, data.result[i]);
                            break;
                        case '06':
                            setTruckStat(index, 5, data.result[i]);
                            break;
                        case '07':
                            setTruckStat(index, 6, data.result[i]);
                            break;
                        case '08':
                            setTruckStat(index, 7, data.result[i]);
                            break;
                        case '09':
                            setTruckStat(index, 8, data.result[i]);
                            break;
                        case '10':
                            setTruckStat(index, 9, data.result[i]);
                            break;
                        case '11':
                            setTruckStat(index, 10, data.result[i]);
                            break;
                        case '12':
                            setTruckStat(index, 11, data.result[i]);
                            break;
                    }
                }
                // 刷新图表
                $scope.refreshTruckChart(type);
            } else{
                swal(data.msg, "", "error");
            }
        });
    }

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