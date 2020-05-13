/**
 * Created by covrazcy on 2017/8/7.
 */
app.controller("truck_brand_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.submitted = false;
    $scope.truck_box_show = false;
    $scope.truck_btn = true;
    $scope.truck_box_style_show = false;
    $scope.truck_style_btn = true;

    // 跳转
    $scope.truck_brand = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.truckBrand ').addClass("active");
        $("#truckBrand").addClass("active");
        $("#truckBrand").show();
    };
    $scope.truck_brand_style = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.truckBrandStyle ').addClass("active");
        $("#truckBrandStyle").addClass("active");
        $("#truckBrandStyle").show();
    };
    $scope.truck_brand();



    // 新增货车品牌按钮控制
    $scope.truck_box = function () {
        $scope.truck_btn = false;
        $scope.truck_box_show = true;
    };

    // 关闭新增按钮
    $scope.closeBrand = function () {
        $scope.truck_box_show = false;
        $scope.truck_btn = true;
        $scope.brandText = "";
        $scope.submitted = false;
    };


    // 新增品牌型号按钮控制
    $scope.truck_style_box = function () {
        $scope.truck_style_btn = false;
        $scope.truck_style_box_show = true;
    };

    // 关闭新增按钮
    $scope.closeBrandStyle = function () {
        $scope.truck_style_box_show = false;
        $scope.truck_style_btn = true;
        $scope.brandStyleText = "";
        $scope.submitted = false;
    };



    // 获取所有货车品牌
    $scope.getTruckBrand = function () {
        _basic.get($host.api_url + "/brand").then(function (data) {
            if (data.success === true) {
                $scope.truck_brand_list = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    $scope.getTruckBrand();

    //获取所有品牌型号
    function getTruckStyle(){
        _basic.get($host.api_url + "/brandStyle").then(function (data) {
            if (data.success === true) {
                $scope.truck_brand_style_list = data.result;
                $scope.putFlag=true;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }


    // 新增货车品牌
    $scope.add_truck_brand = function (iValid) {
        $scope.submitted = true;
        if (iValid) {
            _basic.post($host.api_url + "/user/" + userId + "/brand", {
                brandName: $scope.brandText
            }).then(function (data) {
                if (data.success === true) {
                    $scope.getTruckBrand();
                    $scope.closeBrand();
                    swal("新增成功", "", "success");
                }
            });
        }
    }

    // 新增品牌型号
    $scope.add_truck_style_brand = function (iValid) {
        $scope.submitted = true;
        if (iValid) {
            _basic.post($host.api_url + "/user/" + userId + "/brandStyle", {
                brandStyleName: $scope.brandStyleText
            }).then(function (data) {
                if (data.success === true) {
                    getTruckStyle();
                    $scope.closeBrandStyle();
                    swal("新增成功", "", "success");
                }
            });
        }
    }

    // 打开修改型号
    $scope.open_style = function ($index) {
        $(".brand_box" + $index).hide();
        $(".flag_box" + $index).show();
    };


    // 关闭修改型号
    $scope.close_style = function ($index) {
        $(".brand_box" + $index).show();
        $(".flag_box" + $index).hide();
    };


    // 修改型号
    $scope.amend_style = function (id, $index, putStyle) {
        if (putStyle == undefined) {
            putStyle = [];
            swal("请输入品牌型号", "", "error");
        }
        else {
            var obj = {
                "brandStyleName": putStyle
            };

            _basic.put($host.api_url + "/user/" + userId + "/brandStyle/" + id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    getTruckStyle();
                } else {
                    swal(data.msg, "", "error");
                }
            })


            $(".brand_box" + $index).show();
            $(".flag_box" + $index).hide();
        }


    }



    //设置 车头的 100公里重载油量 和 空载油量
    $scope.postLoad = function (id){
        _basic.get($host.api_url + "/brand?brandId=" + id).then(function (data) {
            if (data.success == true && data.result.length >= 0) {
                $scope.loadItem = data.result[0];
            }
            else {
                swal(data.msg, "", "error");
            }
        })
        $scope.brandId=id;
        $("#postLoad").modal("open");
    }
    $scope.putInfo = function (){
        if($scope.loadItem.load_distance_oil == null || $scope.loadItem.no_load_distance_oil == null||$scope.loadItem.urea == null
        ||$scope.loadItem.load_reverse_oil==null||$scope.loadItem.no_load_reverse_oil==null){
            swal("重载油耗或空载油耗不能为空！", "", "warning");
        }
        else{
            _basic.put($host.api_url + "/user/" + userId + "/brand/" +  $scope.brandId+"/truckLoadDistanceOil",{
                loadDistanceOil: $scope.loadItem.load_distance_oil,
                noLoadDistanceOil: $scope.loadItem.no_load_distance_oil,
                urea:$scope.loadItem.urea,
                loadReverseOil: $scope.loadItem.load_reverse_oil,
                noLoadReverseOil: $scope.loadItem.no_load_reverse_oil
            }).then(function (data) {
                if (data.success === true) {
                    swal("保存成功", "", "success");
                    $scope.getTruckBrand();
                    $("#postLoad").modal("close");
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }



    getTruckStyle();
}]);