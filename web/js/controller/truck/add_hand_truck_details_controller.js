/**
 * Created by ASUS on 2017/7/11.
 */
app.controller("add_hand_truck_details_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var head_car_msg;
    $scope.return = function () {
        $state.go($stateParams.from, {reload: true})
    };
    $scope.numReg = "(^[1-9]?\d$)";

    // 车辆存照片ID;
    var truck_id;

    // 所属类型--公司联动
    $scope.getCompany = function () {
        _basic.get($host.api_url + "/company?operateType=" + $scope.truck_hand_type).then(function (data) {
            if (data.success == true) {
                $scope.company = data.result;
            } else {
                swal(data.msg, "", "error")
            }
        });
    };

    // 获取品牌
    _basic.get($host.api_url + "/brand").then(function (data) {
        if (data.success == true) {
            $scope.brand = data.result;
        } else {
            swal(data.msg, "", "error")
        }
    });

    // 获取车头
    _basic.get($host.api_url + "/truckFirst?truckType=1").then(function (data) {
        if (data.success == true) {
            head_car_msg = data.result;
            $scope.head_car_msg = data.result;
        } else {
            swal(data.msg, "", "error")
        }
    });
    // 获取挂车
    _basic.get($host.api_url + "/truckTrailer?truckType=2").then(function (data) {
        if (data.success == true) {
            $scope.hand_truck_msg = data.result;
        } else {
            swal(data.msg, "", "error")
        }
    });
    // 获取主驾司机
    _basic.get($host.api_url + "/drive").then(function (data) {
        if (data.success == true) {
            $scope.drive = data.result;
        } else {
            swal(data.msg, "", "error")
        }
    });

    // 车辆状态（头车还是挂车）
    var status = $stateParams.status;
    $scope.truck_status = status + "";

    // 新增
    $scope.submit_Form = function (inValid) {
        $scope.submitted = true;
        var obj = {
            truckNum: $scope.truck_hand_num,
            brandId: $scope.truck_make,
            theCode: $scope.hand_vin,
            companyId: $scope.truck_hand_company,
            truckType: 2,
            operateType: $scope.truck_hand_type,
            outputCompanyId:$scope.outputCompany.id,
            outputCompanyName:$scope.outputCompany.company_name,
            relId: $scope.check_hand_truck,
            number: $scope.hand_have_num,
            drivingDate: $scope.drive_hand_time,
            licenseDate: $scope.service_hand_time,
            remark: $scope.hand_textarea
        };
        if (inValid) {
            _basic.post($host.api_url + "/user/" + userId + "/truckTrailer", obj).then(function (data) {
                if (data.success == true) {
                    $(".ui-tabs li").addClass("disabled");
                    $(".test2").removeClass("disabled");
                    $(".ui-tabs li>a").removeClass("active");
                    $(".test2>a").addClass("active");
                    $(".tabs .indicator").css({
                        right: 624 + "px",
                        left: 622 + "px"
                    });
                    $(".test").hide();
                    $(".test").removeClass("active");
                    $("#test2").show();
                    $("#test2").addClass("active");
                    truck_id = data.id;
                    $scope.truck_id = data.id;
                } else {
                    swal(data.msg, "", "error")
                }
            });
        } else {

        }

    };

    // 照片上传函数
    function uploadBrandImage(filename, dom_obj, callback) {
        if (filename) {
            if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
                //check size
                //$file_input[0].files[0].size
                var max_size_str = dom_obj.attr('max_size');
                var max_size = 4 * 1024 * 1024; //default: 4M
                var re = /\d+m/i;
                if (re.test(max_size_str)) {
                    max_size = parseInt(max_size_str.substring(0, max_size_str.length - 1)) * 1024 * 1024;
                    // $currentDom = $(dom).prev();
                    _basic.formPost(dom_obj.parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=2', function (data) {

                        if (data.success) {

                            // // console.log(data,truck_id);
                            var imageId = data.imageId;
                            callback(imageId);
                            // _basic.post($host.record_url + "/car/" + $scope.truck_id + "/vin/" + $scope.vin + "/storageImage", {
                            //     "username": _basic.getSession(_basic.USER_NAME),
                            //     "userId": userId,
                            //     "userType": _basic.getSession(_basic.USER_TYPE),
                            //     "url": imageId
                            // }).then(function (data) {
                            //     if (data.success == true) {
                            //         $scope._id=data.result._id;
                            //         var nowDate=moment(new Date()).format("YYYY-MM-DD HH:mm");
                            //         $scope.storage_image_i.push($host.file_url + '/image/' +imageId);
                            //         $scope.storage_imageBox.push({src: $host.file_url + '/image/' + imageId,record_id:$scope._id,time:nowDate,user:_basic.getSession(_basic.USER_NAME)});
                            //     }
                            // });
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
            } else {

            }

        }
    };
    // 行驶证
    $scope.uploadBrandImage_drive = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        // console.log($(dom).val());
        uploadBrandImage(filename, dom_obj, function (imageId) {
            var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
            $scope.$apply(function () {
                $scope.drive_img = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
            });
            var obj = {
                "truckImage": imageId,
                // "licenseImage": "string",
                "imageType": 1
            };
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + truck_id + "/image", obj).then(function (data) {
                if (data.success == true) {

                } else {
                    swal(data.msg, "", "error")
                }
            })

        });
    };

    // 头车过滤
    $scope.Binding_trailer_check = function () {
        if ($scope.Binding_trailer != null && $scope.Binding_trailer != "") {
            $scope.head_car_msg = [];
            head_car_msg.forEach(function (i) {
                if (i.truck_num.indexOf($scope.Binding_trailer) != -1) {
                    if ($scope.head_car_msg.indexOf(i) == -1) {
                        $scope.head_car_msg.push(i)
                    }
                }
            })
        } else {
            $scope.head_car_msg = head_car_msg;
        }

    };
    // 营运证
    $scope.uploadBrandImage_service = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        // console.log($(dom).val());
        uploadBrandImage(filename, dom_obj, function (imageId) {
            var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
            $scope.$apply(function () {
                $scope.service_img = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
            });
            var obj = {
                // "drivingImage": imageId,
                "truckImage": imageId,
                "imageType": 2
            };
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + truck_id + "/image", obj).then(function (data) {
                if (data.success == true) {

                } else {
                    swal("上传失败", "", "error")
                }
            })
        });
    };
    $scope.truck_imageBox = [];
    $scope.truck_image_i = [];
    // 车辆照片
    $scope.uploadBrandImage_truck = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        // console.log($(dom).val());
        uploadBrandImage(filename, dom_obj, function (imageId) {
            _basic.post($host.record_url + "/user/" + userId + "/truck/" + $scope.truck_hand_num + "/image", {
                "username": _basic.getSession(_basic.USER_NAME),
                "userId": userId,
                "userType": _basic.getSession(_basic.USER_TYPE),
                "url": imageId
            }).then(function (data) {
                if (data.success == true) {
                    $scope._id = data.result._id;
                    var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
                    $scope.truck_image_i.push($host.file_url + '/image/' + imageId);
                    $scope.truck_imageBox.push({
                        src: $host.file_url + '/image/' + imageId,
                        record_id: $scope._id,
                        time: nowDate,
                        user: _basic.getSession(_basic.USER_NAME)
                    });
                }
            });
        });
    };
    // 删除车辆照片
    $scope.delete_ = function (record_id, src) {
        swal({
                title: "确认删除该照片？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
                // console.log(src);
                var url_array = src.split("/");
                var url = url_array[url_array.length - 1];
                _basic.delete($host.record_url + "/user/" + userId + "/record/" + record_id + "/truck/" + $scope.truck_hand_num + "/image/" + url).then(function (data) {
                    if (data.success == true) {
                        var i = $scope.truck_image_i.indexOf(src);
                        $scope.truck_imageBox.splice(i, 1);
                        $scope.truck_image_i.splice(i, 1);
                        swal("删除成功!", "", "success");
                        // $scope.lookStorageCar(data.result.id,data.result.vin)
                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            }
        })
    }

    // 图片--绑定头车
    $scope.next = function () {
        $(".ui-tabs li").addClass("disabled");
        $(".test3").removeClass("disabled");
        $(".ui-tabs li>a").removeClass("active");
        $(".test3>a").addClass("active");
        $(".tabs .indicator").css({
            right: 0 + "px",
            left: 1256 + "px"
        });
        $(".test").hide();
        $(".test").removeClass("active");
        $("#test3").show();
        $("#test3").addClass("active");
    };

    $scope.clear_trailer = function () {
        $scope.check_trailer_id = "";
    };
    $scope.check_trailer = function (id) {
        $scope.check_trailer_id = id;
    };
    // 绑定头车--完成
    $scope.binding_first = function () {
        if ($scope.check_trailer_id) {
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + $scope.check_trailer_id + "/trail/" + truck_id + "/bind", {}).then(function (data) {
                if (data.success == true) {
                    $state.go($stateParams.from, {reload: true})
                } else {
                    swal(data.msg, "", "error")
                }
            })
        } else {
            $state.go($stateParams.from, {reload: true})
        }
    };
    // 绑定头车--增加保单
    $scope.binding_add_insure = function () {
        if ($scope.check_trailer_id) {
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + $scope.check_trailer_id + "/trail/" + truck_id + "/bind", {}).then(function (data) {
                if (data.success == true) {
                    $state.go("truck_guarantee_details", {id: $scope.truck_id, type: 2, from: "truck_details"})
                } else {
                    swal(data.msg, "", "error")
                }
            })
        } else {
            $state.go("truck_guarantee_details", {id: $scope.truck_id, type: 2, from: "truck_details"})
        }
    };
    $scope.add_guarantee = function () {
        $('.modal').modal();
        $('#add_guarantee').modal('open');
    }
}]);