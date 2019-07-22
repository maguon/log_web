/**
 * Created by ASUS on 2017/7/10.
 */
app.controller("truck_details_controller", ["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {


    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 翻页用

    //头车
    $scope.startHead = 0;
    $scope.sizeHead = 11;


    //挂车
    $scope.startHand = 0;
    $scope.sizeHand = 11;



    //公司所属类型
    $scope.operateTypeList = _config.operateType;




    // 头车-->挂车  跳转
    $scope.getHeadCar = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.headerCar').addClass("active");
        $("#headerCar").addClass("active");
        $("#headerCar").show();

    };

    $scope.getHeadCar();


    //挂车-->头车   跳转
    $scope.getHandCar = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.handCar').addClass("active");
        $("#handCar").addClass("active");
        $("#handCar").show();

    };



    //检索条件


    /*
    *  所属类型--公司联动  （共用）
    * */
    $scope.changeOperateType = function (type) {
        // 获取公司
        _basic.get($host.api_url + "/company?operateType=" + type).then(function (data) {
            if (data.success == true) {
                $scope.companyList = data.result;
            }
            else {
                swal(data.msg, "", "error")
            }
        });

    };



    /*
    * 品牌
    * */
   function getBrandList() {
        _basic.get($host.api_url + "/brand").then(function (data) {
            if (data.success == true) {
                $scope.brandList= data.result;
            }
            else {
                swal(data.msg, "", "error")
            }
        });
    };





    /*
    * 货车牌号（头车）
    * */
    function getHeadTruckList () {
        _basic.get($host.api_url + "/truckFirst?truckType=1").then(function (data) {
            if (data.success === true) {
                $scope.headTruckList = data.result;
                $('#headTruck').select2({
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





    /*
    * 货车牌号（挂车）
    * */
    function getHandTruckList () {
        _basic.get($host.api_url + "/truckTrailer?truckType=2").then(function (data) {
            if (data.success === true) {
                $scope.truckTrailerNumList = data.result;
                $('#handTruck').select2({
                    placeholder: '车牌号',
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
     * (头车)查询按钮
     */

    $scope.getHeadCarList = function () {
        $scope.startHead = 0;
        $scope.searchHeadList();
    };



    /*
    * (挂车)查询按钮
    * */
    $scope.getHandCarList = function () {
        $scope.startHand = 0;
        $scope.searchHandList()
    };



    /**
     * 根据条件搜索(头车)
     */
    $scope.searchHeadList = function () {

        // 基本检索URL
        var url = $host.api_url + "/truckFirst?start=" + $scope.startHead + "&size=" + $scope.sizeHead;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "truck_details",
                    start: $scope.startHead,
                    size: $scope.sizeHead,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.arrayBox = data.result;
                $scope.headCarList = $scope.arrayBox.slice(0, 10);
                if ($scope.startHead > 0) {
                    $("#headPre").show();
                }
                else {
                    $("#headPre").hide();
                }

                if (data.result.length < $scope.sizeHead) {
                    $("#headNext").hide();
                }
                else {
                    $("#headNext").show();
                }
            }
            else {
                swal(data.msg, "", "error")
            }
        });
    };




    /**
     * 根据条件搜索(挂车)
     */
    $scope.searchHandList = function () {
        // 基本检索URL
        var url = $host.api_url + "/truckTrailer?start=" + $scope.startHand + "&size=" + $scope.sizeHand;
        // 检索条件
        var conditionsObj = makeConditions2();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "truck_details",
                    start: $scope.startHand,
                    size: $scope.sizeHand,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj2 = {pageArray: []};
                $rootScope.refObj2.pageArray.push(pageItems);
                $scope.carbox = data.result;
                $scope.handCarList = $scope.carbox.slice(0, 10);
                if ($scope.startHand > 0) {
                    $("#handPre").show();
                }
                else {
                    $("#handPre").hide();
                }

                if (data.result.length < $scope.sizeHand) {
                    $("#handNext").hide();
                }
                else {
                    $("#handNext").show();
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };





    /**
     * 数据导出(头车)
     */
    $scope.headExport = function(){
        // 基本检索URL
        var url = $host.api_url + "/truckFirstCsv.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    }





    /**
     * 数据导出(挂车)
     */
    $scope.handExport = function () {
        // 基本检索URL
        var url = $host.api_url + "/truckTrailerCsv.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions2();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    }








    /*
    * 修改头车状态
    * */
    $scope.changeTruck_status = function (id, status) {
        if (status == 1) {
            status = 0
        }
        else {
            status = 1
        }
        _basic.put($host.api_url + "/user/" + userId + "/truck/" + id + "/truckStatus/" + status + "/first", {}).then(function (data) {
            if (data.success == true) {
                swal("修改成功", "", "success");
                $scope.searchHeadList();
            }
            else {
                swal(data.msg, "", "error");
                $scope.searchHeadList();
            }
        })

    };


    /*
    * 修改挂车状态
    * */
    $scope.changeTruckTrailer_status = function (id, status) {
        if (status == 1) {
            status = 0
        }
        else {
            status = 1
        }
        _basic.put($host.api_url + "/user/" + userId + "/truck/" + id + "/truckStatus/" + status + "/trailer", {}).then(function (data) {
            if (data.success == true) {
                swal("修改成功", "", "success");
                $scope.searchHandList();

            }
            else {
                swal(data.msg, "", "error");
                $scope.searchHandList();
            }
        })
    };





    // 显示设置车辆当前位置模态框
    $scope.showCarPositionModel = function (truckId) {
        // 获取城市信息
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                $scope.allCityList = data.result;
                $scope.truck_id = truckId;
                $('.js-example-basic-single').select2({
                    placeholder: '车辆当前位置',
                    containerCssClass : 'select2_dropdown'
                });
                $('#carPositionModel').modal('open');
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 保存位置信息
    $scope.savePositionInfo = function () {
        if($scope.currentCityId != "" && $scope.currentCityId != undefined){
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + $scope.truck_id + "/dispatch",{
                currentCity:$scope.currentCityId,
                carCount:0
            }).then(function (data) {
                if (data.success === true) {
                    $('#carPositionModel').modal('close');
                    swal("设置成功", "", "success");
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请选择车辆位置", "", "warning");
        }
    };







    // 头车分页(上一页)
    $scope.headPreBtn = function () {
        $scope.startHead = $scope.startHead - ($scope.sizeHead - 1);
        $scope.searchHeadList ();
    };


    // 头车分页(下一页)
    $scope.headNextBtn = function () {
        $scope.startHead = $scope.startHead + ($scope.sizeHead - 1);
        $scope.searchHeadList ();
    };



    // 挂车分页(上一页)
    $scope.handPreBtn = function () {
        $scope.startHand = $scope.startHand - ($scope.sizeHand - 1);
        $scope.searchHandList()
    };


    // 挂车分页(下一页)
    $scope.handNextBtn = function () {
        $scope.startHand = $scope.startHand + ($scope.sizeHand - 1);
        $scope.searchHandList()
    };




    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.conHeadTruck=conditions.truckNum;
        $scope.conHeadOperateType=conditions.operateType;
        $scope.conHeadCompany=conditions.companyId;
        $scope.conHeadDriver=conditions.driveName;
        $scope.conHeadOperationStartTime=conditions.licenseDateStart;
        $scope.conHeadOperationEndTime=conditions.licenseDateEnd;
        $scope.conHeadCarStartTime=conditions.drivingDateStart;
        $scope.conHeadCarEndTime=conditions.drivingDateEnd;
        $scope.conHeadBrand=conditions.brandId;
    }


    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            truckNum:$scope.conHeadTruck,
            operateType:$scope.conHeadOperateType,
            companyId:$scope.conHeadCompany,
            driveName:$scope.conHeadDriver,
            licenseDateStart:$scope.conHeadOperationStartTime,
            licenseDateEnd:$scope.conHeadOperationEndTime,
            drivingDateStart:$scope.conHeadCarStartTime,
            drivingDateEnd:$scope.conHeadCarEndTime,
            brandId:$scope.conHeadBrand,
            truckType:1
        };
    }


    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions2(conditions) {
        $scope.conHandTruck=conditions.truckNum;
        $scope.conHandNumStart=conditions.numberStart;
        $scope.conHandNumEnd=conditions.numberEnd;
        $scope.conHandOperateType=conditions.operateType;
        $scope.conHandCompany=conditions.companyId;
        $scope.conOperationHandStartTime=conditions.licenseDateStart;
        $scope.conOperationHandEndTime=conditions.licenseDateEnd;
        $scope.conCarHandStartTime=conditions.drivingDateStart;
        $scope.conCarHandEndTime=conditions.drivingDateEnd;
        $scope.conHandBrand=conditions.brandId;
    }


    /**
     * 组装检索条件。
     */
    function makeConditions2() {
        return {
            truckNum : $scope.conHandTruck,
            numberStart :$scope.conHandNumStart,
            numberEnd :$scope.conHandNumEnd,
            operateType: $scope.conHandOperateType,
            companyId : $scope.conHandCompany,
            licenseDateStart :$scope.conOperationHandStartTime,
            licenseDateEnd : $scope.conOperationHandEndTime,
            drivingDateStart :$scope.conCarHandStartTime,
            drivingDateEnd : $scope.conCarHandEndTime,
            brandId : $scope.conHandBrand,
            truckType:2

        };
    }




    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if (($stateParams.from === "look_head_truck_details" ||$stateParams.from === "truck_guarantee_details"||$stateParams.from === "truck_repair")&& $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "truck_details") {
                // 设定画面翻页用数据
                $scope.startHead = pageItems.start;
                $scope.sizeHead = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
                $scope.changeOperateType(pageItems.conditions.operateType);
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }
        // 查询数据
        $scope.searchHeadList ();

    }



    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData2() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if (($stateParams.from === "look_hand_truck_details"||$stateParams.from === "truck_guarantee_details"||$stateParams.from === "truck_repair") && $rootScope.refObj2 !== undefined && $rootScope.refObj2.pageArray.length > 0) {
            var pageItems = $rootScope.refObj2.pageArray.pop();
            if (pageItems.pageId === "truck_details") {
                // 设定画面翻页用数据
                $scope.startHand = pageItems.start;
                $scope.sizeHand = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions2(pageItems.conditions);
                // 查询数据
                $scope.changeOperateType(pageItems.conditions.operateType);
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj2 = {pageArray: []};
        }

        $scope.searchHandList ();


    }







    initData();
    initData2();
    getBrandList();
    getHeadTruckList ();
    getHandTruckList ();

}]);