app.controller("department_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
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
    function refreshChart(type){
        switch (type) {
            case 'outPut':
                createSettleChartData($("#outputStatistics"), 'outPut');
                break;
            case 'outer':
                createSettleChartData($("#outerOutputStatistics"), 'outer');
                break;
            case 'perTruck':
                createSettleChartData($("#perTruckOutputStatistics"), 'perTruck');
                break;
            case 'perKm':
                createSettleChartData($("#perKmOutputStatistics"), 'perKm');
                break;
            default:
                createSettleChartData($("#outputStatistics"), 'outPut');
                createSettleChartData($("#outerOutputStatistics"), 'outer');
                createSettleChartData($("#perTruckOutputStatistics"), 'perTruck');
                createSettleChartData($("#perKmOutputStatistics"), 'perKm');
        }
    }

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
            refreshChart(type);
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
                refreshChart(type);
            } else{
                swal(data.msg, "", "error");
            }
        });
    }

    // TAB1：初始化 chart图
    function createSettleChartData(node, type) {
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
        createChartOptions(node, 'column', '元', yAxisData);
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
                // 出车数 truck_count 发运量 car_count 总里程 total_distance 重载历程 load_distance 重载率 load_ratio
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
    function refreshDispatchChart(type){
        switch (type) {
            case 'truck_count':
                createDispatchChartData($("#truckCountStatistics"), 'truck_count', '辆');
                break;
            case 'car_count':
                createDispatchChartData($("#carCountStatistics"), 'car_count', '辆');
                break;
            case 'total_distance':
                createDispatchChartData($("#totalDistanceStatistics"), 'total_distance', '公里');
                break;
            case 'load_distance':
                createDispatchChartData($("#loadDistanceStatistics"), 'load_distance', '公里');
                break;
            case 'load_ratio':
                createDispatchChartData($("#loadRatioStatistics"), 'load_ratio', '');
                break;
            default:
                createDispatchChartData($("#truckCountStatistics"), 'truck_count', '辆');
                createDispatchChartData($("#carCountStatistics"), 'car_count', '辆');
                createDispatchChartData($("#totalDistanceStatistics"), 'total_distance', '公里');
                createDispatchChartData($("#loadDistanceStatistics"), 'load_distance', '公里');
                createDispatchChartData($("#loadRatioStatistics"), 'load_ratio', '');
        }
    }

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
            refreshDispatchChart(type);
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
                // 出车数 truck_count 发运量 car_count 总里程 total_distance 重载历程 load_distance 重载率 load_ratio
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
                refreshDispatchChart(type);
            } else{
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * TAB2：初始化 chart图
     * @param node 节点
     * @param chartType 操作chart图的区分
     * @param yAxisText 图表Y轴单位
     */
    function createDispatchChartData(node, chartType, yAxisText) {
        // 只显示 选中的年数据
        let yAxisData = [];
        for (let i = 0; i < $scope.yAxisDataDispatch.length; i++) {
            switch (chartType) {
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
        createChartOptions(node, 'column', yAxisText, yAxisData);
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
    function refreshQualityChart(type){
        switch (type) {
            case 'damage_count':
                createQualityChartData($("#damageCountStatistics"), 'damage_count', '次');
                break;
            case 'total_damge_money':
                createQualityChartData($("#totalDamgeMoneyStatistics"), 'total_damge_money', '元');
                break;
            case 'company_money':
                createQualityChartData($("#companyMoneyStatistics"), 'company_money', '元');
                break;
            case 'per_car_damage_money':
                createQualityChartData($("#perCarDamageMoneyStatistics"), 'per_car_damage_money', '元');
                break;
            case 'per_car_c_damage_money':
                createQualityChartData($("#perCarCDamageMoneyStatistics"), 'per_car_c_damage_money', '元');
                break;
            case 'clean_fee':
                createQualityChartData($("#cleanFeeStatistics"), 'clean_fee', '元');
                break;
            case 'per_car_clean_fee':
                createQualityChartData($("#perCarCleanFeeStatistics"), 'per_car_clean_fee', '元');
                break;
            case 'damage_ratio':
                createQualityChartData($("#damageRatioStatistics"), 'damage_ratio', '');
                break;
            default:
                createQualityChartData($("#damageCountStatistics"), 'damage_count', '次');
                createQualityChartData($("#totalDamgeMoneyStatistics"), 'total_damge_money', '元');
                createQualityChartData($("#companyMoneyStatistics"), 'company_money', '元');
                createQualityChartData($("#perCarDamageMoneyStatistics"), 'per_car_damage_money', '元');
                createQualityChartData($("#perCarCDamageMoneyStatistics"), 'per_car_c_damage_money', '元');
                createQualityChartData($("#cleanFeeStatistics"), 'clean_fee', '元');
                createQualityChartData($("#perCarCleanFeeStatistics"), 'per_car_clean_fee', '元');
                createQualityChartData($("#damageRatioStatistics"), 'damage_ratio', '');
        }
    }

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
            refreshQualityChart(type);
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
                // 出车数 truck_count 发运量 car_count 总里程 total_distance 重载历程 load_distance 重载率 load_ratio
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
                refreshQualityChart(type);
            } else{
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * TAB3：初始化 chart图
     * @param node 节点
     * @param chartType 操作chart图的区分
     * @param yAxisText 图表Y轴单位
     */
    function createQualityChartData(node, chartType, yAxisText) {
        // 只显示 选中的年数据
        let yAxisData = [];
        for (let i = 0; i < $scope.yAxisDataQuality.length; i++) {
            switch (chartType) {
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
        createChartOptions(node, 'column', yAxisText, yAxisData);
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