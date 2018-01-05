/**
 * Created by ASUS on 2017/6/22.
 */
app.controller("setting_shipments_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {

    // 初始数据
    _basic.get($host.api_url + "/baseAddr").then(function (data) {
        if (data.success == true && data.result.length > 0) {
            $scope.setting_shipments = data.result;
            $scope.len = data.result.length;
        }
    });

    // 信息获取
    $scope.get_Msg = function () {
        // 城市
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.get_city = data.result;
                $('#chooseCity').select2({
                    placeholder: '选择城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
        });

    };
    $scope.get_Msg();

    // 城市-发运地联动
    $scope.get_dealer = function () {
        if($scope.city == 0 || $scope.city == "" || $scope.city == null){
            $scope.city = null;
            $scope.setting_shipments_city = [];
        }
        else{
            // 发运地下拉列表
            _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.city).then(function (data) {
                if (data.success == true) {
                    $scope.setting_shipments_city = data.result;
                }
            });
        }
    };

    // 搜索经销商
    $scope.search_dealer = function () {
        var obj = {
            receiveId: $scope.s_dealer,
            cityId: $scope.city
        };

        _basic.get($host.api_url + "/baseAddr?" + _basic.objToUrl(obj)).then(function (data) {
            if (data.success == true) {
                $scope.setting_shipments = data.result;
                $scope.len = data.result.length;
            }
        })
    };

}]);