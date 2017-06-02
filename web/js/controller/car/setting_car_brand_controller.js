/**
 * Created by ASUS on 2017/5/12.
 */
// var storage_setting_car_controller = angular.module("storage_setting_car_controller", []);
app.controller("setting_car_brand_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    var userId = _basic.getSession(_basic.USER_ID);
    // 打开汽车品牌
    $scope.car_Brand_box = function ($event) {
        $($event.target).hide();
        $(".car_Brand_box").show();
    };
    // 关闭汽车品牌
    $scope.closeBrand = function () {
        $(".open_car_brand").show();
        $(".car_Brand_box").hide();
        $scope.b_txt = "";
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
    $scope.amend_brand_make = function ($event, $index) {
        $event.stopPropagation();
        $(".brand_box" + $index).hide();
        $(".amend_brand_box" + $index).show();
    };
    $scope.amend_brand_box = function ($event) {
        $event.stopPropagation();
    };
    // 关闭修改汽车品牌
    $scope.close_amend_brand = function ($index) {
        $(".brand_box" + $index).show();
        $(".amend_brand_box" + $index).hide();
    };

    // 修改汽车品牌
    $scope.amend_brand_submit = function (iValid, id, name, $index) {
        if (iValid) {
            _basic.put($host.api_url + "/user/" + userId + "/carMake/" + id, {
                "makeName": name
            }).then(function (data) {
                if (data.success == true) {
                    $(".brand_box" + $index).show();
                    $(".amend_brand_box" + $index).hide();
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
    $scope.add_car_model_box = function ($event, $index) {
        $event.stopPropagation();
        $(".open_car_brand").show();
        $($event.target).hide();
        $(".add_model_wrap").hide();
        $(".add_model_wrap" + $index).show();
        $scope.add_car_model_text = "";
    };
    // 关闭增加型号界面
    $scope.close_add_car_model = function () {
        $(".add_model_wrap").hide();
        $(".open_car_brand").show();
        $scope.submitted = false;
    };
    // 增加汽车型号接口
    $scope.add_car_model_submit = function (iValid, id) {
        $scope.submitted = true;
        // var xt="add_car_model_text"+index;
        console.log($scope.add_car_model_text);
        if (iValid) {
            _basic.post($host.api_url + "/user/" + userId + "/carMake/" + id + "/carModel", {
                modelName: $scope.add_car_model_text
            }).then(function (data) {
                if (data.success == true) {
                    $(".add_model_wrap").hide();
                    $(".open_car_brand").show();
                    $scope.submitted = false;
                    $scope.search_carModel(id);
                    swal("新增成功", "", "success");

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
            $(".brand_box").attr("flag", "true");
            $($event.target).attr("flag", "false");

        } else {
            $($event.target).attr("flag", "true");
        }
    };
    // 修改汽车型号状态
    // 打开修改面板
    $scope.amend_car_model = function ($index, $event) {
        console.log($index);
        $($event.target).hide();
        $(".car_model_name" + $index).removeAttr("readonly");
        $(".amend_car_model_box" + $index).show();
    };

    $scope.changeSelfBrandStatus = function (id, status, makeId) {
        if (status == 0) {
            status = 1;
        } else {
            status = 0
        }
        _basic.put($host.api_url + "/user/" + userId + "/carModel/" + id + "/modelStatus/" + status, {}).then(function (data) {
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
        $(".car_model_name" + index).attr("readonly", "readonly");
        $(".amend_car_model_box" + index).hide();
        $(".mdi-pencil" + index).show();
    };
    // 确认提交修改型号
    $scope.amend_car_model_submit = function (id, name, index) {
        _basic.put($host.api_url + "/user/" + userId + "/carModel/" + id, {
            modelName: name
        }).then(function (data) {
            if (data.success == true) {
                // console.log(data.result);
                $(".car_model_name" + index).attr("readonly", "readonly");
                $(".amend_car_model_box" + index).hide();
                $(".mdi-pencil" + index).show();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    // 修改汽车型号状态
    $scope.amend_car_model_status = function (id, sta, makeId) {
        if (sta == 0) {
            sta = 1;
        } else {
            sta = 0
        }
        _basic.put($host.api_url + "/user/" + userId + "/carModel/" + id + "/modelStatus/" + sta, {}).then(function (data) {
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
    $scope.add_brand = function (iValid) {
        if (iValid) {
            _basic.post($host.api_url + "/user/" + userId + "/carMake/", {
                makeName: $scope.b_txt
            }).then(function (data) {
                if (data.success == true) {
                    $scope.searchAll();
                    $scope.b_txt = "";
                    $(".open_car_brand").show();
                    $(".car_Brand_box").hide();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }

    }
}]);