app.controller("entrust_setting_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.start = 0;
    $scope.size = 11;
    $scope.start1 = 0;
    $scope.size1 = 11;
    // 跳转
    $scope.settingEntrust = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.settingEntrust ').addClass("active");
        $("#settingEntrust").addClass("active");
        $("#settingEntrust").show();
    };
    $scope.lookMyselfFile = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.lookMyselfFile ').addClass("active");
        $("#lookMyselfFile").addClass("active");
        $("#lookMyselfFile").show();
    };
    $scope.settingEntrust  ();

    $("#pre").hide();
    $("#next").hide();
    $("#pre1").hide();
    $("#next1").hide();

    // 委托方
    function getEntrust(){
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.get_entrust = data.result;
                $('#client').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $('#getClient').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };
    //查询城市
    function getCity() {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.cityList = data.result;
                $('#startCity1').select2({
                    placeholder: '起始城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#endCity1').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
        });

    }

    function getCarMake(){
        // 车辆品牌
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.get_carMake = data.result;
            }
        });

    }

    $scope.changeClient =function (clientId){
        // 车辆品牌
        _basic.get($host.api_url + "/entrustCityRouteRel?entrustId="+clientId).then(function (data) {
            if (data.success == true) {
                $scope.getCarMakeList = data.result;
            }
        });
    }

  /*  // 获取城市列表
    function getCityList() {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                $scope.cityList = data.result;
                $('#startCity').select2({
                    placeholder: '起始城市',
                    containerCssClass : 'select2_dropdown'
                });
                $('#endCity').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };*/

    //点击查询按钮
    $scope.getEntrustSetting = function (){
        $scope.start = 0;
        getEntrustSetting();
    }

    //获取列表详情
    function getEntrustSetting() {
        var obj = {
                entrustId:$scope.client,
                start:$scope.start.toString(),
                size:$scope.size
        };
        _basic.get($host.api_url + "/entrustRoute?"+ _basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.entrustSettingArray = $scope.boxArray.slice(0, 10);
                if ($scope.start > 0) {
                    $("#pre").show();
                }
                else {
                    $("#pre").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next").hide();
                }
                else {
                    $("#next").show();
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };


    $scope.searchList = function (){
        $scope.start1 = 0;
        searchEntrust();
    };


    function searchEntrust() {
        var obj = {
            entrustId:$scope.getClient,
            makeId:$scope.getCarBrand,
            routeStartId:$scope.startCity1,
            routeEndId:$scope.endCity1,
            start:$scope.start1.toString(),
            size:$scope.size1
        };
        _basic.get($host.api_url + "/entrustCityRouteRel?"+ _basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.boxArray1 = data.result;
                $scope.importedFilesList = $scope.boxArray1.slice(0, 10);
                if ($scope.start1 > 0) {
                    $("#pre1").show();
                }
                else {
                    $("#pre1").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next1").hide();
                }
                else {
                    $("#next1").show();
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 关联品牌模态框
    $scope.entrustMakeRel = function (id) {
        $scope.entrustId=id;
        _basic.get($host.api_url + "/entrustMakeRel?entrustId=" + id).then(function (data) {
            if (data.success == true && data.result.length >= 0) {
                $scope.entrustMakeRelList = data.result;

            }
            else {
                swal(data.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/entrust?entrustId=" + id).then(function (data) {
            if (data.success == true && data.result.length >= 0) {
                $scope.shortName = data.result[0].short_name;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $('#entrustMakeInfoModel').modal('open');

    };

    //添加品牌
    $scope.addChip= function (){
        _basic.post($host.api_url + "/user/" + userId + "/entrustMakeRel", {
            entrustId: $scope.entrustId,
            makeId:$scope.car_brand.id
        }).then(function (data) {
            if (data.success === true) {
                $scope.entrustMakeRel($scope.entrustId);
                swal("新增成功", "", "success");
            }
        });
    }

    //删除品牌
    $scope.deleteChip =function (makeId,entrust){
        swal({
                title: "确定删除此品牌吗？",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定"
        }).then(function (result) {
            if (result.value) {
                _basic.delete($host.api_url + "/user/" + userId + "/entrust/" +entrust+"/make/"+makeId , {}).then(
                    function (data) {
                        if (data.success === true) {
                            swal("删除成功", "", "success");
                            $scope.entrustMakeRel(entrust)
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
            }
        })
    }


    $scope.readData = function (entrust_id,route_start_id,route_end_id,make_id){
        $scope.put_entrust_id = entrust_id;
        $scope.routeStartId =route_start_id;
        $scope.routeEndId =route_end_id;
        $scope.make_id = make_id;
        _basic.get($host.api_url + "/entrustCityRouteRel?entrustId="+entrust_id+'&makeId='+make_id+'&routeStartId='+route_start_id+'&routeEndId='+route_end_id ).then(function (data) {
            if (data.success == true) {
                $scope.putList = data.result[0];
                if($scope.putList.size_type==0) {
                    $scope.putList.size_type = '小'
                }
                else {
                    $scope.putList.size_type = '大'
                }
            }
        });

        $(".modal").modal();
        $("#putItem").modal("open");
    }

    $scope.putItem = function (){
        if($scope.putList.distance!==''&&$scope.putList.fee!==''){
            var obj={
                "distance":$scope.putList.distance,
                "fee": $scope.putList.fee,
                "twoDistance": $scope.putList.two_distance,
                "twoFee":  $scope. putList.two_fee
            }
            _basic.put($host.api_url + "/user/" + userId + "/entrust/"+  $scope.put_entrust_id+'/make/'+ $scope.make_id +"/routeStart/"+  $scope.routeStartId +'/routeEnd/'+   $scope.routeEndId, obj).then(function (data) {
                if (data.success == true) {
                    searchEntrust();
                    $("#putItem").modal("close");
                    swal("修改成功", "", "success");

                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写完整信息", "", "error");
        }
    }

    // 分页
    $scope.previousPage = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getEntrustSetting();
    };
    $scope.nextPage = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getEntrustSetting();
    };

    // 分页
    $scope.previousPage = function () {
        $scope.start1 = $scope.start1 - ($scope.size1-1);
        searchEntrust();
    };
    $scope.nextPage = function () {
        $scope.start1 = $scope.start1 + ($scope.size1-1);
        searchEntrust();
    };
    getEntrust();
    searchEntrust();
    getEntrustSetting();
    getCarMake();
    getCity();
  /*  getCityList();*/

}]);