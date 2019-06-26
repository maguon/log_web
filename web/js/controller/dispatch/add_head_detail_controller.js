app.controller("add_head_detail_controller", ["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var hand_truck_msg;
    var hand_driver_msg;
    $scope.show_unbind_drive_btn = false;
    $scope.show_unbind_copilot_btn = false;
    $scope.Binding_driver_flag = true;
    $scope.Binding_copilot_flag = true;
    $scope.return = function () {
        $state.go($stateParams.from, {reload: true})
    };

    // 电话号正则
    $scope.mobileRegx = _config.mobileRegx;
    // 车辆存照片ID;
    var truck_id;


    // 所属类型--公司联动
    _basic.get($host.api_url + "/company?operateType=2").then(function (data) {
        if (data.success == true) {
            $scope.company = data.result;
        } else {
            swal(data.msg, "", "error")
        }
    });
    // 获取品牌
    _basic.get($host.api_url + "/brand").then(function (data) {
        if (data.success == true) {
            $scope.brand = data.result;
        } else {
            swal(data.msg, "", "error")
        }
    });

    // 获取车头
    _basic.get($host.api_url + "/truckFirst?truckType=1&operateType=2").then(function (data) {
        if (data.success == true) {

            $scope.head_car_msg = data.result;

        } else {
            swal(data.msg, "", "error")
        }
    });
    // 获取挂车
    _basic.get($host.api_url + "/truckTrailer?truckType=2&operateType=2").then(function (data) {
        if (data.success == true) {
            hand_truck_msg = data.result;
            $scope.hand_truck_msg = data.result;
        } else {
            swal(data.msg, "", "error")
        }
    });
    // 获取主驾司机
    _basic.get($host.api_url + "/drive?operateType=2").then(function (data) {
        if (data.success == true) {
            hand_driver_msg = data.result;

            // 主驾
            $scope.drive = hand_driver_msg;
            // 副驾
            $scope.copilot = hand_driver_msg;
        } else {
            swal(data.msg, "", "error")
        }
    });


    // 新增
    $scope.submit_Form = function (inValid) {
        $scope.submitted = true;
        var obj = {
            truckNum: $scope.truck_num.replace(/\s+/g,""),
            brandId: $scope.truck_make,
            operateType:2,
            companyId:$scope.companyId,
            truckType: 1,
          /*  companyId:0,*/
            remark: $scope.addHeadModTextarea
        };
        if (inValid) {
            _basic.post($host.api_url + "/user/" + userId + "/truckFirst", obj).then(function (data) {
                if (data.success == true) {
                    $(".ui-tabs li").addClass("disabled");
                    $(".test3").removeClass("disabled");
                    $(".ui-tabs li>a").removeClass("active");
                    $(".test3>a").addClass("active");
                    $(".tabs .indicator").css({
                        right: 500 + "px",
                        left: 500 + "px"
                    });
                    $(".test").hide();
                    $(".test").removeClass("active");
                    $("#test3").show();
                    $("#test3").addClass("active");
                    truck_id = data.id;
                    $scope.truck_id = data.id;
                } else {
                    swal(data.msg, "", "error")
                }
            });
        }

    };


    // 挂车过滤
    $scope.Binding_trailer_check = function () {
        if ($scope.Binding_trailer != null && $scope.Binding_trailer != "") {
            $scope.hand_truck_msg = [];
            hand_truck_msg.forEach(function (i) {
                if (i.truck_num.indexOf($scope.Binding_trailer) != -1) {
                    if ($scope.hand_truck_msg.indexOf(i) == -1) {
                        $scope.hand_truck_msg.push(i)
                    }
                }
            })
        } else {
            $scope.hand_truck_msg = hand_truck_msg;
        }

    };
    $scope.clear_trailer = function () {
        $scope.check_trailer_id = "";
    };
    $scope.check_trailer = function (id, num, number) {
        $scope.check_trailer_id = id;
        $scope.Binding_trailer = num;
        $scope.Binding_trailer_number = number;
    };

    $scope.clear_copilot = function () {
        $scope.check_copilot_id = "";
        $scope.Binding_copilot = "";
    };

    $scope.check_copilot = function (id, drive) {
        $scope.check_copilot_id = id;
        $scope.Binding_copilot = drive;
    };

    // 副司机过滤
    $scope.Binding_copilot_check = function () {
        if ($scope.Binding_copilot != null && $scope.Binding_copilot != "") {
            $scope.copilot = [];
            hand_driver_msg.forEach(function (i) {
                if (i.drive_name.indexOf($scope.Binding_copilot) != -1) {
                    if ($scope.copilot.indexOf(i) == -1) {
                        $scope.copilot.push(i);
                    }
                }
            })
        } else {
            $scope.copilot = hand_driver_msg;
        }
    };
    // 绑定挂车——绑定司机
    $scope.Binding_trailer_submit = function () {
        if ($scope.check_trailer_id) {
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + truck_id + "/trail/" + $scope.check_trailer_id + "/bind", {}).then(function (data) {
                if (data.success == true) {
                    $(".ui-tabs li").addClass("disabled");
                    $(".test4").removeClass("disabled");
                    $(".ui-tabs li>a").removeClass("active");
                    $(".test4>a").addClass("active");
                    $(".tabs .indicator").css({
                        right: 1 + "px",
                        left: 1000 + "px"
                    });
                    $(".test").hide();
                    $(".test").removeClass("active");
                    $("#test4").show();
                    $("#test4").addClass("active");
                } else {
                    swal(data.msg, "", "error")
                }
            })
        } else {
            $(".ui-tabs li").addClass("disabled");
            $(".test4").removeClass("disabled");
            $(".ui-tabs li>a").removeClass("active");
            $(".test4>a").addClass("active");
            $(".tabs .indicator").css({
                right: 1 + "px",
                left: 1000 + "px"
            });
            $(".test").hide();
            $(".test").removeClass("active");
            $("#test4").show();
            $("#test4").addClass("active");
        }
    };


    $scope.clear_driver = function () {
        $scope.check_driver_id = "";
    };
    $scope.check_driver = function (id, drive) {
        $scope.check_driver_id = id;
        $scope.Binding_driver = drive;
    };
    // 司机过滤
    $scope.Binding_driver_check = function () {

        if ($scope.Binding_driver != null && $scope.Binding_driver != "") {
            $scope.drive = [];
            hand_driver_msg.forEach(function (i) {
                if (i.drive_name.indexOf($scope.Binding_driver) != -1) {
                    if ($scope.drive.indexOf(i) == -1) {
                        $scope.drive.push(i);
                    }
                }
            })
        } else {
            $scope.drive = hand_driver_msg;
        }

    };
    // 绑定主驾司机-
    $scope.binding_driver_submit = function () {
        if ($scope.check_driver_id) {
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + truck_id + "/drive/" + $scope.check_driver_id + "/bind", {}).then(function (data) {
                if (data.success == true) {
                    swal("绑定成功", "", "success");
                    $scope.Binding_driver_flag = false;
                    $scope.show_unbind_drive_btn = true;
                    // 获取司机
                    _basic.get($host.api_url + "/drive?operateType=2").then(function (data) {
                        if (data.success == true) {
                            $scope.Binding_copilot_flag = true;
                            hand_driver_msg = data.result;
                            $scope.drive = hand_driver_msg;
                            // 副驾
                            $scope.copilot = hand_driver_msg;
                        } else {
                            swal(data.msg, "", "error");
                        }
                    });
                } else {
                    swal(data.msg, "", "error")
                }
            })
        } else {
            swal("未选择", "", "error")
        }
    };
    // 绑定副驾
    $scope.binding_copilot_submit = function (Binding_copilot) {
        if ($scope.check_copilot_id) {
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + truck_id + "/viceDrive/" + $scope.check_copilot_id + "/bind", {}).then(function (data) {
                if (data.success == true) {
                    swal("绑定成功", "", "success");
                    $scope.Binding_copilot_flag = false;
                    $scope.show_unbind_copilot_btn = true;
                    // 获取主驾司机
                    _basic.get($host.api_url + "/drive?operateType=2").then(function (data) {
                        if (data.success == true) {
                            hand_driver_msg = data.result;
                            $scope.drive = hand_driver_msg;
                            // 副驾
                            $scope.copilot = hand_driver_msg;
                        } else {
                            swal(data.msg, "", "error");
                        }
                    });
                } else {
                    swal(data.msg, "", "error")
                }
            })
        } else {
            swal("未选择", "", "error")
        }
    };
    // 完成
    $scope.binding_over = function () {
        $state.go($stateParams.from, {reload: true})
    };

    // 增加保单
    $scope.binding_add_insure = function () {
        $state.go("truck_guarantee_details", {id: $scope.truck_id, type: 1, from: "truck_details"})
    };
    $scope.add_guarantee = function () {
        $('.modal').modal();
        $('#add_guarantee').modal('open');
    }

}]);