
/**
 * 主菜单：财务管理 -> 车辆成本 控制器
 */

app.controller("car_cost_controller", ["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;


    // 公司所属类型列表
    $scope.operateTypeList = _config.operateType;


    //车型
    $scope.truckTypeList = _config.truckType;



    //查询条件月份
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





    /*
     * 所属类型--公司联动
     * */
    $scope.changeOperateType=function () {
        _basic.get($host.api_url+"/company?operateType="+$scope.operateType).then(function (data) {
            if(data.success==true){
                $scope.companyList=data.result;
                $('#company').select2({
                    placeholder: '所属公司',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }else {
                swal(data.msg,"","error")
            }
        });
    };


    /**
     * 货车牌号随车型的变化  ----联动
     */
    $scope.changeTruckType = function (){
        _basic.get($host.api_url + "/truckBase?truckType=" + $scope.truckType).then(function (data) {
            if (data.success == true) {
                $scope.truckList = data.result;
                $('#truck').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }


    //查询功能
    $scope.getCarCost = function (){
        $scope.start = 0;
        seachCarCost();
    }




    //获取查询数据
    function seachCarCost(){
        if( $('#start_month').val()!==''){
            $scope.startMonth = $('#start_month').val();
        }

        // 基本检索URL
        var url = $host.api_url + "/truckCost?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        _basic.get(url).then(function (data) {
            if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.carCostList = $scope.boxArray.slice(0, 10);
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





    /*
    * 数据导出
    * */
    $scope.export = function () {
        // 基本检索URL
        var url = $host.api_url + "/truckCost.csv";
        // 检索条件
        var conditions = _basic.objToUrl(makeConditions());
        // 检索URL
        url = conditions.length > 0 ? url + "?" + conditions : url;

        swal({
            title: "确定导出车辆成本表？",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        }).then(
            function (result) {
                if (result.value) {
                    window.open(url);
                }
            })
    };


    // 分页
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        seachCarCost();
    };


    $scope.nextBn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        seachCarCost();
    };


    /**
     * 组装检索条件。
     */
    function makeConditions() {
        var obj = {
            yMonth:$scope.startMonth,
            truckType:$scope.truckType,
            companyId: $scope.driverCompany,
            truckId:$scope.truckNumber,
            operateType: $scope.operateType
        }
        return obj;
    }

    getLastMonth();
    seachCarCost();

}])