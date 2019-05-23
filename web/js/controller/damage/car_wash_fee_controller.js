app.controller("car_wash_fee_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_basic", function ($scope,$rootScope,$state,$stateParams, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.receive_status = "1";
    $scope.start = 0;
    $scope.size = 11;
    $scope.smallWashFee =0;
    $scope.bigWashFee =0;
    // 获取目的城市列表
    $scope.getCityList = function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                $scope.cityList = data.result;
                $('#end_city').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive?driveName=").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;

                $('#getDrivderId').select2({
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

    //获取货车牌号
    function getTruckNum() {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
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

    // 根据城市id获取经销商
    $scope.getRecive = function () {
        if($scope.cityId == 0 || $scope.cityId == "" || $scope.cityId == null){
            $scope.cityId = null;
            $scope.receiveList = [];
        }
        else{
            _basic.get($host.api_url + "/receive?cityId=" + $scope.cityId).then(function (data) {
                if (data.success === true) {
                    $scope.receiveList = data.result;
                }
            });
        }
    };


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
                    _basic.put($host.api_url + "/user/" + userId + "/loadTaskCleanRel/" + id + "/status/2", {
                        actualPrice: $scope.totalPrice,
                        actualGuardFee: $scope.guardFee,
                        remark: $scope.remark
                    }).then(function (data) {
                        if (data.success === true) {
                            getCarWashFeeList();
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
                    _basic.put($host.api_url + "/user/" + userId + "/loadTaskCleanRel/" + id + "/status/0", {
                        actualPrice: 0,
                        actualGuardFee: 0,
                        remark: $scope.remark
                    }).then(function (data) {
                        if (data.success === true) {
                            getCarWashFeeList();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });

    }


    // 获取洗车费列表
    $scope.getCarWashFeeList = function () {
        $scope.start = 0;
        getCarWashFeeList();
    }


   function getCarWashFeeList() {
       // 基本检索URL
       var url = $host.api_url + "/dpRouteLoadTaskCleanRel?start=" + $scope.start + "&size=" + $scope.size;
       var urlCount = $host.api_url + "/dpRouteLoadTaskCleanRelCount?start=" + $scope.start + "&size=" + $scope.size;
       // 检索条件
       var conditionsObj = makeConditions();
       var conditions = _basic.objToUrl(conditionsObj);
       // 检索URL
       url = conditions.length > 0 ? url + "&" + conditions : url;
       urlCount = conditions.length > 0 ? urlCount + "&" + conditions : urlCount;

       _basic.get(url).then(function (data) {

           if (data.success == true) {

               // 当前画面的检索信息
               var pageItems = {
                   pageId: "car_wash_fee",
                   start: $scope.start,
                   size: $scope.size,
                   conditions: conditionsObj
               };
               // 将当前画面的条件
               $rootScope.refObj = {pageArray: []};
               $rootScope.refObj.pageArray.push(pageItems);
                $scope.carWashFeeBoxArray = data.result;
                $scope.carWashFeeList = $scope.carWashFeeBoxArray.slice(0,10);
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
       _basic.get(urlCount).then(function (data) {
           if (data.success === true) {
               $scope.boxArrayFee = data.result[0];
           }

       })
    };

    // 数据导出
    $scope.export = function () {
        // 基本检索URL
        var url = $host.api_url + "/dpRouteLoadTaskCleanRel.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };

    //详情
    $scope.openDetail = function (id){
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRel?loadTaskCleanRelId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.showList = data.result[0];
                $scope.smallWashFee = data.result[0].small_single_price*data.result[0].small_car_count;
                $scope.bigWashFee =data.result[0].big_single_price*data.result[0].big_car_count;
            } else {
                swal(data.msg, "", "error");
            }
        })
        $(".modal").modal();
        $("#openDetailModal").modal("open");
    }


    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.instructionNum=conditions.loadTaskCleanRelId;
        $scope.driver=conditions.driveId;
        $scope.cityId=conditions.routeEndId;
        $scope.distributor=conditions.receiveId;
        $scope.receive_status=conditions.status;
        $scope.receiveTimeStart=conditions.cleanDateStart;
        $scope.receiveTimeEnd=conditions.cleanDateEnd;
        $scope.loadDateStart=conditions.loadDateStart;
        $scope.loadDateEnd=conditions.loadDateEnd;
        $scope.dp_number=conditions.dpRouteTaskId;
        $scope.truckNum=conditions.truckId;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            loadTaskCleanRelId: $scope.instructionNum,
            driveId: $scope.driver,
            routeEndId: $scope.cityId,
            receiveId: $scope.distributor,
            status: $scope.receive_status,
            cleanDateStart: $scope.receiveTimeStart,
            cleanDateEnd: $scope.receiveTimeEnd,
            loadDateStart:$scope.loadDateStart,
            loadDateEnd:$scope.loadDateEnd,
            dpRouteTaskId:$scope.dp_number,
            truckId:$scope.truckNum
        };
    }


    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getCarWashFeeList();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getCarWashFeeList();
    };

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "car_wash_fee_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "car_wash_fee") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
                $scope.cityId = pageItems.conditions.routeEndId;

            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }
        $scope.getRecive();
        // 查询数据
        getCarWashFeeList();

    }
    initData();



    // 获取数据
    $scope.queryData = function () {
        $scope.getCityList();
        getCarWashFeeList();
        getDriveNameList ();
        getTruckNum();
    };
    $scope.queryData();
}]);