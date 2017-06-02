
// var settingController = angular.module("settingController", []);
// 管理员密码设置
app.controller("setting_pw_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    $scope.settingPswForm = function (isValid) {
        var adminId = _basic.getSession(_basic.USER_ID);

        $scope.submitted = true;
        if (isValid && $scope.newCode == $scope.confirmPsw) {
            var obj = {
                originPassword: $scope.primaryCode,
                newPassword: $scope.newCode
            };
            _basic.put($host.api_url + "/admin/" + adminId + "/password", obj).then(function (data) {
                if (data.success == true) {
                    swal("密码重置成功", "", "success");
                    $scope.primaryCode="";
                    $scope.newCode="";
                    $scope.confirmPsw="";
                    $scope.submitted = false;
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }

    }
}]);
// 仓库设置
app.controller("settingWH_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var adminId = _basic.getSession(_basic.USER_ID);

    // 整体查询
    var searchAll = function () {
        _basic.get($host.api_url + "/storage").then(function (data) {
            if (data.success == true) {
                $scope.storage = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    searchAll();

    $scope.newStorage = function () {
        $scope.submitted = false;
        $scope.newStorageName = "";
        $scope.newStorageCol = "";
        $scope.newStorageRoad = "";
        $scope.newStorageRemark = "";

        $(".modal").modal();
        $("#newStorage").modal("open");

    };

    // 新增
    $scope.newStorageForm = function (isValid) {
        $scope.submitted = true;
        if (isValid) {
            var obj = {
                storageName: $scope.newStorageName,
                row: Number($scope.newStorageCol),
                col: Number($scope.newStorageRoad),
                remark: $scope.newStorageRemark
            };
            _basic.post($host.api_url + "/admin/" + adminId + "/storage", obj).then(function (data) {
                if (data.success == true) {
                    swal("新增成功", "", "success");
                    searchAll();
                    $("#newStorage").modal("close");
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };
    // 查看
    $scope.lookStorage = function (id) {
        $(".modal").modal();
        $("#look_Storage").modal("open");
        _basic.get($host.api_url + "/storage?storageId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.selfStorage = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    // 修改
    $scope.lookStorageForm = function (isValid, id) {
        $scope.submitted = true;
        console.log(id);
        if (isValid) {
            var obj = {
                storageName: $scope.selfStorage.storage_name,
                remark: $scope.selfStorage.remark
            };
            console.log(obj)
            _basic.put($host.api_url + "/admin/" + adminId + "/storage/" + id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    searchAll();
                    $("#look_Storage").modal("close");
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };
    // 修改仓库运营状态
    $scope.changeStorage_status = function (id, status) {
        var st;
        // var str="";
        //
        if (status == 0) {
            // str="启用";
            st = 1
        } else {
            // str="停用";
            st = 0
        }
        // swal({
        //         title: "是否"+str+"?",
        //         text: "",
        //         type: "warning",
        //         showCancelButton: true,
        //         confirmButtonColor: "#DD6B55",
        //         confirmButtonText: "确定",
        //         cancelButtonText: "取消",
        //         closeOnConfirm: false
        //     },
        //     function () {

                _basic.put($host.api_url + "/admin/" + adminId + "/storage/" + id + "/storageStatus/" + st, {}).then(function (data) {
                    if (data.success == true) {
                        swal("修改成功", "", "success");
                        searchAll();
                    } else {
                        swal(data.msg, "", "error");
                        searchAll();
                    }
                })
            }
        // );


    // }
}]);
// 车辆设置
app.controller("settingT_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    var adminId = _basic.getSession(_basic.USER_ID);
    // 打开汽车品牌
    $scope.car_Brand_box=function ($event) {
        $($event.target).hide();
        $(".car_Brand_box").show();
    };
    // 关闭汽车品牌
    $scope.closeBrand=function () {
        $(".open_car_brand").show();
        $(".car_Brand_box").hide();
        $scope.b_txt="";
    };
    // 汽车品牌
    $scope.searchAll = function () {
        _basic.get($host.api_url + "/carMake/").then(function (data) {
            if (data.success == true) {
                // console.log(data.result);
                $scope.brand = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    $scope.searchAll();
    // 显示修改汽车品牌
    $scope.amend_brand_make = function ($event,$index) {
        $event.stopPropagation();
        $(".brand_box"+$index).hide();
        $(".amend_brand_box"+$index).show();
        // $(".remark_brand_box" + id).fadeOut(500);
        // $(".change_brand_wrap" + id).fadeIn(500);
        // $scope.make_name = val;
        // console.log($scope.make_name);
    };
    $scope.amend_brand_box=function ($event) {
        $event.stopPropagation();
    };
    // 关闭修改汽车品牌
    $scope.close_amend_brand = function ($index) {
        // $(".remark_brand_box" + id).fadeIn(500);
        // $(".change_brand_wrap" + id).fadeOut(500);
        // // $scope.el.make_name=$scope.make_name;
        // $scope.searchAll();
        $(".brand_box"+$index).show();
        $(".amend_brand_box"+$index).hide();
    };

    // 修改汽车品牌
    $scope.amend_brand_submit = function (iValid,id,name,$index) {
        if(iValid){
            _basic.put($host.api_url + "/admin/" + adminId + "/carMake/" + id, {
                "makeName": name
            }).then(function (data) {
                if (data.success == true) {
                    $(".brand_box"+$index).show();
                    $(".amend_brand_box"+$index).hide();
                    // swal("修改成功","","error");
                    // $(".remark_brand_box" + id).fadeIn(500);
                    // $(".change_brand_wrap" + id).fadeOut(500);
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }


    };

    // 汽车型号

    $scope.search_carModel = function (id) {
        _basic.get($host.api_url + "/carMake/" + id + "/carModel").then(function (data) {
            if (data.success == true) {
                // console.log(data.result);
                $scope.brand_model = data.result;

            } else {
                swal(data.msg, "", "error");
            }
        });

    };
    // 增加汽车型号界面
    $scope.add_car_model_box=function ($event,$index) {
        $event.stopPropagation();
        $(".open_car_brand").show();
        $($event.target).hide();
        $(".add_model_wrap").hide();
        $(".add_model_wrap"+$index).show();
        $scope.add_car_model_text="";
    };
    // 关闭增加型号界面
    $scope.close_add_car_model=function () {
        $(".add_model_wrap").hide();
        $(".open_car_brand").show();
        $scope.submitted=false;
    };
     // 增加汽车型号接口
    $scope.add_car_model_submit=function (iValid,id) {
        $scope.submitted=true;
        // var xt="add_car_model_text"+index;
        // console.log($scope.add_car_model_text);
        if(iValid){
            _basic.post($host.api_url + "/admin/" + adminId + "/carMake/" + id+"/carModel", {
                modelName:$scope.add_car_model_text
            }).then(function (data) {
                if (data.success == true) {
                    $(".add_model_wrap").hide();
                    $(".open_car_brand").show();
                    $scope.submitted=false;
                    $scope.search_carModel(id);
                    swal("新增成功","","success");

                } else {
                    swal(data.msg, "", "error");
                }
            })
        }

    };
    // 打开汽车型号界面
    $scope.open_car_model = function ($event, id) {
        // console.log($($event.target).attr("flag"));

        if ($($event.target).attr("flag") == "true") {
            $scope.search_carModel(id);
            $(".brand_box").attr("flag","true");
            $($event.target).attr("flag", "false");

        } else {
            $($event.target).attr("flag", "true");
        }
    };
    // // 打开新增型号
    // $scope.add_brand_model = function (id) {
    //     $(".add_brand_box" + id).fadeOut(500);
    //     $(".add_brand_model_wrap" + id).fadeIn(500);
    // };
    // 修改汽车型号状态
    // 打开修改面板
    $scope.amend_car_model=function ($index,$event) {
        // console.log($index);
            $($event.target).hide();
            $(".car_model_name"+$index).removeAttr("readonly");
            $(".amend_car_model_box"+$index).show();
    };

    $scope.changeSelfBrandStatus = function (id, status, makeId) {
        if (status == 0) {
            status = 1;
        } else {
            status = 0
        }
        _basic.put($host.api_url + "/admin/" + adminId + "/carModel/" + id + "/modelStatus/" + status, {}).then(function (data) {
            if (data.success == true) {
                $scope.search_carModel(makeId);
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 修改汽车型号
    $scope.remarkSelfBrandModel = function ($event, id) {
        $($event.target).removeAttr("readonly");
        $(".selfBrand_status" + id).hide();
        $(".selfBrand_operation" + id).show();

    };
    // 关闭修改型号界面
    $scope.close_car_model = function (index) {
        $(".car_model_name" + index).attr("readonly");
        $(".amend_car_model_box" + index).hide();
        $(".mdi-pencil" + index).show();
    };
    // 确认提交修改型号
    $scope.amend_car_model_submit = function (id, name,index) {
        _basic.put($host.api_url + "/admin/" + adminId + "/carModel/" + id, {
            modelName: name
        }).then(function (data) {
            if (data.success == true) {
                // console.log(data.result);
                $(".car_model_name" + index).attr("readonly");
                $(".amend_car_model_box" + index).hide();
                $(".mdi-pencil" + index).show();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    // 修改汽车型号状态
    $scope.amend_car_model_status=function (id,sta,makeId) {
        if (sta == 0) {
            sta = 1;
        } else {
            sta = 0
        }
        _basic.put($host.api_url + "/admin/" + adminId + "/carModel/" + id+"/modelStatus/"+sta,{}).then(function (data) {
            if (data.success == true) {
                swal("更改状态", "", "success");
                $scope.search_carModel(makeId);

            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    // $scope.searchModel=function (id) {
    //
    // };
    $scope.add_brand=function (iValid) {
        if(iValid){
            _basic.post($host.api_url + "/admin/" + adminId + "/carMake/", {
                makeName: $scope.b_txt
            }).then(function (data) {
                if (data.success == true) {
                    $scope.searchAll();
                    $scope.b_txt="";
                    $(".open_car_brand").show();
                    $(".car_Brand_box").hide();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }

    }
}]);
app.controller("setting_user_controller", ["_basic","_config", "$host", "$scope", function (_basic,_config,$host, $scope) {

    var adminId = _basic.getSession(_basic.USER_ID);

    var user_info_obj=_config.userTypes;
    var user_info_fun=function () {
        $scope.user_info_section=[];
        for(var i in user_info_obj){
            $scope.user_info_section.push(user_info_obj[i])
        }
        return $scope.user_info_section
    };
    user_info_fun();
    // 搜索所有查询
    var searchAll = function () {
        _basic.get($host.api_url + "/admin/" + adminId + "/user").then(function (data) {
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

            _basic.post($host.api_url + "/admin/" + adminId + "/user", obj).then(function (data) {
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
        _basic.get($host.api_url + "/admin/" + adminId + "/user?userId=" + id).then(function (data) {
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

                _basic.put($host.api_url + "/admin/" + adminId + "/user/" + id + "/status/" + $scope.changeSt
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
            _basic.put($host.api_url + "/admin/" + adminId + "/user/" + id, obj).then(function (data) {
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