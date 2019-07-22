
/**
 * 主菜单：车辆管理 -> 运营车辆 控制器
 */

app.controller("operating_vehicles_controller", ['$scope', "$host", '_basic', '$rootScope','$state','_config','$stateParams',function ($scope, $host, _basic, $rootScope,$state,_config,$stateParams) {


    // 翻页用
    $scope.start = 0;
    $scope.size = 11;



    // 公司所属类型列表
    $scope.operateTypeList = _config.operateType;



    //运营状态
    $scope.dispatchFlagList = _config.dispatchFlag;




    /*
  * 所属类型--公司联动
  * */
    $scope.changeOperateType=function () {
        _basic.get($host.api_url+"/company?operateType="+$scope.conOperateType).then(function (data) {
            if(data.success==true){
                $scope.companyList=data.result;
            }else {
                swal(data.msg,"","error")
            }
        });
    };




    /*
    * 获取货车品牌信息
    * */
    function getBrandList() {
        _basic.get($host.api_url + "/brand").then(function (data) {
            if (data.success === true) {
                $scope.brandList = data.result;

            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };





   /*
   * 头车（货车牌号）
   * */
    function getTruckList () {
        _basic.get($host.api_url + "/truckFirst?truckType=1").then(function (data) {
            if (data.success === true) {
                $scope.truckList = data.result;
                $('#truck').select2({
                    placeholder: '货车牌号',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }





    /**
     * 查询按钮
     */
    $scope.getOperatingVehicles = function () {
        $scope.start=0;
        searchOperatingVehiclesList();
    };





    /**
     * 根据条件搜索
     */
    function searchOperatingVehiclesList () {
        // 基本检索URL
        var url = $host.api_url + "/truckOperate?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "operating_vehicles",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.boxArray = data.result;
                $scope.operatingList = $scope.boxArray.slice(0, 10);
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
    };





    /**
     * 数据导出
     */
    $scope.export = function (){
        // 基本检索URL
        var url = $host.api_url + "/truckOperate.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    }





    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.conNumber=conditions.truckId;
        $scope.conDriver=conditions.driveName;
        $scope.conCompany=conditions.companyId;
        $scope.conOperateType = conditions.operateType;
        $scope.conDispatchFlag=conditions.dispatchFlag;
        $scope.conTruckBrand=conditions.brandId;
    }




    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            truckId:$scope.conNumber,
            truckType:1,
            driveName:$scope.conDriver,
            companyId:$scope.conCompany,
            brandId:$scope.conTruckBrand,
            dispatchFlag:$scope.conDispatchFlag,
            operateType: $scope.conOperateType
        };
    }


    // 分页
    $scope.getPrePage = function () {
        $scope.start = $scope.start - ($scope.size-1);
        searchOperatingVehiclesList();
    };
    $scope.getNextPage = function () {
        $scope.start = $scope.start + ($scope.size-1);
        searchOperatingVehiclesList();
    };




    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "look_head_truck_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "operating_vehicles") {
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
        $scope.getOperatingVehicles();
        getTruckList ();
        getBrandList();
    }



    initData();


}]);