/**
 * Created by ASUS on 2017/6/5.
 */
app.controller("setting_city_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
        var userId = _basic.getSession(_basic.USER_ID);
            $scope.submitted=false;
            // var obj = {
            //     originPassword: $scope.primaryCode,
            //     newPassword: $scope.newCode
            // };
            // 打开汽车品牌
            $scope.city_box = function ($event) {
                $($event.target).hide();
                $(".city_box").show();
            };
            // 关闭汽车品牌
            $scope.closeCity = function () {
                $(".open_city").show();
                $(".city_box").hide();
                $scope.cityText = "";
                $scope.submitted=false;
            };
            $scope.getCity=function () {
                _basic.get($host.api_url +"/city").then(function (data) {
                    _basic.callBackDate(data,function () {
                        $scope.city_model=data.result;
                    })
                });
            };
            $scope.getCity();
            $scope.add_city=function (iValid) {
                $scope.submitted=true;
                if(iValid){
                    var obj={
                        "cityName": $scope.cityText
                    };
                    _basic.post($host.api_url + "/user/" + userId + "/city",obj).then(function (data) {
                       if(data.success==true){
                           $scope.getCity();
                       }
                    });
                }

            }
}]);