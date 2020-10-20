app.controller("dealer_map_controller", ["$scope", "_basic", "_config", "baseService", "$host", function ($scope, _basic, _config, baseService, $host) {
    var truckPositionList = [];
    var dealerPositionList = [];
    $scope.receiveTypeList = _config.receiveType;
    $scope.dealer_details = null;
    $scope.flag = true;
    $scope.dealer = '';

    // 统计
    $scope.test1 = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.test1 ').addClass("active");
        $("#test1").addClass("active");
        $("#test1").show();
    };

    // 精确
    $scope.test2 = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.test2 ').addClass("active");
        $("#test2").addClass("active");
        $("#test2").show();
        // 清空检索条件
        $scope.receive_type = '';
        $scope.car_brand = '';
        $scope.receive_flag = '';

        $scope.cityList = [];
        $scope.citySelect = '';
        getCity();
        $scope.getRecive();
    };

    $scope.getRecive = function () {
        if ($scope.citySelect == 0 || $scope.citySelect == "" || $scope.citySelect == null) {
            $scope.citySelect = null;
            $scope.receiveList = [];
        } else {
            _basic.get($host.api_url + "/receive?cityId=" + $scope.citySelect).then(function (data) {
                if (data.success === true) {
                    $scope.receiveList = data.result;
                    $('#dealer').select2({
                        placeholder: '经销商',
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
            });
        }
    };

    $scope.test1();


    // 显示所有车辆位置
    $scope.showAllTruckPosition = function () {
        //初始化地图容器
        var cluster, markers = [];
        var map = new AMap.Map("amap_setting_dealer", {
            resizeEnable: true,
            center: [110.46, 37.92],
            zoom: 4
        });

        for (var i = 0; i < truckPositionList.length; i += 1) {
            markers.push(new AMap.Marker({
                position: truckPositionList[i],
                content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
                offset: new AMap.Pixel(-15, -15)
            }))
        }
        var count = markers.length;
        var _renderCluserMarker = function (context) {
            var factor = Math.pow(context.count / count, 1 / 18)
            var div = document.createElement('div');
            var Hue = 180 - factor * 180;
            var bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
            var fontColor = 'hsla(' + Hue + ',100%,20%,1)';
            var borderColor = 'hsla(' + Hue + ',100%,40%,1)';
            var shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
            div.style.backgroundColor = bgColor
            var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
            div.style.width = div.style.height = size + 'px';
            div.style.border = 'solid 1px ' + borderColor;
            div.style.borderRadius = size / 2 + 'px';
            div.style.boxShadow = '0 0 1px ' + shadowColor;
            div.innerHTML = context.count;
            div.style.lineHeight = size + 'px';
            div.style.color = fontColor;
            div.style.fontSize = '14px';
            div.style.textAlign = 'center';
            context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
            context.marker.setContent(div)
        };
        addCluster(2);

        function addCluster(tag) {
            if (cluster) {
                cluster.setMap(null);
            }
            if (tag == 2) {//完全自定义
                cluster = new AMap.MarkerClusterer(map, markers, {
                    gridSize: 80,
                    renderCluserMarker: _renderCluserMarker
                });
            } else {//默认样式
                cluster = new AMap.MarkerClusterer(map, markers, {gridSize: 80});
            }
        }
    };

    // 组装检索条件
    function makeConditions() {
        let urlFix = '';
        // 经销商类型
        if ($scope.receive_type !== undefined && $scope.receive_type != null && $scope.receive_type !== '') {
            urlFix = urlFix + '&receiveType=' + $scope.receive_type
        }
        // 经营品牌
        if ($scope.car_brand !== undefined && $scope.car_brand != null && $scope.car_brand !== '') {
            urlFix = urlFix + '&makeId=' + $scope.car_brand.id
        }
        // 是否为库
        if ($scope.receive_flag !== undefined && $scope.receive_flag != null && $scope.receive_flag !== '') {
            urlFix = urlFix + '&receiveFlag=' + $scope.receive_flag
        }
        return urlFix;
    }

    //到二层或者三层
    $scope.getCityOrDealer = function (c, d) {
        // 组装检索条件
        let urlFix = makeConditions();

        if (c == '' || c == null || c == undefined) {
            getAllPositionInfo();
            swal('请先选择城市!', "", "error")
        } else {
            if (d == null || d == undefined || d == "") {
                $scope.getCityDealer(c, urlFix);
            } else {
                $scope.c = '';
                $scope.getDetailDealer(d, urlFix);
            }
        }
    };

    //点击城市以后获取经销商（第二层）
    $scope.getCityDealer = function (city, urlFix) {
        $scope.flagScond = true;
        dealerPositionList = [];
        $scope.flag = false;
        $scope.city = city;
        $scope.c = city;
        $scope.dealer_details = null;

        // 经销商下拉列表
        _basic.get($host.api_url + "/receive?cityId=" + city + urlFix).then(function (data) {
            if (data.success === true) {
                if (data.result.length === 0) {
                    getAllPositionInfo();
                    swal('此城市暂无经销商!', "", "error")
                } else {
                    $scope.get_receive = data.result;

                    for (var i = 0; i < data.result.length; i++) {
                        dealerPositionList.push([data.result[i].lng, data.result[i].lat])
                    }
                    var map = new AMap.Map('amap_setting_dealer', {
                        resizeEnable: true
                    });

                    for (var i = 0; i < dealerPositionList.length; i++) {
                        marker = new AMap.Marker({
                            position: dealerPositionList[i],
                            map: map,
                            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png"
                        });

                        // 设置label标签
                        marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
                            offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
                            content: data.result[i].short_name
                        });
                    }

                }
            }
        })
    };

    //获取详细位置（第三层）
    $scope.getDetailDealer = function (id, urlFix) {
        $scope.flagScond = false;
        $scope.flag = '';
        $scope.id = id;

        _basic.get($host.api_url + "/receive?receiveId=" + id + urlFix).then(function (data) {
            if (data.success === true) {
                if (data.result.length === 0) {
                    getAllPositionInfo();
                    swal('此城市暂无经销商!', "", "error")
                } else {
                    $scope.dealer_details = data.result[0];
                    $scope.lng = data.result[0].lng ? data.result[0].lng : 121.62;
                    $scope.lat = data.result[0].lat ? data.result[0].lat : 38.92;
                    var marker, map = new AMap.Map("amap_setting_dealer", {
                        resizeEnable: true,
                        center: [$scope.lng, $scope.lat],
                        zoom: 16
                    });
                    if (marker) {
                        return;
                    }
                    marker = new AMap.Marker({
                        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                        position: [$scope.lng, $scope.lat]
                    });
                    marker.setMap(map);
                }
            }
        });
        _basic.get($host.api_url + "/receive/" + $scope.id + '/contacts').then(function (data) {
            if (data.success === true) {
                if (data.result.length == 0) {
                    $scope.dealerContacts = [];
                } else {
                    $scope.dealerContacts = data.result;
                }
            }
        });
    };

    //返回第一层
    $scope.returnLast = function () {
        // 2020-10-20 修改，保持检索条件
        // $scope.get_receive = [];
        // $scope.cityList=[];
        // $scope.citySelect='';
        // getCity();
        truckPositionList = [];
        getAllPositionInfo();
    };


    //返回上一层（第三层到第二层）
    $scope.return = function () {
        if ($scope.c == '') {
            // 2020-10-20 修改，保持检索条件
            // $scope.get_receive = [];
            // $scope.cityList=[];
            // $scope.citySelect='';
            truckPositionList = [];
            $scope.flagScond = true;
            $scope.flag = true;
            $scope.dealer_details = null;
            getAllPositionInfo();
        } else {
            $scope.getCityDealer($scope.city);
        }
    };

    // 获取经销商经营品牌
    function getCarMakeList() {
        // 车辆品牌
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success) {
                $scope.carMakeList = data.result;
            }
        });
    }

    function getCity() {
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success) {
                $scope.cityList = cityData.result;
                $('#citySelectOn').select2({
                    placeholder: '城市',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            } else {
                swal(cityData.msg, "", "error");
            }
        });
    }

    // 城市信息获取
    function getMsg() {
        _basic.get($host.api_url + "/receiveCount").then(function (data) {
            if (data.success) {
                $scope.get_city = data.result;
            }
        });
    }

    // 获取经销商位置信息（第一层）
    function getAllPositionInfo() {
        $scope.flag = true;
        _basic.get($host.api_url + "/receive/").then(function (data) {
            if (data.success === true) {
                if (data.result.length > 0) {
                    truckGps = data.result;
                    $scope.truckGps = data.result;
                    for (var i = 0; i < data.result.length; i++) {
                        truckPositionList.push([data.result[i].lng, data.result[i].lat])
                    }
                    $scope.showAllTruckPosition();
                }
            } else {
                swal(data.msg, "", "error")
            }
        });
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 经营品牌
        getCarMakeList();
        // 城市
        getCity();
        // 城市信息获取
        getMsg();
        // 获取经销商位置信息（第一层）
        getAllPositionInfo();
    }

    initData();
}]);