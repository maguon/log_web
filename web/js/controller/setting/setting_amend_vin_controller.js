/**
 * Created by ASUS on 2017/5/17.
 */
app.controller("setting_amend_vin_controller",["$scope","_basic","_config","$host",function ($scope,_basic,_config,$host) {
    var admin = _basic.getSession(_basic.USER_ID);

    $(".car_detail").hide();
    $(".no_car_detail").hide();



    // 查询VIN
    $scope.demand_car = function () {
        $scope.start_address = [];
        if ($scope.demand_vin.length == 17) {
            var obj = {
                vin: $scope.demand_vin
            };
            _basic.get($host.api_url + "/carList?" + _basic.objNewTo2Url(obj)).then(function (data) {
                if (data.success = true) {
                    if (data.result.length == 0) {
                        $(".no_car_detail").show();
                        $(".car_detail").hide();
                    } else {
                        $(".no_car_detail").hide();
                        $(".car_detail").show();
                        $scope.carDetailList = data.result;

                        for (var i = 0; i < $scope.carDetailList.length; i++) {
                            if($scope.carDetailList[i].order_date==null){
                                $scope.carDetailList[i].order_date='';
                            }
                            else{
                                $scope.order_date = moment($scope.carDetailList[i].order_date).format('YYYY-MM-DD');
                            }

                            $(".brand_box" + i).attr("display", "black");
                            $(".flag_box" + i).attr("display", "none");

                        }
                    }
                }
            })
        }
    };

    // 打开修改VIN
    $scope.open_vin_amend = function ($index) {
        $(".brand_box" + $index).hide();
        $(".flag_box" + $index).show();
    };


    // 关闭修改VIN
    $scope.close_vin_amend = function ($index) {
        $(".brand_box" + $index).show();
        $(".flag_box" + $index).hide();
    };



    // 修改VIN
    $scope.amend_vin = function (id, $index, vin) {
        if (vin == undefined) {
            vin = [];
        }
        var obj = {
            "vin": vin
        };
        if (vin.length == 17) {
            _basic.put($host.api_url + "/user/" + admin + "/car/" + id + "/vin", obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    $scope.demand_car();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请输入17位数字", "", "error");
        }

        $(".brand_box" + $index).show();
        $(".flag_box" + $index).hide();

    }


    // 修改
    $scope.putDataItem = function (id) {
        $(".modal").modal();
        $("#putDataItem").modal("open");
        $scope.start_addr ='';
        $scope.start_city='';
        $scope.arrive_city='';
        $scope.start_address =[];
        $scope.put_receive=[];
        _basic.get($host.api_url + "/car?carId="+id).then(function (data) {
            $scope.commodityCarList=data.result[0];
            if($scope.commodityCarList.order_date==null){
                $scope.commodityCarList.order_date ='';
            }
            else {
                $scope.commodityCarList.order_date = moment($scope.commodityCarList.order_date).format('YYYY-MM-DD');
            }
            $scope.start_city = $scope.commodityCarList.route_start_id;
            $scope.arrive_city = $scope.commodityCarList.route_end_id === null ? 0 : $scope.commodityCarList.route_end_id;
            $scope.start_addr = $scope.commodityCarList.base_addr_id;
            $scope.arrive_receive = $scope.commodityCarList.receive_id;
            $scope.get_addr( $scope.start_city,$scope.commodityCarList.addr_name);
            $scope.get_received($scope.arrive_city,$scope.commodityCarList.re_short_name);
        })


    };


    function getCompany(){
        _basic.get($host.api_url + "/company?operateType=2").then(function (companyData) {
            if (companyData.success === true) {
                $scope.companyList = companyData.result;
                $('#company_id').select2({
                    placeholder: '外协公司',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(companyData.msg, "", "error");
            }
        });
    }


    //删除
    $scope.deleteDataItem = function (id) {
        swal({
            title: "确定删除当前车辆吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
                _basic.delete($host.api_url + "/user/" + admin + "/car/" + id + '/car').then(function (data) {
                    if (data.success === true) {
                        $scope.demand_car();
                    }
                    else {
                        swal('删除失败', "", "error");
                    }
                });
            }
        })
    }



    // 修改
    $scope.putBankNumber = function (id) {
        $scope.putDataItemId = id;
        if($scope.start_city==0||$scope.start_city==''||
            $scope.start_addr==0||$scope.start_addr==''||
            $scope.start_addr==undefined
        ||$scope.arrive_receive==null||$scope.commodityCarList.order_date==''
        ||$scope.arrive_city==0||$scope.arrive_city==''){
            swal('请填写完整信息！',"","error")
        }
        else{
            _basic.get($host.api_url +'/city?cityId='+$scope.start_city).then(function (data) {
                if (data.success == true) {
                    $scope.putStartCity=data.result[0].city_name;
                }
                else {
                    swal(data.msg, "", "error")
                }
            });
            _basic.get($host.api_url +'/city?cityId='+$scope.arrive_city).then(function (data) {
                if (data.success == true) {
                    $scope.putArriveCity=data.result[0].city_name;
                    putSingleData();
                }
                else {
                    swal(data.msg, "", "error")
                }
            });
        };
    };


    function putSingleData(){
        if($scope.commodityCarList.company_id==null||$scope.commodityCarList.company_id==0){
            $scope.commodityCarList.company_id=0;
        }
        var obj = {
            "makeId": $scope.commodityCarList.make_id,
            "makeName": $("#look_makecarName").find("option:selected").text(),
            "orderDate": $scope.commodityCarList.order_date,
            "remark": $scope.commodityCarList.remark,
            "routeStartId": $scope.start_city,
            "routeStart":$scope.putStartCity,
            "baseAddrId": $scope.start_addr,
            "routeEndId": $scope.arrive_city,
            "routeEnd":$scope.putArriveCity,
            "receiveId": $scope.arrive_receive,
            "entrustId": $scope.commodityCarList.entrust_id,
            "companyId":$scope.commodityCarList.company_id
        };
        // 修改仓库信息
        _basic.put($host.api_url + "/user/" + admin + "/car/" +  $scope.putDataItemId+'/completedCar', _basic.removeProps(obj)).then(function (data) {
            if (data.success == true) {
                $('#putDataItem').modal('close');
                swal("修改成功", "", "success");
                $scope.demand_car();

            }
            else {
                swal(data.msg, "", "error")
            }
        });
    }











    // 信息获取
    $scope.get_Msg = function () {
        // 委托方
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.get_entrust = data.result;
            }
        })

        // 车辆品牌增加
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.get_carMake = data.result;
            }
        });

        // 车辆品牌修改查询
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.makecarName = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };



    function getCityEvery(){
        // 城市
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

    }
    $scope.get_Msg();
    getCityEvery();
    getCompany();

    // 目的地城市-经销商联动
    $scope.get_received = function (id,text) {
        if(id==0){
            $scope.put_receive=[];
            $('#dealer1').select2({
                placeholder: '经销商',
                containerCssClass: 'select2_dropdown'
            });
        }
        else{
            if(text==null||text==undefined){
                _basic.get($host.api_url + "/receive?cityId=" + id).then(function (data) {
                    if (data.success == true) {
                        $scope.put_receive = data.result;
                        $('#dealer1').select2({
                            placeholder: '经销商',
                            containerCssClass: 'select2_dropdown'
                        });

                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            }
            else{
                _basic.get($host.api_url + "/receive?cityId=" + id).then(function (data) {
                    if (data.success == true) {
                        $scope.put_receive = data.result;
                        $('#dealer1').select2({
                            placeholder: text,
                            containerCssClass: 'select2_dropdown'
                        });

                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            }
        }


    };


    // 发运地城市--地址联动
    $scope.start_city_change = function (val) {
        _basic.get($host.api_url + "/baseAddr?cityId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.baseAddr = data.result;
            }
        })
    };


    // 发运地城市地质联动
    $scope.get_addr = function (id,text) {
        if(text==null||text==undefined){
            _basic.get($host.api_url + "/baseAddr?cityId=" + id).then(function (data) {
                if (data.success == true) {
                    $scope.start_address = data.result;
                    $('#start_addr').select2({
                        placeholder: '发运地名称',
                        containerCssClass: 'select2_dropdown'
                    });
                }
                else {
                    swal(data.msg, "", "error")
                }
            })
        }
        else{
            _basic.get($host.api_url + "/baseAddr?cityId=" + id).then(function (data) {
                if (data.success == true) {
                    $scope.start_address = data.result;
                    $('#start_addr').select2({
                        placeholder: text,
                        containerCssClass: 'select2_dropdown'
                    });
                }
                else {
                    swal(data.msg, "", "error")
                }
            })
        }
    };




}])