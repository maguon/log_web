/**
 * Created by ASUS on 2017/5/11.
 */
// var storage_statistics_controller = angular.module("storage_statistics_controller", []);
app.controller("storage_statistics_controller", ['$rootScope', '$scope', "$host", '$location', '$q', "_basic", function ($rootScope, $scope, $host, $location, $q, _basic) {
    var date = new Date();
    var month_size = 12;
    var day_size = 30;
    var now_date = moment(date).format('YYYYMMDD');
    var day;
    var month;
    // 入库每日统计
    var day_date_array = [
        {
            name: "入库统计",
            data: [],
            color: "#4dd0e1"
        }, {
            name: "出库统计",
            data: [],
            color: "#ff5252"
        }
    ];

    // 入库每月统计
    var month_date_array = [{
        name: "入库统计",
        data: [],
        color: "#4dd0e1"
    }, {
        name: "出库统计",
        data: [],
        color: "#ff5252"
    }];

    $scope.change_statistics = function () {
        searchAll();
    };
    var searchAll = function () {
        day = [];
        month = [];
        day_date_array[0].data = [];
        day_date_array[1].data = [];
        month_date_array[0].data = [];
        month_date_array[1].data = [];
        // 月份数据读取
        _basic.get($host.api_url + "/storageTotalMonth?storageId=" + $scope.storage_id.id + "&start=0&size=" + month_size).then(function (data) {
            if (data.success == true) {
                for (var i in data.result) {
                    month.push(data.result[data.result.length - 1 - i].y_month);
                    month_date_array[0].data.push(data.result[data.result.length - 1 - i].total_imports);
                    month_date_array[1].data.push(data.result[data.result.length - 1 - i].total_exports)
                }
                // console.log(day,day_date_array);
                $("#statistics_month").highcharts({
                    title: {
                        text: '仓储统计(月)',
                        align: "left",
                        style: {
                            color: '#616161',
                            fontWeight: 'bold'
                        },
                        x: 0,

                    },
                    // subtitle: {
                    //     text: '数据来源: WorldClimate.com',
                    //     x: -20
                    // },
                    xAxis: {
                        categories: month
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    // 版权信息
                    credits: {
                        enabled: "false",
                        text: '',
                        href: ''
                    },
                    tooltip: {
                        valueSuffix: '辆车'
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    series: month_date_array
                });
            }
        });

        // 近几日查询
        _basic.get($host.api_url + "/storageTotalDay?storageId=" + $scope.storage_id.id + "&start=0&size=" + day_size).then(function (data) {
            if (data.success == true) {
                for (var i in data.result) {
                    // day.push(data.result[data.result.length - 1 - i].date_id.substr(4,6));
                    var day_filter = data.result[data.result.length - 1 - i].date_id.toString().substr(4, 4);
                    day.push(day_filter)
                    day_date_array[0].data.push(data.result[data.result.length - 1 - i].total_imports);
                    day_date_array[1].data.push(data.result[data.result.length - 1 - i].total_exports)
                }
                // console.log(day,day_date_array);
                $("#statistics_day").highcharts({
                    title: {
                        text: '仓储统计(日)',
                        align: "left",
                        style: {
                            color: '#616161',
                            fontWeight: 'bold'
                        },
                        x: 0,

                    },
                    // subtitle: {
                    //     text: '数据来源: WorldClimate.com',
                    //     x: -20
                    // },
                    xAxis: {
                        categories: day
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    // 版权信息
                    credits: {
                        enabled: "false",
                        text: '',
                        href: ''
                    },
                    tooltip: {
                        valueSuffix: '辆车'
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    series: day_date_array
                });
            }
        });
    }
    // 车库查询
    _basic.get($host.api_url + "/storage").then(function (data) {
        if (data.success == true) {
            $scope.storageName = data.result;
            // console.log($scope.storageName);
            $scope.storage_id = $scope.storageName[0];
            searchAll();


            // setTimeout($('select').material_select(), 2000)
        } else {
            swal(data.msg, "", "error");
        }
    });
}]);