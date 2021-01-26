app.controller("driver_settlement_controller", ["_basic", "_config", "$host", "$scope", function (_basic, _config, $host, $scope) {
    $scope.start = 0;
    $scope.size = 11;

    $("#pre").hide();
    $("#next").hide();
    $("#preSalary").hide();
    $("#nextSalary").hide();
    // 跳转
    $scope.driverOutput = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.driverOutput ').addClass("active");
        $("#driverOutput").addClass("active");
        $("#driverOutput").show();
    };
    $scope.driverSalary = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.driverSalary ').addClass("active");
        $("#driverSalary").addClass("active");
        $("#driverSalary").show();
    };
    $scope.driverOutput();

    $("#pre").hide();
    $("#next").hide();


    //司机 公司
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive?driveName=").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#driveName').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown'
                });
                $('#driveNameSalary').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
       /* _basic.get($host.api_url + "/company").then(function (data) {
            if (data.success === true) {
                $scope.companyList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });*/
    }

    //获取货车牌号
    function getTruckNum() {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAllList = data.result;
                $('#truckNum').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $('#truckNumSalary').select2({
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

    // 根据select选择的所属类型获取所属公司信息
    $scope.chooseOperateType = function () {
        _basic.get($host.api_url + "/company?operateType=" + $scope.operateType).then(function (companyData) {
            if (companyData.success === true) {
                $scope.companyList = companyData.result;
            }
            else {
                swal(companyData.msg, "", "error");
            }
        });
    };
    // 根据select选择的所属类型获取所属公司信息
    $scope.chooseOperateTypeSalary = function () {
        _basic.get($host.api_url + "/company?operateType=" + $scope.operateTypeSalary).then(function (companyData) {
            if (companyData.success === true) {
                $scope.companyListSalary = companyData.result;
            }
            else {
                swal(companyData.msg, "", "error");
            }
        });
    };

    // 数据导出
    $scope.export = function () {
        if($scope.instruct_starTime==undefined||$scope.instruct_endTime==undefined){
            swal('请输入完整的查询时间', "", "error");
        }
        else {
            var obj = {
                taskPlanDateStart:  moment($scope.instruct_starTime).format('YYYYMMDD'),
                taskPlanDateEnd:  moment($scope.instruct_endTime).format('YYYYMMDD'),
                driveId: $scope.drivderId,
                companyId: $scope.searchCompany,
                operateType: $scope.operateType,
                truckId: $scope.truckNum

            };
            swal({
                    title: "确定导出司机产值结算表？",
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
            }).then(
                function (result) {
                    if (result.value) {
                        window.open($host.api_url + "/driveSettleOutput.csv?" + _basic.objToUrl(obj));
                    }
                })
        }
    }

    // 数据导出
    $scope.exportDatail = function () {
        if($scope.instruct_starTime==undefined||$scope.instruct_endTime==undefined){
            swal('请输入完整的查询时间', "", "error");
        }
        else {
            var obj = {
                taskPlanDateStart:  moment($scope.instruct_starTime).format('YYYYMMDD'),
                taskPlanDateEnd:  moment($scope.instruct_endTime).format('YYYYMMDD'),
                driveId: $scope.drivderId,
                companyId: $scope.searchCompany,
                operateType: $scope.operateType,
                truckId: $scope.truckNum

            };
            swal({
                title: "确定导出司机结算产值表详情？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(
                function (result) {
                    if (result.value) {
                        window.open($host.api_url + "/driveSettleDetail.csv?" + _basic.objToUrl(obj));
                    }
                })
        }
    }
    $scope.exportSalary =function (){
        if($scope.instruct_starTimeSalary==undefined||$scope.instruct_endTimeSalary==undefined){
            swal('请输入完整的查询时间', "", "error");
            $scope.settlementListSalary=[];
        }
        else {
            var obj = {
                taskPlanDateStart:  moment($scope.instruct_starTimeSalary).format('YYYYMMDD'),
                taskPlanDateEnd:  moment($scope.instruct_endTimeSalary).format('YYYYMMDD'),
                driveId: $scope.drivderIdSalary,
                companyId: $scope.searchCompanySalary,
                operateType: $scope.operateTypeSalary,
                truckId: $scope.truckNumSalary

            };
            swal({
                title: "确定导出司机工资表？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(
                function (result) {
                    if (result.value) {
                        window.open($host.api_url + "/driveSettleSalary.csv?" + _basic.objToUrl(obj));
                    }
                })
        }
    }

    //查询功能
    $scope.getSettlement = function (){
        $scope.start = 0;
        getSettlementData();
    }

    //获取查询数据
    function getSettlementData(){
        if($scope.instruct_starTime==undefined||$scope.instruct_endTime==undefined){
            swal('请输入完整的查询时间', "", "error");
            $scope.settlementList=[];
        }
        else{
            _basic.get($host.api_url + "/driveSettleOutput?" + _basic.objToUrl({
                taskPlanDateStart:  moment($scope.instruct_starTime).format('YYYYMMDD'),
                taskPlanDateEnd:  moment($scope.instruct_endTime).format('YYYYMMDD'),
                driveId: $scope.drivderId,
                companyId: $scope.searchCompany,
                operateType: $scope.operateType,
                truckId: $scope.truckNum,
                start: $scope.start.toString(),
                size: $scope.size
            })).then(function (data) {
                if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.settlementList = $scope.boxArray.slice(0, 10);
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
    }

    //司机工资查询按钮
    $scope.getSettlementSalary= function (){
        $scope.start = 0;
        getSettlementDataSalary();
    }

    //获取查询数据
    function getSettlementDataSalary(){
        if($scope.instruct_starTimeSalary==undefined||$scope.instruct_endTimeSalary==undefined){
            swal('请输入完整的查询时间', "", "error");
            $scope.settlementListSalary=[];
        }
        else{
            _basic.get($host.api_url + "/driveSettleSalary?" + _basic.objToUrl({
                taskPlanDateStart:  moment($scope.instruct_starTimeSalary).format('YYYYMMDD'),
                taskPlanDateEnd:  moment($scope.instruct_endTimeSalary).format('YYYYMMDD'),
                driveId: $scope.drivderIdSalary,
                companyId: $scope.searchCompanySalary,
                operateType: $scope.operateTypeSalary,
                truckId: $scope.truckNumSalary,
                start: $scope.start.toString(),
                size: $scope.size
            })).then(function (data) {
                if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.settlementListSalary = $scope.boxArray.slice(0, 10);
                    if ($scope.start > 0) {
                        $("#preSalary").show();
                    }
                    else {
                        $("#preSalary").hide();
                    }
                    if (data.result.length < $scope.size) {
                        $("#nextSalary").hide();
                    }
                    else {
                        $("#nextSalary").show();
                    }
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }

    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getSettlementData();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getSettlementData();
    };


    // 分页
    $scope.getPrePageSalary = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getSettlementDataSalary();
    };
    $scope.getNextPageSalary = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getSettlementDataSalary();
    };



    getTruckNum();
    getDriveNameList ();
}])
