
/**
 * 主菜单：调度管理 -> 费用申请 控制器
 */

app.controller("cost_application_controller", ["$scope", "$state","$stateParams", "$host", "_basic",  "_config",function ($scope, $state,$stateParams, $host, _basic,_config) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;


    //申请状态列表
    $scope.applicationStatusList = _config.applicationStatus;


    //费用申请信息
    $scope.newCostApplication ={};


    //新增费用申请  默认数据
    var defaultCostApplication = {
        //司机ID
        driveId:  '',
        //司机名字
        driveName: '',
        //货车ID
        truckId: '',
        //货车牌号
        truckNum: '',
        //调度编号
        dpRouteTaskId:'',
        //货车停留天数
        dayCount:0,
        //货车停车单价
        singlePrice: 0,
        //货车停车费
        totalPrice: 0,
        //商品车停留天数
        carDayCount: 0,
        //商品车停车单价
        carSinglePrice:0,
        //商品车停车费
        carTotalPrice:0,
        //商品车加油费
        carOilFee:0,
        //现金ETC
        cashEtc: 0,
        //现金维修
        cashRepair: 0,
        //现金违章
        cashPeccancy: 0,
        //现金加油
        cashOil: 0,
        //备注
        remark:''
    };



    /**
    * 获取司机
     */
    function getDriver () {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveList = data.result;
                $('#driver').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#newDriver').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };




    //获取货车牌号
    function getTruck(text) {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckList = data.result;

                //新增司机与货车牌号联动
                if(text==''||text==undefined||text==null){
                    $('#newTruck').select2({
                        placeholder: '货车牌号',
                        containerCssClass: 'select2_dropdown'
                    });
                }
                else {
                    $('#newTruck').select2({
                        placeholder:text,
                        containerCssClass: 'select2_dropdown'
                    });
                }

                //查询货车牌号
                $('#truck').select2({
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




    /**
     * 在【新增费用申请】中司机和货车牌号 联动
     */
    $scope.changeDriver = function (driver){
        if(driver==undefined){
            getTruck();
        }
        else {
            _basic.get($host.api_url + "/drive?driveId="+driver).then(function (data) {
                if (data.success == true) {
                    $scope.newTruck= data.result[0].truck_id;
                    $scope.newTruckNumber=data.result[0].truck_num;
                    getTruck(data.result[0].truck_num);
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }

    };




    /**
     * 查询按钮
     */
    $scope.getCost = function () {
        $scope.start = 0;
        searchCostList();
    }




    /**
     * 根据条件搜索
     */
    function searchCostList() {

        // 基本检索URL
        var url = $host.api_url + "/dpRouteTaskFee?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        _basic.get(url).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.costList = $scope.boxArray.slice(0, 10);
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
        var url = $host.api_url + "/dpRouteTaskFee.csv";
        // 检索条件
        var conditions = _basic.objToUrl(makeConditions());
        // 检索URL
        url = conditions.length > 0 ? url + "?" + conditions : url;
        // 调用接口下载
        window.open(url);
    }



    /**
     *
     * 点击添加按钮
     */
    $scope.openCost = function (){

        //清除缓存数据
        $scope.driveList=[];
        $scope.truckList=[];
        getDriver();



        $('.modal').modal();
        $('#newCost').modal('open');

        // 初期化数据
        angular.copy(defaultCostApplication, $scope.newCostApplication);

    }



    /*
    * 提交新增信息
    * */
    $scope.addCostItem = function () {



        if( $scope.newCostApplication.truck!==undefined&& $scope.newCostApplication.truck!==null){

            $scope.newTruck = $scope.newCostApplication.truck.id;
            $scope.newTruckNumber= $scope.newCostApplication.truck.truck_num;


        }
        if($scope.newCostApplication.carDayCount==null|| $scope.newCostApplication.carSinglePrice==null||
            $scope.newCostApplication.driver== ''||$scope.newTruck==null||  $scope.newTruckNumber==null||
            $scope.newCostApplication.dpRouteTaskId==''||$scope.newCostApplication.dayCount ==null||
            $scope.newCostApplication.singlePrice ==null||$scope.newCostApplication.carOilFee==null||
            $scope.newCostApplication.cashEtc ==null||$scope.newCostApplication.cashRepair==null||
            $scope.newCostApplication.cashPeccancy ==null||$scope.newCostApplication.cashOil==null


        ){
            swal('请输入完整信息!', "", "error")
        }
        else {
            _basic.post($host.api_url + "/user/" + userId + "/dpRouteTaskFee", {
                driveId:  $scope.newCostApplication.driver.id,
                driveName: $scope.newCostApplication.driver.drive_name,
                truckId:  $scope.newTruck,
                truckNum: $scope.newTruckNumber,
                dpRouteTaskId: $scope.newCostApplication.dpRouteTaskId,
                dayCount: $scope.newCostApplication.dayCount,
                singlePrice: $scope.newCostApplication.singlePrice,
                totalPrice:  $scope.newCostApplication.dayCount*$scope.newCostApplication.singlePrice,
                carDayCount: $scope.newCostApplication.carDayCount,
                carSinglePrice: $scope.newCostApplication.carSinglePrice,
                carTotalPrice: $scope.newCostApplication.carDayCount*$scope.newCostApplication.carSinglePrice,
                carOilFee:$scope.newCostApplication.carOilFee,
                cashEtc: $scope.newCostApplication.cashEtc,
                cashRepair: $scope.newCostApplication.cashRepair,
                cashPeccancy: $scope.newCostApplication.cashPeccancy,
                cashOil: $scope.newCostApplication.cashOil,
                remark:$scope.newCostApplication.remark
            }).then(function (data) {
                if (data.success == true) {
                    $('#newCost').modal('close');
                    swal("新增成功", "", "success");
                    searchCostList();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };



    /**
     * 打开画面【修改费用申请】模态框。
     *
     */
    $scope.openEditCost = function (id){
        $scope.dpRouteTaskFeeId=id;
        _basic.get($host.api_url+ '/dpRouteTaskFee?dpRouteTaskFeeId='+id).then(function (data) {
            if (data.success === true&&data.result.length > 0) {

                $(".modal").modal();
                $('#editCost').modal('open');

                $scope.putList = data.result[0];
            }
            else {
                swal(data.msg, "", "error");
            }
        });

    }


    /**
     * 修改费用申请
     */
    $scope.saveCost = function (){

        //必填条件
        if($scope.putList.day_count !== null &&  $scope.putList.single_price!== null&&$scope.putList.car_oil_fee!==null
        &&$scope.putList.car_day_count !== null &&  $scope.putList.car_single_price!== null&&$scope.putList.cash_etc!== null
            &&  $scope.putList.cash_repair!== null&&  $scope.putList.cash_peccancy!== null&&  $scope.putList.cash_oil!== null
        ){

            _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskFee/"+$scope.dpRouteTaskFeeId,{
                dayCount: $scope.putList.day_count,
                singlePrice: $scope.putList.single_price,
                totalPrice:  $scope.putList.day_count*$scope.putList.single_price,
                carOilFee:$scope.putList.car_oil_fee,
                carDayCount: $scope.putList.car_day_count,
                carSinglePrice: $scope.putList.car_single_price,
                carTotalPrice: $scope.putList.car_single_price*$scope.putList.car_day_count,
                cashEtc: $scope.putList.cash_etc,
                cashRepair: $scope.putList.cash_repair,
                cashPeccancy: $scope.putList.cash_peccancy,
                cashOil: $scope.putList.cash_oil,
                remark:$scope.putList.remark
            }).then(function (data) {
                if (data.success === true) {

                    $('#editCost').modal('close');
                    swal("修改成功", "", "success");
                    searchCostList();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    }




    // 分页
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        searchCostList();
    };

    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        searchCostList();
    };


    /**
     * 组装检索条件。
     */
    function makeConditions() {
        var obj = {
            driveId: $scope.conDrivder,
            truckId: $scope.conTruck,
            createdOnStart:$scope.conStarTime,
            createdOnEnd:$scope.conEndTime,
            status:$scope.conStatus
        }
        return obj;
    }



    getDriver();
    getTruck();
    searchCostList();

}]);