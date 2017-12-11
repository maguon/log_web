// var storage_working_calendarController = angular.module("storage_working_calendarController", []);
app.controller("storage_working_calendar_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var date = new Date();
    // console.log(moment(date).format('YYYY-MM-DD h:mm:ss '))
    var now_date = moment(date).format('YYYYMMDD');
    var month = date.getMonth() + 1;
    $scope.today_month = date.getFullYear() + "年" + month + "月";
    $scope.today_d = date.getDate();
    var weekday = new Array(7);
    weekday[0] = "星期日";
    weekday[1] = "星期一";
    weekday[2] = "星期二";
    weekday[3] = "星期三";
    weekday[4] = "星期四";
    weekday[5] = "星期五";
    weekday[6] = "星期六";
    $scope.today_week = weekday[date.getDay()];

    // 获取仓储信息数据
    $scope.getStorageDateInfo = function () {
        _basic.get($host.api_url + "/storageDate" + "?dateStart=" + now_date + "&dateEnd=" + now_date).then(function (data) {
            if (data.success == true) {
                $scope.store_storage = data.result;
                $scope.storage_id = $scope.store_storage[0].id;
                search($scope.storage_id);
                $scope.getVehicleBrandInfo();
            }
        });
    };

    // 获取车辆品牌数据
    $scope.getVehicleBrandInfo = function () {
        _basic.get($host.api_url + "/storage/" + $scope.storage_id + "/makeStat").then(function (data) {
            if (data.success === true) {
                // 转换数据格式
                $scope.vehicleCountInfo = [];
                for (var i = 0; i < data.result.length; i++) {
                    if(data.result[i].make_name == null){
                        data.result[i].make_name = "未知"
                    }
                    $scope.vehicleCountInfo[i] = [
                        data.result[i].make_name + ": " + data.result[i].car_count + " 辆",
                        data.result[i].car_count
                    ]
                }
                $scope.showVehicleBrandPie();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    $scope.get_fullCalendar = function (storage_id) {
        search(storage_id);
        $scope.getVehicleBrandInfo();
    };

    // 显示车辆品牌统计饼图
    $scope.showVehicleBrandPie = function () {
        $('#vehicleBrand').highcharts({
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
                name: '保险公司金额占比',
                data: $scope.vehicleCountInfo
            }]
        });
    };

    // 日历信息
    var search = function (storage_id) {
        $('#calendar').fullCalendar('destroy');
        $('#calendar').fullCalendar({
            viewRender: function (view, element) {
            },
            aspectRatio: 1,
            header: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },
            height: 'auto',

            events: function (start, end, timezone, callback) {
                // console.log(start, end);
                start = moment(start).format('YYYYMMDD');
                end = moment(end).format('YYYYMMDD');
                var eventArray = [];

                _basic.get($host.api_url + "/storageDate?storageId=" + storage_id + "&dateStart=" + start + "&dateEnd=" + end).then(function (data) {
                    if (data.success == true) {
                        // console.log(data);
                        $scope.data = data.result;
                        for (var i  in $scope.data) {
                            var titleHtml = '<div class=" p0" style="padding-top: 10px">' +
                                '<div class="col s4 center-align  cyan-text text-lighten-1" style="font-size: 14px">' +
                                '<i style="display: block" class="mdi mdi-login"></i><span>' + $scope.data[i].imports + '</span></div>' +
                                '<div class="col s4 center-align  cyan-text text-lighten-1" style="font-size: 14px">' +
                                '<i style="display: block" class="mdi mdi-arrow-down-bold-circle-outline"></i><span >' + $scope.data[i].balance + '</span></div>' +
                                '<div class="col s4 center-align red-text text-lighten-2" style="font-size: 14px">' +
                                '<i style="display: block" class=" mdi mdi-logout"></i><span >' + $scope.data[i].exports + '</span></div></div>'
                            var date = {
                                title: titleHtml,
                                start: $scope.data[i].date_id + '',
                                color: 'transparent',     // an option!
                                textColor: 'transparent', // an option!

                                allDay: true // will make the time show
                            };
                            eventArray.push(date);
                        }
                        callback(eventArray)

                    }
                })

            },
            eventRender: function (event, element) {
                element.html(event.title);
            }
        });
        $('#calendar').fullCalendar('option', 'locale', 'zh-cn');
        // 当天仓库信息

        _basic.get($host.api_url + "/storageDate?storageId=" + storage_id + "&dateStart=" + now_date + "&dateEnd=" + now_date).then(function (data) {
            if (data.success == true) {
                $scope.today_data = data.result[0];
            }
        })
    };

    $scope.queryData = function () {
        $scope.getStorageDateInfo();
    };
    $scope.queryData();


}]);