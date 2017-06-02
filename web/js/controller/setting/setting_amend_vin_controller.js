/**
 * Created by ASUS on 2017/5/17.
 */
// var setting_amend_vin_controller=angular.module("setting_amend_vin_controller",[]);
app.controller("setting_amend_vin_controller",["$scope","_basic","_config","$host",function ($scope,_basic,_config,$host){
    var admin=_basic.getSession(_basic.USER_ID);
    $scope.flag=true;
    // 查询vin码
    $scope.demand_car=function ($iValid) {
        $scope.submitted=true;
        if($iValid&&$scope.demand_vin.length==17){
            var obj={
                vin:$scope.demand_vin,
                active:1
            };

            _basic.get($host.api_url+"/admin/"+admin+"/car?"+_basic.objToUrl(obj)).then(function (data) {
                if(data.success=true){
                    if(data.result.length==0){
                        $(".no_car_detail").show();
                        $(".car_detail").hide();
                    }else {
                        $(".no_car_detail").hide();
                        $(".car_detail").show();
                        $scope.car_details=data.result[0];
                        $scope.vin= $scope.car_details.vin;

                        for(var i in _config.config_color){
                            if(_config.config_color[i].colorId==$scope.car_details.colour){
                                $scope.color=_config.config_color[i].colorName;
                            }
                        }
                    }


                }
            })
        }
    };
    
    // 打开修改vin码
    $scope.open_vin_amend=function () {
        $scope.flag=false;
    };
    // 关闭修改vin码
    $scope.close_vin_amend=function () {
        $scope.flag=true;
    };
    // 修改vin码
    $scope.amend_vin=function (id) {
        $scope.flag=true;
        var obj={
            "vin":$scope.vin
        };
        if($scope.vin.length==17){
            _basic.put($host.api_url+"/admin/"+admin+"/car/"+id+"/vin",obj).then(function (data) {
                if(data.success==true){
                    swal("修改成功","","success");
                    $scope.demand_vin="";
                    $scope.submitted=false;
                }else {
                    swal(data.msg,"","error");
                }
            })
        }
    }
}]);
