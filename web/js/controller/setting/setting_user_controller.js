/**
 * Created by ASUS on 2017/6/14.
 */
app.controller("setting_user_controller", ["_basic", "_config", "$host", "$scope", function (_basic, _config, $host, $scope) {

    var adminId = _basic.getSession(_basic.USER_ID);
    var adminType = _basic.getSession(_basic.USER_TYPE);

    // 判断用户类型，从不同接口获取相应用户数据
    if (adminType == 99) {
        $scope.request = "/user";
    }
    else {
        $scope.request = "/user?type=" + adminType;
    }
    // console.log("request", $scope.request);

    var user_info_obj = _config.userTypes;
    // console.log("user_info_obj", user_info_obj);
    var user_info_fun = function () {
        $scope.user_info_section = [];
        // 管理员拥有最高权限，可操作所有用户
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
            }
            if (adminType == 99) {
                $scope.user_info_section = administrator;
            }
        }
        // console.log("user_info_section", $scope.user_info_section);
        return $scope.user_info_section
    };
    user_info_fun();
    // 搜索所有查询
    var searchAll = function () {
        _basic.get($host.api_url + $scope.request).then(function (data) {
            if (data.success == true) {
                // console.log(data)
                $scope.operator = data.result;

            } else {
                swal(data.msg, "", "error");
            }
        });

        // $basic.get($host.api_url+"/admin/"+adminId+"/department").then(function (data) {
        //     if(data.success==true){
        //         $scope.department=data.result;
        //         // console.log($scope.Company);
        //     }else {
        //         swal(data.msg,"","error");
        //     }
        // })
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

    }
}]);