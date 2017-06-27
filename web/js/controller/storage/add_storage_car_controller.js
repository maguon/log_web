/**
 * Created by ASUS on 2017/6/27.
 */
/**
 * Created by ASUS on 2017/5/4.
 */
// var Storage_carController = angular.module("Storage_carController", []);
app.controller("new_storage_car_controller", ["$scope", "$rootScope","$state","$stateParams","$host", "_basic", "_config", "baseService", function ($scope, $rootScope,$state,$stateParams,$host, _basic,  _config, baseService) {
    // 信息获取
    $scope.get_Msg=function () {
        // 城市
        _basic.get($host.api_url+"/city").then(function (data) {
            if(data.success==true){
                $scope.get_city=data.result;
            }
        });
        // 车辆品牌查询
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.makecarName = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
        // 经销商
        _basic.get($host.api_url+"/receive").then(function (data) {
            if(data.success==true){
                $scope.get_receive=data.result;
            }
        });
        // 委托方
        _basic.get($host.api_url+"/entrust").then(function (data) {
            if(data.success==true){
                $scope.get_entrust=data.result;
            }
        });
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .test1').addClass("active");
        $("#test1").addClass("active");
        $("#test1").show();
    };
    $scope.get_Msg();

    // 新增信息
    $scope.newsubmitForm = function (isValid) {
        console.log($scope.order_time);
        $scope.submitted = true;
        if (isValid) {
            var obj_car = {
                "vin": $scope.vin,
                "makeId": $scope.make_name.id,
                "makeName": $scope.make_name.make_name,
                "orderDate": $scope.order_time,
                "routeStartId": $scope.start_city.id,
                "routeStart": $scope.start_city.city_name,
                "routeEndId": $scope.arrive_city.id,
                "routeEnd": $scope.arrive_city.city_name,
                "receiveId": $scope.client,
                "entrustId": $scope.dealer,
                "remark": $scope.remark,
                "storageId": $scope.storage_name.id,
                "storageName": $scope.storage_name.storage_name,
                // "enterTime":$scope.enter_time,
                "parkingId": $scope.parking_id,
                // "planOutTime": $scope.plan_out_time
            };
            console.log(obj_car);
            _basic.post($host.api_url + "/user/" + userId + "/carStorageRel", _basic.removeNullProps(obj_car)).then(function (data) {
                if (data.success == true) {
                    $('.tabWrap .tab').removeClass("active");
                    $(".tab_box ").removeClass("active");
                    $(".tab_box ").hide();
                    $('.tabWrap .test2').addClass("active");
                    $("#test2").addClass("active");
                    $("#test2").show();
                    searchAll();
                    $scope.Picture_carId = data.id;
                } else {
                    swal(data.msg, "", "error")
                }
            });
        }

    };


}]);