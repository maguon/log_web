app.controller("add_truck_management_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host",
    function ($scope, $state, $stateParams, _basic, _config, $host) {
        var userId = _basic.getSession(_basic.USER_ID);
        $scope.step_first = true;
        $scope.step_second =false;
        $scope.car_image_i = [];
        $scope.car_imageBox = [];
        //返回
        $scope.return = function () {
            $state.go($stateParams.from, {reload: true})
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
        //点击加号
        $scope.search_dpRouteTaskId = function(){
                _basic.get($host.api_url +"/dpRouteTask?dpRouteTaskId=" + $scope.dpRouteTaskId).then(function (data) {
                    if (data.success == true&& data.result.length !== 0) {
                        $scope.driverName=data.result[0].drive_name;
                        $scope.startCityName=data.result[0].city_route_end;
                        $scope.endCityName=data.result[0].city_route_start;
                        $scope.taskStartDate=data.result[0].task_start_date;
                        $scope.trailNum=data.result[0].trail_num;
                        $scope.truckNum=data.result[0].truck_num;
                        $scope.driveId  = data.result[0].drive_id;
                        $scope.lineInfo = true;
                    }else {
                        $scope.dpRouteTaskId=null;
                        $scope.lineInfo = false;
                        swal("编号不存在，请重新填写","","error");
                    }
                    $scope.trailNumclick();
                })
        }
        $scope.truckNumclick=function(){
            _basic.get($host.api_url +"/truckBase?truckNum=" + $scope.truckNum).then(function (data) {
                        $scope.Id  =data.result[0].id;
            })
        }
        $scope.trailNumclick=function(){
            _basic.get($host.api_url +"/truckBase?truckNum=" + $scope.trailNum).then(function (data) {
                $scope.Id  =data.result[0].id;
            })
        }
        // 提交事故信息
        $scope.createTruckAccident = function (valid) {
            $scope.submitted = true;
            if(valid){
                var managementInfo = {
                    driveId:$scope.driveId,
                    truckId:$scope.Id,
                    dpRouteTaskId:$scope.dpRouteTaskId,
                    accidentDate: $scope.accidentDate+" " + $scope.lineStartTime,
                    address: $scope.address,
                    lng:$scope.lng,
                    lat: $scope.lat,
                    accidentExplain: $scope.remark
                };
                _basic.post($host.api_url + "/user/" + userId + "/truckAccident", managementInfo).then(function (data) {
                    if (data.success === true) {
                        $scope.createId=data.id;
                        $scope.step_first = false;
                        $scope.step_second = true;
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
            };
        // 照片上传函数
        function uploadBrandImage(filename,dom_obj,callback) {
            if(filename){
                if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
                    var max_size_str = dom_obj.attr('max_size');
                    var max_size = 4 * 1024 * 1024; //default: 4M
                    var re = /\d+m/i;
                    if (re.test(max_size_str)) {
                        max_size = parseInt(max_size_str.substring(0, max_size_str.length - 1)) * 1024 * 1024;
                        _basic.formPost(dom_obj.parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=5', function (data) {
                            if (data.success) {
                                var imageId = data.imageId;
                                callback(imageId);
                            } else {
                                swal('上传图片失败', "", "error");
                            }
                        }, function (error) {
                            swal('服务器内部错误', "", "error");
                        })
                    }

                    if (dom_obj[0].files[0].size > max_size) {
                        swal('图片文件最大: ' + max_size_str, "", "error");
                        return false;
                    }
                }
                else if (filename && filename.length > 0) {
                    dom_obj.val('');
                    swal('支持的图片类型为. (jpeg,jpg,png,gif,svg,bmp,tiff)', "", "error");
                }else {

                }
            }
        }
        // 照片上传
        $scope.uploadAccientImage = function (dom) {
            var dom_obj = $(dom);
            var filename = $(dom).val();
            uploadBrandImage(filename, dom_obj, function (imageId) {
                _basic.post($host.record_url + "/user/" + userId + "/truckDamage/" +  $scope.createId + "/image", {
                    "username": _basic.getSession(_basic.USER_NAME),
                    "userId": userId,
                    "userType": _basic.getSession(_basic.USER_TYPE),
                    "url": imageId,
                    "vheNo": ""
                }).then(function (data) {
                    if (data.success == true) {
                        if ($scope.car_imageBox.length != 0) {
                            viewer.destroy();
                        }
                        var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
                        $scope.car_image_i.push($host.file_url + '/image/' + imageId);
                        $scope.car_imageBox.push({
                            src: $host.file_url + '/image/' + imageId,
                            time: nowDate,
                            user: _basic.getSession(_basic.USER_NAME)
                        });
                    }
                });
            });
        };
        // 点击图片查看大图
        var viewer;
        $scope.accientFinish = function () {
            viewer = new Viewer(document.getElementById('look_img'), {
                url: 'data-original'
            });
        };


    }]);






