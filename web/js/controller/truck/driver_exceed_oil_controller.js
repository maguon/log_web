/**
 * Created by star on 2018/6/12.
 */
app.controller("driver_exceed_oil_controller", ["$scope","$rootScope","$state","$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state,$stateParams, _basic, _config, $host) {
    $scope.start = 0;
    $scope.size = 11;
    var userId = _basic.getSession(_basic.USER_ID);

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
        getTruckId();
        $('#addExceedOilItem').modal('open');
    }

    $scope.changeDrive =function (driver){

    }


    //点击确定 增加完成
    $scope.addExceedOilItem = function (){
        if ($scope.addExceedOilDriver !== '' && $scope.oilDate !== '') {
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


    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getExceedOilData();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getExceedOilData();
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
            truckId:$scope.truckNum
        };
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
            }
        } else {
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