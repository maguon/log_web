/**
 * Created by ASUS on 2017/8/30.
 */
app.controller("instruction_drive_details_controller", ["$scope", "$host", "_config", "_basic", "$state", "$stateParams", function ($scope, $host, _config, _basic, $state, $stateParams) {
    var dateIdStart = $stateParams.timeStart;
    var dateIdEnd = $stateParams.timeEnd;
    var makeId = $stateParams.makeId;
    $scope.driveId = $stateParams.id;
    $scope.driver_mileage_startTime = dateIdStart;
    $scope.driver_mileage_endTime = dateIdEnd;
    var loadFlag = "";
    var drive_detail = function () {
        var p = new Promise(function (resolve, reject) {
            if ($scope.car_status == '0') {
                loadFlag ='0';
            }
            else if ($scope.car_status == 1) {
                loadFlag =1;
            }
            else {
                loadFlag ='';
            }

            var obj = {
                taskStatus: 9,
                driveId: $scope.driveId,
                truckId:makeId,
                dateIdStart: $scope.driver_mileage_startTime,
                dateIdEnd: $scope.driver_mileage_endTime,
                loadFlag:loadFlag
            };
            _basic.get($host.api_url + "/driveDistanceLoadStat?" + _basic.objToUrl(obj)).then(function (data) {
                if (data.success == true ) {
                    if(data.result.length ==0){
                        $scope.driveDetail.no_load_distance = 0
                        $scope.driveDetail.load_distance = 0
                    }
                    else {
                        $scope.driveDetail = data.result[0];
                        if ($scope.driveDetail.no_load_distance == null) {
                            $scope.driveDetail.no_load_distance = 0
                        }
                        if ($scope.driveDetail.load_distance == null) {
                            $scope.driveDetail.load_distance = 0
                        }
                        resolve();
                    }

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
        drive_detail();



        if ($scope.car_status == '0') {
            loadFlag ='0';
        }
        else if ($scope.car_status == 1) {
            loadFlag =1;
        }
        else {
            loadFlag ='';
        }

        var obj = {
            taskStatusArr:[9,10],
            driveId:$scope.driveId,
            loadFlag:loadFlag,
            truckId:makeId,
            dateIdStart: $scope.driver_mileage_startTime,
            dateIdEnd: $scope.driver_mileage_endTime
        };
        _basic.get($host.api_url + "/dpRouteTaskList?" + _basic.objToUrl(obj)).then(function (data) {
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