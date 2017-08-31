/**
 * Created by ASUS on 2017/8/23.
 */
app.controller("instruction_need_controller", ["$scope", "$host","_config","_basic", function ($scope, $host,_config, _basic) {
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
    $scope.add_need=function () {
        $('.modal').modal();
        $('#newNeed').modal('open');
        var data = new Date();
        $scope.time = moment(data).format('YYYY-MM-DD');
        $scope.user=_basic.getSession(_basic.USER_NAME)
        $scope.submitted=false;
        $scope.add_start_city.id="",
        $scope.add_start_city.city_name='',
        $scope.add_dispatch_car_position='',
        $scope.add_end_city.id='',
        $scope.add_end_city.city_name='',
        $scope.add_dealer='',
        $scope.add_car_num='',
        $scope.add_instruct_Time=''
    }
    $scope.search_all=function () {

        var obj={
            createOnStart:$scope.instruct_need_startTime,
            createOnEnd:$scope.instruct_need_endTime,
            dateIdStart:$scope.instruct_start_time,
            dateIdEnd:$scope.instruct_endTime,
            realName:$scope.instruct_need_man,
            preCountStart:$scope.car_num_start,
            preCountEnd:$scope.car_num_end,
            routeStartId:$scope.start_city,
            baseAddrId:$scope.dispatch_car_position,
            routeEndId:$scope.arrive_city,
            receiveId:$scope.dealer,
            // demandStatus:$scope.task_status
        };
        _basic.get($host.api_url+"/dpDemand?"+_basic.objToUrl(obj)).then(function (data){
            if(data.success==true&&data.result.length>0){
                $scope.instruction_neee_list=data.result;
            }else {
                $scope.instruction_list=[];
            }
        })
    };
    $scope.search_all();
    
    // 新增需求
    $scope.add_need_instruct=function (inValid) {
        $scope.submitted=true;
        if(inValid){
           var obj={
               "routeStartId": $scope.add_start_city.id,
               "routeStart": $scope.add_start_city.city_name,
               "baseAddrId": $scope.add_dispatch_car_position,
               "routeEndId": $scope.add_end_city.id,
               "routeEnd":  $scope.add_end_city.city_name,
               "receiveId": $scope.add_dealer,
               "preCount":$scope.add_car_num,
               "dateId": $scope.add_instruct_Time
           };
            _basic.post($host.api_url+"/user/"+_basic.getSession(_basic.USER_ID)+"/dpDemand",obj).then(function (data) {
                if(data.success==true){
                    $scope.submitted=false;
                    swal("新增成功","","success");
                    $('#newNeed').modal('close');
                    $scope.search_all();
                }
            })
        }
    }
}]);