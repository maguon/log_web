app.controller("putData_controller",["$scope", "$rootScope","$state","$stateParams", "$host", "_config","_basic", function ($scope,$rootScope,$state,$stateParams,  $host,_config, _basic) {
    $scope.start = 0;
    $scope.size = 11;
    $("#pre").hide();
    $("#next").hide();
    var userId = _basic.getSession(_basic.USER_ID);

    // 跳转
    $scope.putTask = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.putTask').addClass("active");
        $("#putTask").addClass("active");
        $("#putTask").show();
    };
    $scope.putTask();
    /**
     * 点击查询按钮
     * */
    $scope.getOrderInfo = function (){
        $scope.start = 0;
        seachOrderInfo();
    }
    /**
     * 查询列表
     * */
    function seachOrderInfo(){
        var url = $host.api_url + "/dpRouteTaskList?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objNewToUrl(conditionsObj);
        if($scope.dispatchId==undefined||$scope.dispatchId==''){
            $scope.dispatchOrderArray=[];
        }
        else {
            // 检索URL
            url = conditions.length > 0 ? url + "&" + conditions : url;

            _basic.get(url).then(function (data) {

                if (data.success == true) {

                    // 当前画面的检索信息
                    var pageItems = {
                        pageId: "putData",
                        start: $scope.start,
                        size: $scope.size,
                        conditions: conditionsObj
                    };
                    // 将当前画面的条件
                    $rootScope.refObj = {pageArray: []};
                    $rootScope.refObj.pageArray.push(pageItems);
                    $scope.dispatchOrderBoxArray = data.result;
                    $scope.dispatchOrderArray = $scope.dispatchOrderBoxArray.slice(0, 10);
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

    };


    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.dispatchId=conditions.dpRouteTaskId;

    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            dpRouteTaskId: $scope.dispatchId,
            taskStatus:10
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件

        if ($rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "putData") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);


            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }
        // 查询数据
        seachOrderInfo();
    }
    initData();


    /*
  * 修改结算
  * */
    $scope.putSettle = function (obj){
        if(obj.task_status!==10){
            $(".modal").modal();
            $("#putSettle").modal("close");
            swal("全部完成状态下可修改！", "", "warning");
        }
        else{
            $(".modal").modal();
            $("#putSettle").modal("open");
        }
        $scope.putSettleItem=obj;

    }
    $scope.putSettleData =function(){
        if($scope.putSettleItem.distance == null || $scope.putSettleItem.distance === ""
            || $scope.putSettleItem.car_count == null || $scope.putSettleItem.car_count === ""
            || $scope.putSettleItem.load_flag == null || $scope.putSettleItem.load_flag === ""){
            swal("里程或运载车辆数或载重类型不能为空！", "", "warning");
        }
        else{
            _basic.put($host.api_url + "/user/" + userId + "/dpRouteTask/" +$scope.putSettleItem.id +'/dpRouteLoadDistance',{
                distance: $scope.putSettleItem.distance,
                carCount: $scope.putSettleItem.car_count,
                loadFlag: $scope.putSettleItem.load_flag,
                reverseMoney: $scope.putSettleItem.reverse_money
            }).then(function (data) {
                if (data.success === true) {
                    swal("保存成功", "", "success");
                    $("#putSettle").modal("close");
                    seachOrderInfo();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }

    /*
    * 修改油耗
    * */
    $scope.putOil = function (obj){
        if(obj.task_status!==10){
            $(".modal").modal();
            $("#putOil").modal("close");
            swal("全部完成状态下可修改！", "", "warning");
        }
        else{
            $(".modal").modal();
            $("#putOil").modal("open");
        }
        $scope.putOilItem=obj;
    }
    $scope.putOilData =function(){
        if($scope.putOilItem.oil_distance == null || $scope.putOilItem.oil_distance === ""
            || $scope.putOilItem.oil_load_flag == null || $scope.putOilItem.oil_load_flag === ""){
            swal("里程或载重类型不能为空！", "", "warning");
        }
        else{
            _basic.put($host.api_url + "/user/" + userId + "/dpRouteTask/" +$scope.putOilItem.id +'/dpRouteOilLoadDistance',{
                oilDistance: $scope.putOilItem.oil_distance,
                oilLoadFlag: $scope.putOilItem.oil_load_flag
            }).then(function (data) {
                if (data.success === true) {
                    swal("保存成功", "", "success");
                    $("#putOil").modal("close");
                    seachOrderInfo();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }


    /**
     * 上一页
     */
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1) ;
        seachOrderInfo();
    };

    /**
     * 下一页
     */
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1) ;
        seachOrderInfo();
    };


}]);