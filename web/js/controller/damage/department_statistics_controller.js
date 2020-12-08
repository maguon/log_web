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
                            $scope.yAxisData[index].dataOutput[0] = data.result[i].output;
                            $scope.yAxisData[index].dataOuter[0] = data.result[i].outer_output;
                            $scope.yAxisData[index].dataPerTruck[0] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].dataPerKm[0] = data.result[i].per_km_output;
                            break;
                        case '02':
                            $scope.yAxisData[index].dataOutput[1] = data.result[i].output;
                            $scope.yAxisData[index].dataOuter[1] = data.result[i].outer_output;
                            $scope.yAxisData[index].dataPerTruck[1] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].dataPerKm[1] = data.result[i].per_km_output;
                            break;
                        case '03':
                            $scope.yAxisData[index].dataOutput[2] = data.result[i].output;
                            $scope.yAxisData[index].dataOuter[2] = data.result[i].outer_output;
                            $scope.yAxisData[index].dataPerTruck[2] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].dataPerKm[2] = data.result[i].per_km_output;
                            break;
                        case '04':
                            $scope.yAxisData[index].dataOutput[3] = data.result[i].output;
                            $scope.yAxisData[index].dataOuter[3] = data.result[i].outer_output;
                            $scope.yAxisData[index].dataPerTruck[3] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].dataPerKm[3] = data.result[i].per_km_output;
                            break;
                        case '05':
                            $scope.yAxisData[index].dataOutput[4] = data.result[i].output;
                            $scope.yAxisData[index].dataOuter[4] = data.result[i].outer_output;
                            $scope.yAxisData[index].dataPerTruck[4] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].dataPerKm[4] = data.result[i].per_km_output;
                            break;
                        case '06':
                            $scope.yAxisData[index].dataOutput[5] = data.result[i].output;
                            $scope.yAxisData[index].dataOuter[5] = data.result[i].outer_output;
                            $scope.yAxisData[index].dataPerTruck[5] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].dataPerKm[5] = data.result[i].per_km_output;
                            break;
                        case '07':
                            $scope.yAxisData[index].dataOutput[6] = data.result[i].output;
                            $scope.yAxisData[index].dataOuter[6] = data.result[i].outer_output;
                            $scope.yAxisData[index].dataPerTruck[6] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].dataPerKm[6] = data.result[i].per_km_output;
                            break;
                        case '08':
                            $scope.yAxisData[index].dataOutput[7] = data.result[i].output;
                            $scope.yAxisData[index].dataOuter[7] = data.result[i].outer_output;
                            $scope.yAxisData[index].dataPerTruck[7] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].dataPerKm[7] = data.result[i].per_km_output;
                            break;
                        case '09':
                            $scope.yAxisData[index].dataOutput[8] = data.result[i].output;
                            $scope.yAxisData[index].dataOuter[8] = data.result[i].outer_output;
                            $scope.yAxisData[index].dataPerTruck[8] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].dataPerKm[8] = data.result[i].per_km_output;
                            break;
                        case '10':
                            $scope.yAxisData[index].dataOutput[9] = data.result[i].output;
                            $scope.yAxisData[index].dataOuter[9] = data.result[i].outer_output;
                            $scope.yAxisData[index].dataPerTruck[9] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].dataPerKm[9] = data.result[i].per_km_output;
                            break;
                        case '11':
                            $scope.yAxisData[index].dataOutput[10] = data.result[i].output;
                            $scope.yAxisData[index].dataOuter[10] = data.result[i].outer_output;
                            $scope.yAxisData[index].dataPerTruck[10] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].dataPerKm[10] = data.result[i].per_km_output;
                            break;
                        case '12':
                            $scope.yAxisData[index].dataOutput[11] = data.result[i].output;
                            $scope.yAxisData[index].dataOuter[11] = data.result[i].outer_output;
                            $scope.yAxisData[index].dataPerTruck[11] = data.result[i].per_truck_output;
                            $scope.yAxisData[index].dataPerKm[11] = data.result[i].per_km_output;
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
                            $scope.yAxisDataDispatch[index].truckCount[0] = data.result[i].truck_count;
                            $scope.yAxisDataDispatch[index].carCount[0] = data.result[i].car_count;
                            $scope.yAxisDataDispatch[index].totalDistance[0] = data.result[i].total_distance;
                            $scope.yAxisDataDispatch[index].loadDistance[0] = data.result[i].load_distance;
                            $scope.yAxisDataDispatch[index].loadRatio[0] = data.result[i].load_ratio;
                            break;
                        case '02':
                            $scope.yAxisDataDispatch[index].truckCount[1] = data.result[i].truck_count;
                            $scope.yAxisDataDispatch[index].carCount[1] = data.result[i].car_count;
                            $scope.yAxisDataDispatch[index].totalDistance[1] = data.result[i].total_distance;
                            $scope.yAxisDataDispatch[index].loadDistance[1] = data.result[i].load_distance;
                            $scope.yAxisDataDispatch[index].loadRatio[1] = data.result[i].load_ratio;
                            break;
                        case '03':
                            $scope.yAxisDataDispatch[index].truckCount[2] = data.result[i].truck_count;
                            $scope.yAxisDataDispatch[index].carCount[2] = data.result[i].car_count;
                            $scope.yAxisDataDispatch[index].totalDistance[2] = data.result[i].total_distance;
                            $scope.yAxisDataDispatch[index].loadDistance[2] = data.result[i].load_distance;
                            $scope.yAxisDataDispatch[index].loadRatio[2] = data.result[i].load_ratio;
                            break;
                        case '04':
                            $scope.yAxisDataDispatch[index].truckCount[3] = data.result[i].truck_count;
                            $scope.yAxisDataDispatch[index].carCount[3] = data.result[i].car_count;
                            $scope.yAxisDataDispatch[index].totalDistance[3] = data.result[i].total_distance;
                            $scope.yAxisDataDispatch[index].loadDistance[3] = data.result[i].load_distance;
                            $scope.yAxisDataDispatch[index].loadRatio[3] = data.result[i].load_ratio;
                            break;
                        case '05':
                            $scope.yAxisDataDispatch[index].truckCount[4] = data.result[i].truck_count;
                            $scope.yAxisDataDispatch[index].carCount[4] = data.result[i].car_count;
                            $scope.yAxisDataDispatch[index].totalDistance[4] = data.result[i].total_distance;
                            $scope.yAxisDataDispatch[index].loadDistance[4] = data.result[i].load_distance;
                            $scope.yAxisDataDispatch[index].loadRatio[4] = data.result[i].load_ratio;
                            break;
                        case '06':
                            $scope.yAxisDataDispatch[index].truckCount[5] = data.result[i].truck_count;
                            $scope.yAxisDataDispatch[index].carCount[5] = data.result[i].car_count;
                            $scope.yAxisDataDispatch[index].totalDistance[5] = data.result[i].total_distance;
                            $scope.yAxisDataDispatch[index].loadDistance[5] = data.result[i].load_distance;
                            $scope.yAxisDataDispatch[index].loadRatio[5] = data.result[i].load_ratio;
                            break;
                        case '07':
                            $scope.yAxisDataDispatch[index].truckCount[6] = data.result[i].truck_count;
                            $scope.yAxisDataDispatch[index].carCount[6] = data.result[i].car_count;
                            $scope.yAxisDataDispatch[index].totalDistance[6] = data.result[i].total_distance;
                            $scope.yAxisDataDispatch[index].loadDistance[6] = data.result[i].load_distance;
                            $scope.yAxisDataDispatch[index].loadRatio[6] = data.result[i].load_ratio;
                            break;
                        case '08':
                            $scope.yAxisDataDispatch[index].truckCount[7] = data.result[i].truck_count;
                            $scope.yAxisDataDispatch[index].carCount[7] = data.result[i].car_count;
                            $scope.yAxisDataDispatch[index].totalDistance[7] = data.result[i].total_distance;
                            $scope.yAxisDataDispatch[index].loadDistance[7] = data.result[i].load_distance;
                            $scope.yAxisDataDispatch[index].loadRatio[7] = data.result[i].load_ratio;
                            break;
                        case '09':
                            $scope.yAxisDataDispatch[index].truckCount[8] = data.result[i].truck_count;
                            $scope.yAxisDataDispatch[index].carCount[8] = data.result[i].car_count;
                            $scope.yAxisDataDispatch[index].totalDistance[8] = data.result[i].total_distance;
                            $scope.yAxisDataDispatch[index].loadDistance[8] = data.result[i].load_distance;
                            $scope.yAxisDataDispatch[index].loadRatio[8] = data.result[i].load_ratio;
                            break;
                        case '10':
                            $scope.yAxisDataDispatch[index].truckCount[9] = data.result[i].truck_count;
                            $scope.yAxisDataDispatch[index].carCount[9] = data.result[i].car_count;
                            $scope.yAxisDataDispatch[index].totalDistance[9] = data.result[i].total_distance;
                            $scope.yAxisDataDispatch[index].loadDistance[9] = data.result[i].load_distance;
                            $scope.yAxisDataDispatch[index].loadRatio[9] = data.result[i].load_ratio;
                            break;
                        case '11':
                            $scope.yAxisDataDispatch[index].truckCount[10] = data.result[i].truck_count;
                            $scope.yAxisDataDispatch[index].carCount[10] = data.result[i].car_count;
                            $scope.yAxisDataDispatch[index].totalDistance[10] = data.result[i].total_distance;
                            $scope.yAxisDataDispatch[index].loadDistance[10] = data.result[i].load_distance;
                            $scope.yAxisDataDispatch[index].loadRatio[10] = data.result[i].load_ratio;
                            break;
                        case '12':
                            $scope.yAxisDataDispatch[index].truckCount[11] = data.result[i].truck_count;
                            $scope.yAxisDataDispatch[index].carCount[11] = data.result[i].car_count;
                            $scope.yAxisDataDispatch[index].totalDistance[11] = data.result[i].total_distance;
                            $scope.yAxisDataDispatch[index].loadDistance[11] = data.result[i].load_distance;
                            $scope.yAxisDataDispatch[index].loadRatio[11] = data.result[i].load_ratio;
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