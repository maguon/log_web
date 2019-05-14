app.controller("look_hand_detail_controller", ["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {
  var userId=_basic.getSession(_basic.USER_ID);
        var id=$stateParams.id;
        var head_car_msg=[];
        $scope.show_unbind_head_btn=false;
        $scope.no_service_img=false;
        $scope.no_drive_img=false;
        $scope.return=function () {
            $state.go($stateParams.from,{from:'look_hand_detail'},{reload:true})
        };
        var viewer;

        // 所属类型--公司联动

            _basic.get($host.api_url+"/company?operateType=2").then(function (data) {
                if(data.success==true){
                    $scope.company=data.result;
                }else {
                    swal(data.msg,"","error")
                }
            });


        function truck_msg() {
            var p =new Promise(function (resolve, reject) {
                resolve();

            });
            return p
        }
        function truck_details() {
            var p =new Promise(function (resolve, reject) {
                resolve();

            });
            return p
        }
        truck_msg().then(function () {
            // 获取品牌
            _basic.get($host.api_url+"/brand").then(function (data) {
                if(data.success==true){
                    $scope.brand=data.result;
                }else {
                    swal(data.msg,"","error")
                }
            });

            // 获取车头
            _basic.get($host.api_url+"/truckFirst?truckType=1&operateType=2").then(function (data) {
                if(data.success==true){
                    $scope.head_car_msg=data.result;
                    head_car_msg=data.result;

                }else {
                    swal(data.msg,"","error")
                }
            });
            return truck_details()
        }).then(function () {
            // 挂车详情
            _basic.get($host.api_url + "/truckTrailer?truckId=" + id).then(function (data) {
                if (data.success == true) {
                    $scope.truckTrailer = data.result[0];
                    $scope.truck_id = $scope.truckTrailer.truck_num;
                    $scope.Binding_head_truck = $scope.truckTrailer.first_num;
                    if ($scope.Binding_head_truck != null && $scope.Binding_head_truck != "") {
                        $scope.show_unbind_head_btn = true;
                    }
                    $scope.Binding_head_truck_check();
                } else {
                    swal(data.msg, "", "error");
                }
            });
        })

        // 修改挂车
        $scope.submit_Form=function (inValid) {
            $scope.submitted=true;
            var obj={
                "truckNum":$scope.truckTrailer.truck_num,
                "truckType":2,
                operateType:2,
                companyId:0,
                "number":$scope.truckTrailer.number,
                "remark":$scope.truckTrailer.remark
            };
            if(inValid){
                _basic.put($host.api_url+"/user/"+userId+"/truck/"+id,obj).then(function (data) {
                    if(data.success==true){
                        swal("修改成功","","success")
                    }else {
                        swal(data.msg,"","error")
                    }
                });
            }

        };


        // 头车过滤
        $scope.Binding_head_truck_check=function () {
            if($scope.Binding_head_truck!=null&&$scope.Binding_head_truck!=""){
                $scope.head_car_msg=[];
                head_car_msg.forEach(function (i) {
                    if(i.truck_num.indexOf($scope.Binding_head_truck)!=-1){
                        if($scope.head_car_msg.indexOf(i)==-1){
                            $scope.head_car_msg.push(i)
                        }

                    }
                })
            }else {
                $scope.head_car_msg=head_car_msg;
            }

        };
        $scope.clear_head_truck=function () {
            $scope.check_head_car_id="";
        };
        $scope.check_head_truck=function (id,num) {
            $scope.check_head_car_id=id;
            $scope.Binding_head_truck=num;
        };
        // 绑定头车
        $scope.Binding_head_car_submit=function () {
            if($scope.check_head_car_id){
                _basic.put($host.api_url+"/user/"+userId+"/truck/"+$scope.check_head_car_id+"/trail/"+id+"/bind",{}).then(function (data) {
                    if(data.success==true){
                        swal("绑定成功","","success");
                        truck_msg().then(function () {
                            // 获取车头
                            _basic.get($host.api_url+"/truckFirst?truckType=1&operateType=2").then(function (data) {
                                if(data.success==true){
                                    $scope.head_car_msg=data.result;
                                    head_car_msg=data.result;

                                }else {
                                    swal(data.msg,"","error")
                                }
                            });
                            return truck_details()
                        }).then(function () {
                            // 挂车详情
                            _basic.get($host.api_url+"/truckTrailer?truckId="+id).then(function (data) {
                                if(data.success==true){
                                    $scope.truckTrailer=data.result[0];
                                    $scope.truck_id=$scope.truckTrailer.truck_num;
                                    $scope.hand_truck_img($scope.truck_id);
                                    $scope.getCompany();
                                    $scope.Binding_head_truck=$scope.truckTrailer.first_num;
                                    if($scope.Binding_head_truck!=null&&$scope.Binding_head_truck!=""){
                                        $scope.show_unbind_head_btn=true;
                                    }
                                    $scope.Binding_head_truck_check();
                                }else {
                                    swal("请求异常","","error");
                                }
                            });
                        });
                    }else {
                        swal(data.msg,"","error")
                    }
                })
            }else {

            }
        };
        // 解绑头车
        $scope.unbind_head_truck=function () {
            _basic.put($host.api_url+"/user/"+userId+"/truck/"+$scope.truckTrailer.first_id+"/trail/"+id+"/unbind",{}).then(function (data) {
                if(data.success==true){
                    swal("解绑成功","","success");
                    $scope.show_unbind_head_btn=false;
                    // 获取车头
                    _basic.get($host.api_url+"/truckTrailer?truckType=1&operateType=2").then(function (data) {
                        if(data.success==true){
                            $scope.head_car_msg=data.result;
                            head_car_msg=data.result;

                        }else {
                            swal(data.msg,"","error")
                        }
                    });

                }else {
                    swal(data.msg,"","error")
                }
            });
        };


        $scope.add_guarantee=function () {
            $('.modal').modal();
            $('#add_guarantee').modal('open');
        }

}]);