/**
 * Created by ASUS on 2017/6/14.
 */
app.controller("setting_user_controller", ["_basic", "_config", "$host", "$scope", function (_basic, _config, $host, $scope) {

    var adminType = _basic.getSession(_basic.USER_TYPE);
    $scope.start = 0;
    $scope.size = 21;

    var user_info_obj = _config.userTypes;
    var user_info_fun = function () {
        $scope.user_info_section = [];
        $scope.qrList = [];
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
                $scope.qrList = user_info_obj[i].qr;
                // 给下拉列表选定初始值
                $scope.userType = $scope.user_info_section[0].type;
            }
            if (adminType == 99) {
                $scope.user_info_section = administrator;
                $scope.userType = $scope.user_info_section[0].type;
            }
        }
    };


    // 获取姓名
    $scope.getName = function (id) {
        if (id == undefined || id == "" || id == null) {
            $scope.nameList = [];
        }
        else {
            _basic.get($host.api_url + "/user?type=" + id).then(function (data) {
                if (data.success == true) {
                    $scope.nameList = data.result;
                    $('#name').select2({
                        placeholder: '姓名',
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
            });
        }
    };
    $scope.getName(10);


    user_info_fun();
    // 搜索所有查询
    var searchAll = function () {
        // 获取所有用户
        var url;
        if($scope.realName==undefined){
            url = $host.api_url + "/user?type=" + $scope.userType + "&start=" + $scope.start + "&size=" + $scope.size
        }
        else {
            url =$host.api_url + "/user?realName="+$scope.realName+"&type=" + $scope.userType + "&start=" + $scope.start + "&size=" + $scope.size
        }

        _basic.get(url).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.matchUser = $scope.boxArray.slice(0, 20);
                if ($scope.start > 0) {
                    $("#pre").show();
                }
                else {
                    $("#pre").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next").hide();
                }
                else {
                    $("#next").show();
                }

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
            } else {
                swal(data.msg, "", "error");
            }

        })
    };
    // 停启用
    $scope.changeStatus = function (st, id) {
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
                status: $scope.look_operation.status,
                gender: $scope.newUserSex
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
        searchAll();
    };

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        searchAll();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        searchAll();
    };

}]);