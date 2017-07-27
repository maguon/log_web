/**
 * Created by ASUS on 2017/7/26.
 */
app.controller("truck_guarantee_details_controller", ["$scope","$state","$stateParams","_basic", "_config", "$host", function ($scope,$state,$stateParams,_basic, _config, $host) {
    var userId=_basic.getSession(_basic.USER_ID);
    $scope.truck_guarantee_id=$stateParams.id;
    $scope.return=function () {
        $state.go($stateParams.from,{reload:true})
    };
    _basic.get($host.api_url+"/truckInsureRel?redId="+$scope.truck_guarantee_id).then(function (data) {
        if(data.success==true){
            $scope.truck_guarantee=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });

}]);