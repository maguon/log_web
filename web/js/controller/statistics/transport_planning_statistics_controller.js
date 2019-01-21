app.controller("transport_planning_statistics_controller", ["$scope", "$host", "_basic","$timeout", function ($scope, $host, _basic,$timeout) {

    // 日期初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');
    $scope.start = 0;
  /*  $scope.size = 12;*/
    $scope.daySize =20;
    var month;
    var day;
    // monthPicker控件
    $('#choosePlanStart_month,#choosePlanEnd_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });
    var obj={
        entrustId:$scope.client,
        makeId:$scope.truckBrand,
        routeStartId:$scope.startCity,
        baseAddrId:$scope.baseAddr,
        routeEndId:$scope.endCity,
        receiveId:$scope.receiveName
    }

    //获取车辆品牌 委托方 起始城市 始发地点 目的城市 经销商*
    function getCondition(){
        //获取车辆品牌
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.carMakeList = data.result;
                $('#truck_brand').select2({
                    placeholder: '车辆品牌',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            } else {
                swal(data.msg, "", "error")
            }
        });

        //获取委托方
        _basic.get($host.api_url + "/entrust").then(function (entrustData) {
            if (entrustData.success === true) {
                $scope.entrustList = entrustData.result;
                $('#client').select2({
                    placeholder: '委托方',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(entrustData.msg, "", "error");
            }
        });

        //起始城市 目的城市
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.cityList = data.result;
                $('#startCity').select2({
                    placeholder: '起始城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#endCity').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    }

    //通过日期接口获取点击数据
    $scope.queryDate =function (){
        getPlanCountCar();
        carMonth();
    };

    //起始城市改变 获取装车地点
    $scope.getAddres = function (truckBrand,client,startCity,baseAddr,endCity,receiveName) {
        if($scope.startCity == 0 || $scope.startCity == "" || $scope.startCity == null){
            $scope.startCity = null;
            $scope.baseAddrList = [];
        }
        else{
            _basic.get($host.api_url + "/baseAddr?cityId=" + startCity).then(function (data) {
                if (data.success == true) {
                    $scope.baseAddrList = data.result;
                    obj={
                        entrustId:client,
                        makeId:truckBrand,
                        routeStartId:startCity,
                        baseAddrId:baseAddr,
                        routeEndId:endCity,
                        receiveId:receiveName
                    };
                    carMonth();
                    carDay();
                    getPlanCountCar();
                }
            });
        }
    };

    // 目的城市改变 获取经销商
    $scope.getRecive = function (truckBrand,client,startCity,baseAddr,endCity,receiveName) {
        if($scope.endCity == 0 || $scope.endCity == "" || $scope.endCity == null){
            $scope.endCity = null;
            $scope.receiveList = [];
        }
        else{
            _basic.get($host.api_url + "/receive?cityId=" + endCity).then(function (data) {
                if (data.success == true) {
                    $scope.receiveList = data.result;
                    obj={
                        entrustId:client,
                        makeId:truckBrand,
                        routeStartId:startCity,
                        baseAddrId:baseAddr,
                        routeEndId:endCity,
                        receiveId:receiveName
                    };

                    carMonth();
                    carDay();
                    getPlanCountCar();
                }
            });
        }
    };

    // 品牌改变
    $scope.changeTruckBand=function(truckBrand,client,startCity,baseAddr,endCity,receiveName){
        obj={
            entrustId:client,
            makeId:truckBrand,
            routeStartId:startCity,
            baseAddrId:baseAddr,
            routeEndId:endCity,
            receiveId:receiveName
        };

        carMonth();
        carDay();
        getPlanCountCar();
    }

    // 委托方改变
    $scope.changeClient=function(truckBrand,client,startCity,baseAddr,endCity,receiveName){
        obj={
            entrustId:client,
            makeId:truckBrand,
            routeStartId:startCity,
            baseAddrId:baseAddr,
            routeEndId:endCity,
            receiveId:receiveName
        };

        carMonth();
        carDay();
        getPlanCountCar();
    }

    // 装车地点改变
    $scope.changeBaseAddr=function(truckBrand,client,startCity,baseAddr,endCity,receiveName){
        obj={
            entrustId:client,
            makeId:truckBrand,
            routeStartId:startCity,
            baseAddrId:baseAddr,
            routeEndId:endCity,
            receiveId:receiveName
        };

        carMonth();
        carDay();
        getPlanCountCar();
    }

    // 经销商改变
    $scope.changeReciveName=function(truckBrand,client,startCity,baseAddr,endCity,receiveName){
        obj={
            entrustId:client,
            makeId:truckBrand,
            routeStartId:startCity,
            baseAddrId:baseAddr,
            routeEndId:endCity,
            receiveId:receiveName
        };

        carMonth();
        carDay();
        getPlanCountCar();
    }

    //获取计划发车数
    function getPlanCountCar(){
        $scope.carCount=0;
        var monthStart = $('#choosePlanStart_month').val();
        var monthEnd = $('#choosePlanEnd_month').val();
        if(monthStart == "" || monthStart == undefined){
            monthStart = $scope.startInitial;
        }
        if(monthEnd == "" || monthEnd == undefined){
            monthEnd = $scope.endInitial;
        }
        var obj={
            monthStart:monthStart,
            monthEnd:monthEnd,
            entrustId:$scope.client,
            makeId:$scope.truckBrand,
            routeStartId:$scope.startCity,
            baseAddrId:$scope.baseAddr,
            routeEndId:$scope.endCity,
            receiveId:$scope.receiveName
        };
        _basic.get($host.api_url + "/carMonthStat?"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true){
                if(data.result.length==0){
                    $scope.carCount=0;
                }
                for (var i = 0; i < data.result.length; i++) {
                    $scope.carCount  += data.result[i].car_count;
                }
            } else{
                swal(data.msg, "", "error");
            }
        });
    }

    // 发出车辆按月统计
    var carCountMonth = [{
        name: '按月统计',
        data: [],
        color:'#26C6DA'
    }];

    // 发出车辆按天统计
    var carCountDay = [{
        name: '按天统计',
        data: [],
        color:'#FF7E7E'
    }];

    // 显示车辆数按月统计柱状图
    function showHistogramMonth () {
        $("#planStatisticsMonth").highcharts({
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
                categories:month,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                '<td style="padding:0"><b>{point.y}辆</b></td></tr>',
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
            series: carCountMonth
        });
    };

    // 显示车辆数按天统计柱状图
    function showHistogramDay () {
        $("#planStatisticsDay").highcharts({
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
                categories:day,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                '<td style="padding:0"><b>{point.y}辆</b></td></tr>',
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
            series: carCountDay
        });
    };

    // 获取月数据
    function carMonth(){
        var monthStart = $('#choosePlanStart_month').val();
        var monthEnd = $('#choosePlanEnd_month').val();
        if(monthStart == "" || monthStart == undefined){
            monthStart = $scope.startInitial;
        }
        if(monthEnd == "" || monthEnd == undefined){
            monthEnd = $scope.endInitial;
        }
        _basic.get($host.api_url + "/carMonthStat?monthStart="+monthStart+"&monthEnd="+monthEnd+'&'+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true){
                data.result.reverse();
                month = [];
                // 初始化
                carCountMonth[0].data = [];
                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    month.push(data.result[i].y_month);
                    carCountMonth[0].data.push(data.result[i].car_count);
                }
                showHistogramMonth();
            } else{
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取天数据
    function carDay() {
        _basic.get($host.api_url + "/carDayStat?start="+$scope.start+"&size="+$scope.daySize +'&'+_basic.objToUrl(obj)).then(function (data) {
            if (data.success == true) {
                data.result.reverse();
                // X轴月份
                day = [];
                // 初始化金额数
                carCountDay[0].data = [];
                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    day.push(data.result[i].id);
                    carCountDay[0].data.push(data.result[i].car_count);
                }
                showHistogramDay();
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取数据
    $scope.queryData = function () {
        carMonth($scope.startInitial,$scope.endInitial);
        carDay();
        getCondition();
        getPlanCountCar();
    };
    $scope.queryData();
}]);