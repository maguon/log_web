app.controller("setting_settlement_outsourcing_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.hasChosen = false;
    $scope.selectedCityId = 0;
    $scope.startCityList = [];
    $scope.endCityList = [];


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
        getCity();
    };
    $scope.settingEntrust();

    $("#pre").hide();
    $("#next").hide();
    $("#pre1").hide();
    $("#next1").hide();



    function getEntrust(){
        //品牌获取
        _basic.get($host.api_url + "/carMake?").then(function (data) {
            if (data.success == true) {
                $scope.get_carMake = data.result;
            }
        });
    };

    function getCompany(){
        _basic.get($host.api_url + "/company?operateType=2").then(function (companyData) {
            if (companyData.success === true) {
                $scope.companyList = companyData.result;
                $('#companyId').select2({
                    placeholder: '外协公司',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#getClient').select2({
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


    // 获取所有起始城市和结束城市
    function getCityList() {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                $scope.startCityList = data.result;
                for (var i = 0; i < data.result.length; i++) {
                    $scope.startCityList[i].flag=true;
                    var endItem = {
                        id: data.result[i].id,
                        city_name: data.result[i].city_name,
                        dis: "",
                        fee:'',
                        routeId:0,
                        flag: 1
                    };
                    $scope.endCityList.push(endItem);
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };



    $scope.getOutsourcingSetting = function (){
        $scope.start = 0;
        searchOutsourcingSetting();
    }

    function searchOutsourcingSetting(){
        var obj = {
            companyId:$scope.companyId,
            operateType:2,
            start:$scope.start.toString(),
            size:$scope.size
        };

        _basic.get($host.api_url + "/companyRoute?"+ _basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.entrustSettingArray = data.result;
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
    }



    // 点击打开模态框
    $scope.modifyLineInfo = function (lineInfo,flag,ev) {
        if(flag==1){
            ev.stopPropagation();
        }else{
            $scope.endCity = lineInfo.city_name;
            $scope.distance = lineInfo.dis;
            $scope.price = lineInfo.fee;
            $scope.car_type = lineInfo.size_type;
            $scope.modifyFlag = lineInfo.flag;
            $scope.routeId = lineInfo.routeId;
            $scope.endCityId = lineInfo.id;
            if($scope.modifyFlag!==1){
                if($scope.hasChosen){
                    $('#modifyModel').modal('open');
                }
                else{
                    swal("请先选择起始城市！", "", "warning");
                }
            }
            else{
                $('#modifyModel').modal('close');
            }
        }
    };


    // 修改或设置里程数
    $scope.distanceModify = function () {
        if($scope.makeId !== null&&$scope.distance !== null&&$scope.fee !== null){
            _basic.post($host.api_url + "/user/" + userId + '/settleOuterTruck',{
                makeId:$scope.car_brand.id,
                makeName:$scope.car_brand.make_name,
                routeStartId: $scope.selectedCityId,
                routeStart: $scope.startCity,
                routeEndId:$scope.endCityId,
                routeEnd: $scope.endCity,
                distance:$scope.distance,
                fee: $scope.price
            }).then(function (data) {
                if (data.success === true) {
                    swal("操作成功", "", "success");
                    $scope.searchCityLine($scope.startCityList[$scope.startCityIndex],$scope.startCityIndex)
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请输入完整信息！", "", "error");
        }
    }

    $scope.searchList = function (){
        $scope.start1 = 0;
        searchEntrust();
    };


    function searchEntrust() {
        var obj = {
            companyId:$scope.getClient,
            routeStartId:$scope.startCity1,
            routeEndId:$scope.endCity1,
            makeId:$scope.getCarBrand,
            start:$scope.start1.toString(),
            size:$scope.size1
        };
        _basic.get($host.api_url + "/settleOuterTruck?"+ _basic.objToUrl(obj)).then(function (data) {
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



    $scope.readData = function (route_start_id,route_end_id,make_id,company_id){

        $scope.routeStartId =route_start_id;
        $scope.routeEndId =route_end_id;
        $scope.make_id = make_id;
        $scope.company_id=company_id;
        _basic.get($host.api_url + "/settleOuterTruck?makeId="+make_id+'&routeStartId='+route_start_id+'&routeEndId='+route_end_id+'&companyId='+ company_id).then(function (data) {
            if (data.success == true) {
                $scope.putList = data.result[0];
            }
        });

        $(".modal").modal();
        $("#putItem").modal("open");
    }

    $scope.putItem = function (){
        if($scope.putList.distance!==''&&$scope.putList.fee!==''){
            var obj={
                "distance":$scope.putList.distance,
                "fee": $scope.putList.fee
            }
            _basic.put($host.api_url + "/user/" + userId+'/company/'+ $scope.company_id+'/make/'+ $scope.make_id +"/routeStart/"+  $scope.routeStartId +'/routeEnd/'+$scope.routeEndId, obj).then(function (data) {
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
        $scope.start1 = $scope.start1 - ($scope.size1-1);
        searchEntrust();
    };
    $scope.nextPage = function () {
        $scope.start1 = $scope.start1 + ($scope.size1-1);
        searchEntrust();
    };

    getCompany();
    getCityList();
    getEntrust();
    searchEntrust();
    searchOutsourcingSetting();
}])

