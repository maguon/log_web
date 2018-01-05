/**
 * Created by ASUS on 2017/6/7.
 */
app.controller("add_setting_dealer_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    // 获取城市
    (function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.setting_city = data.result;
                $('#chooseCity').select2({
                    placeholder: '选择城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
        });
    })();

    // 选择清除城市重置value
    $scope.eliminateCityVal = function () {
        if($scope.setting_city_id == 0 || $scope.setting_city_id == "" || $scope.setting_city_id == null){
            $scope.setting_city_id = null
        }
    };

    // 百度地图控件
    var map = new BMap.Map("dealer_map");
    var point = new BMap.Point(121.62, 38.92);
    map.centerAndZoom(point, 15);

    // var icon = new BMap.Icon('/assets/images/point.png', new BMap.Size(20, 32), {
    //     anchor: new BMap.Size(10, 30)
    // });
    var marker = new BMap.Marker(point, {
        // icon: icon,
        // rotation: 90
    });
    map.addOverlay(marker);
    marker.enableDragging();
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放;
    map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
    marker.addEventListener("dragend", function () {
        $scope.$apply(function () {
            var p = marker.getPosition();//获取marker的位置
            $scope.lng = p.lng;
            $scope.lat = p.lat;
        });
    });
    marker.addEventListener("click", function () {
        var sContent = "大连顺通物流有限公司...";
        var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow, point); //开启信息窗口
    });
    $scope.lng = 121.62;
    $scope.lat = 38.92;

    // 地图下拉
    function G(id) {
        return document.getElementById(id);
    }

    // 地图自动化提示
    var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {
            "input": "address",
            "location": map
        });

    ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });

    var myValue;
    ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
        $scope.input_address = myValue;
        setPlace();
    });

    function setPlace() {
        map.clearOverlays();    //清除地图上所有覆盖物
        function myFun() {
            var map = new BMap.Map("dealer_map");
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18);
            marker = new BMap.Marker(pp);
            map.addOverlay(marker);    //添加标注
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            marker.enableDragging();
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放;
            $scope.$apply(function () {
                $scope.lng = pp.lng;
                $scope.lat = pp.lat;
            });
            marker.addEventListener("dragend", function () {
                $scope.$apply(function () {
                    var p = marker.getPosition();//获取marker的位置
                    $scope.lng = p.lng;
                    $scope.lat = p.lat;
                });
            });

        }

        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    }

    //    搜索新地址
    $scope.search_location = function (myKeys) {
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        if (myKeys != "") {
            myGeo.getPoint(myKeys, function (point) {
                if (point) {
                    var map = new BMap.Map("dealer_map");// 创建Map实例
                    marker = new BMap.Marker(point);
                    $scope.$apply(function () {
                        $scope.lng = point.lng;
                        $scope.lat = point.lat;
                    });
                    map.centerAndZoom(point, 18);
                    map.addOverlay(marker);
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    marker.enableDragging();
                    marker.addEventListener("dragend", get_location);
                    // marker.addEventListener("click",function () {
                    //     var sContent ="大连顺通物流有限公司...";
                    //     var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
                    //     map.openInfoWindow(infoWindow,point); //开启信息窗口
                    // });
                    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放;
                    map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
                } else {
                    swal("无法定位当前地址", "", "error");
                }
            }, "中国");
        }

    };
    // $scope.search_location("大连市");

//    获取移动后的坐标
    var get_location = function () {
        $scope.$apply(function () {
            var p = marker.getPosition();//获取marker的位置
            $scope.lng = p.lng;
            $scope.lat = p.lat;
        });
    };
    // 新增经销商
    $scope.add_setting_dealer = function (isValid) {
        $scope.submitted = true;
        if (isValid) {
            if ($scope.lng != 121.62 && $scope.lat != 38.92) {
                var obj = {
                    "shortName": $scope.short_name,
                    "receiveName": $scope.deal_name,
                    "address": $scope.input_address,
                    "lng": $scope.lng,
                    "lat": $scope.lat,
                    "cityId": $scope.setting_city_id,
                    "remark": $scope.remark
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

}]);