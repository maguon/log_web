app.controller("dispatch_order_details_controller", ["$scope", "$host", "$location", "_basic", "$state", "$stateParams", function ($scope, $host, $location, _basic, $state, $stateParams) {
    var val = $stateParams.id;//跳转过来的id
    //用户名
    var userId = _basic.getSession(_basic.USER_ID);



    // 返回上层
    $scope.return = function (){
        if($stateParams.from === "driver_information_details"){
            $state.go($stateParams.from,{
                reload: true,
                driverId: $location.search().driverId,
                from:$stateParams.from
            });
            console.log(($stateParams.from,{from:"dispatch_order_details"}, {
                reload: true,
                driverId: $location.search().driverId
            }))
        }
        else{
            $state.go($stateParams.from,{from:'dispatch_order_details'}, {reload: true})
        }
    };


    /**
     * 获取头部card详情
     * */
    function getHeaderInfo(){
        _basic.get($host.api_url + "/dpRouteTaskList?dpRouteTaskId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.dispatchOrderList = data.result[0];

            } else {
                swal(data.msg, "", "error");
            }
        });
    };


    /*
    * tab跳转*
    * */
    $scope.lookOrderTask = function (){
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookOrderTask').addClass("active");
        $("#lookOrderTask").addClass("active");
        $("#lookOrderTask").show();
        getOrderTaskInfo ();

    };
    $scope.lookOutFee = function (){
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookOutFee').addClass("active");
        $("#lookOutFee").addClass("active");
        $("#lookOutFee").show();
        getOutFeeDetail();
    };
    $scope.lookWashFee = function (){
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookWashFee').addClass("active");
        $("#lookWashFee").addClass("active");
        $("#lookWashFee").show();
        getWashFee();
    };
    $scope.lookRecord = function (){
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookRecord').addClass("active");
        $("#lookRecord").addClass("active");
        $("#lookRecord").show();
        getRecordList ();
    };


    /**
     * 获取装车任务中的数据信息
     * */
    function getOrderTaskInfo (){
        _basic.get($host.api_url + "/dpRouteLoadTask?dpRouteTaskId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.taskList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }


    /**
     * 打开查看装车详情模态框
     * */
    $scope.showOrderTaskModal = function (id){
        $(".modal").modal();
        $("#orderTaskModal").modal("open");
        _basic.get($host.api_url + "/dpRouteLoadTask/" + id+"/dpRouteLoadTaskDetail").then(function (data) {
            if (data.success == true) {
                /*获取列表详情*/
                $scope.taskDetailList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/dpRouteLoadTask?dpRouteLoadTaskId="+id).then(function (data) {
            if (data.success == true) {
                /*获取列表详情*/
                $scope.taskDetailModelList = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        });
    };


    /**
     * 关闭装车详情模态框
     * */
    $scope.closeOrderTaskModal = function () {
        $(".modal").modal();
        $("#orderTaskModal").modal("close");
    }



    $scope.putDataItem= function (){
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTask/"+val+'/dpRouteReverseRemark',{
            remark:$scope.dispatchOrderList.remark
        }).then(function (data) {
            if (data.success === true) {
                swal("修改成功", "", "success");
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }




    /**
     * 获取出车款详情
     * */
    function getOutFeeDetail (){
        _basic.get($host.api_url + "/dpRouteTaskLoan?dpRouteTaskId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.outFeeInfo = data.result[0];
                if(data.result.length==0){
                    $scope.outFeeInfo=undefined;
                    $scope.relateTaskList=[];
                }else{
                    getRelateTask();
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取洗车费
    function washCarFee(){
        $scope.bigPrice =0;
        if(val==''||val==null||val==undefined){
            $scope.responseData=[];
        }else{
            //洗车费
            _basic.get($host.api_url + "/dpRouteLoadTaskCleanRel?dpRouteTaskId=" + val + "&statusArr=1,2").then(function (data) {
                if (data.success === true) {
                    $scope.responseData = data.result;
                    for(i=0;i<$scope.responseData.length;i++){
                        if($scope.responseData[i].actual_price==null){
                            $scope.responseData[i].actual_price=0;
                        }
                        $scope.bigPrice  +=$scope.responseData[i].actual_price+$scope.responseData[i].actual_guard_fee;
                    }

                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }

    /**
     *获取关联的其他调度任务
     * */
    function getRelateTask(){
        _basic.get($host.api_url + "/dpRouteTaskLoanRel?dpRouteTaskLoanId=" + $scope.outFeeInfo.id).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.relateTaskList = data.result;
                for(var i=0;i< data.result.length;i++){
                    if($scope.dispatchOrderList.id==$scope.relateTaskList[i].dp_route_task_id){
                        $scope.relateTaskList.splice(i,1);
                    }
                }
            }else if(data.success == true&&data.result.length==0) {
                $scope.relateTaskList=[];
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }


    /**
     * 获取洗车费
     * */
    function getWashFee (){
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRel?dpRouteTaskId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.washFeeList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }



    /**
     * 获取任務執行记录
     */
    function  getRecordList () {
        _basic.get($host.record_url + "/routeRecord?routeId=" + val).then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.recordList = data.result[0].comment;
            }
        });
    }

    /**
     * 获取数据
     * */
    function getData(){
        getHeaderInfo();
        washCarFee();
        $scope.lookOrderTask();
    }
    getData();
}])