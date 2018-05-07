/**
 * Created by ASUS on 2017/6/7.
 * Restructure by zcy on 2018/5/7.
 */
app.controller("add_setting_dealer_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {

    var userId = _basic.getSession(_basic.USER_ID);
    $scope.lng = 121.62;
    $scope.lat = 38.92;

    // 获取城市
    $scope.getCityList = function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.setting_city = data.result;
                $('#chooseCity').select2({
                    placeholder: '选择城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
        });
    };

    // 选择清除城市重置value
    $scope.eliminateCityVal = function () {
        if($scope.setting_city_id == 0 || $scope.setting_city_id == "" || $scope.setting_city_id == null){
            $scope.setting_city_id = null
        }
    };

    // 显示定位点
    $scope.showMarkerPosition = function (lon, lat) {
        var marker, map = new AMap.Map("a_map_location", {
            resizeEnable: true,
            center: [lon, lat],
            zoom: 17
        });
        if (marker) {
            return;
        }
        marker = new AMap.Marker({
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [lon, lat]
        });
        marker.setMap(map);
    };

    // 高德autocomplete
    $scope.amapAutocomplete = function () {
        AMap.plugin(['AMap.Autocomplete'],function(){
            var autoOptions = {
                city: "中国", //城市，默认全国
                input: "amapAddress"//使用联想输入的input的id
            };
            var autocomplete = new AMap.Autocomplete(autoOptions);
            AMap.event.addListener(autocomplete, "select", function(e){
                // console.log(e);
                if(e.poi.location === undefined){
                    swal("无法获取该位置地理信息", "请重新输入", "warning")
                }
                else{
                    $scope.$apply(function () {
                        $scope.lng = e.poi.location.lng;
                        $scope.lat = e.poi.location.lat;
                    });
                    // console.log($scope.lng,$scope.lat);
                    $scope.showMarkerPosition(e.poi.location.lng, e.poi.location.lat);
                }
            });
        });
    };

    // 新增经销商
    $scope.add_setting_dealer = function (isValid) {
        $scope.submitted = true;
        if (isValid) {
            if ($scope.lng != 121.62 && $scope.lat != 38.92) {
                var obj = {
                    shortName: $scope.short_name,
                    receiveName: $scope.deal_name,
                    address: $scope.input_address,
                    lng: $scope.lng,
                    lat: $scope.lat,
                    cityId: $scope.setting_city_id,
                    remark: $scope.remark
                };
                _basic.post($host.api_url + "/user/" + userId + "/receive", obj).then(function (data) {
                    if (data.success == true) {
                        swal("新增成功", "", "success");
                        $scope.short_name = "";
                        $scope.deal_name = "";
                        $scope.input_address = "";
                        $scope.setting_city_id = "";
                        $scope.remark = "";
                        $scope.submitted = false;
                    }
                });
            }
        }
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getCityList();
        $scope.showMarkerPosition($scope.lng, $scope.lat);
    };
    $scope.queryData();
}]);