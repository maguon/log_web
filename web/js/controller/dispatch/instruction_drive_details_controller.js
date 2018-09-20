/**
 * Created by ASUS on 2017/8/30.
 */
app.controller("instruction_drive_details_controller", ["$scope", "$host", "_config", "_basic", "$state", "$stateParams", function ($scope, $host, _config, _basic, $state, $stateParams) {
    var dateIdStart = $stateParams.timeStart;
    var dateIdEnd = $stateParams.timeEnd;
    $scope.driveId = $stateParams.id;
    $scope.driver_mileage_startTime = dateIdStart;
    $scope.driver_mileage_endTime = dateIdEnd;
    var loadFlag = "";
    var drive_detail = function () {
        var p = new Promise(function (resolve, reject) {
            var obj = {
                taskStatus: 10,
                driveId: $scope.driveId,
                dateIdStart: dateIdStart,
                dateIdEnd: dateIdEnd
            };
            _basic.get($host.api_url + "/driveDistanceLoad?" + _basic.objToUrl(obj)).then(function (data) {
                if (data.success == true && data.result.length > 0) {
                    $scope.driveDetail = data.result[0];
                    if ($scope.driveDetail.no_load_distance == null) {
                        $scope.driveDetail.no_load_distance = 0
                    }
                    if ($scope.driveDetail.load_distance == null) {
                        $scope.driveDetail.load_distance = 0
                    }
                    resolve();
                } else {
                    swal("异常", "", "error")
                }
            });
        });
        return p
    };
    drive_detail().then(function () {
        $scope.drive_instruction_list();
    });

    $scope.drive_instruction_list = function () {
        if ($scope.car_status == 0) {
            loadFlag =0;
        }
        else if ($scope.car_status == 1) {
            loadFlag =1;
        }
        else {
            loadFlag ='';
        }

        var obj = {
            driveId:$scope.driveId,
            loadFlag:loadFlag,
            taskPlanDateStart: $scope.driver_mileage_startTime,
            taskPlanDateEnd: $scope.driver_mileage_endTime
        };
        _basic.get($host.api_url + "/dpRouteTask?" + _basic.objToUrl(obj)).then(function (data) {
            if (data.success == true) {
                $scope.instruction_list = data.result;
            }
            else {
                $scope.instruction_list = [];
            }
        });
    };


    $scope.return = function () {
        $state.go($stateParams.from,{from:'instruction_drive_details'}, {reload: true})
    }

}]);