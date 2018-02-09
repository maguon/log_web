app.controller("look_truck_management_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var truckId = $stateParams.id;
    $scope.step1 = true;
    $scope.step2 =false;
    $scope.step3 =false;
    $scope.step4 =false;
    $scope.step5 =false;
    // 点击返回按钮返回之前页面
    $scope.return = function () {
        $state.go($stateParams.from, {reload: true});
    };
    // 百度地图控件
    var map = new BMap.Map("dealer_map");
    var point = new BMap.Point(121.62, 38.92);
    map.centerAndZoom(point, 15);
    var marker = new BMap.Marker(point, {
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
        $scope.address=myValue;
    }
    //搜索新地址
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
                    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放;
                    map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
                } else {
                    swal("无法定位当前地址", "", "error");
                }
            }, "中国");
        }
    };
    //获取移动后的坐标
    var get_location = function () {
        $scope.$apply(function () {
            var p = marker.getPosition();//获取marker的位置
            $scope.lng = p.lng;
            $scope.lat = p.lat;
        });
    };
    //获取信息
    function getDetailTruckData (){
        _basic.get($host.api_url + "/truckAccident?truckAccidentId=" + truckId).then(function (data) {
            if (data.success === true) {
                $scope.vId=data.result[0].id;
                $scope.accidentDate=data.result[0].accident_date;
                $scope.accidentDateDetail=moment($scope.accidentDate).format("YYYY-MM-DD HH:mm");
                $scope.truckNum=data.result[0].truck_num;
                $scope.driveName=data.result[0].drive_name;
                $scope.accidentStatus=data.result[0].accident_status;
                $scope.address=data.result[0].address;
                $scope.remark=data.result[0].accident_explain;
                _basic.get($host.api_url + "/truckFirst?truckNum="+  $scope.truckNum).then(function (data) {
                    if (data.success === true) {
                        $scope.truckTel=data.result[0].truck_tel;
                        $scope.companyName=data.result[0].company_name;
                    }
                })
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    }
    //事故信息
    $scope.createTruckAccident=function(valid){
        if(valid){
            var managementInfo = {
                driveId:$scope.driveId,
                truckId:$scope.Id,
                dpRouteTaskId:$scope.dpRouteTaskId,
                accidentDate: $scope.accidentDate+" " + $scope.lineStartTime,
                address: $scope.address,
                lng:$scope.lng,
                lat: $scope.lat,
                remark: $scope.remark
            };
            _basic.post($host.api_url + "/user/" + userId + "/truckAccident"+truckId, managementInfo).then(function (data) {
                if (data.success === true) {
                    $scope.step_first = false;
                    $scope.step_second = true;
                    // $(".test1").addClass("disabled");
                    // $(".test2").removeClass("disabled");
                    // $("#test2").addClass("display:b");
                    $(".tabs .indicator").css({
                        right: 0 + "px",
                        left: 50 + '%'
                    });
                    $(".tab2>a").addClass("active");
                    $(".tab1>a").removeClass("active");
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }
    // 获取数据
    $scope.queryData = function () {
        getDetailTruckData();
    };
    $scope.queryData();
}]);