app.controller("add_truck_management_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host",
    function ($scope, $state, $stateParams, _basic, _config, $host) {
        var userId = _basic.getSession(_basic.USER_ID);
        $scope.step_first = true;
        $scope.step_second = false;
        $scope.car_image_i = [];
        $scope.car_imageBox = [];
        $scope.lng = 121.62;
        $scope.lat = 38.92;
        $scope.vhe_no;

        //返回
        $scope.return = function () {
            $state.go($stateParams.from, {reload: true})
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

        //点击加号
        $scope.search_dpRouteTaskId = function () {
            _basic.get($host.api_url + "/dpRouteTask?dpRouteTaskId=" + $scope.dpRouteTaskId).then(function (data) {
                if (data.success == true && data.result.length !== 0) {
                    $scope.driverName = data.result[0].drive_name;
                    $scope.startCityName = data.result[0].city_route_end;
                    $scope.endCityName = data.result[0].city_route_start;
                    $scope.taskStartDate = data.result[0].task_start_date;
                    $scope.trailNum = data.result[0].trail_num;
                    $scope.truckNum = data.result[0].truck_num;
                    $scope.driveId = data.result[0].drive_id;
                    $scope.lineInfo = true;
                } else {
                    $scope.dpRouteTaskId = null;
                    $scope.lineInfo = false;
                    swal("编号不存在，请重新填写", "", "error");
                }
                $scope.trailNumclick();
            })
        };

        $scope.truckNumclick = function () {
            _basic.get($host.api_url + "/truckBase?truckNum=" + $scope.truckNum).then(function (data) {
                $scope.Id = data.result[0].id;
                $scope.vhe_no = $scope.truckNum;
            })
        };

        $scope.trailNumclick = function () {
            _basic.get($host.api_url + "/truckBase?truckNum=" + $scope.trailNum).then(function (data) {
                $scope.Id = data.result[0].id;
                $scope.vhe_no = $scope.trailNum;
            })
        };

        // 提交事故信息
        $scope.createTruckAccident = function (valid) {
            $scope.submitted = true;
            if (valid) {
                var managementInfo = {
                    driveId: $scope.driveId,
                    truckId: $scope.Id,
                    dpRouteTaskId: $scope.dpRouteTaskId,
                    accidentDate: $scope.accidentDate + " " + $scope.lineStartTime,
                    address: $("#amapAddress").val(),
                    lng: $scope.lng,
                    lat: $scope.lat,
                    accidentExplain: $scope.remark
                };
                _basic.post($host.api_url + "/user/" + userId + "/truckAccident", managementInfo).then(function (data) {
                    if (data.success === true) {
                        $scope.createId = data.id;
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
        function uploadBrandImage(filename, dom_obj, callback) {
            if (filename) {
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
                }
                else {

                }
            }
        }

        // 照片上传
        $scope.uploadAccientImage = function (dom) {
            var dom_obj = $(dom);
            var filename = $(dom).val();
            uploadBrandImage(filename, dom_obj, function (imageId) {
                _basic.post($host.record_url + "/user/" + userId + "/truckDamage/" + $scope.createId + "/image", {
                    username: _basic.getSession(_basic.USER_NAME),
                    userId: userId,
                    userType: _basic.getSession(_basic.USER_TYPE),
                    url: imageId,
                    vheNo: $scope.vhe_no
                }).then(function (data) {
                    if (data.success === true) {
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

        $scope.queryData = function () {
            $scope.showMarkerPosition($scope.lng, $scope.lat);
        };
        $scope.queryData()
    }]);