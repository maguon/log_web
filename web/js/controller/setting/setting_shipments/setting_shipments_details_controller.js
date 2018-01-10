/**/
app.controller("setting_shipments_details_controller", ["$scope", "_basic", "_config", "$host", "$stateParams", function ($scope, _basic, _config, $host, $stateParams) {
    var userId = _basic.getSession(_basic.USER_ID);
    var marker;
    var map;

    // 获取城市
    (function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.setting_city = data.result;
                $('.js-example-basic-single').select2({
                    placeholder: '选择城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
        });
    })();


//    搜索新地址
    $scope.search_location = function (myKeys) {
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        if (myKeys != "") {
            myGeo.getPoint(myKeys, function (point) {
                if (point) {
                    map = new BMap.Map("dealer_map");// 创建Map实例
                    // $scope.now_local="当前位置经度：" + point.lng + ",纬度：" + point.lat;
                    marker = new BMap.Marker(point);
                    // var icon = new BMap.Icon('/assets/images/point.png', new BMap.Size(35, 24), {
                    //     anchor: new BMap.Size(35, 24)
                    // });
                    // var marker = new BMap.Marker(point,{
                    //     icon: icon,
                    //     // rotation: 60
                    // });
                    map.centerAndZoom(point, 18);
                    map.addOverlay(marker);
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    marker.enableDragging();
                    $scope.$apply(function () {
                        $scope.lng = point.lng;
                        $scope.lat = point.lat;
                    });
                    marker.addEventListener("dragend", get_location);
                    marker.addEventListener("click", function () {
                        var sContent = "大连顺通物流有限公司...";
                        var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
                        map.openInfoWindow(infoWindow, point); //开启信息窗口
                    });
                    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放;
                    map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
                } else {
                    swal("无法定位当前地址", "", "error");
                }
            }, "中国");
        }

    };

//    获取移动后的坐标
    var get_location = function () {
        $scope.$apply(function () {
            var p = marker.getPosition();//获取marker的位置
            $scope.lng = p.lng;
            $scope.lat = p.lat;
        });
    };

    // 查看详情
    _basic.get($host.api_url + "/baseAddr?baseAddrId=" + $stateParams.shipments_id).then(function (data) {
        if (data.success == true) {
            $scope.shipments_details = data.result[0];
            $scope.input_address = $scope.shipments_details.address;
            $scope.lng = data.result[0].lng;
            $scope.lat = data.result[0].lat;
            // $scope.search_location(data.result[0].address);

            // 地图重新渲染
            var map = new BMap.Map("dealer_map");

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
            ac.setInputValue($scope.input_address);
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

            var value;
            ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                setPlace();
                $scope.input_address = myValue;
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


            var point = new BMap.Point($scope.lng, $scope.lat);
            map.centerAndZoom(point, 15);
            // var icon = new BMap.Icon('/assets/images/point.png', new BMap.Size(35, 24), {
            //     anchor: new BMap.Size(35, 24)
            // });
            // var marker = new BMap.Marker(point,{
            //     icon: icon,
            //     // rotation: 60
            // });
            marker = new BMap.Marker(point);
            map.addOverlay(marker);
            marker.enableDragging();
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放;
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
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


            // 深度复制
            // $scope.obj1={
            //     "shortName":$scope.dealer_details.short_name,
            //     "receiveName":$scope.dealer_details.receive_name,
            //     "address":$scope.dealer_details.address,
            //     "lng": $scope.lng,
            //     "lat": $scope.lat,
            //     "cityId": $scope.dealer_details.city_id,
            //     "remark": $scope.dealer_details.remark
            // };
            // $scope.$watch('obj1',function(newValue,oldValue, scope){
            //
            //     console.log(newValue);
            //
            //     console.log(oldValue);
            //
            // },true);

            // var deepCopy= function(source) {
            //     var result={};
            //     for (var key in source) {
            //         result[key] = typeof source[key]==='object'? deepCoyp(source[key]): source[key];
            //     }
            //     return result;
            // };
            // $scope._obj=deepCopy(obj);

        } else {
            swal(data.msg, "", "error");
        }
    });


    // 修改经销商
    $scope.change_setting_dealer = function (isValid) {
        $scope.submitted = true;
        if (isValid) {

            var obj = {
                "addrName": $scope.shipments_details.addr_name,
                "address": $scope.input_address,
                "cityId": $scope.shipments_details.city_id,
                "lng": $scope.lng,
                "lat": $scope.lat,
                "remark": $scope.shipments_details.remark
            };
            // // 比较对象是否发生变化
            // // if(JSON.stringify($scope._obj) === JSON.stringify(obj)){
            // //
            // // }else {
            // //     console.log(obj,$scope._obj);
            // // }
            _basic.put($host.api_url + "/user/" + userId + "/baseAddr/" + $stateParams.shipments_id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    $scope.submitted = false;
                }
            });
        }
    };
}]);