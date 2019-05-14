/**
 * Created by ASUS on 2017/6/8.
 * Restructure by zcy on 2018/5/7.
 */
app.controller("setting_dealer_details_controller", ["$scope","$state", "$stateParams",  "_basic", "_config", "baseService", "$host", "$stateParams", function ($scope, $state, $stateParams, _basic, _config, baseService, $host, $stateParams) {
    var userId = _basic.getSession(_basic.USER_ID);
    var marker;
    $scope.dealer_details=null;
    $scope.receiveTypeList=_config.receiveType;
    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"setting_dealer__details"}, {reload: true})
    };


    function getCityList(selectText) {
        if(selectText==''||selectText==undefined){
            // 获取城市
            _basic.get($host.api_url + "/city").then(function (data) {
                if (data.success == true) {
                    $scope.setting_city = data.result;
                    $('#start_city').select2({
                        placeholder: '选择城市',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });
                }
            });

        }else{
            // 获取城市
            _basic.get($host.api_url + "/city").then(function (data) {
                if (data.success == true) {
                    $scope.setting_city = data.result;
                    $('#start_city').select2({
                        placeholder: selectText,
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });
                }
            });

        }

    };
function getCarMake(){
    // 车辆品牌
    _basic.get($host.api_url + "/carMake").then(function (data) {
        if (data.success == true) {
            $scope.get_carMake = data.result;
        }
    });
}

    // 高德autocomplete
    $scope.amapAutocomplete = function () {
        AMap.plugin(['AMap.Autocomplete'],function(){
            var autoOptions = {
                city: "中国", //城市，默认全国
                input: "amapAddress"//使用联想输入的input的id
            };
            var autocomplete = new AMap.Autocomplete(autoOptions);
            AMap.event.addListener(autocomplete, "select", function(e){
                if(e.poi.location === undefined){
                    swal("无法获取该位置地理信息", "请重新输入", "warning")
                }
                else{
                    $scope.$apply(function () {
                        $scope.lng = e.poi.location.lng;
                        $scope.lat = e.poi.location.lat;
                    })
                    $scope.showPosition(e.poi.location.lng,e.poi.location.lat);
                }
            });
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
            geocoder.getLocation(mapAddress, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    // result中对应详细地理坐标信息
                    $scope.lat = result.geocodes[0].location.getLat();
                    $scope.lng = result.geocodes[0].location.getLng();
                    $scope.showPosition( $scope.lng, $scope.lat)
                }
                else{
                    swal("无法获取该位置地理信息", "请重新输入", "warning")
                }
            })
        })
    }


    // 显示车辆位置
    $scope.showPosition = function (lon, lat) {
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
        $scope.car_brand=$("#car_brand").find("option:selected").text();
        _basic.get($host.api_url + "/receive?receiveId=" + $stateParams.dealer_id).then(function (data) {
            if (data.success === true) {
                $scope.dealer_details = data.result[0];
                $scope.dealer_details.make_id = data.result[0].make_id;
                $scope.getCityId = data.result[0].city_id;
                $scope.lng = data.result[0].lng ? data.result[0].lng : 121.62;
                $scope.lat = data.result[0].lat ? data.result[0].lat : 38.92;
                getCityList($scope.dealer_details.city_name)
                // 显示经销商位置
                $scope.showPosition($scope.lng, $scope.lat);
            }
        });
    };

  /*  $scope.changeCity = function (cityId){

    }*/


    // 修改经销商
    $scope.change_setting_dealer = function () {

        if ($scope.dealer_details.receive_type!==null
            &&$scope.dealer_details.short_name!==undefined
            &&$scope.dealer_details.receive_name!==undefined
            &&$scope.dealer_details.city_id!==''
            &&$scope.dealer_details.address!=='') {
            // 车辆品牌
            $scope.dealer_details.make_id = $scope.dealer_details.make_id == '' ?0 :$scope.dealer_details.make_id;
            if($scope.dealer_details.make_id==0){
                $scope.dealer_details.make_name='';
                putReceive();
            }
            else{
                _basic.get($host.api_url + "/carMake?makeId="+$scope.dealer_details.make_id).then(function (data) {
                    if (data.success == true) {
                        $scope.dealer_details.make_name = data.result[0].make_name;

                        putReceive();
                    }
                });
            }

        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    };


    function putReceive(){
        if( $scope.getCityId==null){
            $scope.getCityId= $scope.dealer_details.city_id;
        }
        var cleanFeeCount = $scope.dealer_details.clean_fee == null ? 0 : $scope.dealer_details.clean_fee.toFixed(2);
        var obj={
            shortName: $scope.dealer_details.short_name,
            receiveName: $scope.dealer_details.receive_name,
            receiveType:$scope.dealer_details.receive_type,
            receiveFlag:$scope.dealer_details.receive_flag,
            makeId:$scope.dealer_details.make_id,
            makeName: $scope.dealer_details.make_name,
            cleanFee: parseFloat(cleanFeeCount),
            address: $("#amapAddress").val(),
            lng: $scope.lng,
            lat: $scope.lat,
            cityId: $scope.getCityId,
            remark: $scope.dealer_details.remark
        }
        _basic.put($host.api_url + "/user/" + userId + "/receive/" + $stateParams.dealer_id, obj ).then(function (data) {
            if (data.success === true) {
                swal("修改成功", "", "success");
                $scope.submitted = false;
                $scope.seeDetails();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

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
        $scope.seeDetails();
        getCarMake();
        getCityList()
    };
    $scope.queryData();
}]);