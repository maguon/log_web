/**
 * Created by ASUS on 2017/7/11.
 */
app.controller("add_truck_details_controller", ["$scope","$state","$stateParams","_basic", "_config", "$host", function ($scope,$state,$stateParams, _basic, _config, $host) {
    var userId=_basic.getSession(_basic.USER_ID);
    $scope.return=function () {
        $state.go($stateParams.from,{reload:true})
    }
    // 获取公司
    _basic.get($host.api_url+"/company").then(function (data) {
        if(data.success==true){
            $scope.company=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });
    // 获取品牌
    _basic.get($host.api_url+"/brand").then(function (data) {
        if(data.success==true){
            $scope.brand=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });
    // 获取挂车
    _basic.get($host.api_url+"/truck?truckType=2").then(function (data) {
        if(data.success==true){
            $scope.hand_truck_msg=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });
    // 获取主驾司机
    _basic.get($host.api_url+"/drive").then(function (data) {
        if(data.success==true){
            $scope.drive=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });
    $scope.submitForm=function (inValid) {
        $scope.submitted=true;
        var obj={
            "truckNum":$scope.truck_num,
            "brandId":$scope.truck_make,
            "truckTel": $scope.phone_num,
            "theCode": $scope.vin,
            "driveId": $scope.main_driver,
            // "copilot": "string",
            "companyId":$scope.truck_company,
            "truckType":$scope.truck_type,
            "relId":$scope.check_hand_truck,
            "truckStatus": $scope.truck_status,
            // "number": 0,
            // "drivingDate": "string",
            // "licenseDate": "string",
            // "twoDate": "string",
            // "drivingImage": "string",
            // "licenseImage": "string",
            "remark":$scope.textarea
        };
        console.log(obj);
        if(inValid){
            _basic.post($host.api_url+"/user/"+userId+"/truck",obj).then(function (data) {
                if(data.success==true){
                   $(".ui-tabs li").addClass("disabled");
                    $(".ui-tabs li a").removeClass("active");
                   $(".test2").removeClass("disabled");
                    $(".test2 a").addClass("active");
                }else {
                    swal(data.msg,"","error")
                }
            });
        }
    }
}])