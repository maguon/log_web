/**
 * Created by ASUS on 2017/7/11.
 */
app.controller("add_truck_details_controller", ["$scope","$state","$stateParams","_basic", "_config", "$host", function ($scope,$state,$stateParams, _basic, _config, $host) {
    $scope.return=function () {
        $state.go($stateParams.from,{reload:true})
    }

}])