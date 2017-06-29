/**
 * Created by ASUS on 2017/6/27.
 */
/**
 * Created by ASUS on 2017/5/4.
 */
// var Storage_carController = angular.module("Storage_carController", []);
app.controller("new_storage_car_controller", ["$scope", "$rootScope","$state","$stateParams","$host", "_basic", "_config", "baseService", function ($scope, $rootScope,$state,$stateParams,$host, _basic,  _config, baseService) {
    var userId=_basic.getSession(_basic.USER_ID);
    $scope.vin=$stateParams.vin;
    // $scope.vin = "";
    $scope.make_name = "";
    $scope.order_time = "";
    $scope.start_city = "";
    $scope.arrive_city = "";
    $scope.client = "";
    $scope.dealer = "";
    // $scope.create_time = "";
    // $scope.car_color = "";
    // $scope.engineNum = "";
    $scope.remark = "";
    $scope.storage_name = "";
    // 存放位置清空
    $scope.parkingArray = "";
    $scope.parking_id = "";
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
        // 车库查询
        _basic.get($host.api_url + "/storage").then(function (data) {
            if (data.success == true) {
                $scope.storageName = data.result;
            } else {
                swal(data.msg, "", "error");
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

    // 存放位置联动查询--行
    $scope.changeStorageId = function (val) {
        if (val) {
            _basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
                if (data.success == true) {
                    $scope.storageParking = data.result;

                    $scope.parkingArray = baseService.storageParking($scope.storageParking);
                    console.log($scope.parkingArray)

                } else {
                    swal(data.msg, "", "error");
                }
            });
        }

    },
    // 存放位置联动查询--列
    $scope.changeStorageRow = function (val, array) {

        if (val) {
            // console.log(val);
            $scope.colArr = array[val - 1].col;
            // console.log($scope.colArr)
        }


    };


    // 新增信息
    $scope.newsubmitForm = function (isValid) {
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
            _basic.post($host.api_url + "/user/" + userId + "/carStorageRel", _basic.removeNullProps(obj_car)).then(function (data) {
                if (data.success == true) {
                    $('.tabWrap .tab').removeClass("active");
                    $(".tab_box ").removeClass("active");
                    $(".tab_box ").hide();
                    $('.tabWrap .test2').addClass("active");
                    $("#test2").addClass("active");
                    $("#test2").show();
                    $scope.Picture_carId = data.id;
                } else {
                    swal(data.msg, "", "error")
                }
            });
        }

    };
    // 返回
    $scope.return = function () {
        // console.log($stateParams.mark);
            $state.go($stateParams.from, {reload: true})

    };
}]);