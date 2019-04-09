/**
 * Created by ASUS on 2017/6/5.
 */
app.controller("setting_city_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.submitted = false;
    $scope.city_box_show = false;
    $scope.city_btn = true;

    // 打开汽车品牌
    $scope.city_box = function () {
        $scope.city_btn = false;
        $scope.city_box_show = true;
    };

    // 关闭汽车品牌
    $scope.closeCity = function () {
        $scope.city_box_show = false;
        $scope.city_btn = true;
        $scope.cityText = "";
        $scope.submitted = false;
    };

    $scope.getCity = function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            _basic.callBackDate(data, function () {
                $scope.city_model = data.result;
            })
        });
    };
    $scope.getCity();

    $scope.add_city = function (iValid) {
        $scope.submitted = true;
        if (iValid) {
            var obj = {
                cityName: $scope.cityText
            };
            _basic.post($host.api_url + "/user/" + userId + "/city", obj).then(function (data) {
                if (data.success === true) {
                    $scope.getCity();
                    $scope.cityText = "";
                    $scope.submitted = false;
                }
                else{
                    swal(data.msg, "", "error")
                }
            });
        }
    }

    $scope.openCity =function (id,status,index){
        if (status == 1) {
            status = 0
            swal({
                title: "确定修改此状态吗?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(
                function (result) {
                    if (result.value) {
                        _basic.put($host.api_url + "/user/" + userId + '/city/' + id + "/cityOilFlag/" + status
                            , {}).then(function (data) {
                            if (data.success !== true) {
                                swal(data.msg, "", "error");
                            }else{
                                $scope.getCity()
                            }
                        })
                    }else {
                        event.target.checked =!event.target.checked;
                    }
                })
        } else {
            status = 1
            _basic.put($host.api_url + "/user/" + userId + '/city/' + id + "/cityOilFlag/" + status
                , {}).then(function (data) {
                if (data.success !== true) {
                    swal(data.msg, "", "error");
                }else{
                    $scope.getCity()
                }
            })
        }
    }


}]);