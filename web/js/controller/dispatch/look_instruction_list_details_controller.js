/**
 * Created by ASUS on 2017/8/22.
 */

app.controller("look_instruction_list_details_controller", ["$scope", "$host", "_basic","$state","$stateParams", function ($scope, $host, _basic,$state,$stateParams) {
    $scope.return=function () {
        $state.go($stateParams.from,{reload:true})
    };
    $scope.LoadTaskList=false;
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
        _basic.get($host.api_url+"/dpRouteLoadTask?dpRouteTaskId="+$stateParams.id).then(function (data) {
            if(data.success==true){
                $scope.this_LoadTask=data.result;
            }
        })
    });
    $scope.open_LoadTaskList=function (id,index) {
        $(".this_LoadTaskList").hide();
        if($(".this_LoadTaskList"+index).attr("flag")=='false'){
            _basic.get($host.api_url+"/dpRouteLoadTask/"+id+"/dpRouteLoadTaskDetail").then(function (data) {
                $(".this_LoadTaskList").attr("flag","false");
                if(data.success==true&&data.result.length>0){
                    $scope.this_LoadTaskList=data.result;
                    $(".this_LoadTaskList"+index).show();
                    $(".this_LoadTaskList"+index).attr("flag",'true');
                }else {
                    $(".this_LoadTaskList"+index).attr("flag",'false');
                    $(".this_LoadTaskList"+index).hide();
                }
            })
        }else {
            $(".this_LoadTaskList"+index).attr("flag",'false');
            $(".this_LoadTaskList"+index).hide();

        };
    }
}]);