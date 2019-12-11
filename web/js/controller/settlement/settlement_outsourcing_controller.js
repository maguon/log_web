app.controller("settlement_outsourcing_controller", ["_basic","$rootScope", "_config", "$host", "$scope", "$state", "$stateParams",function (_basic,$rootScope, _config, $host, $scope,$state, $stateParams) {
    $scope.start1 = 0;
    $scope.size1 = 11;
    $scope.start = 0;
    $scope.size = 11;
    $("#prebtn").hide();
    $("#nextbtn").hide();
    $scope.receiveList=[];
    $scope.locateList =[];
    $scope.carMsg=[];
    //用户名
    var userId = _basic.getSession(_basic.USER_ID);

    // 跳转
    $scope.importFile = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.importFile ').addClass("active");
        $("#importFile").addClass("active");
        $("#importFile").show();
    };
    $scope.lookMyselfFile = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.lookMyselfFile ').addClass("active");
        $("#lookMyselfFile").addClass("active");
        $("#lookMyselfFile").show();
    };
    $scope.importFile  ();


    // 获取所有公司列表
    function getEntrust(){
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.get_entrust = data.result;
                $('#entrust').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/company?operateType=2").then(function (data) {
            if (data.success === true) {
                $scope.companyList = data.result;
                $('#truck_company').select2({
                    placeholder: '外协公司',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#conCompany').select2({
                    placeholder: '外协公司',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });


            }
            else {
                swal(data.msg, "", "error");
            }
        });
         //城市
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.cityList = data.result;
                $('#startCity').select2({
                    placeholder: '始发城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#endCity').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
        });
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success === true) {
                $scope.brandList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 发运地名称
    $scope.getAddrData = function () {
        if($scope.startCity == 0 || $scope.startCity == "" || $scope.startCity == null){
            $scope.startCity = null;
            $scope.locateList = [];
        }
        else{
            _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.startCity).then(function (data) {
                if (data.success === true) {
                    $scope.locateList = data.result;
                    $('#chooseLocate').select2({
                        placeholder: '装车地点',
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    };

    //获取经销商
    $scope.getReceiveMod = function (id) {
        _basic.get($host.api_url + "/receive?cityId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.receiveList = data.result;
                $('#receiveId').select2({
                    placeholder: '经销商',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    };

    // 数据导出
    $scope.export = function () {
        if($scope.instruct_starTime==undefined||$scope.instruct_endTime==undefined||$scope.orderStarTime==undefined||$scope.orderEndTime==undefined){
            swal('请输入完整的指令日期和调度日期', "", "error");
            $scope.settlementList=[];
            $("#prebtn").hide();
            $("#nextbtn").hide();
        }
        else {
            var obj = {
                entrustId: $scope.entrustId,
                orderStart: $scope.instruct_starTime,
                orderEnd: $scope.instruct_endTime,
                taskPlanDateStart:$scope.orderStarTime,
                taskPlanDateEnd:$scope.orderEndTime,
                makeId: $scope.car_brand,
                routeStartId: $scope.startCity,
                addrId: $scope.locateId,
                routeEndId: $scope.endCity,
                receiveId: $scope.receiveId,
                settleStatus:$scope.conStatus,
                vin:$scope.vin,
                operateType:2,
                companyId:$scope.companyId
            };
            swal({
                title: "确定导出外协结算报表？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(
                function (result) {
                    if (result.value) {
                        window.open($host.api_url + "/settleOuterTruck.csv?" + _basic.objToUrl(obj));
                    }
                })

        }
    };

    //查询功能
    $scope.getSettlement = function (){
        $scope.start1 = 0;
        getSettlementData();
    }

    $scope.addHandover=function (){

        var obj={
            entrustId: $scope.entrustId,
            orderStart: $scope.instruct_starTime,
            orderEnd: $scope.instruct_endTime,
            taskPlanDateStart:$scope.orderStarTime,
            taskPlanDateEnd:$scope.orderEndTime,
            makeId: $scope.car_brand,
            routeStartId: $scope.startCity,
            addrId: $scope.locateId,
            routeEndId: $scope.endCity,
            receiveId: $scope.receiveId,
            companyId:$scope.companyId,
            vin:$scope.vin,
            operateType:2,
            settleStatus:1
        }

        swal({
            title: "确定交接当前车辆吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
                _basic.get($host.api_url + "/settleOuterInvoiceBatch?" + _basic.objToUrl(obj)).then(function (data) {
                    if (data.success == true) {
                        swal('交接成功', "", "success");
                        getSettlementData();

                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
        })

    }

    //获取查询数据
    function getSettlementData(){
        if($scope.instruct_starTime==undefined||$scope.instruct_endTime==undefined||$scope.orderStarTime==undefined||$scope.orderEndTime==undefined){
            swal('请输入完整的指令日期和调度日期', "", "error");
            $scope.settlementList=[];
            $scope.carMsg ='';
            $("#prebtn").hide();
            $("#nextbtn").hide();
        }
        else{
            _basic.get($host.api_url + "/settleOuterTruckList?" + _basic.objToUrl({
                entrustId: $scope.entrustId,
                orderStart: $scope.instruct_starTime,
                orderEnd: $scope.instruct_endTime,
                taskPlanDateStart:$scope.orderStarTime,
                taskPlanDateEnd:$scope.orderEndTime,
                makeId: $scope.car_brand,
                routeStartId: $scope.startCity,
                addrId: $scope.locateId,
                routeEndId: $scope.endCity,
                receiveId: $scope.receiveId,
                settleStatus:$scope.conStatus,
                vin:$scope.vin,
                operateType:2,
                companyId:$scope.companyId,
                start:$scope.start1.toString(),
                size:$scope.size1
            })).then(function (data) {
                if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.settlementList = $scope.boxArray.slice(0, 10);
                    if ($scope.start1 > 0) {
                        $("#prebtn").show();
                    }
                    else {
                        $("#prebtn").hide();
                    }
                    if (data.result.length < $scope.size1) {
                        $("#nextbtn").hide();
                    }
                    else {
                        $("#nextbtn").show();
                    }
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
            var obj = {
                entrustId: $scope.entrustId,
                orderStart: $scope.instruct_starTime,
                orderEnd: $scope.instruct_endTime,
                taskPlanDateStart:$scope.orderStarTime,
                taskPlanDateEnd:$scope.orderEndTime,
                makeId: $scope.car_brand,
                routeStartId: $scope.startCity,
                addrId: $scope.locateId,
                routeEndId: $scope.endCity,
                receiveId: $scope.receiveId,
                settleStatus:$scope.conStatus,
                vin:$scope.vin,
                operateType:2,
                companyId:$scope.companyId
            };
            _basic.get($host.api_url + "/settleOuterTruckCarCount?" + _basic.objToUrl(obj)).then(function (data) {
                if (data.success == true) {
                    if (data.result.length > 0) {
                        $scope.carMsg = data.result[0];
                    }
                    else {
                        $scope.carMsg = [];
                    }

                }
                else {
                    swal(data.msg, "", "error");
                }
            });

        }

    }
 /*   //结算车辆数 结算金额
    function getCarMsg () {
        if ($scope.instruct_starTime == undefined || $scope.instruct_endTime == undefined) {
            swal('请输入完整的指令时间', "", "error");
            $scope.settlementList = [];
            $scope.carMsg ='';
            $("#prebtn").hide();
            $("#nextbtn").hide();

        }
        else {
            var obj = {
                entrustId: $scope.entrustId,
                orderStart: $scope.instruct_starTime,
                orderEnd: $scope.instruct_endTime,
                makeId: $scope.car_brand,
                routeStartId: $scope.startCity,
                addrId: $scope.locateId,
                routeEndId: $scope.endCity,
                receiveId: $scope.receiveId,
                vin:$scope.vin,
                operateType:2,
                companyId:$scope.companyId
            };
            _basic.get($host.api_url + "/settleOuterTruckCarCount?" + _basic.objToUrl(obj)).then(function (data) {
                if (data.success == true) {
                    if (data.result.length > 0) {
                        $scope.carMsg = data.result[0];
                    }
                    else {
                        $scope.carMsg = [];
                    }

                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }*/
    // 分页
    $scope.pre_btn = function () {
        $scope.start1 = $scope.start1 - ($scope.size1-1);
        getSettlementData();
    };

    $scope.next_btn = function () {
        $scope.start1 = $scope.start1 + ($scope.size1-1);
        getSettlementData();
    };

















    /**
     * 查询按钮
     */
    $scope.getInvoice = function () {
        $scope.start = 0;
        searchInvoiceList();
    }




    /**
     * 根据条件搜索
     */
    function searchInvoiceList() {


        // 基本检索URL
        var url = $host.api_url + "/settleOuterInvoice?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {
                $scope.boxArray = data.result;
                $scope.invoiceList = $scope.boxArray.slice(0, 10);
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

    /*
    * 删除
    * */
    $scope.delete = function(id){
        swal({
            title: "确定删除当前信息吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
                _basic.delete($host.api_url + "/user/" + userId + "/settleOuterInvoice/" + id).then(function (data) {
                    if (data.success === true) {
                        searchInvoiceList();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
        })
    }



    $scope.putDetail = function(id){
        $scope.settleOuterInvoiceId=id;
        $('.modal').modal();
        $('#lookDetail').modal('open');

        _basic.get($host.api_url + "/settleOuterInvoice?outerInvoiceId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.detailItem = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/settleOuterInvoiceCarRel?outerInvoiceId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.detailList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }


    /**
     修改费用申请
     */
    $scope.saveInvoice = function (){
        //必填条件
        if($scope.detailItem.update_price !== null){
            _basic.put($host.api_url + "/user/" + userId + "/settleOuterInvoice/"+   $scope.settleOuterInvoiceId,{
                "updatePrice": $scope.detailItem.update_price,
                "actualPrice": $scope.detailItem.plan_price-$scope.detailItem.update_price,
                "remark":$scope.detailItem.remark
            }).then(function (data) {
                if (data.success === true) {
                    $('#lookDetail').modal('close');
                    swal("修改成功", "", "success");
                    searchInvoiceList();
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


    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            companyId:$scope.conCompany,
            invoiceStatus:$scope.status
        };
    }




        // 查询数据
        searchInvoiceList();






// 数据导出
    $scope.exportSettle = function (id) {

        var obj = {
            settleOuterInvoiceId:id,
        };
        swal({
            title: "确定导出外协结算报表？",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        }).then(
            function (result) {
                if (result.value) {
                    window.open($host.api_url + "/settleOuterInvoiceCarRel.csv?" + _basic.objToUrl(obj));
                }
            })


    };




    // 分页
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        searchInvoiceList();
    };

    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        searchInvoiceList();
    };

    getEntrust();
    searchInvoiceList()




}])
