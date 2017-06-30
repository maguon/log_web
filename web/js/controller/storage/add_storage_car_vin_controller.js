/**
 * Created by ASUS on 2017/5/4.
 */
// var Storage_carController = angular.module("Storage_carController", []);
app.controller("add_storage_car_vin_controller", ["$scope", "$rootScope","$state","$stateParams","$host", "_basic", "_config", "baseService", function ($scope, $rootScope,$state,$stateParams,$host, _basic,  _config, baseService) {
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
        // console.log($scope.demand_vin);
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

            var obj={
                vin:$scope.demand_vin,
            };
            _basic.get($host.api_url+"/car?"+_basic.objToUrl(obj)).then(function (data) {
                if(data.success=true){
                    if(data.result.length>0){
                        if(data.result[data.result.length-1].rel_status==1){
                            $scope.submitted=false;
                            $state.go("storage_car_details_", {id:data.result[data.result.length-1].id,vin:$scope.demand_vin,mark:1,status:1,from:"add_storage_car_vin"}, {reload: true})
                        }else {
                            $scope.submitted=false;
                            $state.go("add_storage_car_put_in", {vin:$scope.demand_vin,from:"add_storage_car_vin"}, {reload: true})
                        }
                    }else {
                        $scope.submitted=false;
                        $state.go("add_storage_car", {vin:$scope.demand_vin,from:"add_storage_car_vin"}, {reload: true})
                    }
                }
            })
        }else if($iValid){
            $scope.submitted=false;
            $state.go("add_storage_car", {vin:$scope.demand_vin,from:"add_storage_car_vin"}, {reload: true})
        }
    };
}]);