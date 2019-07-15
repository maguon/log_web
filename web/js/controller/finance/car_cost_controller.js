
/**
 * 主菜单：财务管理 -> 车辆成本 控制器
 */

app.controller("car_cost_controller", ["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;


    // 公司所属类型列表
    $scope.operateTypeList = _config.operateType;


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





    // 获取查询条件 (货车牌号)
    function getCondition() {

        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumList = data.result;
                $('#truckNumber').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };

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



    //查询功能
    $scope.getdrive = function (){
        $scope.start = 0;
        getdriveData();
    }




    // 数据导出
    $scope.export = function () {
        var obj = {
            companyId: $scope.driverCompany,
            yMonth:$scope.startMonth,
            truckId:$scope.truckNumber,
            operateType: $scope.operateType
        };
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
                    window.open($host.api_url + "/truckCost.csv?" + _basic.objToUrl(obj));
                }
            })

    };




    //获取查询数据
    function getdriveData(){
        if( $('#start_month').val()!==''){
            $scope.startMonth = $('#start_month').val();
        }
            _basic.get($host.api_url + "/truckCost?" + _basic.objToUrl({
                yMonth:$scope.startMonth,
                companyId: $scope.driverCompany,
                truckId:$scope.truckNumber,
                operateType: $scope.operateType,
                start: $scope.start.toString(),
                size: $scope.size
            })).then(function (data) {
                if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.driveList = $scope.boxArray.slice(0, 10);
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



    // 分页


    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getdriveData();
    };



    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getdriveData();
    };


    getLastMonth();
    getCondition();
    getdriveData();

}])