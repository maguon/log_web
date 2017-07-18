/**
 * Created by ASUS on 2017/7/10.
 */
app.controller("truck_details_controller", ["$scope","$state","$stateParams","_basic", "_config", "$host", function ($scope,$state,$stateParams,_basic, _config, $host) {

    _basic.get($host.api_url+"/truckFirst?truckType=1").then(function (data) {
        if(data.success==true){
            $scope.head_car=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });

    // 获取公司
    _basic.get($host.api_url+"/company").then(function (data) {
        if(data.success==true){
            $scope.company=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });

    _basic.get($host.api_url+"/truckTrailer?truckType=2").then(function (data) {
        if(data.success==true){
            $scope.hand_truck_msg=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });
    $('ul.tabWrap li').removeClass("active");
    $(".tab_box").removeClass("active");
    $(".tab_box").hide();
    $('ul.tabWrap li.header_car').addClass("active");
    $("#header_car").addClass("active");
    $("#header_car").show();
    $scope.search_truck_status=1;
    // 头车挂车跳转
    $scope.header_car = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.header_car ').addClass("active");
        $("#header_car").addClass("active");
        $("#header_car").show();
        $scope.search_truck_status=1;
    };
    $scope.hand_car = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.hand_car ').addClass("active");
        $("#hand_car").addClass("active");
        $("#hand_car").show();
        $scope.search_truck_status=2;
    };
    
    // 搜索头车
    $scope.search_truck=function () {
        var obj={
            truckType: 1,
            truckNum:$scope.search_num,
            operateType:$scope.search_truck_type,
            companyId:$scope.search_company,
            driveName:$scope.search_driver,
            drivingDateStart:$scope.search_checkCar_startTime,
            drivingDateEnd:$scope.search_checkCar_endTime
        };
        _basic.get($host.api_url+"/truckFirst?"+_basic.objToUrl(obj)).then(function (data) {
            if(data.success==true){
                $scope.head_car=data.result;
            }else {
                swal(data.msg,"","error")
            }
        });
    };
    // 搜索挂车
    $scope.search_hand_truck=function () {
        var obj={
            truckType:2,
            truckNum:$scope.search_hand_num,
            numberStart:$scope.search_hand_num_start,
            numberEnd:$scope.search_hand_num_end,
            operateType:$scope.search_truck_hand_type,
            companyId:$scope.search_hand_company,
            drivingDateStart:$scope.search_checkCar_hand_startTime,
            drivingDateEnd:$scope.search_checkCar_hand_endTime
        };
        _basic.get($host.api_url+"/truckTrailer?"+_basic.objToUrl(obj)).then(function (data) {
            if(data.success==true){
                $scope.hand_truck_msg=data.result;
            }else {
                swal(data.msg,"","error")
            }
        });
    }

}]);