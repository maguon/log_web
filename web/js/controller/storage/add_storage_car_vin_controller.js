/**
 * Created by ASUS on 2017/5/4.
 */
// var Storage_carController = angular.module("Storage_carController", []);
app.controller("new_storage_car_vin_controller", ["$scope", "$rootScope","$state","$stateParams","$host", "_basic", "_config", "baseService", function ($scope, $rootScope,$state,$stateParams,$host, _basic,  _config, baseService) {
    // $scope.data={};
    var vinObjs ={}
    $('#autocomplete-input').autocomplete({
        data: vinObjs,
        limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
        onAutocomplete: function(val) {
            console.log(val)
            // Callback function when value is autcompleted.
        },
        minLength: 6, // The minimum length of the input for the autocomplete to start. Default: 1.
    });

    $scope.short_search=function () {
        console.log($scope.demand_vin);
        if($scope.demand_vin!=undefined){
            if($scope.demand_vin.length>=6){
                _basic.get($host.api_url+"/carList?vinCode="+$scope.demand_vin).then(function (data) {
                    if(data.success==true&&data.result.length>0){
                        $scope.vin_msg=data.result
                        vinObjs ={};
                        for(var i in $scope.vin_msg){
                            vinObjs[$scope.vin_msg[i].vin]=null;
                        }

                        return vinObjs;

                    }else{
                        return {};
                    }
                }).then(function(vinObjs){
                    $('#autocomplete-input').autocomplete({
                        data: vinObjs,
                        minLength: 6
                    });
                    $('#autocomplete-input').focus();

                })
            }else {
                $('#autocomplete-input').autocomplete({minLength:6});
                $scope.vin_msg={}
            }
        }

    };
    // 查询vin码
    $scope.demand_car=function ($iValid) {
        $scope.submitted=true;
        if($iValid&&$scope.demand_vin.length==17){
            $scope.submitted=false;
            console.log($scope.demand_vin);
            // var obj={
            //     vin:$scope.demand_vin,
            //     active:1
            // };
            // _basic.get($host.api_url+"/car?"+_basic.objToUrl(obj)).then(function (data) {
            //     if(data.success=true){
            //         if(data.result.length==0){
            //             $(".no_car_detail").show();
            //             $(".car_detail").hide();
            //         }else {
            //             $(".no_car_detail").hide();
            //             $(".car_detail").show();
            //             $scope.car_details=data.result[0];
            //             $scope.vin= $scope.car_details.vin;
            //
            //             for(var i in _config.config_color){
            //                 if(_config.config_color[i].colorId==$scope.car_details.colour){
            //                     $scope.color=_config.config_color[i].colorName;
            //                 }
            //             }
            //         }
            //
            //
            //     }
            // })
        }else if($iValid){
            $scope.submitted=false;
            $state.go("new_storage_car", {}, {reload: true})
        }
    };
}]);