app.controller("driver_social_security_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    $scope.size = 11;
    $scope.start = 0;
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

    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive?driveName=").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#driveName').select2({
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


    //查询功能
    $scope.searchList = function (){
        $scope.start = 0;
        getData();
    };

    //获取查询数据
    function getData(){
        if( $('#start_month').val()!==''){
            $scope.startMonth = $('#start_month').val();
        }

        // 基本检索URL
        var url = $host.api_url + "/driveWork?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditions = _basic.objToUrl({
            driveId:$scope.driveName,
            yMonth:$scope.startMonth
        });
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {
                $scope.boxArray = data.result;
                $scope.securityList = $scope.boxArray.slice(0, 10);
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
    }
    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getData();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getData();
    };

    getLastMonth();
    getDriveNameList ();
    getData();
}])