/**/
app.controller("setting_shipments_details_controller", ["$scope", "_basic", "_config", "$host", "$stateParams", function ($scope, _basic, _config, $host, $stateParams) {

    var userId = _basic.getSession(_basic.USER_ID);

    // 获取城市
    $scope.getCityList = function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                $scope.setting_city = data.result;
                $("#start_city").select2({
                    placeholder: '选择城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
        });
    };

    // 获取发运地信息
    $scope.getAddrData = function () {
        _basic.get($host.api_url + "/baseAddr?baseAddrId=" + $stateParams.shipments_id).then(function (data) {
            if (data.success === true) {
                $scope.shipments_details = data.result[0];
                $scope.input_address = $scope.shipments_details.address;
                $scope.lng = data.result[0].lng;
                $scope.lat = data.result[0].lat;
                $scope.locatedCity = data.result[0].city_id;
                $scope.getCityList();
               /* $('#start_city').val(data.result[0].city_id);
                $("#select2-start_city-container").html($("#start_city").find("option:selected").text());*/
                $scope.showMarkerPosition($scope.lng, $scope.lat)
            }
            else {
                $scope.getCityList();
                swal(data.msg, "", "error");
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

    // 修改经销商
    $scope.change_setting_dealer = function (isValid) {
        $scope.submitted = true;
        if (isValid) {
            var obj = {
                addrName: $scope.shipments_details.addr_name,
                address: $("#amapAddress").val(),
                cityId: $scope.locatedCity,
                lng: $scope.lng,
                lat: $scope.lat,
                remark: $scope.shipments_details.remark
            };
            _basic.put($host.api_url + "/user/" + userId + "/baseAddr/" + $stateParams.shipments_id, obj).then(function (data) {
                if (data.success === true) {
                    swal("修改成功", "", "success");
                    $scope.submitted = false;
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getAddrData();
    };
    $scope.queryData()
}]);