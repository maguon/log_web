/**
 * Created by ASUS on 2017/8/22.
 */
app.controller("instruction_list_controller", ["$scope", "$host","_config","_basic", function ($scope, $host,_config, _basic) {
    // 指令任务状态
    $scope.taskStatusList=_config.taskStatus;
            _basic.get($host.api_url+"/city").then(function (data) {
                if(data.success==true){
                    $scope.cityList=data.result;
                }
            });
    // 获取装车地点
    $scope.getAddres=function (id) {
        _basic.get($host.api_url+"/baseAddr?cityId="+id).then(function (data) {
            if(data.success==true){
                $scope.baseAddrList=data.result;
            }
        });
    };
    // 获取经销商
    $scope.getRecive=function (id) {
        _basic.get($host.api_url+"/receive?cityId="+id).then(function (data) {
            if(data.success==true){
                $scope.receiveList=data.result;
            }
        });
    };
    $scope.search_all=function () {

        var obj={
            dpRouteTaskId:"",
            vin:$scope.vin,
            taskPlanDateStart:$scope.instruct_startTime,
            taskPlanDateEnd:$scope.instruct_endTime,
            truckId:"",
            truckNum:$scope.truck_num,
            driveName:$scope.driver,
            routeStartId:$scope.start_city,
            baseAddrId:$scope.dispatch_car_position,
            routeEndId:$scope.end_city,
            receiveId:$scope.dealer,
            taskStatus:$scope.task_status
        };
        _basic.get($host.api_url+"/dpRouteTask?"+_basic.objToUrl(obj)).then(function (data) {
            if(data.success==true&&data.result.length>0){
                $scope.instruction_list=data.result;
            }else {
                $scope.instruction_list=[];
            }
        })
    };
    $scope.search_all();
}]);