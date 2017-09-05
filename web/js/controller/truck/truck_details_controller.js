/**
 * Created by ASUS on 2017/7/10.
 */
app.controller("truck_details_controller", ["$scope","$state","$stateParams","_basic", "_config", "$host", function ($scope,$state,$stateParams,_basic, _config, $host) {
    var userId=_basic.getSession(_basic.USER_ID);
    $scope.head_start = 0;
    $scope.head_size = 11;
    $scope.hand_start = 0;
    $scope.hand_size = 11;


    // 类型--公司联动
    $scope.get_company=function (type) {
        // 获取公司
        _basic.get($host.api_url+"/company?operateType="+type).then(function (data) {
            if(data.success==true){
                $scope.company=data.result;
            }else {
                swal(data.msg,"","error")
            }
        });

    };


    // 头车搜索请求
    $scope.head_query = function(params){
        _basic.get($host.api_url+"/truckFirst?"+_basic.objToUrl(params)).then(function (data) {
            if(data.success==true){
                $scope.head_car_box=data.result;
                $scope.head_car = $scope.head_car_box.slice(0, 10);
                if ($scope.head_start > 0) {
                    $scope.head_pre=true;
                    // $("#pre").removeClass("disabled");
                } else {
                    $scope.head_pre=false;
                    // $("#pre").addClass("disabled");
                }
                if ($scope.head_car_box.length < $scope.head_size) {
                    // $("#next").addClass("disabled");
                    $scope.head_next=false;
                } else {
                    // $("#next").removeClass("disabled");
                    $scope.head_next=true;
                }
            }else {
                swal(data.msg,"","error")
            }
        });
    };

    // 基本条件
    $scope.queryParams = {
        truckType: 1,
        start:$scope.head_start,
        size:$scope.head_size,
    };
    // 普通查询
    $scope.search_head_truck= function(){

         // 控制分页查询参数
        $scope.queryParams.start = $scope.head_start;
        $scope.head_query($scope.queryParams)
    };
    $scope.search_head_truck();


    // 条件赋值
    $scope.setParams = function(){
        // 控制查询参数逻辑
        if($scope.search_num){
            $scope.queryParams.truckNum = $scope.search_num;
        }else{
            $scope.queryParams.truckNum = null;
        }
        if($scope.search_truck_type){
            $scope.queryParams.operateType = $scope.search_truck_type;
        }else {
            $scope.queryParams.operateType=null;
        }

        if($scope.search_company){
            $scope.queryParams.companyId = $scope.search_company;
        }else {
            $scope.queryParams.companyId=null;
        }
        if($scope.search_driver){
            $scope.queryParams.driveName = $scope.search_driver;
        }else {
            $scope.queryParams.driveName=null;
        }

        if($scope.check_operation_startTime){
            $scope.queryParams.licenseDateStart = $scope.check_operation_startTime;
        }else {
            $scope.queryParams.licenseDateStart=null;
        }

        if($scope.check_operation_endTime){
            $scope.queryParams.licenseDateEnd = $scope.check_operation_endTime;
        }else {
            $scope.queryParams.licenseDateEnd=null;
        }

        if($scope.search_checkCar_startTime){
            $scope.queryParams.drivingDateStart = $scope.search_checkCar_startTime;
        }else {
            $scope.queryParams.drivingDateStart=null;
        }
        if($scope.search_checkCar_endTime){
            $scope.queryParams.drivingDateEnd = $scope.search_checkCar_endTime;
        }else {
            $scope.queryParams.drivingDateEnd=null;
        }

    };
    // 头车搜索事件-条件查询
    $scope.searchHead_car =function(){
        $scope.head_start = 0;
        $scope.setParams();
        $scope.head_query($scope.queryParams)
    };

    // 分页
    // 头车上一页
    $scope.head_pre_btn = function () {
        $scope.head_start = $scope.head_start - ($scope.head_size - 1);
        $scope.search_head_truck();
    };
    // 头车下一页
    $scope.head_next_btn = function () {
        $scope.head_start = $scope.head_start + ($scope.head_size - 1);
        $scope.search_head_truck();
    };


    _basic.get($host.api_url+"/truckTrailer?truckType=2").then(function (data) {
        if(data.success==true){
            $scope.hand_truck_msg=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });
    $('ul.tabWrap li').removeClass("active");
    $(".tab_box").removeClass("active");
    $(".tab_box").hide();
    $('ul.tabWrap li.header_car').addClass("active");
    $("#header_car").addClass("active");
    $("#header_car").show();
    $scope.search_truck_status=1;
    // 头车挂车跳转
    $scope.header_car = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.header_car ').addClass("active");
        $("#header_car").addClass("active");
        $("#header_car").show();
        $scope.search_truck_status=1;
    };
    $scope.hand_car = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.hand_car ').addClass("active");
        $("#hand_car").addClass("active");
        $("#hand_car").show();
        $scope.search_truck_status=2;
    };
    

    // 修改头车状态
    $scope.changeTruck_status=function (id,status) {
            if(status==1){
                status=0
            }else {
                status=1
            }
        _basic.put($host.api_url+"/user/"+userId+"/truck/"+id+"/truckStatus/"+status+"/first",{}).then(function (data) {
            if(data.success==true){
                swal("修改成功","","success");
                $scope.search_head_truck();

            }else {
                swal(data.msg,"","error");
                $scope.search_head_truck();
            }
        })

    };



    // 挂车接口查询
    $scope.hand_query=function (params) {

        _basic.get($host.api_url+"/truckTrailer?"+_basic.objToUrl(params)).then(function (data) {
            if(data.success==true){
                $scope.hand_car_box=data.result;
                $scope.hand_car_msg = $scope.hand_car_box.slice(0, 10);
                if ($scope.hand_start > 0) {
                    $scope.hand_pre=true;
                    // $("#pre").removeClass("disabled");
                } else {
                    $scope.hand_pre=false;
                    // $("#pre").addClass("disabled");
                }
                if ($scope.hand_car_box.length < $scope.hand_size) {
                    // $("#next").addClass("disabled");
                    $scope.hand_next=false;
                } else {
                    // $("#next").removeClass("disabled");
                    $scope.hand_next=true;
                }
            }else {
                swal(data.msg,"","error");
            }
        });
    };



    // 挂车基本条件
    $scope.hand_queryParams = {
        truckType: 2,
        start:$scope.hand_start,
        size:$scope.hand_size,
    };
    // 挂车普通查询
    $scope.search_hand_truck=function () {
        // 控制分页查询参数
        $scope.hand_queryParams.start = $scope.hand_start;
        $scope.hand_query($scope.hand_queryParams)
    };
    $scope.search_hand_truck();

    // 挂车条件赋值
    $scope.hand_setParams = function(){
        // 挂车控制查询参数逻辑
        if($scope.search_hand_num){
            $scope.hand_queryParams.truckNum = $scope.search_hand_num;
        }else{
            $scope.hand_queryParams.truckNum = null;
        }
        if($scope.search_hand_num_start){
            $scope.hand_queryParams.numberStart = $scope.search_hand_num_start;
        }else {
            $scope.hand_queryParams.numberStart=null;
        }

        if($scope.search_hand_num_end){
            $scope.hand_queryParams.numberEnd = $scope.search_hand_num_end;
        }else {
            $scope.hand_queryParams.numberEnd=null;
        }

        if($scope.search_truck_hand_type){
            $scope.hand_queryParams.operateType = $scope.search_truck_hand_type;
        }else {
            $scope.hand_queryParams.operateType=null;
        }

        if($scope.search_hand_company){
            $scope.hand_queryParams.companyId = $scope.search_hand_company;
        }else {
            $scope.hand_queryParams.companyId=null;
        }

        if($scope.check_operation_hand_startTime){
            $scope.hand_queryParams.licenseDateStart = $scope.check_operation_hand_startTime;
        }else {
            $scope.hand_queryParams.licenseDateStart=null;
        }

        if($scope.check_operation_hand_endTime){
            $scope.hand_queryParams.licenseDateEnd = $scope.check_operation_hand_endTime;
        }else {
            $scope.hand_queryParams.licenseDateEnd=null;
        }
        if($scope.search_checkCar_hand_startTime){
            $scope.hand_queryParams.drivingDateStart = $scope.search_checkCar_hand_startTime;
        }else {
            $scope.hand_queryParams.drivingDateStart=null;
        }
        if($scope.search_checkCar_hand_endTime){
            $scope.hand_queryParams.drivingDateEnd = $scope.search_checkCar_hand_endTime;
        }else {
            $scope.hand_queryParams.drivingDateEnd=null;
        }

    };
    // 挂车搜索事件-条件查询
    $scope.searchHand_car =function(){
        $scope.hand_start = 0;
        $scope.hand_setParams();
        $scope.hand_query($scope.hand_queryParams)
    };
    // 分页
    // 挂车上一页
    $scope.hand_pre_btn = function () {
        $scope.hand_start = $scope.hand_start - ($scope.hand_size - 1);
        $scope.search_hand_truck();
    };
    // 挂车下一页
    $scope.hand_next_btn = function () {
        $scope.hand_start = $scope.hand_start + ($scope.hand_size - 1);
        $scope.search_hand_truck();
    };
    // 修改挂车状态
    $scope.changeTruckTrailer_status=function (id,status) {
        if(status==1){
            status=0
        }else {
            status=1
        }
        _basic.put($host.api_url+"/user/"+userId+"/truck/"+id+"/truckStatus/"+status+"/trailer",{}).then(function (data) {
            if(data.success==true){
                swal("修改成功","","success");
                $scope.search_hand_truck();

            }else {
                swal(data.msg,"","error");
                $scope.search_hand_truck();
            }
        })
    };


}]);