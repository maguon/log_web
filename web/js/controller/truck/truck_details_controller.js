/**
 * Created by ASUS on 2017/7/10.
 */
app.controller("truck_details_controller", ["$scope","$state","$stateParams","_basic", "_config", "$host", function ($scope,$state,$stateParams,_basic, _config, $host) {
    var userId=_basic.getSession(_basic.USER_ID);
    $scope.head_start = 0;
    $scope.head_size = 11;
    $scope.hand_start = 0;
    $scope.hand_size = 11;
    // var search_headAll=function () {
    //     _basic.get($host.api_url+"/truckFirst?truckType=1").then(function (data) {
    //         if(data.success==true){
    //             $scope.head_car=data.result;
    //         }else {
    //             swal(data.msg,"","error")
    //         }
    //     });
    //
    // };
    // 搜索头车
    $scope.search_head_truck=function () {
        var obj={
            truckType: 1,
            start:$scope.head_start,
            size:$scope.head_size,
            truckNum:$scope.search_num,
            operateType:$scope.search_truck_type,
            companyId:$scope.search_company,
            driveName:$scope.search_driver,
            drivingDateStart:$scope.search_checkCar_startTime,
            drivingDateEnd:$scope.search_checkCar_endTime
        };
        _basic.get($host.api_url+"/truckFirst?"+_basic.objToUrl(obj)).then(function (data) {
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
    // 头车数据
    $scope.search_head_truck();
    // 头车条件查询
    $scope.searchHead_car = function () {
        $scope.head_start = 0;
        $scope.search_head_truck();
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

    // 获取公司
    _basic.get($host.api_url+"/company").then(function (data) {
        if(data.success==true){
            $scope.company=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });


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

    // 搜索挂车
    $scope.search_hand_truck=function () {
        var obj={
            truckType:2,
            start:$scope.hand_start,
            size:$scope.hand_size,
            truckNum:$scope.search_hand_num,
            numberStart:$scope.search_hand_num_start,
            numberEnd:$scope.search_hand_num_end,
            operateType:$scope.search_truck_hand_type,
            companyId:$scope.search_hand_company,
            drivingDateStart:$scope.search_checkCar_hand_startTime,
            drivingDateEnd:$scope.search_checkCar_hand_endTime
        };
        _basic.get($host.api_url+"/truckTrailer?"+_basic.objToUrl(obj)).then(function (data) {
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
    // 挂车数据
    $scope.search_hand_truck();
    // 挂车条件查询
    $scope.searchHand_car = function () {
        $scope.hand_start = 0;
        $scope.search_hand_truck();
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