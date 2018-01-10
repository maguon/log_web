/**
 * Created by ASUS on 2017/8/29.
 */
app.controller("instruction_driver_mileage_controller", ["$scope", "$host", "_basic", "baseService", function ($scope, $host, _basic, baseService) {

    $scope.driver_mileage_startTime = moment(baseService.dateFirst()).format("YYYY-MM-DD");
    $scope.driver_mileage_endTime = moment(baseService.dateLast()).format("YYYY-MM-DD");
    // 司机里程
    $scope.search = function () {
        var obj = {
            taskStatus: 10,
            loadDistance: 3,
            noLoadDistance: 3,
            driveName: $scope.drive_name,
            truckNum: $scope.truckNum,
            dateIdStart: $scope.driver_mileage_startTime,
            dateIdEnd: $scope.driver_mileage_endTime
        };
        _basic.get($host.api_url + "/driveDistanceCount?" + _basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
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

}]);