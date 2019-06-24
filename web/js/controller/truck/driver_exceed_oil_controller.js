/**
 * Created by star on 2018/6/12.
 */
app.controller("driver_exceed_oil_controller", ["$scope","$rootScope","$state","$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state,$stateParams, _basic, _config, $host) {
    /*$scope.start = 0;
    $scope.size = 11;*/
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
    }
    getLastMonth();

    //获取货车牌号
    function getTruckId() {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAll = data.result;
                $('#truckNumber').select2({
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
                $('#driverName').select2({
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

    // 所属类型--公司联动
    $scope.getCompany=function () {
        _basic.get($host.api_url+"/company?operateType="+$scope.operateType).then(function (data) {
            if(data.success==true){
                $scope.companyList=data.result;
            }else {
                swal(data.msg,"","error")
            }
        });
    };



    $scope.getExceedOilMonth =function (){
        /*$scope.start = 0;*/
        // 检索条件
        if($('#start_month').val()!==''){
            $scope.startMonth = $('#start_month').val();
        }
        getExceedOilDataMonth();
    }
    function getExceedOilDataMonth(){
        // 基本检索URL
        var url = $host.api_url + "/driveExceedOilDate?";

        //获取当月第一天和最后一天
        var year =  $scope.startMonth.toString().slice(0,4);
        var month = $scope.startMonth.toString().slice(4,6);
        $scope.firstDay=new Date(year,month-1,1);//这个月的第一天
        var currentMonth=$scope.firstDay.getMonth(); //取得月份数
        var nextMonthFirstDay=new Date($scope.firstDay.getFullYear(),currentMonth+1,1);//加1获取下个月第一天
        var dis=nextMonthFirstDay.getTime()-24*60*60*1000;//减去一天就是这个月的最后一天
        $scope.lastDay=new Date(dis);
        $scope.firstDay= moment($scope.firstDay).format("YYYYMMDD");//格式化 //这个格式化方法要用你们自己的，也可以用本文已经贴出来的下面的Format
        $scope.lastDay= moment($scope.lastDay).format("YYYYMMDD");//格式化


        var conditionsObj = {
            yMonth:$scope.startMonth,
            taskPlanDateStart:$scope.firstDay,
            taskPlanDateEnd:$scope.lastDay,
            driveId:$scope.driverName,
            truckId:$scope.truckNumber,
            companyId:$scope.companyId,
            operateType:$scope.operateType,
            checkStatus:$scope.dealStatus
         /*   start:$scope.start,
            size:$scope.size*/
        };
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {
                // 当前画面的检索信息
                var pageItems = {
                    pageId: "driver_exceed_oil",
                   /* start: $scope.start,
                    size: $scope.size,*/
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArrayMonth: []};
                $rootScope.refObj.pageArrayMonth.push(pageItems);


                $scope.ExceedOilListMonth =  data.result;
               /* if ($scope.start > 0) {
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
                    }*/

            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    /*导出*/
    $scope.exportMonth = function(){
        // 基本检索URL
        var url = $host.api_url + "/driveExceedOilDate.csv?" ;
        // 检索条件
        var conditions = _basic.objToUrl({
            yMonth:$scope.startMonth,
            taskPlanDateStart:$scope.firstDay,
            taskPlanDateEnd:$scope.lastDay,
            driveId:$scope.driverName,
            truckId:$scope.truckNumber,
            companyId:$scope.companyId,
            operateType:$scope.operateType,
            checkStatus:$scope.dealStatus
        });
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    }

    $scope.exportDriver  = function(exportDriveId,exportTruckId,exportStartMonth){
        // 基本检索URL
        var url = $host.api_url + "/driveDpRouteTaskOilRel.csv?" ;
        // 检索条件
        var conditions = _basic.objToUrl({
            yMonth:exportStartMonth,
            taskPlanDateStart:$scope.firstDay,
            taskPlanDateEnd:$scope.lastDay,
            driveId:exportDriveId,
            truckId:exportTruckId
        });
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    }



   /* // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getExceedOilDataMonth()
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getExceedOilDataMonth()
    };*/


    function setConditionsMonth(conditions) {
        $scope.startMonth=conditions.yMonth;
        $scope.driverName=conditions.driveId;
        $scope.truckNumber=conditions.truckId;
        $scope.operateType=conditions.operateType;
        $scope.dealStatus=conditions.checkStatus;
     }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "driver_exceed_oil_month_detail" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArrayMonth.length > 0) {
            var pageItems = $rootScope.refObj.pageArrayMonth.pop();
            if (pageItems.pageId === "driver_exceed_oil") {
              /*  // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;*/
                // 将上次的检索条件设定到画面
                setConditionsMonth(pageItems.conditions);
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
        getTruckId();

        getExceedOilDataMonth();
    }
}])