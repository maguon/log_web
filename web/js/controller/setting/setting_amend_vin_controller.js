/**
 * Created by ASUS on 2017/5/17.
 */
app.controller("setting_amend_vin_controller",["$scope","_basic","_config","$host",function ($scope,_basic,_config,$host){
    var admin=_basic.getSession(_basic.USER_ID);

    $(".car_detail").hide();
    $(".no_car_detail").hide();
    // 查询VIN
    $scope.demand_car=function () {
        $scope.start_address = [];
        if($scope.demand_vin.length==17){
            var obj={
                vin:$scope.demand_vin
            };
            _basic.get($host.api_url+"/car?"+_basic.objToUrl(obj)).then(function (data) {
                if(data.success=true){
                    if(data.result.length==0){
                        $(".no_car_detail").show();
                        $(".car_detail").hide();
                    }else {
                        $(".no_car_detail").hide();
                        $(".car_detail").show();
                        $scope.carDetailList=data.result;

                        for(var i = 0;i <  $scope.carDetailList.length;i++){
                            $scope.order_date = moment($scope.carDetailList[i].order_date).format('YYYY-MM-DD');
                            $(".brand_box"+i).attr("display","black");
                            $(".flag_box"+i).attr("display","none");

                          /*  $scope.get_addr($scope.carDetailList[i].route_start_id);*/
                            /*$scope.car_details =  $scope.carDetailList[i];
                            $scope.start_addr = $scope.car_details.base_addr_id;
                            $scope.select_city_start = {id: $scope.car_details.route_start_id, city_name: $scope.car_details.route_start};
                            $scope.select_city_end = {id: $scope.car_details.route_end_id, city_name: $scope.car_details.route_end};
                            $scope.start_city = $scope.select_city_start.id;
                            $scope.arrive_city = $scope.select_city_end.id === null ? "0" : $scope.select_city_end.id;
                            if($scope.car_details.order_date==null){
                                $scope.car_details.order_date ='';
                            }
                            $scope.car_details.order_date = moment($scope.car_details.order_date).format('YYYY-MM-DD');
                            $scope.get_addr($scope.car_details.route_start_id);
                            $scope.vin= $scope.car_details.vin;*/
                        }
                    }
                }
            })
        }
    };
    
    // 打开修改VIN
    $scope.open_vin_amend=function ($index) {
        $(".brand_box"+$index).hide();
        $(".flag_box"+$index).show();
    };
    // 关闭修改VIN
    $scope.close_vin_amend=function ($index) {
        $(".brand_box"+$index).show();
        $(".flag_box"+$index).hide();
    };
    // 修改VIN
    $scope.amend_vin=function (id,$index,vin) {
        if(vin==undefined){
            vin=[];
        }
        var obj={
            "vin":vin
        };
        if(vin.length==17){
            _basic.put($host.api_url+"/user/"+admin+"/car/"+id+"/vin",obj).then(function (data) {
                if(data.success==true){
                    swal("修改成功","","success");
                    $scope.demand_car();
                }else {
                    swal(data.msg,"","error");
                }
            })
        }else {
            swal("请输入17位数字","","error");
            /*$scope.vin=$scope.car_details.vin;*/
        }

        $(".brand_box"+$index).show();
        $(".flag_box"+$index).hide();

    }

    // 城市信息获取
    $scope.get_Msg = function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.get_city = data.result;
                $('#chooseStartCity').select2({
                    containerCssClass: 'select2_dropdown'
                });
                $('#chooseEndCity').select2({
                    containerCssClass: 'select2_dropdown'
                });
            }
        });

        // 车辆品牌查询
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.makecarName = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 经销商
        _basic.get($host.api_url + "/receive").then(function (data) {
            if (data.success == true) {
                $scope.get_receive = data.result;
            }
        });

        // 委托方
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.get_entrust = data.result;
            }
        })

      /*  _basic.get($host.api_url + "/baseAddr").then(function (data) {
            if (data.success == true) {
                $scope.start_address = data.result;
            }
            else {
                swal(data.msg, "", "error")
            }
        })*/
    };
    $scope.get_Msg();

    // 发运地城市地质联动
    $scope.get_addr = function () {
       /* $scope.selectedText = $("#chooseStartCity").find("option:selected").text();*/
        _basic.get($host.api_url + "/baseAddr").then(function (data) {
            if (data.success == true) {
                $scope.start_address = data.result;
            }
            else {
                swal(data.msg, "", "error")
            }
        })
    };

    $scope.get_addr();
    // 修改
    $scope.putDataItem = function (id) {
        // 如果没有选中select或是重置了初始值，则传空字符串
        var arrive_city = $scope.arrive_city == 0 ? "" : $scope.arrive_city;
        var obj = {
            "vin": $scope.vin,
            "makeId": $scope.car_details.make_id,
            "makeName": $("#look_makecarName").find("option:selected").text(),
            "orderDate": $scope.car_details.order_date,
            "remark": $scope.car_details.remark,
            "routeStartId": $scope.start_city,
            "baseAddrId": $scope.start_addr,
            "routeEndId": arrive_city,
            "receiveId": $scope.car_details.receive_id,
            "entrustId": $scope.car_details.entrust_id
        };
        // 修改仓库信息
        _basic.put($host.api_url + "/user/" + admin + "/car/" + id, _basic.removeNullProps(obj)).then(function (data) {
            if (data.success == true) {
                $scope.demand_vin="";
                $(".car_detail").hide();
                swal("修改成功", "", "success");

            }
            else {
                swal(data.msg, "", "error")
            }
        });
    };


    //删除
    $scope.deleteDataItem = function (id) {
        swal({
                title: "确定删除当前车辆吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                _basic.delete($host.api_url + "/user/" + admin + "/car/" + id+'/car').then(function (data) {
                    if (data.success === true) {
                        $scope.demand_car();
                    }
                    else {
                        swal('删除失败', "", "error");
                    }
                });
            }
        );
    };
}]);
