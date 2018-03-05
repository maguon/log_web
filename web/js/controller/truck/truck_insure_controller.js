app.controller("truck_insure_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    $scope.size = 10;
    $scope.start = 0;
    var userId = _basic.getSession(_basic.USER_ID);
    // 获取所有保险公司
    function getInsuranceCompany() {
        _basic.get($host.api_url + "/truckInsure").then(function (data) {
            if (data.success === true) {
                $scope.insureNameList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    //获取经办人
    function getTruckNumList(){
        _basic.get($host.api_url + "/admin/"+userId).then(function (data) {
            if (data.success === true) {
                $scope.insureUserNameList = data.result;
                $scope.insureUserNameList.real_name = data.result[0].real_name+"";
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    //获取所有货车牌号
    function insureUserName (){
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAll = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    // 数据导出
    $scope.export = function () {
        var obj = {
            relId:$scope.InsureNum,
            insureId:$scope.truckInsureName,
            insureType:$scope.truckInsureType,
            insureUserId:$scope.insureUserName,
            truckNum:$scope.truckNum,
            truckType:$scope.truckType,
            endDateStart:$scope.startTime_start,
            endDateEnd:$scope.startTime_end
        };
        window.open($host.api_url + "/truckInsureRel.csv?" + _basic.objToUrl(obj));
    };
    // 获取筛选列表
    function getTruckInsureList () {
        _basic.get($host.api_url + "/truckInsureRel?" + _basic.objToUrl({
            relId:$scope.InsureNum,
            insureId:$scope.truckInsureName,
            insureType:$scope.truckInsureType,
            insureUserId:$scope.insureUserName,
            truckNum:$scope.truckNum,
            truckType:$scope.truckType,
            endDateStart:$scope.startTime_start,
            endDateEnd:$scope.startTime_end,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
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
                $scope.truckInsureList = data.result;
                for(var i = 0; i < $scope.truckInsureList.length; i++) {
                    var endDate = new Date( $scope.truckInsureList[i].end_date).getTime();
                    var nowDate = new Date().getTime();
                    if(endDate - nowDate < (1000 * 60 * 60 * 24*30)&&(nowDate - endDate)<0){
                        $scope.truckInsureList[i].expiredStatus =0;
                    }else if(nowDate - endDate > 0){
                        $scope.truckInsureList[i].expiredStatus =1;
                    } else{
                        $scope.truckInsureList[i].expiredStatus =2;
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 点击搜索
    $scope.searchTruckInsure = function () {
        $scope.start=0;
        getTruckInsureList();
    };
    //添加
    $scope.addTruckInsure=function () {
        $('.modal').modal();
        $('#addTruckInsure').modal('open');
    }
    $scope.submitTruckInsure=function() {
        if ($scope.addSystemType !== undefined && $scope.addtruckInsureName !== undefined && $scope.addtruckInsureType!== undefined &&
            $scope.addInsureNum!== undefined&&$scope.addinsureMoney!== undefined&&$scope.time_start!== undefined&& $scope.time_end!== undefined) {
            _basic.post($host.api_url + "/user/" + userId + "/truckInsureRel/", {
                truckId: $scope.addSystemType,
                insureId:$scope.addtruckInsureName,
                insureType: $scope.addtruckInsureType,
                insureNum: $scope.addInsureNum,
                insureMoney: $scope.addinsureMoney,
                startDate: $scope.time_start,
                endDate: $scope.time_end,
                insureExplain: $scope.addInsureExplain
            }).then(function (data) {
                if (data.success == true) {
                    swal("新增成功", "", "success");
                    $('#addTruckInsure').modal('close');
                    $scope.searchTruckInsure();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    }
    //查看详情
    $scope.showTruckInsure=function (id) {
        $('.modal').modal();
        $('#showTruckInsure').modal('open');
        _basic.get($host.api_url + "/truckInsureRel?relId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.showTruckInsureList = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    }
    //修改
    $scope.submitShowTruckInsure = function (id) {
        if($scope.showTruckInsureList.truck_id!== "" &&$scope.showTruckInsureList.insure_id!==""
            &&$scope.showTruckInsureList.insure_type!== ""&& $scope.showTruckInsureList.id!== ""
            &&$scope.showTruckInsureList.insure_money!== "" &&$scope.showTruckInsureList.start_date!== "" &&$scope.showTruckInsureList.end_date!== ""){
            var obj = {
             truckId:  $scope.showTruckInsureList.truck_id,
             insureId:  $scope.showTruckInsureList.insure_id,
             insureType: $scope.showTruckInsureList.insure_type,
             insureNum:  $scope.showTruckInsureList.insure_num,
             insureMoney:  $scope.showTruckInsureList.insure_money,
             startDate:  $scope.showTruckInsureList.start_date,
             endDate: $scope.showTruckInsureList.end_date,
             insureExplain: $scope.showTruckInsureList.insure_explain
            };
            _basic.put($host.api_url + "/user/" + userId+"/truckInsureRel/" +id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    $('#showTruckInsure').modal('close');
                    getTruckInsureList ();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    };
    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - $scope.size;
        getTruckInsureList();
    };
    $scope.next_page = function () {
        $scope.start = $scope.start + $scope.size;
        getTruckInsureList();
    };
    // 获取数据
    function queryData () {
        getInsuranceCompany();
        insureUserName();
        getTruckNumList();
        $scope.searchTruckInsure();
    };
    queryData();
}])