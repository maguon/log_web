/**
 * Created by star on 2018/6/12.
 */
app.controller("driver_exceed_oil_controller", ["$scope","$rootScope","$state","$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state,$stateParams, _basic, _config, $host) {
    $scope.start = 0;
    $scope.size = 11;
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.dataTotal=[];
    // monthPicker控件
    $('#start_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });
    //获取上个月年月
    function getLastMonth(){//获取上个月日期
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        if(month<10){
            month ='0'+month;
        }

        if(month == 0){
            year = year -1;
            month = 12;
        }
        $scope.startMonth = year.toString()+month.toString();
        $scope.addStartMonth = year.toString()+month.toString();
    }
    getLastMonth();

    // 跳转
    $scope.single = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.single ').addClass("active");
        $("#single").addClass("active");
        $("#single").show();
    };
    $scope.month = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.month ').addClass("active");
        $("#month").addClass("active");
        $("#month").show();
        $scope.getExceedOilMonth();
    };
    $scope.single();

    //获取货车牌号
    function getTruckId() {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAll = data.result;
                $('#truckNum').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $('#addTruckNum').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $('#truckNumber').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $('#addTruckNumMonth').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/company").then(function (data) {
            if (data.success === true) {
                $scope.company = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

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
                $('#addExceedOilDriver').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#driverName').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#addExceedOilDriverMonth').select2({
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
    };

    //获取查询数据
    function getExceedOilData(){
        // 基本检索URL
        var url = $host.api_url + "/driveExceedOil?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "driver_exceed_oil",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
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
        // 基本检索URL
        var url = $host.api_url + "/driveExceedOil.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };

    //打开新增模态框
    $scope.addExceedOil = function (){
        $scope.addExceedOilDriver = '';
        $scope.oilDate = '';
        $scope.addRemark='';
        $scope.driveNameList=[];
        $scope.truckNumListAll=[];
        $scope.addTruckNum ='';
        getDriveNameList ();
        $('#addExceedOilItem').modal('open');
    }

    $scope.changeDriver = function (driver){
        _basic.get($host.api_url + "/drive?driveId="+driver).then(function (data) {
            if (data.success == true) {
                $scope.addTruckNum = data.result[0].truck_id;
                getTruckId();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //点击确定 增加完成
    $scope.addExceedOilItem = function (){
        if ($scope.addExceedOilDriver !== '' && $scope.oilDate !== ''&&$scope.addTruckNum!=='') {
            _basic.post($host.api_url + "/user/" + userId + "/driveExceedOil", {
                driveId:$scope.addExceedOilDriver,
                truckId:$scope.addTruckNum,
                oilDate:$scope.oilDate,
                remark:$scope.addRemark
            }).then(function (data) {
                if (data.success === true) {
                    $('#addExceedOilItem').modal('close');
                    getExceedOilData();
                    $state.go('driver_exceed_oil_detail', {
                        reload: true,
                        id:data.id,
                        truckId:$scope.addTruckNum,
                        driveId:$scope.addExceedOilDriver,
                        from: 'driver_exceed_oil'
                    });
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


    //打开新增模态框
    $scope.addExceedOilMonth = function (){
        $scope.addTruckNumMonth = '';
        $scope.addExceedOilDriverMonth = '';
        $scope.addStartMonth='';
        $scope.driveNameList=[];
        $scope.truckNumListAll=[];
        $scope.addRemarkMonth ='';
        getDriveNameList ();
        $('#addExceedOilItemMonth').modal('open');
        $('#add_start_month').MonthPicker({
            Button: false,
            MonthFormat: 'yymm'
        });
        getLastMonth();

    }
    $scope.changeDriverMonth = function (driver){
        _basic.get($host.api_url + "/drive?driveId="+driver).then(function (data) {
            if (data.success == true) {
                $scope.addTruckNumMonth = data.result[0].truck_id;
                getTruckId();
                getDataTotal();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    $scope.changeTruck =function (){
        getDataTotal();
    }

    //查询按月份的总计划实际超量
    function getDataTotal(){
        $scope.addStartMonth = $('#add_start_month').val();
        if ($scope.addExceedOilDriverMonth !== '' && $scope.addStartMonth !== '' && $scope.addTruckNumMonth !== '') {
            var obj = {
                yMonth: $scope.addStartMonth,
                driveId: $scope.addExceedOilDriverMonth,
                truckId: $scope.addTruckNumMonth,
                oilStatus:2
            };
            //司机  核油日期
            _basic.get($host.api_url + "/driveExceedOil?" + _basic.objToUrl(obj)).then(function (data) {
                if (data.success === true && data.result.length >= 0) {
                    if (data.result.length == 0) {
                        $scope.dataTotal = [];
                        swal('该司机下无任务,新增失败!', '', 'error');
                    }
                    else {
                        $scope.dataTotal = data.result;
                    }
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
            //统计
            _basic.get($host.api_url + "/driveExceedOilTotal?" + _basic.objToUrl(obj)).then(function (data) {
                if (data.success === true && data.result.length >= 0) {
                    if (data.result.length == 0) {
                        $scope.dataTotal = [];
                    }
                    else {
                        $scope.dataTotalStatistics = data.result[0];
                    }
                }
                else {
                    swal(data.msg, "", "error");
                }
            });

        }
        else {
            swal("请填写完整信息！", "", "warning");
        }
    }

    //点击确定 增加完成
    $scope.addExceedOilItemMonth = function () {
        if($scope.dataTotalStatistics.actual_money==''){
            swal("请填写超量金额！", "", "warning");
        }
        else{
            _basic.post($host.api_url + "/user/" + userId + "/driveExceedOilDate", {
                monthDateId: $scope.addStartMonth,
                driveId: $scope.addExceedOilDriverMonth,
                truckId: $scope.addTruckNumMonth,
                planOilTotal: $scope.dataTotalStatistics.plan_oil,
                planUreaTotal: $scope.dataTotalStatistics.plan_urea,
                actualOilTotal: $scope.dataTotalStatistics.actual_oil,
                actualUreaTotal: $scope.dataTotalStatistics.actual_urea,
                actualMoney:$scope.dataTotalStatistics.actual_money,
                remark:$scope.addRemarkMonth
            }).then(function (data) {
                if (data.success === true) {
                    $('#addExceedOilItemMonth').modal('close');
                    getExceedOilDataMonth();
                }
                else {
                    swal(data.msg, "", "error");
                }

            })
        }

    }

    $scope.getExceedOilMonth =function (){
        $scope.start = 0;
        getExceedOilDataMonth();
    }
    function getExceedOilDataMonth(){
        // 基本检索URL
        var url = $host.api_url + "/driveExceedOilDate?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        if($('#start_month').val()!==''){
            $scope.startMonth = $('#start_month').val();
        }

        var conditionsObj = {
            monthDateId:$scope.startMonth,
            driveId:$scope.driverName,
            truckId:$scope.truckNumber
        };
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {
                // 当前画面的检索信息
                var pageItems = {
                    pageId: "driver_exceed_oil",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArrayMonth: []};
                $rootScope.refObj.pageArrayMonth.push(pageItems);

                $scope.boxArrayMonth = data.result;
                $scope.ExceedOilListMonth = $scope.boxArrayMonth.slice(0, 10);
                if ($scope.start > 0) {
                    $("#preM").show();
                }
                else {
                    $("#preM").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#nextM").hide();
                }
                else {
                    $("#nextM").show();
                    }

            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }





    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getExceedOilData();
        getExceedOilDataMonth()
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getExceedOilData();
        getExceedOilDataMonth()
    };

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.driverId=conditions.driveId;
        $scope.settleStatus=conditions.settleStatus;
        $scope.driveStartTime=conditions.oilDateStart;
        $scope.driveEndTime=conditions.oilDateEnd;
        $scope.search_company=conditions.companyId;
        $scope.truckNum=conditions.truckId;
        $scope.dealStatus=conditions.oilStatus;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            driveId:$scope.driverId,
            settleStatus:$scope.settleStatus,
            oilDateStart:$scope.driveStartTime,
            oilDateEnd:$scope.driveEndTime,
            companyId:$scope.search_company,
            truckId:$scope.truckNum,
            oilStatus:$scope.dealStatus
        };
    }

    function setConditionsMonth(conditions) {
        $scope.startMonth=conditions.monthDateId;
        $scope.driverName=conditions.driveId;
        $scope.truckNumber=conditions.truckId;
     }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {

        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "driver_exceed_oil_detail" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "driver_exceed_oil") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
                $scope.single();
            }
        }
        // 如果是从后画面跳回来时，取得上次检索条件
       else if ($stateParams.from === "driver_exceed_oil_month_detail" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArrayMonth.length > 0) {
            var pageItems = $rootScope.refObj.pageArrayMonth.pop();
            if (pageItems.pageId === "driver_exceed_oil") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditionsMonth(pageItems.conditions);
                $scope.month();
            }
        }

        else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }
        // 查询数据
        queryData();

    }
    initData();





    //获取数据
    function queryData() {
        getDriveNameList();
        getExceedOilData();
        getTruckId();
    }
}])