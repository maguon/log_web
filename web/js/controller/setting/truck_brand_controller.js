/**
 * Created by covrazcy on 2017/8/7.
 */
app.controller("truck_brand_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.submitted = false;
    $scope.truck_box_show = false;
    $scope.truck_btn = true;

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

    // 获取所有货车品牌
    $scope.getTruckBrand = function () {
        _basic.get($host.api_url + "/brand").then(function (data) {
            if (data.success === true) {
                // console.log("truck_brand_list",data);
                $scope.truck_brand_list = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    $scope.getTruckBrand();

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
}]);