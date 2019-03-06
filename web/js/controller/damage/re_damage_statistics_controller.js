app.controller("re_damage_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    $scope.brandStartInitial = moment(new Date()).format('YYYY') + "01";
    $scope.brandEndInitial = moment(new Date()).format('YYYYMM');
    $scope.reciveStartInitial = moment(new Date()).format('YYYY') + "01";
    $scope.reciveEndInitial = moment(new Date()).format('YYYYMM');
    $scope.addrStartInitial = moment(new Date()).format('YYYY') + "01";
    $scope.addrEndInitial = moment(new Date()).format('YYYYMM');

    // monthPicker控件
    $('#chooseBrandStartMonth,#chooseBrandEndMonth,#reciveStartMonth,#reciveEndMonth,#addrStartMonth,#addrEndMonth').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });
    $scope.start = 0;
    $scope.size = 10;

    // 车辆品牌
     function getCarMakeData() {
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

    };


    // 获取目的城市列表
    function getCityList() {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                $scope.cityList = data.result;
                $('#start_city').select2({
                    placeholder: '起始城市',
                    containerCssClass : 'select2_dropdown'
                });
                $('#end_city').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear:true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };


    // 根据城市id获取经销商
    $scope.getRecive = function () {
        if($scope.cityId == 0 || $scope.cityId == "" || $scope.cityId == null){
            $scope.cityId = null;
            $scope.receiveList = [];
        }
        else{
            _basic.get($host.api_url + "/receive?cityId=" + $scope.cityId).then(function (data) {
                if (data.success === true) {
                    $scope.receiveList = data.result;
                }
            });
        }
    };


    // 发运地名称
    $scope.getAddrData = function (id) {
        if(id == 0 || id == "" || id == null){
           id = null;
            $scope.addrList = [];
        }
        else{
            _basic.get($host.api_url + "/baseAddr?cityId=" + id).then(function (addrData) {
                if (addrData.success === true) {
                    $scope.addrList = addrData.result;
                }
                else {
                    swal(addrData.msg, "", "error");
                }
            });
        }
    };


    // 品牌按月统计
    var carMakeCountMonth = [
        {
        name: '品牌发运数',
        data: [],
        color: '#26C6DA'
        },
        {
        name: '品牌质损数',
        data: [],
        color: '#FF7E7E'
        }

    ];
    // 显示品牌按月统计柱状图
    function createCarMakeMonthChart() {
        $("#bandStatisticsMonth").highcharts({
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
                categories:$scope.bandMonth,
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
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
                '<td style="padding:0"><b>{point.y} 辆</b></td></tr>',
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
            series: carMakeCountMonth
        });
    };
    //通过接口获取top10和车辆品牌质损
    $scope.queryCountBand = function () {
        var monthStart = $("#chooseBrandStartMonth").val();
        var monthEnd = $("#chooseBrandEndMonth").val();
        if(monthStart==''||monthStart == null||monthEnd==''||monthEnd == null){
            monthStart= $scope.brandStartInitial;
            monthEnd=$scope.brandEndInitial;
        }
        getBandCount(monthStart, monthEnd);
        bandMonthTop(monthStart, monthEnd);
    };
    function getBandCount(start,end){
        var obj = {
            monthStart:start,
            monthEnd: end,
            makeId:$scope.truckBrand
        }
        _basic.get($host.api_url + "/carMonthStat?"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true){
                data.result.reverse();
                // X轴月份
                $scope.bandMonth = [];
                // 初始化金额数
                carMakeCountMonth[0].data = [];
                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    $scope.bandMonth.push(data.result[i].y_month);
                    carMakeCountMonth[0].data.push(data.result[i].car_count);
                }
                createCarMakeMonthChart();
            } else{
                swal(data.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/damageMakeMonthStat?damageStatus=3&"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true){
                data.result.reverse();
                // X轴月份
                $scope.bandMonth = [];
                // 初始化金额数
                carMakeCountMonth[1].data = [];
                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    $scope.bandMonth.push(data.result[i].y_month);
                    carMakeCountMonth[1].data.push(data.result[i].damage_count);
                }
                createCarMakeMonthChart();
            } else{
                swal(data.msg, "", "error");
            }
        });
    }
    function bandMonthTop(start,end) {
        var obj = {
            damageStatus:3,
            monthStart:start,
            monthEnd: end
        };
        _basic.get($host.api_url + "/damageMakeTopMonthStat?"+_basic.objToUrl(obj)+"&start="+ $scope.start+"&size="+ $scope.size ).then(function (data) {
            if (data.success === true){
                if(data.result[0]==null||data.result[0]==undefined)
                {
                    return
                }
                var maxCost = parseFloat(data.result[0].damage_count);
                for (var i = 0; i < data.result.length; i++) {
                    var pecentage = parseInt(data.result[i].damage_count/maxCost*100);
                    data.result[i].percentage = pecentage;
                }
                $scope.bandMouthList = data.result;
            } else{
                swal(data.msg, "", "error");
            }
        });
    };



    // 经销商按月统计
    var reciveCountMonth = [
        {
            name: '经销商发运数',
            data: [],
            color: '#26C6DA'
        },
        {
            name: '经销商质损数',
            data: [],
            color: '#FF7E7E'
        }

    ];
    // 显示经销商按月统计柱状图
    function createReciveMonthChart() {
        $("#reciveStatisticsMonth").highcharts({
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
                categories:$scope.receiveMonth,
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
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
                '<td style="padding:0"><b>{point.y} 辆</b></td></tr>',
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
            series: reciveCountMonth
        });
    };
    //通过接口获取top10和车辆品牌质损
    $scope.reciveQueryCount = function () {
        var monthStart2 = $("#reciveStartMonth").val();
        var monthEnd2 = $("#reciveEndMonth").val();
        if(monthStart2==''||monthStart2 == null||monthEnd2==''||monthEnd2 == null){
            monthStart2= $scope.reciveStartInitial;
            monthEnd2=$scope.reciveEndInitial;
        }
        getReciveCount(monthStart2, monthEnd2);
        reciveMonthTop(monthStart2, monthEnd2);
    };
    function reciveMonthTop(start,end) {
        var obj = {
            damageStatus:3,
            monthStart:start,
            monthEnd: end
        };
        _basic.get($host.api_url + "/damageReceiveTopMonthStat?"+_basic.objToUrl(obj)+"&start="+ $scope.start+"&size="+ $scope.size ).then(function (data) {
            if (data.success === true){
                if(data.result[0]==null||data.result[0]==undefined)
                {
                    return
                }
                var maxCost = parseFloat(data.result[0].damage_count);
                for (var i = 0; i < data.result.length; i++) {
                    var pecentage = parseInt(data.result[i].damage_count/maxCost*100);
                    data.result[i].percentage = pecentage;
                }
                $scope.reciveMouthList = data.result;
            } else{
                swal(data.msg, "", "error");
            }
        });
    };
    function getReciveCount(start,end){
        var obj = {
            monthStart:start,
            monthEnd: end,
            routeEndId:$scope.cityId,
            receiveId:$scope.distributor
        }
        _basic.get($host.api_url + "/carMonthStat?"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true){
                data.result.reverse();
                // X轴月份
                $scope.receiveMonth = [];
                // 初始化金额数
                reciveCountMonth[0].data = [];
                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    $scope.receiveMonth.push(data.result[i].y_month);
                    reciveCountMonth[0].data.push(data.result[i].car_count);
                }
                createReciveMonthChart();
            } else{
                swal(data.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/damageReceiveMonthStat?damageStatus=3&"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true){
                data.result.reverse();
                // X轴月份
                $scope.receiveMonth = [];
                // 初始化金额数
                reciveCountMonth[1].data = [];
                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    $scope.receiveMonth.push(data.result[i].y_month);
                    reciveCountMonth[1].data.push(data.result[i].damage_count);
                }
                createReciveMonthChart();
            } else{
                swal(data.msg, "", "error");
            }
        });
    }





    // 经销商按月统计
    var addrCountMonth = [
        {
            name: '发运地发运数',
            data: [],
            color: '#26C6DA'
        },
        {
            name: '发运地质损数',
            data: [],
            color: '#FF7E7E'
        }

    ];
    // 显示经销商按月统计柱状图
    function createAddrMonthChart() {
        $("#addrStatisticsMonth").highcharts({
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
                categories:$scope.addrMonth,
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
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
                '<td style="padding:0"><b>{point.y} 辆</b></td></tr>',
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
            series: addrCountMonth
        });
    };
    //通过接口获取top10和车辆品牌质损
    $scope.addrQueryCount = function () {
        var monthStart3 = $("#addrStartMonth").val();
        var monthEnd3 = $("#addrEndMonth").val();
        if(monthStart3==''||monthStart3 == null||monthEnd3==''||monthEnd3 == null){
            monthStart3= $scope.addrStartInitial;
            monthEnd3=$scope.addrEndInitial;
        }
        getAddrCount(monthStart3, monthEnd3);
        addrMonthTop(monthStart3, monthEnd3);
    };
    function getAddrCount(start,end){
        var obj = {
            monthStart:start,
            monthEnd: end,
            baseAddrId:$scope.addrId
        }
        _basic.get($host.api_url + "/carMonthStat?"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true){
                data.result.reverse();
                // X轴月份
                $scope.addrMonth = [];
                // 初始化金额数
                addrCountMonth[0].data = [];
                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    $scope.addrMonth.push(data.result[i].y_month);
                    addrCountMonth[0].data.push(data.result[i].car_count);
                }
                createAddrMonthChart();
            } else{
                swal(data.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/damageDaseAddrMonthStat?damageStatus=3&"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true){
                data.result.reverse();
                // X轴月份
                $scope.addrMonth = [];
                // 初始化金额数
                addrCountMonth[1].data = [];
                // 赋予柱状图金额数组
                for (var i = 0; i < data.result.length; i++) {
                    $scope.addrMonth.push(data.result[i].y_month);
                    addrCountMonth[1].data.push(data.result[i].damage_count);
                }
                createAddrMonthChart();
            } else{
                swal(data.msg, "", "error");
            }
        });
    }
    function addrMonthTop(start,end) {
        var obj = {
            damageStatus:3,
            monthStart:start,
            monthEnd: end
        };
        _basic.get($host.api_url + "/damageDaseAddrTopMonthStat?"+_basic.objToUrl(obj)+"&start="+ $scope.start+"&size="+ $scope.size ).then(function (data) {
            if (data.success === true){
                if(data.result[0]==null||data.result[0]==undefined)
                {
                    return
                }
                var maxCost = parseFloat(data.result[0].damage_count);
                for (var i = 0; i < data.result.length; i++) {
                    var pecentage = parseInt(data.result[i].damage_count/maxCost*100);
                    data.result[i].percentage = pecentage;
                }
                $scope.addrMouthList = data.result;
            } else{
                swal(data.msg, "", "error");
            }
        });
    };


    // 获取数据
    $scope.queryData = function () {
        getBandCount($scope.brandStartInitial,$scope.brandEndInitial);
        bandMonthTop($scope.brandStartInitial,$scope.brandEndInitial);
        getReciveCount($scope.reciveStartInitial,$scope.reciveEndInitial);
        reciveMonthTop($scope.reciveStartInitial,$scope.reciveEndInitial);
        getAddrCount($scope.addrStartInitial,$scope.addrEndInitial);
        addrMonthTop($scope.addrStartInitial,$scope.addrEndInitial);
        getCarMakeData();
        getCityList();
    };
    $scope.queryData();
}]);