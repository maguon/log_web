app.controller("single_value_controller", ["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {


    $scope.start = 0;
    $scope.size = 11;

    // monthPicker控件
    $('#start_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });
    //获取上个月年月
    function getLastMonth(){//获取上个月日期
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        if(month<10){
            month ='0'+month;
        }

        if(month == 0){
            year = year -1;
            month = 12;
        }
        $scope.startMonth = year.toString()+month.toString();
    }
    getLastMonth();

   /* // 获取所有公司列表
    $scope.getCompanyList = function () {
        _basic.get($host.api_url + "/company").then(function (data) {
            if (data.success === true) {
                $scope.companyList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };*/
    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#driver').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取货车牌号 查询条件
    function getTruckId() {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAll = data.result;
                $('#truckId').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    }
    // 获取司机信息
    $scope.getDriverInfoList = function () {
        if($('#start_month').val()!==''){
            $scope.startMonth = $('#start_month').val();
        }
        var obj={
            yMonth:$scope.startMonth,
            driveId:$scope.driverName,
            truckId:$scope.truckNumber,
            start:$scope.start,
            size: $scope.size
        };
            _basic.get($host.api_url + "/driveTruckMonthValue?"+_basic.objToUrl(obj)).then(function (data) {
                if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.driverInfoList = $scope.boxArray.slice(0, 10);
                    if ($scope.start > 0) {
                        $("#pre").show();
                    }
                    else {
                        $("#pre").hide();
                    }
                    if (data.result.length < $scope.size) {
                        $("#next").hide();
                    }
                    else {
                        $("#next").show();
                    }

                }
                else {
                    swal(data.msg, "", "error");
                }
            });
    };


    /*导出*/
    $scope.export = function(){
        // 基本检索URL
        var url = $host.api_url + "/driveTruckMonthValue.csv?" ;
        if($('#start_month').val()!==''){
            $scope.startMonth = $('#start_month').val();
        }
        var obj={
            yMonth:$scope.startMonth,
            driveId:$scope.driverName,
            truckId:$scope.truckNumber,
            start:$scope.start,
            size: $scope.size
        };
        var conditions = _basic.objToUrl(obj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    }


    // 点击查询
    $scope.searchDriverInfoList = function () {
        $scope.start = 0;
        $scope.getDriverInfoList();
    };

    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.getDriverInfoList();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.getDriverInfoList();
    };





    // 获取数据
    $scope.queryData = function () {
      /*  $scope.getCompanyList();*/
        $scope.getDriverInfoList();
        getDriveNameList ();
        getTruckId();

    };
    $scope.queryData();


}])