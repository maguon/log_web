/**
 * Created by ASUS on 2017/6/14.
 */
app.controller("setting_user_controller", ["_basic", "_config", "$host", "$scope", function (_basic, _config, $host, $scope) {

    var adminId = _basic.getSession(_basic.USER_ID);
    var adminType = _basic.getSession(_basic.USER_TYPE);
    $scope.start = 0;
    $scope.size = 20;

    var user_info_obj = _config.userTypes;
    // console.log("user_info_obj", user_info_obj);
    var user_info_fun = function () {
        $scope.user_info_section = [];
        // 超级管理员拥有最高权限，可操作所有用户
        var administrator = [];
        for (var a = 0; a < user_info_obj.length; a++) {
            administrator[a] = {
                name: user_info_obj[a].name,
                type: user_info_obj[a].type
            }
        }
        // 判断用户类型，给予用户不同权限
        for (var i = 0; i < user_info_obj.length; i++) {
            if (user_info_obj[i].type == adminType) {
                $scope.user_info_section = user_info_obj[i].subType;
                // 给下拉列表选定初始值
                $scope.userType = $scope.user_info_section[0].type;
            }
            if (adminType == 99) {
                $scope.user_info_section = administrator;
                $scope.userType = $scope.user_info_section[0].type;
            }
        }
        return $scope.user_info_section
    };
    user_info_fun();
    // 搜索所有查询
    var searchAll = function () {
        // 获取所有用户
        $scope.request = "/user?start=" + $scope.start + "&size=" + $scope.size;


        // 判断用户类型，从不同接口参数获取相应用户数据
        // if (adminType == 99) {
        //     $scope.request = "/user?start=" + $scope.start + "&size=" + $scope.size;
        // }
        // else {
        //     $scope.request = "/user?type=" + adminType + "&start=" + $scope.start + "&size=" + $scope.size;
        // }
        _basic.get($host.api_url + $scope.request).then(function (data) {
            if (data.success == true) {
                if ($scope.start > 0) {
                    // $("#pre").removeClass("disabled");
                    $("#pre").show();
                } else {
                    // $("#pre").addClass("disabled");
                    $("#pre").hide();
                }
                if (data.result.length < $scope.size) {
                    // $("#next").addClass("disabled");
                    $("#next").hide();
                } else {
                    // $("#next").removeClass("disabled");
                    $("#next").show();
                }
                // 根据用户可操作权限分配显示的用户列表，过滤掉没有操作权限的用户
                var machList = [];
                for (var i = 0; i < data.result.length; i++) {
                    for (var a = 0; a < $scope.user_info_section.length; a++) {
                        if (data.result[i].type == $scope.user_info_section[a].type) {
                            machList.push(data.result[i]);
                        }
                    }
                }
                $scope.operator = machList;
                // $scope.operator = data.result;
                console.log("operator", $scope.operator);
                $scope.searchUser();
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    searchAll();

    $scope.newOperator = function () {
        $scope.submitted = false;
        $scope.newRealName = "";
        $scope.newDepId = "";
        $scope.newUserName = "";
        $scope.newUserSex = "";
        $scope.newUserPassword = "";

        $(".modal").modal();
        $("#newOperator").modal("open");

    };
    // 提交新增
    $scope.submitForm = function (isValid) {
        $scope.submitted = true;
        if (isValid) {
            var sex_id = $(".sex").attr("sex");
            $scope.newUserSex = sex_id;
            var obj = {
                mobile: $scope.newUserName,
                realName: $scope.newRealName,
                type: $scope.newDepId,
                gender: $scope.newUserSex,
                // mobile:$scope.new_userName,
                password: $scope.newUserPassword
            };
            _basic.post($host.api_url + "/user", obj).then(function (data) {
                if (data.success == true) {
                    swal("新增成功", "", "success");
                    $('#newOperator').modal('close');
                    searchAll();
                } else {
                    swal(data.msg, "", "error");
                }

            })

        }
    };
    // 查看详情
    $scope.lookOperation = function (id) {
        $(".modal").modal();
        $("#look_Operator").modal("open");
        _basic.get($host.api_url + "/user?userId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.look_operation = data.result[0];
                // console.log($scope.look_operation)
            } else {
                swal(data.msg, "", "error");
            }

        })
    };
    // 停启用
    $scope.changeStatus = function (st, id) {
        // var st_txt;
        // if (st == "1") {
        //     st_txt = "停用"
        // } else if (st == "0") {
        //     st_txt = "启用"
        // }
        // swal({
        //         title: "确定" + st_txt + "?",
        //         // text: "You will not be able to recover this imaginary file!",
        //         type: "warning",
        //         showCancelButton: true,
        //         confirmButtonColor: "#DD6B55",
        //         confirmButtonText: st_txt,
        //         closeOnConfirm: false,
        //         cancelButtonText: "取消",
        //     },
        //     function () {
        //         swal("成功!", "", "success");
        if (st == "1") {
            $scope.changeSt = "0"
        } else if (st == "0") {
            $scope.changeSt = "1"
        }

        _basic.put($host.api_url + "/user/" + id + "/status/" + $scope.changeSt
            , {}).then(function (data) {
            if (data.success == true) {
                searchAll();
            } else {
                swal(data.msg, "", "error");
            }

        })
        // });
    };
    // 修改
    $scope.changeOperatorForm = function (isValid, id) {
        $scope.submitted = true;
        if (isValid) {
            var sex_id = $(".sex").attr("sex");
            $scope.newUserSex = sex_id;
            var obj = {
                mobile: $scope.look_operation.mobile,
                realName: $scope.look_operation.real_name,
                type: $scope.look_operation.type,
                // gender:$scope.look_operation.gender,
                status: $scope.look_operation.status,
                gender: $scope.newUserSex
                // mobile:$scope.new_userName,
                // password:$scope.look_operation.newUserPassword
            };
            _basic.put($host.api_url + "/user/" + id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    $('#look_Operator').modal('close');
                    searchAll();
                } else {
                    swal(data.msg, "", "error");
                }

            })
        }

    };

    // 点击按钮查询用户
    $scope.clickSearch = function () {
        $scope.start = 0;
        // $scope.searchUser();
        searchAll();
    };

    $scope.searchUser = function () {
        $scope.new_operator = [];
        // console.log("userType", $scope.userType);
        if ($scope.userType != undefined && $scope.userType != "") {
            for (var i = 0; i < $scope.operator.length; i++) {
                if ($scope.operator[i].type == $scope.userType) {
                    $scope.new_operator.push($scope.operator[i]);
                }
            }
        }
        else {
            $scope.new_operator = $scope.operator;
        }
    };

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - $scope.size;
        searchAll();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + $scope.size;
        searchAll();
    };

}]);