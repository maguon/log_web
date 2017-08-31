/**
 * Created by ASUS on 2017/8/22.
 */

app.controller("look_instruction_list_details_controller", ["$scope", "$host", "_basic","$state","$stateParams", function ($scope, $host, _basic,$state,$stateParams) {
    $scope.return=function () {
        if($stateParams.from=="instruction_drive_details"){
            $state.go($stateParams.from,{reload:true,id:$stateParams.id,timeStart:$stateParams.timeStart,timeEnd:$stateParams.timeEnd,refer:$stateParams.refer})
        }else {
            $state.go($stateParams.from,{reload:true,})
        }

    };
    $scope.LoadTaskList=false;
    function p() {
        var p=new Promise(function (resolve,reject) {
            _basic.get($host.api_url+"/dpRouteTask?dpRouteTaskId="+$stateParams.instruction_id).then(function (data) {
                if(data.success==true&&data.result.length>0){
                    $scope.this_instruction=data.result[0];
                    $scope.data_id=moment($scope.this_instruction.date_id.toString()).format("YYYY-MM-DD");
                    resolve();
                }
            })
        });
        return p;
    }

    p().then(function () {
        _basic.get($host.api_url+"/dpRouteLoadTask?dpRouteTaskId="+$stateParams.instruction_id).then(function (data) {
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