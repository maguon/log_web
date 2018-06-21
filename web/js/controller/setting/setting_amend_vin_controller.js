/**
 * Created by ASUS on 2017/5/17.
 */
app.controller("setting_amend_vin_controller",["$scope","_basic","_config","$host",function ($scope,_basic,_config,$host){
    var admin=_basic.getSession(_basic.USER_ID);
    $scope.flag=true;
    // 查询VIN
    $scope.demand_car=function () {
        $scope.start_address = [];
        $scope.car_details.route_start_id='';
        if($scope.demand_vin.length==17){
            var obj={
                vin:$scope.demand_vin,
                active:1
            };
            _basic.get($host.api_url+"/car?"+_basic.objToUrl(obj)).then(function (data) {
                if(data.success=true){
                    if(data.result.length==0){
                        $(".no_car_detail").show();
                        $(".car_detail").hide();
                    }else {
                        $(".no_car_detail").hide();
                        $(".car_detail").show();
                        $scope.car_details=data.result[0];
                        $scope.start_addr = $scope.car_details.base_addr_id;
                        $scope.select_city_start = {id: $scope.car_details.route_start_id, city_name: $scope.car_details.route_start};
                        $scope.select_city_end = {id: $scope.car_details.route_end_id, city_name: $scope.car_details.route_end};
                        $scope.start_city = $scope.select_city_start.id;
                        $scope.arrive_city = $scope.select_city_end.id === null ? "0" : $scope.select_city_end.id;
                        if($scope.car_details.order_date==null){
                            $scope.car_details.order_date ='';
                        }
                        $scope.car_details.order_date = moment($scope.car_details.order_date).format('YYYY-MM-DD');
                        $scope.get_addr($scope.car_details.route_start_id)
                        $scope.vin= $scope.car_details.vin;
                    }
                }
            })
        }
    };
    
    // 打开修改VIN
    $scope.open_vin_amend=function () {
        $scope.flag=false;
    };
    // 关闭修改VIN
    $scope.close_vin_amend=function () {
        $scope.flag=true;
        $scope.vin=$scope.car_details.vin;
    };
    // 修改VIN
    $scope.amend_vin=function (id) {
        $scope.flag=true;
        var obj={
            "vin":$scope.vin
        };
        if($scope.vin.length==17){
            _basic.put($host.api_url+"/user/"+admin+"/car/"+id+"/vin",obj).then(function (data) {
                if(data.success==true){
                    swal("修改成功","","success");
                    $scope.demand_vin="";
                }else {
                    swal(data.msg,"","error");
                }
            })
        }else {
            swal("请输入17位数字","","error");
            $scope.vin=$scope.car_details.vin;
        }
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
    };
    $scope.get_Msg();

    // 发运地城市地质联动
    $scope.get_addr = function (id) {
        $scope.selectedText = $("#chooseStartCity").find("option:selected").text();
        _basic.get($host.api_url + "/baseAddr?cityId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.start_address = data.result;
            }
            else {
                swal(data.msg, "", "error")
            }
        })
    };
    

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
}]);
