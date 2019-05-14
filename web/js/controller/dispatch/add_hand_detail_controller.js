app.controller("add_hand_detail_controller", ["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {
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
            _basic.get($host.api_url + "/company?operateType=2").then(function (data) {
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
        _basic.get($host.api_url + "/truckFirst?truckType=1&operateType=2").then(function (data) {
            if (data.success == true) {
                head_car_msg = data.result;
                $scope.head_car_msg = data.result;
            } else {
                swal(data.msg, "", "error")
            }
        });
        // 获取挂车
        _basic.get($host.api_url + "/truckTrailer?truckType=2&operateType=2").then(function (data) {
            if (data.success == true) {
                $scope.hand_truck_msg = data.result;
            } else {
                swal(data.msg, "", "error")
            }
        });
        // 获取主驾司机
        _basic.get($host.api_url + "/drive?operateType=2").then(function (data) {
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
                truckType: 2,
                operateType: 2,
                companyId:0,
                number: $scope.hand_have_num,
                remark: $scope.hand_textarea

            };
            if (inValid) {
                _basic.post($host.api_url + "/user/" + userId + "/truckTrailer", obj).then(function (data) {
                    if (data.success == true) {
                        $(".ui-tabs li").addClass("disabled");
                        $(".test3").removeClass("disabled");
                        $(".ui-tabs li>a").removeClass("active");
                        $(".test3>a").addClass("active");
                        $(".tabs .indicator").css({
                            right: 0 + "px",
                            left: 760 + "px"
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
            } else {

            }

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
                        $state.go("truck_guarantee_details", {id: $scope.truck_id, type: 2, from: "outsourcing_vehicles"})
                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            } else {
                $state.go("truck_guarantee_details", {id: $scope.truck_id, type: 2, from: "outsourcing_vehicles"})
            }
        };
        $scope.add_guarantee = function () {
            $('.modal').modal();
            $('#add_guarantee').modal('open');
        }
}]);