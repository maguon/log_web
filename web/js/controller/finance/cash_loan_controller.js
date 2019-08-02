app.controller("cash_loan_controller",["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {

    var userId = _basic.getSession(_basic.USER_ID);

    // 领取状态 默认为未处理
    $scope.etcPaymentStatus = "0";
    $scope.repairPaymentStatus = '0';
    $scope.oilPaymentStatus = '0';


    // 初始化复选金额
    $scope.initialEtc={
        selectedIdsArr:[],
        checkedEtc:0,
    }

    $scope.initialRepair={
        selectedIdsArr:[],
        checkedRepair:0,
        checkedParts:0,
        checkedMain:0
    }

    $scope.initialOil={
        selectedIdsArr:[],
        checkedOilMoney:0,
        checkedUreaMoney:0
    }




    $scope.repairStart = 0;
    $scope.repairSize = 11;
    $scope.oilStart = 0;
    $scope.oilSize = 11;
    $scope.etcStart = 0;
    $scope.etcSize = 11;


    // 跳转
    $scope.cash_oil = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.cash_oil').addClass("active");
        $("#cash_oil").addClass("active");
        $("#cash_oil").show();
        getOilList();
    };
    $scope.cash_repair = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.cash_repair').addClass("active");
        $("#cash_repair").addClass("active");
        $("#cash_repair").show();
        getReairList();
    };
    $scope.cash_etc =function (){
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.cash_etc').addClass("active");
        $("#cash_etc").addClass("active");
        $("#cash_etc").show();
        getETCList ();
    }




    //车牌号
    function getTruckNumList () {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckList = data.result;
                $('#oilTruck').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $('#etcTruck').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $('#repairTruck').select2({
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


    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveList = data.result;
                $('#oilDriver').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#etcDriver').select2({
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





    //现金加油
    $scope.searchOilList = function () {
        $scope.oilStart=0;
        getOilList();
    };

    //查询按钮相关
    function getOilList () {
        _basic.get($host.api_url + "/driveExceedOilRel?"+ _basic.objToUrl({
            truckId:  $scope.oilTruck,
            paymentType:2,
            driveId:  $scope.oilDriver,
            oilDateStart: $scope.oilStartDate,
            oilDateEnd: $scope.oilEndDate,
            createdOnStart:$scope.oilCreatedOnStart,
            createdOnEnd:$scope.oilCreatedOnEnd,
            paymentStatus:$scope.oilPaymentStatus,
            start:$scope.oilStart,
            size:$scope.oilSize
        })).then(function (data) {
            if (data.success === true) {
                $scope.oilBoxArray = data.result;
                $scope.oilList = $scope.oilBoxArray.slice(0, 10);
                if ($scope.oilStart > 0) {
                    $("#oilPre").show();
                }
                else {
                    $("#oilPre").hide();
                }
                if (data.result.length < $scope.oilSize) {
                    $("#oilNext").hide();
                }
                else {
                    $("#oilNext").show();
                }

            }
            else {
                swal(data.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/driveExceedOilRelCount?"+ _basic.objToUrl({
            truckId:  $scope.oilTruck,
            paymentType:2,
            driveId:  $scope.oilDriver,
            oilDateStart: $scope.oilStartDate,
            oilDateEnd: $scope.oilEndDate,
            createdOnStart:$scope.oilCreatedOnStart,
            createdOnEnd:$scope.oilCreatedOnEnd,
            paymentStatus:$scope.oilPaymentStatus,
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArrayOil = data.result[0];
            }

        })
    };

    $scope.exportOil=function (){
        // 基本检索URL
        var url = $host.api_url + "/driveExceedOilRel.csv?";
        // 检索条件

        var conditions = _basic.objToUrl({
            truckId:  $scope.oilTruck,
            paymentType:2,
            driveId:  $scope.oilDriver,
            oilDateStart: $scope.oilStartDate,
            oilDateEnd: $scope.oilEndDate,
            createdOnStart:$scope.oilCreatedOnStart,
            createdOnEnd:$scope.oilCreatedOnEnd,
            paymentStatus:$scope.oilPaymentStatus
        });
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    }

    //拒绝
    $scope.getRejectOil = function(id){
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
                    _basic.put($host.api_url + "/user/" + userId + "/driveExceedOilRel/" + id + "/paymentStatus/-1", {}).then(function (data) {
                        if (data.success === true) {
                            getOilList();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    }

    //同意
    $scope.getPastOil = function(id){
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
                    _basic.put($host.api_url + "/user/" + userId + "/driveExceedOilRel/" + id + "/paymentStatus/1", {}).then(function (data) {
                        if (data.success === true) {
                            getOilList();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    }

    /*
    *
    * 全选
    * */
    $scope.selectAllCheckBoxOil = function (event) {

        //本页全部选中
        if (event.target.checked) {
            $("[name = 'select']").prop('checked', true);
            for (var i = 0; i < $scope.oilList.length; i++) {
                $scope.initialOil.selectedIdsArr.push($scope.oilList[i].id);
                $scope.initialOil.checkedOilMoney+= $scope.oilList[i].oil_money;
                $scope.initialOil.checkedUreaMoney+= $scope.oilList[i].urea_money;

            }
        }

        //本页全不选
        else {
            $scope.initialOil={
                selectedIdsArr:[],
                checkedOilMoney:0,
                checkedUreaMoney:0
            }
            //checkbox 为空
            $("[name = 'select']").prop('checked', false);

        }
    };

    /*
    * 检测所有分选按钮是否被选中
    * */
    $scope.checkIsAllSelOil = function () {
        var selectAll = false;
        $("[name = 'select']").each(function () {
            if(!$(this).is(':checked')){
                selectAll = true;
            }
        });

        // 如果全部checkBox被选中，则改变全选按钮状态
        if(selectAll){
            $("[name = 'selectAllOil']").prop('checked' , false);
        }
        else{
            $("[name = 'selectAllOil']").prop('checked' , true);
        }
    };

    /*
    * 点击单个按钮
    * */
    $scope.checkSelMissionOil= function (event, car, index) {
        var currentSel = event.target;

        //选中  添加金额
        if(currentSel.checked){
            $scope.initialOil.selectedIdsArr.push(car.id);
            $scope.initialOil.checkedOilMoney+= car.oil_money;
            $scope.initialOil.checkedUreaMoney+= car.urea_money;
        }


        //未选中  删除金额
        else{
            // 获取取消选中的checkbox在id数组中的下标
            var noSelIndex = $scope.initialOil.selectedIdsArr.indexOf(car.id);
            $scope.initialOil.selectedIdsArr.splice(noSelIndex, 1);
            $scope.initialOil.checkedOilMoney-= car.oil_money;
            $scope.initialOil.checkedUreaMoney-= car.urea_money;

        }
    };

    /*
    *
    * 点击批量按钮
    * */
    $scope.batchDealOil= function (){
        $(".modal").modal();
        $("#openBatchDealOil").modal("open");
    }

    $scope.createListOil = function (){
        if($scope.initialOil.selectedIdsArr.length==0){
            $("#openBatchDealOil").modal("close");
            swal('请至少选择一条数据', "", "error");

        }
        else {
            swal({
                title: "确定批量领取吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
            }).then(
                function(result){
                    if (result.value) {
                        _basic.put($host.api_url + "/user/" + userId + "/paymentStatus/1/oilPaymentStatusAll", {
                            "relIds": $scope.initialOil.selectedIdsArr
                        }).then(function (data) {
                            if (data.success === true) {
                                $scope.initialOil={
                                    selectedIdsArr:[],
                                    checkedOil:0,
                                    checkedParts:0,
                                    checkedMain:0
                                }

                                $("[name = 'selectAllOil']").prop('checked', false);
                                $("#openBatchDealOil").modal("close");
                                getOilList();
                            }
                            else {
                                swal(data.msg, "", "error");
                            }
                        });
                    }
                });
        }
    }


    // 分页
    $scope.oilPreviousPage = function () {
        $scope.initialOil={
            selectedIdsArr:[],
            checkedOilMoney:0,
            checkedUreaMoney:0
        }
        $("[name = 'selectAllOil']").prop('checked', false);
        $scope.oilStart = $scope.oilStart - ($scope.oilSize-1);
        getOilList();
    };

    $scope.oilNextPage = function () {
        $scope.initialOil={
            selectedIdsArr:[],
            checkedOilMoney:0,
            checkedUreaMoney:0
        }
        $("[name = 'selectAllOil']").prop('checked', false);
        $scope.oilStart = $scope.oilStart + ($scope.repairSize-1);
        getOilList();
    };














    //现金维修
    $scope.searchRepairList = function () {
        $scope.repairStart=0;
        getReairList();
    };

    //查询按钮相关
    function getReairList () {
        _basic.get($host.api_url + "/truckRepairRel?"+ _basic.objToUrl({
            truckId:  $scope.repairTruck,
            paymentType:2,
            relId:  $scope.repairNum,
            repairDateStart: $scope.repairStartDate,
            repairDateEnd: $scope.repairEndDate,
            createdOnStart:$scope.repairCreatedOnStart,
            createdOnEnd:$scope.repairCreatedOnEnd,
            paymentStatus:$scope.repairPaymentStatus,
            start:$scope.repairStart,
            size:$scope.repairSize
        })).then(function (data) {
            if (data.success === true) {
                $scope.repairBoxArray = data.result;
                $scope.repairList = $scope.repairBoxArray.slice(0, 10);
                if ($scope.repairStart > 0) {
                    $("#repairPre").show();
                }
                else {
                    $("#repairPre").hide();
                }
                if (data.result.length < $scope.repairSize) {
                    $("#repairNext").hide();
                }
                else {
                    $("#repairNext").show();
                }

            }
            else {
                swal(data.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/truckRepairRelCount?"+ _basic.objToUrl({
            truckId:  $scope.repairTruck,
            paymentType:2,
            relId:  $scope.repairNum,
            repairDateStart: $scope.repairStartDate,
            repairDateEnd: $scope.repairEndDate,
            createdOnStart:$scope.repairCreatedOnStart,
            createdOnEnd:$scope.repairCreatedOnEnd,
            paymentStatus:$scope.repairPaymentStatus
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArrayReair = data.result[0];
            }

        })
    };

    $scope.exportRepair=function (){

        // 基本检索URL
        var url = $host.api_url + "/truckRepair.csv?";
        // 检索条件

        var conditions = _basic.objToUrl({
            truckId:  $scope.repairTruck,
            paymentType:2,
            relId:  $scope.repairNum,
            repairDateStart: $scope.repairStartDate,
            repairDateEnd: $scope.repairEndDate,
            createdOnStart:$scope.repairCreatedOnStart,
            createdOnEnd:$scope.repairCreatedOnEnd,
            paymentStatus:$scope.repairPaymentStatus
        });
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    }

    //拒绝
    $scope.getRejectReair = function(id){
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
                    _basic.put($host.api_url + "/user/" + userId + "/truckRepairRel/" + id + "/paymentStatus/-1", {}).then(function (data) {
                        if (data.success === true) {
                            getReairList();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    }

    //同意
    $scope.getPastReair = function(id){
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
                    _basic.put($host.api_url + "/user/" + userId + "/truckRepairRel/" + id + "/paymentStatus/1", {}).then(function (data) {
                        if (data.success === true) {
                            getReairList();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    }

    /*
    *
    * 全选
    * */
    $scope.selectAllCheckBoxReair = function (event) {

        //本页全部选中
        if (event.target.checked) {
            $("[name = 'select']").prop('checked', true);
            for (var i = 0; i < $scope.repairList.length; i++) {
                $scope.initialRepair.selectedIdsArr.push($scope.repairList[i].id);
                $scope.initialRepair.checkedRepair+= $scope.repairList[i].repair_money;
                $scope.initialRepair.checkedParts+= $scope.repairList[i].parts_money;
                $scope.initialRepair.checkedMain+= $scope.repairList[i].maintain_money;
            }
        }

        //本页全不选
        else {

            $scope.initialRepair={
                selectedIdsArr:[],
                checkedRepair:0,
                checkedParts:0,
                checkedMain:0
            }

            //checkbox 为空
            $("[name = 'select']").prop('checked', false);

        }
    };

    /*
    * 检测所有分选按钮是否被选中
    * */
    $scope.checkIsAllSelReair = function () {
        var selectAll = false;
        $("[name = 'select']").each(function () {
            if(!$(this).is(':checked')){
                selectAll = true;
            }
        });

        // 如果全部checkBox被选中，则改变全选按钮状态
        if(selectAll){
            $("[name = 'selectAllReair']").prop('checked' , false);
        }
        else{
            $("[name = 'selectAllReair']").prop('checked' , true);
        }
    };

    /*
    * 点击单个按钮
    * */
    $scope.checkSelMissionReair= function (event, car, index) {
        var currentSel = event.target;

        //选中  添加金额
        if(currentSel.checked){
            $scope.initialRepair.selectedIdsArr.push(car.id);
            $scope.initialRepair.checkedRepair+= car.repair_money;
            $scope.initialRepair.checkedParts+= car.parts_money;
            $scope.initialRepair.checkedMain+= car.maintain_money;

        }


        //未选中  删除金额
        else{
            // 获取取消选中的checkbox在id数组中的下标
            var noSelIndex = $scope.initialRepair.selectedIdsArr.indexOf(car.id);
            $scope.initialRepair.selectedIdsArr.splice(noSelIndex, 1);
            $scope.initialRepair.checkedRepair-= car.repair_money;
            $scope.initialRepair.checkedParts-= car.parts_money;
            $scope.initialRepair.checkedMain-= car.maintain_money;

        }
    };

    /*
    *
    * 点击批量按钮
    * */
    $scope.batchDealReair= function (){
        $(".modal").modal();
        $("#openBatchDeal").modal("open");
    }

    $scope.createListRepair = function (){
        if($scope.initialRepair.selectedIdsArr.length==0){
            $("#openBatchDeal").modal("close");
            swal('请至少选择一条数据', "", "error");

        }
        else {
            swal({
                title: "确定批量领取吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
            }).then(
                function(result){
                    if (result.value) {
                        _basic.put($host.api_url + "/user/" + userId + "/paymentStatus/1/repairPaymentStatusAll", {
                            "relIds": $scope.initialRepair.selectedIdsArr
                        }).then(function (data) {
                            if (data.success === true) {
                                $scope.initialRepair={
                                    selectedIdsArr:[],
                                    checkedRepair:0,
                                    checkedParts:0,
                                    checkedMain:0
                                }

                                $("[name = 'selectAllReair']").prop('checked', false);
                                $("#openBatchDeal").modal("close");
                                getReairList();
                            }
                            else {
                                swal(data.msg, "", "error");
                            }
                        });
                    }
                });
        }
    }


    // 分页
    $scope.repairPreviousPage = function () {
        //初始化
        $scope.initialRepair={
            selectedIdsArr:[],
            checkedRepair:0,
            checkedParts:0,
            checkedMain:0
        }
        $("[name = 'selectAllReair']").prop('checked', false);
        $scope.repairStart = $scope.repairStart - ($scope.repairSize-1);
        getReairList();
    };

    $scope.repairNextPage = function () {
        $scope.initialRepair={
            selectedIdsArr:[],
            checkedRepair:0,
            checkedParts:0,
            checkedMain:0
        }
        $("[name = 'selectAllReair']").prop('checked', false);
        $scope.repairStart = $scope.repairStart + ($scope.repairSize-1);
        getReairList();
    };












    //现金etc
    // 点击搜索
    $scope.searchETCList = function () {
        $scope.etcStart=0;
        getETCList();
    };

    //查询按钮相关
    function getETCList () {
            _basic.get($host.api_url + "/truckEtc?"+ _basic.objToUrl({
                paymentType:2,
                truckId:  $scope.etcTruck,
                driveId:  $scope.etcDriver,
                etcDateStart: $scope.etcStartDate,
                etcDateEnd: $scope.etcEndDate,
                createdOnStart:$scope.etcCreatedOnStart,
                createdOnEnd:$scope.etcCreatedOnEnd,
                paymentStatus:$scope.etcPaymentStatus,
                start:$scope.etcStart,
                size:$scope.etcSize
            })).then(function (data) {
                if (data.success === true) {
                    $scope.etcBoxArray = data.result;
                    $scope.etcList = $scope.etcBoxArray.slice(0, 10);
                    if ($scope.etcStart > 0) {
                        $("#etcPre").show();
                    }
                    else {
                        $("#etcPre").hide();
                    }
                    if (data.result.length < $scope.etcSize) {
                        $("#etcNext").hide();
                    }
                    else {
                        $("#etcNext").show();
                    }

                }
                else {
                    swal(data.msg, "", "error");
                }
            });
            _basic.get($host.api_url + "/truckEtcFeeCount?"+ _basic.objToUrl({
                paymentType:2,
                truckId:  $scope.etcTruck,
                driveId:  $scope.etcDriver,
                etcDateStart: $scope.etcStartDate,
                etcDateEnd: $scope.etcEndDate,
                createdOnStart:$scope.etcCreatedOnStart,
                createdOnEnd:$scope.etcCreatedOnEnd,
                paymentStatus:$scope.etcPaymentStatus
            })).then(function (data) {
                if (data.success === true) {
                    $scope.boxArrayEtc = data.result[0].etc_fee;
                }

            })
    };

    $scope.exportEtc=function (){

        // 基本检索URL
        var url = $host.api_url + "/truckEtc.csv?";
        // 检索条件

        var conditions = _basic.objToUrl({
            paymentType:2,
            truckId:  $scope.etcTruck,
            driveId:  $scope.etcDriver,
            etcDateStart: $scope.etcStartDate,
            etcDateEnd: $scope.etcEndDate,
            createdOnStart:$scope.etcCreatedOnStart,
            createdOnEnd:$scope.etcCreatedOnEnd,
            paymentStatus:$scope.etcPaymentStatus
        });
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    }

    //拒绝
    $scope.getRejectEtc = function(id){
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
                    _basic.put($host.api_url + "/user/" + userId + "/truckEtc/" + id + "/paymentStatus/-1", {}).then(function (data) {
                        if (data.success === true) {
                            getETCList();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    }

    //同意
    $scope.getPastEtc = function(id){
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
                    _basic.put($host.api_url + "/user/" + userId + "/truckEtc/" + id + "/paymentStatus/1", {}).then(function (data) {
                        if (data.success === true) {
                            getETCList();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    }

    /*
    *
    * 全选
    * */
    $scope.selectAllCheckBoxEtc = function (event) {

        //本页全部选中
        if (event.target.checked) {
            $("[name = 'select']").prop('checked', true);
            for (var i = 0; i < $scope.etcList.length; i++) {
                $scope.initialEtc.selectedIdsArr.push($scope.etcList[i].id);
                $scope.initialEtc.checkedEtc+= $scope.etcList[i].etc_fee;
            }
        }

        //本页全不选
        else {

            //初始化
            $scope.initialEtc={
                selectedIdsArr:[],
                checkedEtc:0
            }
            //checkbox 为空
            $("[name = 'select']").prop('checked', false);

        }
    };

    /*
    * 检测所有分选按钮是否被选中
    * */
    $scope.checkIsAllSelEtc = function () {
        var selectAll = false;
        $("[name = 'select']").each(function () {
            if(!$(this).is(':checked')){
                selectAll = true;
            }
        });

        // 如果全部checkBox被选中，则改变全选按钮状态
        if(selectAll){
            $("[name = 'selectAllEtc']").prop('checked' , false);
        }
        else{
            $("[name = 'selectAllEtc']").prop('checked' , true);
        }
    };

    /*
    * 点击单个按钮
    * */
    $scope.checkSelMissionEtc = function (event, car, index) {
        var currentSel = event.target;

        //选中  添加金额
        if(currentSel.checked){
            $scope.initialEtc.selectedIdsArr.push(car.id);
            $scope.initialEtc.checkedEtc+= car.etc_fee;

        }


        //未选中  删除金额
        else{
            // 获取取消选中的checkbox在id数组中的下标
            var noSelIndex = $scope.initialEtc.selectedIdsArr.indexOf(car.id);
            $scope.initialEtc.selectedIdsArr.splice(noSelIndex, 1);
            $scope.initialEtc.checkedEtc-= car.etc_fee;

        }
    };

    /*
    *
    * 点击批量按钮
    * */
    $scope.batchDealEtc= function (){
        if($scope.initialEtc.selectedIdsArr.length==0){
            swal('请至少选择一条数据', "", "error");

        }
        else {
            swal({
                title: "确定批量领取吗？",
                text: '批量过路费'+$scope.initialEtc.checkedEtc +'元',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
            }).then(
                function(result){
                    if (result.value) {
                        _basic.put($host.api_url + "/user/" + userId + "/paymentStatus/1/paymentStatusAll", {
                            "truckEtcIds": $scope.initialEtc.selectedIdsArr
                        }).then(function (data) {
                            if (data.success === true) {
                                //初始化
                                $scope.initialEtc={
                                    selectedIdsArr:[],
                                    checkedEtc:0,
                                };
                                $("[name = 'selectAllEtc']").prop('checked', false);
                                getETCList();
                            }
                            else {
                                swal(data.msg, "", "error");
                            }
                        });
                    }
                });
        }
    }

    // 分页
    $scope.etcPreviousPage = function () {
        //初始化
        $scope.initialEtc={
            selectedIdsArr:[],
            checkedEtc:0,
        };
        $("[name = 'selectAllEtc']").prop('checked', false);
        $scope.etcStart = $scope.etcStart - ($scope.etcSize-1);
        getETCList();
    };

    $scope.etcNextPage = function () {
        //初始化
        $scope.initialEtc={
            selectedIdsArr:[],
            checkedEtc:0,
        };
        $("[name = 'selectAllEtc']").prop('checked', false);
        $scope.etcStart = $scope.etcStart + ($scope.etcSize-1);
        getETCList();
    };

































    $scope.cash_oil();
    getTruckNumList ();
    getDriveNameList ();

}]);