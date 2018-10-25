app.controller("driver_cost_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_config", "_basic", function ($scope, $rootScope,$state,$stateParams,$host, _config, _basic) {
    $scope.start = 0;
    $scope.size = 11;

    //司机 公司
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive?").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#addDrivderId').select2({
                    placeholder: '司机',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //查询功能
    $scope.getdrive = function (){
        $scope.start = 0;
        getdriveData();
    }

    // 数据导出
    $scope.export = function () {
        var obj = {
            dateStart: moment($scope.instruct_starTime).format("YYYYMMDD"),
            dateEnd: moment($scope.instruct_endTime).format("YYYYMMDD"),
            driveId: $scope.drivderId
        };
        swal({
                title: "确定导出司机成本表？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: true,
                closeOnCancel:true
            },
            function () {
                window.open($host.api_url + "/driveCost.csv?" + _basic.objToUrl(obj));
            })

    };

    //获取查询数据
    function getdriveData(){
        if($scope.instruct_starTime==undefined||$scope.instruct_endTime==undefined){
            $scope.settlementList=[];
            $("#pre").hide();
            $("#next").hide();
        }
        else{
            _basic.get($host.api_url + "/driveCost?" + _basic.objToUrl({
                dateStart:moment($scope.instruct_starTime).format("YYYYMMDD"),
                dateEnd:moment($scope.instruct_endTime).format("YYYYMMDD"),
                driveId: $scope.drivderId,
                start: $scope.start.toString(),
                size: $scope.size
            })).then(function (data) {
                if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.driveList = $scope.boxArray.slice(0, 10);
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
    }
    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getdriveData();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getdriveData();
    };
    getdriveData();
    getDriveNameList ();
}])