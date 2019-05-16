/**
 * Created by ASUS on 2017/8/29.
 */
app.controller("instruction_driver_mileage_controller", ["$scope","$rootScope","$state","$stateParams",  "$host", "_basic", "baseService", function ($scope, $rootScope,$state,$stateParams,$host, _basic, baseService) {

    $scope.driver_mileage_startTime = moment(baseService.dateFirst()).format("YYYY-MM-DD");
    $scope.driver_mileage_endTime = moment(baseService.dateLast()).format("YYYY-MM-DD");
    // 司机里程
    $scope.search = function () {
        // 基本检索URL
        var url = $host.api_url + "/driveDistanceLoadStat?";
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "instruction_driver_mileage",
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.driveDistanceCount = data.result;
            }
            else {
                swal(data.msg, "", "error")
            }
        });
    };
    $scope.search();

    $scope.search_all = function () {
        if ($scope.driver_mileage_startTime == undefined || $scope.driver_mileage_endTime == undefined) {
            swal("统计时间不能为空！", "", "error")
        }
        else {
            $scope.search();
        }
    }

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

    //获取货车牌号
    function getTruckNum(selectText) {
        if(selectText==''||selectText==undefined){
            _basic.get($host.api_url + "/truckBase").then(function (data) {
                if (data.success === true) {
                    $scope.truckNumListAllList = data.result;
                    $('#truckId').select2({
                        placeholder: "货车牌号",
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
            _basic.get($host.api_url + "/truckBase").then(function (data) {
                if (data.success == true) {
                    $scope.truckNumListList = data.result;
                    $('#truckId').select2({
                        placeholder: selectText,
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    })
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }


    // 数据导出
    $scope.export = function () {
        // 基本检索URL
        var url = $host.api_url + "/driveDistanceLoadStat.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.drive_name=conditions.driveName;
        $scope.driver_mileage_startTime=conditions.taskPlanDateStart;
        $scope.driver_mileage_endTime=conditions.taskPlanDateEnd;
        $scope.truckId=conditions.truckId;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            taskStatus: 9,
            driveName: $scope.drive_name,
            truckId: $scope.truckId,
            taskPlanDateStart: $scope.driver_mileage_startTime,
            taskPlanDateEnd: $scope.driver_mileage_endTime
        };
    }


    // 数据导出
    $scope.exportItem = function (id,truckId) {
        var obj = {
            driveId:id,
            truckId:truckId,
            taskPlanDateStart:$scope.driver_mileage_startTime,
            taskPlanDateEnd:$scope.driver_mileage_endTime,
            taskStatusArr:[9,10]

        };
        swal({
                title: "确定导出司机工作详情表？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
        }).then(
            function (result) {
                if (result.value) {
                    window.open($host.api_url + "/driveDistanceLoad.csv?" + _basic.objToUrl(obj));
                }
            })
    }



    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "instruction_drive_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "instruction_driver_mileage") {
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
                getTruckNum(pageItems.conditions.truckId)
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }
        // 查询数据
        $scope.search();

    }
    initData();
    getDriveNameList ();
    getTruckNum()



}]);