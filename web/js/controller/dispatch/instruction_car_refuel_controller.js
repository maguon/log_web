/**
 * Created by zcy on 2017/8/30.
 */
app.controller("instruction_car_refuel_controller", ["$scope","$rootScope","$state","$stateParams",  "$host", "_basic", function ($scope,$rootScope,$state,$stateParams, $host, _basic) {
    $scope.start = 0;
    $scope.size = 11;
   /* $scope.currentStatus = "1";*/
   /* var userId = _basic.getSession(_basic.USER_ID);*/

    // 搜索请求
    $scope.search_query = function () {
        // 基本检索URL
        var url = $host.api_url + "/driveExceedOilRel?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {
                $scope.car_refuel_obj = data.result;
                $scope.car_refuel = $scope.car_refuel_obj.slice(0, 10);
                if ($scope.start > 0) {
                    $scope.pre = true;
                }
                else {
                    $scope.pre = false;
                }
                if ($scope.car_refuel_obj.length < $scope.size) {
                    $scope.next = false;
                }
                else {
                    $scope.next = true;
                }

            }
            else {
                swal(data.msg, "", "error")
            }
        })
    };

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            driveId:$scope.driveName,
            truckId:$scope.truckNum,
            oilDateStart: $scope.refueling_startTime,
            oilDateEnd:$scope.refueling_endTime
        }
    }


    //获取货车牌号
    function getTruckId() {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAll = data.result;
                $('#truckNumber').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#driverName').select2({
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


    // 头车搜索事件-条件查询
    $scope.search_condition = function () {
        $scope.start = 0;
        $scope.search_query();
    };

    // 分页
    // 上一页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        $scope.search_query();
    };

    // 下一页
    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        $scope.search_query();
    };



    getTruckId();
    getDriveNameList ();
    $scope.search_query();
}]);