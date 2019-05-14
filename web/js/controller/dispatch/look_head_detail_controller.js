app.controller("look_head_detail_controller", ["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
        var id = $stateParams.id;
        var hand_truck_msg;
        var hand_driver_msg;
        $scope.show_unbind_trailer_btn = false;
        $scope.show_unbind_drive_btn = false;
        $scope.show_unbind_copilot_btn = false;
        $scope.Binding_copilot_flag = true;
        $scope.Binding_drive_flag = true;

        $scope.return = function () {
            $state.go($stateParams.from,{from:'look_head_detail'}, {reload: true})
        };
        // 电话号正则
        $scope.mobileRegx = _config.mobileRegx;



        _basic.get($host.api_url + "/company?operateType=2").then(function (data) {
            if (data.success == true) {
                $scope.company = data.result;
            } else {
                swal(data.msg, "", "error")
            }
        });



        function truck_msg() {
            var p = new Promise(function (resolve, reject) {
                resolve();
            });
            return p
        }

        function truck_details() {
            var p = new Promise(function (resolve, reject) {
                resolve();
            });
            return p
        }

        truck_msg().then(function () {
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
            // 获取司机
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
            return truck_details();
        }).then(function () {
            // 头车详情
            _basic.get($host.api_url + "/truckFirst?truckId=" + id).then(function (data) {
                if (data.success == true) {
                    $scope.truckFirst = data.result[0];
                    $scope.truckFirst.hp = $scope.truckFirst.hp === 0 ? null : $scope.truckFirst.hp;
                    // 获取车牌号
                    $scope.truck_num = $scope.truckFirst;
                    $scope.Binding_trailer = $scope.truckFirst.trail_num;
                    if ($scope.Binding_trailer != null && $scope.Binding_trailer != "") {
                        $scope.show_unbind_trailer_btn = true;
                    }
                    $scope.truck_id = $scope.truckFirst.truck_num;
                    $scope.Binding_trailer_check();

                    $scope.Binding_driver = $scope.truckFirst.drive_name;
                    if ($scope.Binding_driver != null && $scope.Binding_driver != "") {
                        $scope.show_unbind_drive_btn = true;
                    }
                    if ($scope.truckFirst.drive_name != null && $scope.truckFirst.drive_name != "") {
                        $scope.Binding_drive_flag = false;
                    }


                    $scope.Binding_copilot = $scope.truckFirst.vice_drive_name;
                    if ($scope.Binding_copilot != null && $scope.Binding_copilot != "") {
                        $scope.show_unbind_copilot_btn = true;
                    }
                    if ($scope.truckFirst.vice_drive_name != null && $scope.truckFirst.vice_drive_name != "") {
                        $scope.Binding_copilot_flag = false;
                    }

                } else {
                    swal(data.msg, "", "error")
                }
            });

        })


        // 解绑关联挂车
        $scope.unbind_trailer = function () {
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + id + "/trail/" + $scope.truckFirst.rel_id + "/unbind", {}).then(function (data) {
                if (data.success == true) {
                    swal("解绑成功", "", "success");
                    $scope.show_unbind_trailer_btn = false;
                    // 获取挂车
                    _basic.get($host.api_url + "/truckTrailer?truckType=2&operateType=2").then(function (data) {
                        if (data.success == true) {
                            hand_truck_msg = data.result;
                            $scope.hand_truck_msg = data.result;

                        } else {
                            swal(data.msg, "", "error")
                        }
                    });

                } else {
                    swal(data.msg, "", "error")
                }
            });
        };

        // 修改头车
        $scope.submit_Form = function (inValid) {
            $scope.submitted = true;
            var obj = {
                "truckNum": $scope.truckFirst.truck_num,
                "brandId": $scope.truckFirst.brand_id,
                "truckType": 1,
                operateType:2,
                companyId:0,
                "remark": $scope.truckFirst.remark

            };
            if (inValid) {
                _basic.put($host.api_url + "/user/" + userId + "/truck/" + id, obj).then(function (data) {
                    if (data.success == true) {
                        swal("修改成功", "", "success");
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
                            $scope.hand_truck_msg.push(i);
                        }
                    }
                })
            } else {
                $scope.hand_truck_msg = hand_truck_msg;
            }

        };
        $scope.clear_trailer = function () {
            $scope.check_trailer_id = "";
            $scope.Binding_trailer = "";
        };
        $scope.check_trailer = function (id, num, number) {
            $scope.check_trailer_id = id;
            $scope.Binding_trailer = num;
            $scope.Binding_trailer_number = number;
        };
        // 绑定挂车——绑定司机
        $scope.Binding_trailer_submit = function () {
            if ($scope.check_trailer_id) {
                _basic.put($host.api_url + "/user/" + userId + "/truck/" + id + "/trail/" + $scope.check_trailer_id + "/bind", {}).then(function (data) {
                    if (data.success == true) {
                        swal("绑定成功", "", "success");
                        truck_msg().then(function () {
                            // 获取挂车
                            _basic.get($host.api_url + "/truckTrailer?truckType=2&operateType=2").then(function (data) {
                                if (data.success == true) {
                                    hand_truck_msg = data.result;
                                    $scope.hand_truck_msg = data.result;

                                } else {
                                    swal(data.msg, "", "error")
                                }
                            });
                            return truck_details()
                        }).then(function () {
                            // 头车详情
                            _basic.get($host.api_url + "/truckFirst?truckId=" + id).then(function (data) {
                                if (data.success == true) {
                                    $scope.truckFirst = data.result[0];
                                    // 获取车牌号
                                    $scope.truck_num = $scope.truckFirst;

                                    $scope.Binding_trailer = $scope.truckFirst.trail_num;
                                    if ($scope.Binding_trailer != null && $scope.Binding_trailer != "") {
                                        $scope.show_unbind_trailer_btn = true;
                                    }
                                    $scope.truck_id = $scope.truckFirst.truck_num;
                                    $scope.Binding_trailer_check();
                                    $scope.Binding_driver = $scope.truckFirst.drive_name;
                                    if ($scope.Binding_driver != null && $scope.Binding_driver != "") {
                                        $scope.show_unbind_drive_btn = true;
                                    }
                                    $scope.Binding_driver_check();
                                } else {
                                    swal(data.msg, "", "error")
                                }
                            })
                        });

                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            } else {

            }
        };


        $scope.clear_driver = function () {
            $scope.check_driver_id = "";
            $scope.Binding_driver = "";
        };
        $scope.check_driver = function (id, drive) {
            $scope.check_driver_id = id;
            $scope.Binding_driver = drive;
        };
        // 主司机过滤
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


        // 绑定司机——车保
        $scope.binding_driver_submit = function (Binding_driver_name) {
            if ($scope.check_driver_id) {
                _basic.put($host.api_url + "/user/" + userId + "/truck/" + id + "/drive/" + $scope.check_driver_id + "/bind", {}).then(function (data) {
                    if (data.success == true) {
                        swal("绑定成功", "", "success");
                        $scope.Binding_drive_flag = false;
                        truck_msg().then(function () {
                            $scope.$apply(function () {
                                hand_driver_msg.forEach(function (i) {
                                    if (i.id == $scope.check_driver_id) {
                                        i.truck_id = id;
                                        i.truck_num = Binding_driver_name;
                                    }

                                });
                                $scope.drive = hand_driver_msg;
                                // 副驾
                                $scope.copilot = hand_driver_msg;

                            });

                            return truck_details();
                        }).then(function () {
                            // 头车详情
                            _basic.get($host.api_url + "/truckFirst?truckId=" + id).then(function (data) {
                                if (data.success == true) {
                                    $scope.truckFirst = data.result[0];
                                    // 获取车牌号
                                    $scope.truck_num = $scope.truckFirst;
                                    $scope.Binding_trailer = $scope.truckFirst.trail_num;
                                    if ($scope.Binding_trailer != null && $scope.Binding_trailer != "") {
                                        $scope.show_unbind_trailer_btn = true;
                                    }
                                    $scope.truck_id = $scope.truckFirst.truck_num;
                                    $scope.Binding_trailer_check();
                                    $scope.Binding_driver = $scope.truckFirst.drive_name;
                                    if ($scope.Binding_driver != null && $scope.Binding_driver != "") {
                                        $scope.show_unbind_drive_btn = true;
                                    }

                                } else {
                                    swal(data.msg, "", "error")
                                }
                            })
                        });
                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            } else {
            }
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
        // 绑定副驾
        $scope.binding_copilot_submit = function (Binding_driver_name) {
            if ($scope.check_copilot_id) {
                _basic.put($host.api_url + "/user/" + userId + "/truck/" + id + "/viceDrive/" + $scope.check_copilot_id + "/bind", {}).then(function (data) {
                    if (data.success == true) {
                        swal("绑定成功", "", "success");
                        $scope.Binding_copilot_flag = false;
                        truck_msg().then(function () {
                            $scope.$apply(function () {
                                hand_driver_msg.forEach(function (i) {
                                    if (i.id == $scope.check_copilot_id) {
                                        i.truck_id = id;
                                        i.truck_num = Binding_driver_name;
                                    }

                                });
                                $scope.drive = hand_driver_msg;
                                // 副驾
                                $scope.copilot = hand_driver_msg;

                            });

                            return truck_details();
                        }).then(function () {
                            // 头车详情
                            _basic.get($host.api_url + "/truckFirst?truckId=" + id).then(function (data) {
                                if (data.success == true) {
                                    $scope.truckFirst = data.result[0];
                                    // 获取车牌号
                                    $scope.truck_num = $scope.truckFirst;

                                    $scope.Binding_trailer = $scope.truckFirst.trail_num;
                                    if ($scope.Binding_trailer != null && $scope.Binding_trailer != "") {
                                        $scope.show_unbind_trailer_btn = true;
                                    }
                                    $scope.truck_id = $scope.truckFirst.truck_num;
                                    $scope.Binding_trailer_check();
                                    $scope.Binding_copilot = $scope.truckFirst.vice_drive_name;
                                    if ($scope.Binding_copilot != null && $scope.Binding_copilot != "") {
                                        $scope.show_unbind_copilot_btn = true;
                                    }

                                } else {
                                    swal(data.msg, "", "error")
                                }
                            })
                        });
                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            } else {
            }
        };
        // 解绑副驾司机
        $scope.unbind_copilot = function () {
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + id + "/viceDrive/" + $scope.truckFirst.vice_drive_id + "/unbind", {}).then(function (data) {
                if (data.success == true) {
                    swal("解绑成功", "", "success");
                    $scope.show_unbind_copilot_btn = false;
                    $scope.Binding_copilot = "";
                    // 获取主驾司机
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
            });
        };
        // 解绑主驾司机
        $scope.unbind_drive = function () {
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + id + "/drive/" + $scope.truckFirst.drive_id + "/unbind", {}).then(function (data) {
                if (data.success == true) {
                    swal("解绑成功", "", "success");
                    $scope.show_unbind_drive_btn = false;
                    // 获取主驾司机
                    _basic.get($host.api_url + "/drive?operateType=2").then(function (data) {
                        if (data.success == true) {
                            $scope.Binding_drive_flag = true;
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
            });
        };
        $scope.add_guarantee = function () {
            $('.modal').modal();
            $('#add_guarantee').modal('open');
        }


}]);