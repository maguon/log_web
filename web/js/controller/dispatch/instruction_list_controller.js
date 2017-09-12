/**
 * Created by ASUS on 2017/8/22.
 */
app.controller("instruction_list_controller", ["$scope", "$host","_config","_basic", function ($scope, $host,_config, _basic) {
    $scope.start=0;
    $scope.size=11;
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
    }

    // 搜索请求
    $scope.search_query=function (params) {
        _basic.get($host.api_url+"/dpRouteTask?"+_basic.objToUrl(params)).then(function (data) {
            if(data.success==true&&data.result.length>0){
                $scope.instruction_list_obj=data.result;
                $scope.instruction_list=$scope.instruction_list_obj.slice(0,10);
                if ($scope.start > 0) {
                    $scope.pre=true;
                    // $("#pre").removeClass("disabled");
                } else {
                    $scope.pre=false;
                    // $("#pre").addClass("disabled");
                }
                if ($scope.instruction_list_obj.length < $scope.size) {
                    // $("#next").addClass("disabled");
                    $scope.next=false;
                } else {
                    // $("#next").removeClass("disabled");
                    $scope.next=true;
                }

            }else {
                swal(data.msg,"","error")
            }
        })
    };

    // 基本条件
    $scope.queryParams = {
        start:$scope.start,
        size:$scope.size,
    };
    // 普通查询
    $scope.search_All= function(){

        // 控制分页查询参数
        $scope.queryParams.start = $scope.start==0?'0':$scope.start;
        $scope.search_query($scope.queryParams)
    };
    $scope.search_All();


    // 条件赋值
    $scope.setParams = function(){

        // 控制查询参数逻辑
        if($scope.vin){
            $scope.queryParams.vin = $scope.vin;
        }else{
            $scope.queryParams.vin = null;
        }

        if($scope.dispatch_num){
            $scope.queryParams.dpRouteTaskId = $scope.dispatch_num;
        }else{
            $scope.queryParams.dpRouteTaskId = null;
        }

        if($scope.instruct_startTime){
            $scope.queryParams.taskPlanDateStart = $scope.instruct_startTime;
        }else {
            $scope.queryParams.taskPlanDateStart=null;
        }

        if($scope.instruct_endTime){
            $scope.queryParams.taskPlanDateEnd = $scope.instruct_endTime;
        }else {
            $scope.queryParams.taskPlanDateEnd=null;
        }

        if($scope.truck_num){
            $scope.queryParams.truckNum = $scope.truck_num;
        }else {
            $scope.queryParams.truckNum=null;
        }

        if($scope.driver){
            $scope.queryParams.driveName = $scope.driver;
        }else {
            $scope.queryParams.driveName=null;
        }

        if($scope.start_city){
            $scope.queryParams.routeStartId = $scope.start_city;
        }else {
            $scope.queryParams.routeStartId=null;
        }

        if($scope.dispatch_car_position){
            $scope.queryParams.baseAddrId = $scope.dispatch_car_position;
        }else {
            $scope.queryParams.baseAddrId=null;
        }

        if($scope.end_city){
            $scope.queryParams.routeEndId = $scope.end_city;
        }else {
            $scope.queryParams.routeEndId=null;
        }

        if($scope.dealer){
            $scope.queryParams.receiveId = $scope.dealer;
        }else {
            $scope.queryParams.receiveId=null;
        }
        if($scope.task_status){
            $scope.queryParams.taskStatus = $scope.task_status;
        }else {
            $scope.queryParams.taskStatus=null;
        }

    };
    // 头车搜索事件-条件查询
    $scope.search_condition =function(){
        $scope.start = 0;
        $scope.setParams();
        $scope.search_query($scope.queryParams)
    };

    // 分页
    // 上一页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        $scope.search_All();
    };
    // 下一页
    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        $scope.search_All();
    };
    // $scope.search_all=function () {
    //
    //     var obj={
    //         dpRouteTaskId:$scope.dispatch_num,
    //         vin:$scope.vin,
    //         taskPlanDateStart:$scope.instruct_startTime,
    //         taskPlanDateEnd:$scope.instruct_endTime,
    //         truckId:"",
    //         truckNum:$scope.truck_num,
    //         driveName:$scope.driver,
    //         routeStartId:$scope.start_city,
    //         baseAddrId:$scope.dispatch_car_position,
    //         routeEndId:$scope.end_city,
    //         receiveId:$scope.dealer,
    //         taskStatus:$scope.task_status
    //     };
    //     _basic.get($host.api_url+"/dpRouteTask?"+_basic.objToUrl(obj)).then(function (data) {
    //         if(data.success==true&&data.result.length>0){
    //             $scope.instruction_list=data.result;
    //         }else {
    //             $scope.instruction_list=[];
    //         }
    //     })
    // };
    // $scope.search_all();
}]);