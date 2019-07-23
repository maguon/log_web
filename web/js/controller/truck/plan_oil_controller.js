
/**
 * 主菜单：车辆管理 -> 计划油耗 控制器
 */

app.controller("plan_oil_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;


    //是否倒板
    $scope.reverseFlagList = _config.reverseFlag;


    //重载(空载)
    $scope.loadFlagList = _config.loadFlag;


    /**
     * 获取司机
     */
    function getDriver () {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveList = data.result;
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
    };




    //获取货车牌号
    function getTruck() {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckList = data.result;

                //查询货车牌号
                $('#truck').select2({
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





    /**
     * 查询按钮
     */
    $scope.getPlanOil = function () {
        $scope.start = 0;
        searchPlanOilList();
    }




    /**
     * 根据条件搜索
     */
    function searchPlanOilList() {

        // 基本检索URL
        var url = $host.api_url + "/dpRouteTaskOilRelList?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        _basic.get(url).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.planOilList = $scope.boxArray.slice(0, 10);
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



    // 分页
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        searchPlanOilList();
    };

    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        searchPlanOilList();
    };


    /**
     * 组装检索条件。
     */
    function makeConditions() {
        var obj = {
            driveId: $scope.conDrivder,
            truckId: $scope.conTruck,
            taskPlanDateStart:$scope.conStarTime,
            taskPlanDateEnd:$scope.conEndTime,
            dpRouteTaskId:$scope.conDpId
        }
        return obj;
    }



    getDriver ();
    getTruck();
    searchPlanOilList();

}]);