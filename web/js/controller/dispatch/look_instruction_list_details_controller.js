/**
 * Created by ASUS on 2017/8/22.
 */

app.controller("look_instruction_list_details_controller", ["$scope", "$host", "_basic","$state","$stateParams", function ($scope, $host, _basic,$state,$stateParams) {
    $scope.return=function () {
        $state.go($stateParams.from,{reload:true})
    };
    function p() {
        var p=new Promise(function (resolve,reject) {
            _basic.get($host.api_url+"/dpRouteTask?dpRouteTaskId="+$stateParams.id).then(function (data) {
                if(data.success==true){
                    $scope.this_instruction=data.result[0];
                    resolve();
                }
            })
        });
        return p;
    }

    p().then(function () {
        _basic.get($host.api_url+"/dpRouteTask/"+$stateParams.id+"/dpRouteLoadTask").then(function (data) {
            if(data.success==true){
                $scope.this_LoadTask=data.result;
            }
        })
    })
}]);