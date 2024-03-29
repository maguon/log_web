/**
 * Created by ASUS on 2017/6/22.
 */
app.controller("add_setting_shipments_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {

    var userId = _basic.getSession(_basic.USER_ID);
    $scope.lng = 121.62;
    $scope.lat = 38.92;

    // 获取城市
    $scope.getCityList = function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.setting_city = data.result;
                $('#start_city').select2({
                    placeholder: '选择城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
        });
    };
    $scope.getDetailAddress = function (){
        AMap.plugin('AMap.Geocoder', function() {
            var geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: '中国',
                radius: 1000 //范围，默认：500
            });
            var mapAddress = amapAddress.value;
            $scope.lat = 39.0451;
            $scope.lng = 121.84541;
            $scope.showMarkerPosition( $scope.lng, $scope.lat)

            /* geocoder.getLocation(mapAddress, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    // result中对应详细地理坐标信息
                    $scope.lat = result.geocodes[0].location.getLat();
                    $scope.lng = result.geocodes[0].location.getLng();
                    $scope.showMarkerPosition( $scope.lng, $scope.lat)
                }
                else{
                    swal("无法获取该位置地理信息", "请重新输入", "warning")
                }
            }) */
        })
    }
    // 显示marker位置
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
                    $scope.showMarkerPosition(e.poi.location.lng,e.poi.location.lat);
                }
            });
        });
    };

    // 新增发货商
    $scope.add_setting_dealer = function (isValid) {
        $scope.submitted = true;
        if (isValid) {
            if ($scope.lng != 121.62 && $scope.lat != 38.92) {
                var obj = {
                    addrName: $scope.shipments_name,
                    address: $("#amapAddress").val(),
                    lng: $scope.lng,
                    lat: $scope.lat,
                    cityId: $scope.setting_city_id,
                    remark: $scope.remark
                };
                _basic.post($host.api_url + "/user/" + userId + "/baseAddr", obj).then(function (data) {
                    if (data.success === true) {
                        swal("新增成功", "", "success");
                        $scope.shipments_name = "";
                        $scope.input_address = "";
                        $scope.setting_city_id = "";
                        $scope.remark = "";
                        $scope.submitted = false;
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
        }
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getCityList();
        $scope.showMarkerPosition($scope.lng, $scope.lat)
    };
    $scope.queryData()

}]);