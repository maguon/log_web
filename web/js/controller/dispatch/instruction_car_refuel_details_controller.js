/**
 * Created by ASUS on 2017/9/8.
 */

app.controller("instruction_car_refuel_details_controller", ["$scope", "$host", "_basic", "$state", "$stateParams", function ($scope, $host, _basic, $state, $stateParams) {
    $scope.id = $stateParams.id;
    $scope.from = $stateParams.from;
    var userId = _basic.getSession(_basic.USER_ID);

    // 通过
    $scope.resolve = function (id) {
        swal({
                title: "确认审核通过？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                _basic.put($host.api_url + "/user/" + userId + "/driveRefuel/" + id + "/checkStatus/" + 2, {}).then(function (data) {
                    if (data.success == true) {
                        $scope.search_All();
                    }
                })
            });
    };
    // 拒绝
    $scope.reject = function (id) {
        $scope.reject_id = id;
        $scope.reject_reason_msg = "";
        $('#modal1').modal('open');
    };

    $scope.reject_reason = function () {
        if($scope.reject_reason_msg !== ""){
            _basic.put($host.api_url + "/user/" + userId + "/driveRefuel/" + $scope.reject_id + "/checkStatus/" + 3, {
                checkReason: $scope.reject_reason_msg
            }).then(function (data) {
                if (data.success == true) {
                    $scope.search_All();
                    $('#modal1').modal('close');
                }
            })
        }
        else{
            swal("拒绝原因不能为空", "", "warning")
        }

    };

    $scope.search_All = function () {
        _basic.get($host.api_url + "/driveRefuel?driveRefuelId=" + $scope.id).then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.driveRefuel_details = data.result[0];
                var lat = data.result[0].lat;
                var lng = data.result[0].lng;
                // console.log("driveRefuel_details",$scope.driveRefuel_details);
                // 百度地图API功能
                var map = new BMap.Map("refuel_address");
                var point = new BMap.Point(lng, lat);
                map.centerAndZoom(point, 15);
                var marker = new BMap.Marker(point);  // 创建标注
                map.addOverlay(marker);               // 将标注添加到地图中
                marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            } else {
                swal(data.msg, "", "error")
            }
        });
    };
    $scope.search_All();
}]);