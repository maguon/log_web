/**
 * Created by star on 2018/6/12.
 */
app.controller("driver_exceedOil_controller", ["$scope", "$state", "_basic", "_config", "$host", function ($scope, $state, _basic, _config, $host) {
    $scope.start = 0;
    $scope.size = 11;
    var userId = _basic.getSession(_basic.USER_ID);
    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#driver').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //查询功能
    $scope.getExceedOil = function (){
        $scope.start = 0;
        getExceedOilData();
    }

    //获取查询数据
    function getExceedOilData(){
        _basic.get($host.api_url + "/driveExceedOil?" + _basic.objToUrl({
            driveId:$scope.driverId,
            dpRouteTaskId:$scope.dispatchId,
            taskPlanDateStart:$scope.driveStartTime,
            taskPlanDateEnd:$scope.driveEndTime,
            fineStatus:$scope.ExceedOilStu,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.ExceedOilList = $scope.boxArray.slice(0, 10);
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
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    // 数据导出
    $scope.export = function () {
        var obj = {
            driveId:$scope.driverId,
            dpRouteTaskId:$scope.dispatchId,
            taskPlanDateStart:$scope.driveStartTime,
            taskPlanDateEnd:$scope.driveEndTime,
            fineStatus:$scope.ExceedOilStu
        };
        window.open($host.api_url + "/driveExceedOil.csv?" + _basic.objToUrl(obj));
    };

    //打开新增模态框
    $scope.addExceedOil = function (){
        $scope.addExceedOilDispatch = '';
        $scope.addExceedOilDriver = '';
        $scope.addTruckNum = '';
        $scope.addTime = '';
        $scope.addExceedOilScore = '';
        $scope.addExceedOilMoney = '';
        $scope.newRemark = '';
        $('#addExceedOilItem').modal('open');
    }

    //添加調度编号联动查询
    $scope.changeExceedOilDispatch =function (dispacthId) {
        _basic.get($host.api_url + "/dpRouteTask?dpRouteTaskId=" + dispacthId).then(function (detailsData) {
            if (detailsData.success === true) {
                if(detailsData.result.length==0){
                    $scope.addExceedOilDriver = "";
                    $scope.addTruckNum = "";
                    $scope.addTime = "";
                }
                else{
                    $scope.addExceedOilDriver = detailsData.result[0].drive_name;
                    $scope.addTruckNum = detailsData.result[0].truck_num;
                    $scope.addTime = moment(detailsData.result[0].task_plan_date).format('YYYY-MM-DD');
                }
            }
            else {
                swal(detailsData.msg, "", "error");
            }
        })
    }

    //修改調度编号联动查询
    $scope.changePutExceedOilDispatch = function (dispacthId){
        _basic.get($host.api_url + "/dpRouteTask?dpRouteTaskId=" + dispacthId).then(function (detailsData) {
            if (detailsData.success === true) {
                if(detailsData.result.length==0){
                    $scope.putExceedOilList.drive_name = "";
                    $scope.putExceedOilList.truck_num = "";
                    $scope.putExceedOilList.task_plan_date = "";
                }
                else{
                    $scope.putExceedOilList.drive_name = detailsData.result[0].drive_name;
                    $scope.putExceedOilList.truck_num  = detailsData.result[0].truck_num;
                    $scope.putExceedOilList.task_plan_date = moment(detailsData.result[0].task_plan_date).format('YYYY-MM-DD');
                }
            }
            else {
                swal(detailsData.msg, "", "error");
            }
        })
    }

    //点击确定 增加完成
    $scope.addExceedOilItem = function (){
        if ($scope.addExceedOilDispatch !== '' && $scope.addExceedOilScore !== '' && $scope.addExceedOilMoney !== '') {
            _basic.post($host.api_url + "/user/" + userId + "/driveExceedOil", {
                dpRouteTaskId:  $scope.addExceedOilDispatch,
                exceedOilQuantity: $scope.addExceedOilScore,
                exceedOilMoney: $scope.addExceedOilMoney,
                remark: $scope.newRemark
            }).then(function (data) {
                if (data.success === true) {
                    $('#addExceedOilItem').modal('close');
                    swal("新增成功", "", "success");
                    getExceedOilData();
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写完整信息！", "", "warning");
        }
    }


    //打开修改模态框
    $scope.putExceedOil = function (id){
        $scope.id = id;
        $scope.driveList =[];
        $('#putExceedOilItem').modal('open');
        _basic.get($host.api_url + "/driveExceedOil?exceedOilId=" +id).then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.putExceedOilList = [];
                }
                else{
                    $scope.putExceedOilList = data.result[0];
                    $scope.putExceedOilList.task_plan_date = moment(data.result[0].task_plan_date).format('YYYY-MM-DD');
                }
            }
        })
    }


    //点击确定 修改完成
    $scope.putExceedOilItem = function (){
        if (  $scope.putExceedOilList.dp_route_task_id !== '' && $scope.putExceedOilList.exceed_oil_quantity !== ''
            && $scope.putExceedOilList.exceed_oil_money !== '') {
            _basic.put($host.api_url + "/user/" + userId + "/exceedOil/"+$scope.id, {
                dpRouteTaskId: $scope.putExceedOilList.dp_route_task_id,
                exceedOilQuantity:$scope.putExceedOilList.exceed_oil_quantity,
                exceedOilMoney: $scope.putExceedOilList.exceed_oil_money,
                remark: $scope.putExceedOilList.remark
            }).then(function (data) {
                if (data.success === true) {
                    swal("修改成功", "", "success");
                    $('#putExceedOilItem').modal('close');
                    getExceedOilData();
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写完整信息！", "", "warning");
        }
    }

    $scope.putExceedOilItem2 = function (){
        $('#putExceedOilItem').modal('close');
    }

    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getSettlementData();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getSettlementData();
    };

    //获取数据
    function queryData() {
        getDriveNameList();
        getExceedOilData();
    }
    queryData();
}])