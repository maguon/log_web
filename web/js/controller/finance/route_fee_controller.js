
/**
 * 主菜单：财务管理 -> 出车款 控制器
 */

app.controller("route_fee_controller", ["$scope", "$state","$stateParams", "$host", "_basic",  "_config",function ($scope, $state,$stateParams, $host, _basic,_config) {
    var userId = _basic.getSession(_basic.USER_ID);
        $scope.start = 0;
        $scope.size = 26;

        // 领取状态 默认为未发放
        $scope.getStatus = "1";


    // 初始化复选金额
    $scope.initial={
        selectedIdsArr:[],
        checkOilFee:0,
        checkedTotalPrice:0,
        checkedParkingFee:0,
        checkedOtherFee:0
    }



    //通过
        $scope.carHave = function(id){
            swal({
                title: "确定领取吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
            }).then(
                function(result){
                    if (result.value) {
                        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskFee/" + id + "/status/2", {}).then(function (data) {
                            if (data.success === true) {
                                searchCost()
                            }
                            else {
                                swal(data.msg, "", "error");
                            }
                        });
                    }
                });
        }

        //拒绝
        $scope.carNotHave = function(id){
            swal({
                title: "确定驳回吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
            }).then(
                function(result){
                    if (result.value) {
                        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskFee/" + id + "/status/0", {}).then(function (data) {
                            if (data.success === true) {
                                searchCost();
                            }
                            else {
                                swal(data.msg, "", "error");
                            }
                        });
                    }
                });

        }


        //司机
        function getDriveNameList () {
            _basic.get($host.api_url + "/drive?").then(function (data) {
                if (data.success == true) {
                    $scope.driveNameList = data.result;
                    $('#driveName').select2({
                        placeholder: '司机',
                        containerCssClass : 'select2_dropdown'
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        };

        //获取货车牌号
        function getTruckNum() {
            _basic.get($host.api_url + "/truckBase?truckType=1").then(function (data) {
                if (data.success === true) {
                    $scope.truckNumListAllList = data.result;
                    $('#truckNum').select2({
                        placeholder: '货车牌号',
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }


        //查询
        $scope.getCost = function () {
            $scope.start = 0;
            searchCost();
        }

        // 根据条件搜索
        function searchCost() {
            _basic.get($host.api_url+ '/dpRouteTaskFee?' + _basic.objToUrl({
                driveId: $scope.drivderId,
                dpRouteTaskId:$scope.dispatchId,
                truckId: $scope.truckNum,
                createdOnStart:$scope.instruct_starTime,
                createdOnEnd:$scope.instruct_endTime,
                grantDateStart:$scope.grant_start_time,
                grantDateEnd:$scope.grant_end_time,
                status:$scope.getStatus,
                start:$scope.start,
                size:$scope.size
            })).then(function (data) {
                if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.costList = $scope.boxArray.slice(0, 25);
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

            _basic.get($host.api_url+ '/dpRouteTaskFeeCount?' + _basic.objToUrl({
                driveId: $scope.drivderId,
                truckId: $scope.truckNum,
                createdOnStart:$scope.instruct_starTime,
                dpRouteTaskId:$scope.dispatchId,
                createdOnEnd:$scope.instruct_endTime,
                status:$scope.getStatus,
                grantDateStart:$scope.grant_start_time,
                grantDateEnd:$scope.grant_end_time
            })).then(function (data) {
                if (data.success === true) {
                    $scope.boxArrayFee = data.result[0];
                }

            })

        };

        $scope.export = function (){
            // 基本检索URL
            var url = $host.api_url + "/dpRouteTaskFee.csv?" ;
            // 检索条件
            var conditionsObj = {
                driveId: $scope.drivderId,
                truckId: $scope.truckNum,
                createdOnStart:$scope.instruct_starTime,
                createdOnEnd:$scope.instruct_endTime,
                grantDateStart:$scope.grant_start_time,
                grantDateEnd:$scope.grant_end_time,
                dpRouteTaskId:$scope.dispatchId,
                status:$scope.getStatus
            };
            var conditions = _basic.objToUrl(conditionsObj);
            // 检索URL
            url = conditions.length > 0 ? url + "&" + conditions : url;
            window.open(url);
        }









    /*
    *
    * 全选
    * */
    $scope.selectAllCheckBox = function (event) {

        //本页全部选中
        if (event.target.checked) {
            $("[name = 'select']").prop('checked', true);
            for (var i = 0; i < $scope.costList.length; i++) {
                $scope.initial.selectedIdsArr.push($scope.costList[i].id);
                $scope.initial.checkOilFee+= $scope.costList[i].car_oil_fee;
                $scope.initial.checkedTotalPrice+= $scope.costList[i].car_total_price;
                $scope.initial.checkedParkingFee+= $scope.costList[i].total_price;
                $scope.initial.checkedOtherFee+= $scope.costList[i].other_fee;

            }
        }

        //本页全不选
        else {

            //初始化
            $scope.initial={
                selectedIdsArr:[],
                checkOilFee:0,
                checkedTotalPrice:0,
                checkedParkingFee:0,
                checkedOtherFee:0
            }

            //checkbox 为空
            $("[name = 'select']").prop('checked', false);

        }
    };



    /*
    * 检测所有分选按钮是否被选中
    * */
    $scope.checkIsAllSel = function () {
        var selectAll = false;
        $("[name = 'select']").each(function () {
            if(!$(this).is(':checked')){
                selectAll = true;
            }
        });

        // 如果全部checkBox被选中，则改变全选按钮状态
        if(selectAll){
            $("[name = 'selectAll']").prop('checked' , false);
        }
        else{
            $("[name = 'selectAll']").prop('checked' , true);
        }
    };



    /*
    * 点击单个按钮
    * */
    $scope.checkSelMission = function (event, car, index) {
        var currentSel = event.target;

        //选中  添加金额
        if(currentSel.checked){
            $scope.initial.selectedIdsArr.push(car.id);
            $scope.initial.checkOilFee+= car.car_oil_fee;
            $scope.initial.checkedTotalPrice+= car.car_total_price;
            $scope.initial.checkedParkingFee+= car.total_price;
            $scope.initial.checkedOtherFee+= car.other_fee;
        }


        //未选中  删除金额
        else{
            // 获取取消选中的checkbox在id数组中的下标
            var noSelIndex = $scope.initial.selectedIdsArr.indexOf(car.id);
            $scope.initial.selectedIdsArr.splice(noSelIndex, 1);
            $scope.initial.checkOilFee-= car.car_oil_fee;
            $scope.initial.checkedTotalPrice-= car.car_total_price;
            $scope.initial.checkedParkingFee-= car.total_price;
            $scope.initial.checkedOtherFee-=car.other_fee;

        }
    };



    /*
    *
    * 点击批量按钮
    * */
    $scope.batchDeal = function (){
        $(".modal").modal();
        $("#openBatchDeal").modal("open");
    }



    /*
    *
    *  确定批量
    * */
    $scope.createList = function (){
        if($scope.initial.selectedIdsArr.length==0){
            $("#openBatchDeal").modal("close");
            swal('请至少选择一条数据', "", "error");

        }
        else {
            _basic.put($host.api_url + "/user/" + userId + "/status/2/dpRouteTaskFeeStatusAll", {
                "dpRouteTaskFeeIds": $scope.initial.selectedIdsArr
            }).then(function (data) {
                if (data.success === true) {
                    //初始化
                    $scope.initial={
                        selectedIdsArr:[],
                        checkOilFee:0,
                        checkedTotalPrice:0,
                        checkedParkingFee:0,
                        checkedOtherFee:0
                    };
                    $("[name = 'selectAll']").prop('checked', false);
                    $("#openBatchDeal").modal("close");
                    swal("批量成功", "", "success");
                    searchCost();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }






    /*
    * 点击查看详情
    * */
    $scope.getDetail = function (id){
        _basic.get($host.api_url + "/dpRouteTaskFee?dpRouteTaskFeeId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.showList = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
        $(".modal").modal();
        $("#openDetailModal").modal("open");
    }









    // 分页
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        searchCost();
    };

    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        searchCost();
    };



        getDriveNameList ();
        getTruckNum();
        searchCost();
}]);