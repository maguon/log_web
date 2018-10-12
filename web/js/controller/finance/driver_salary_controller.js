app.controller("driver_salary_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_config", "_basic", function ($scope, $rootScope,$state,$stateParams,$host, _config, _basic) {

    $scope.start = 0;
    $scope.size = 11;
    $scope.selectedIdsArr = [];
    $scope.noLoadDistanceCount = 0;
    $scope.loadDistanceCount = 0;
    $scope.shouldPay = 0;
    $scope.startMonth = moment(new Date()).format('YYYYMM');
    var heavyLoad = _config.heavyLoad;
    var userId = _basic.getSession(_basic.USER_ID);

    // monthPicker控件
    $('#start_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 获取货车品牌信息
    $scope.getTruckBrandList = function () {
        _basic.get($host.api_url + "/brand").then(function (data) {
            if (data.success === true) {
                $scope.brandList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 所属类型--公司联动
    $scope.getCompany = function () {
        _basic.get($host.api_url + "/company?operateType=" + $scope.carType).then(function (data) {
            if (data.success == true) {
                $scope.companyList = data.result;
            } else {
                swal(data.msg, "", "error")
            }
        });
    };

    // 获取司机工资信息
    $scope.searchDriverSalaryList = function (status) {
        if(status === "init"){
            $scope.monthStart = $scope.startMonth
        }
        else{
            $scope.monthStart = $('#start_month').val();
        }
        $scope.monthVal =  $scope.monthStart;

        // 基本检索URL
        var url = $host.api_url + "/driveSalary?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "driver_salary",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.boxArray = data.result;
                $scope.driverSalaryList = $scope.boxArray.slice(0, 10);
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
                $scope.temporaryMonth = $("#start_month").val();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击查询
    $scope.getDriverSalaryList = function () {
        $scope.start = 0;
        $scope.searchDriverSalaryList();
    };

    // 根据司机id查询未结算工资信息
    $scope.showDriverWageSettlement = function (driverInfo) {
        $scope.driverInfo = driverInfo;
        _basic.get($host.api_url + "/dpRouteTaskBase?driveId=" + driverInfo.drive_id + "&taskStatus=10&statStatus=1").then(function (data) {
            if (data.success === true) {
                // console.log("driverData", data);
                $scope.driverWageSettlementList = data.result;
                $("#wageSettlementModal").modal("open");
                $scope.selectedIdsArr = [];
                $("[name = 'selectAll']").prop('checked' , false);
                $scope.noLoadDistanceCount = 0;
                $scope.loadDistanceCount = 0;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 全选
    $scope.selectAllCheckBox = function (event) {
        var selAllBtn = event.target;
        $scope.selectedIdsArr = [];
        if (selAllBtn.checked) {
            $("[name = 'select']").prop('checked', true);
            // 收集调度编号并计算重载空载里程
            for (var i = 0; i < $scope.driverWageSettlementList.length; i++) {
                $scope.selectedIdsArr.push($scope.driverWageSettlementList[i].id);

                if($scope.driverWageSettlementList[i].car_count <= heavyLoad){
                    $scope.noLoadDistanceCount += $scope.driverWageSettlementList[i].distance
                }
                else{
                    $scope.loadDistanceCount += $scope.driverWageSettlementList[i].distance
                }
            }
        }
        else {
            $("[name = 'select']").prop('checked', false);
            $scope.selectedIdsArr = [];
            $scope.noLoadDistanceCount = 0;
            $scope.loadDistanceCount = 0;
        }
        // console.log("selectedIdsArr",$scope.selectedIdsArr);
    };

    // 检测所有分选按钮是否被选中
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

    // 检测当前选中的路线，修改路线id数组并计算重载空载公里数
    $scope.checkSelMission = function (event, id, index) {
        var currentSel = event.target;
        if(currentSel.checked){
            $scope.selectedIdsArr.push(id);
            // 计算重载空载公里数
            if($scope.driverWageSettlementList[index].car_count <= heavyLoad){
                $scope.noLoadDistanceCount += $scope.driverWageSettlementList[index].distance
            }
            else{
                $scope.loadDistanceCount += $scope.driverWageSettlementList[index].distance
            }
        }
        else{
            // 获取取消选中的checkbox在id数组中的下标
            var noSelIndex = $scope.selectedIdsArr.indexOf(id);
            $scope.selectedIdsArr.splice(noSelIndex, 1);
            // 计算重载空载公里数
            if($scope.driverWageSettlementList[index].car_count <= heavyLoad){
                $scope.noLoadDistanceCount -= $scope.driverWageSettlementList[index].distance
            }
            else{
                $scope.loadDistanceCount -= $scope.driverWageSettlementList[index].distance
            }
        }
        // console.log("selectedIdsArr",$scope.selectedIdsArr);
    };

    // 模态框点击确定新增结算任务工资并跳转页面
    $scope.addRouteFeeInfo = function () {
        var truckId = $scope.driverInfo.truck_id == null ? 0 : $scope.driverInfo.truck_id;
        _basic.post($host.api_url + "/user/" + userId + "/driveSalary",{
            driveId: $scope.driverInfo.drive_id,
            truckId: truckId,
            loadDistance: $scope.loadDistanceCount,
            noLoadDistance: $scope.noLoadDistanceCount,
            planSalary: $scope.shouldPay,
            dpRouteTaskIds: $scope.selectedIdsArr
        }).then(function (data) {
            if (data.success === true) {
                swal({
                        title: "操作成功",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#86cceb",
                        confirmButtonText: "确认",
                        closeOnConfirm: true
                    },
                    function () {
                        $state.go("driver_salary_details", {
                            id: data.id,
                            driveId: $scope.driverInfo.drive_id,
                            from:'driver_salary'
                        });
                        $("#wageSettlementModal").modal("close");
                    });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.searchDriverSalaryList();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.searchDriverSalaryList();
    };

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.monthStart=conditions.monthDateId;
        $scope.driverName=conditions.driveName;
        $scope.carType=conditions.operateType;
        $scope.insureCompany=conditions.companyId;
        $scope.truckNumber=conditions.truckNum;
        $scope.truckBrand=conditions.truckBrandId;
        $scope.grantStatus=conditions.grantStatus;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            monthDateId: $scope.monthStart,
            driveName: $scope.driverName,
            operateType: $scope.carType,
            companyId: $scope.insureCompany,
            truckNum: $scope.truckNumber,
            truckBrandId: $scope.truckBrand,
            grantStatus: $scope.grantStatus
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "driver_salary_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "driver_salary") {
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
        $scope.getCompany();
        // 查询数据
        $scope.searchDriverSalaryList();
    }
    initData();


    // 获取数据
    $scope.queryData = function () {
        $scope.getTruckBrandList();
        $scope.searchDriverSalaryList("init");
    };
    $scope.queryData();
}]);