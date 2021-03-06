/**
 * Created by ASUS on 2017/9/8.
 */

app.controller("instruction_car_refuel_details_controller", ["$scope", "$host", "_basic", "$state", "$stateParams", function ($scope, $host, _basic, $state, $stateParams) {
    $scope.id = $stateParams.id;
    $scope.from = $stateParams.from;
    var userId = _basic.getSession(_basic.USER_ID);


    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"instruction_car_refuel_details"}, {reload: true})
    };
    // 通过
    $scope.resolve = function (id) {
        swal({
                title: "确认审核通过？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
        }).then(
            function (result) {
                if (result.value) {
                    _basic.put($host.api_url + "/user/" + userId + "/driveRefuel/" + id + "/checkStatus/" + 2, {}).then(function (data) {
                        if (data.success == true) {
                            $scope.search_All();
                        }
                    })
                }
            });
    };
    // 拒绝
    $scope.reject = function (id) {
        $scope.reject_id = id;
        $scope.reject_reason_msg = "";
        $('#modal1').modal('open');
    };

    $scope.reject_reason = function () {
        // console.log("reject_reason_msg",$scope.reject_reason_msg);
        if ($scope.reject_reason_msg != "") {
            _basic.put($host.api_url + "/user/" + userId + "/driveRefuel/" + $scope.reject_id + "/checkStatus/" + 3, {
                checkReason: $scope.reject_reason_msg
            }).then(function (data) {
                if (data.success == true) {
                    $scope.search_All();
                    $('#modal1').modal('close');
                }
            })
        }
        else {
            swal("拒绝原因不能为空", "", "warning")
        }

    };

    $scope.search_All = function () {
        _basic.get($host.api_url + "/driveRefuel?driveRefuelId=" + $scope.id).then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.driveRefuel_details = data.result[0];
                if(data.result[0].route_start==null ){
                    $scope.driveRefuel_details.route_start='未知';
                }
                if(data.result[0].route_end==null ){
                    $scope.driveRefuel_details.route_end='未知';
                }
                if(data.result[0].dp_route_task_id==null ){
                    $scope.driveRefuel_details.dp_route_task_id='';
                }
                var lat = data.result[0].lat;
                var lng = data.result[0].lng;
                var marker, map = new AMap.Map("refuel_address", {
                    resizeEnable: true,
                    center: [lng, lat],
                    zoom: 13
                });
                if (marker) {
                    return;
                }
                marker = new AMap.Marker({
                    icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                    position: [lng, lat]
                });
                marker.setMap(map);
            }
            else {
                swal(data.msg, "", "error")
            }
        });
    };
    $scope.search_All();
}]);