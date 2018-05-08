/**
 * Created by ASUS on 2017/6/8.
 * Restructure by zcy on 2018/5/7.
 */
app.controller("setting_dealer_details_controller", ["$scope", "_basic", "_config", "baseService", "$host", "$stateParams", function ($scope, _basic, _config, baseService, $host, $stateParams) {
    var userId = _basic.getSession(_basic.USER_ID);
    var marker;

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
                    $scope.showTruckPosition(e.poi.location.lng,e.poi.location.lat);
                }
            });
        });
    };

    // 显示车辆位置
    $scope.showTruckPosition = function (lon, lat) {
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

    // 查看详情
    $scope.seeDetails = function () {
        _basic.get($host.api_url + "/receive?receiveId=" + $stateParams.dealer_id).then(function (data) {
            if (data.success === true) {
                // console.log("data",data);
                $scope.dealer_details = data.result[0];
                $scope.lng = data.result[0].lng ? data.result[0].lng : 121.62;
                $scope.lat = data.result[0].lat ? data.result[0].lat : 38.92;

                // 显示经销商位置
                // var positionResult = baseService.transformMarkerPosition($scope.lng, $scope.lat);
                $scope.showTruckPosition($scope.lng, $scope.lat);
            }
        });
    };

    // 修改经销商
    $scope.change_setting_dealer = function (isValid) {
        $scope.submitted = true;
        if (isValid) {
            var obj = {
                shortName: $scope.dealer_details.short_name,
                receiveName: $scope.dealer_details.receive_name,
                cleanFee: $scope.dealer_details.clean_fee.toFixed(2),
                address: $scope.dealer_details.address,
                lng: $scope.lng,
                lat: $scope.lat,
                cityId: $scope.dealer_details.city_id,
                remark: $scope.dealer_details.remark
            };

            _basic.put($host.api_url + "/user/" + userId + "/receive/" + $stateParams.dealer_id, obj).then(function (data) {
                if (data.success === true) {
                    swal("修改成功", "", "success");
                    $scope.submitted = false;
                    $scope.seeDetails();
                }
            });
        }
    };

    // 获取经销商操作记录
    $scope.getOperateDetails = function () {
        _basic.get($host.record_url + "/receiverRecord?receiverId=" + $stateParams.dealer_id).then(function (data) {
            if (data.success === true) {
                // console.log("data",data);
                if(data.result.length === 0 || data.result[0].comment.length === 0){
                    $scope.recordList = [];
                }
                else{
                    $scope.recordList = data.result[0].comment;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    $scope.queryData = function () {
        $scope.getCityList();
        $scope.seeDetails();
    };
    $scope.queryData();
}]);