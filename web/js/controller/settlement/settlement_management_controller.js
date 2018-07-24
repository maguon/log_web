/**
 * Created by star  on 2018/6/5.
 */

//结算管理
app.controller("settlement_management_controller", ["$scope","$state","$stateParams", "$host", "_basic", function ($scope,$state,$stateParams,$host, _basic) {
    $scope.start = 0;
    $scope.size = 11;
    $scope.addNumberId = 0;
    var userId = _basic.getSession(_basic.USER_ID);
    //提交人
    function  getopUserId(){
        _basic.get($host.api_url + "/settleHandover?typeArr=61%2C69").then(function (data) {
            if (data.success === true) {
                $scope.opUserNameList = data.result;
                $('#opUserName').select2({
                    placeholder: '提交人',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
    }
    // 获取起始城市信息
    function getCityInfo() {
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.cityList = cityData.result;
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
            else {
                swal(cityData.msg, "", "error");
            }
        });
    };


    // 委托方
   function getEntrustData() {
        _basic.get($host.api_url + "/entrust").then(function (entrustData) {
            if (entrustData.success === true) {
                $scope.entrustList = entrustData.result;
                $('#entrustId').select2({
                    placeholder: '委托方',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#addEntrustId').select2({
                    placeholder: '委托方',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });

            }
            else {
                swal(entrustData.msg, "", "error");
            }
        });
    };


    // 经销商
    $scope.getReceiveMod = function (id) {
        if(id == 0 || id == "" || id == null){
           id = null;
           $scope.receiveList = [];
        }
        else{
            _basic.get($host.api_url + "/receive?cityId=" +id ).then(function (receiveData) {
                if (receiveData.success === true) {
                    $scope.receiveList = receiveData.result;
                }
                else {
                    swal(receiveData.msg, "", "error");
                }
            });
        }
    };

    // 数据导出
    $scope.export = function () {
        var obj = {
            number:$scope.handover,
            vinCode:$scope.VIN,
            serialNumber:$scope.numberId,
            opUserId:$scope.opUserName,
            routeStartId: $scope.startCity,
            entrustId:$scope.entrustId,
            routeEndId:$scope.endCity,
            receiveId:$scope.receiveId,
            receivedDateStart:$scope.handoverReceiveStartTime,
            receivedDateEnd:$scope.handoverReceiveEndTime
        };
        window.open($host.api_url + "/settleHandover.csv?" + _basic.objToUrl(obj));
    };

    //查询功能
    $scope.getSettlement = function (){
        $scope.start = 0;
        getSettlementData();
    }

    //获取查询数据
    function getSettlementData(){
        _basic.get($host.api_url + "/settleHandover?" + _basic.objToUrl({
            number:$scope.handover,
            vinCode:$scope.VIN,
            serialNumber:$scope.numberId,
            opUserId:$scope.opUserName,
            routeStartId: $scope.startCity,
            entrustId:$scope.entrustId,
            routeEndId:$scope.endCity,
            receiveId:$scope.receiveId,
            receivedDateStart:$scope.handoverReceiveStartTime,
            receivedDateEnd:$scope.handoverReceiveEndTime,
            start:$scope.start.toString(),
            size:$scope.size
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


    //打开添加模态框
    $scope.addSettlement = function (){
        $scope.entrustList = [];
        $scope.entrustId = '';
        $scope.newRemark = '';
        $scope.addNumberId = 0;
        $scope.addHandoverReceiveStartTime = moment(new Date()).format("YYYY-MM-DD");
        getEntrustData();
        $('#addSettlementItem').modal('open');
    }

    //点击確定
    $scope.addSettlementItem = function(){
        if ($scope.addEntrustId !== undefined&& $scope.addNumberId!==undefined) {
            swal({
                    title: "确定提交？",
                    text: '<p style="color:red;font-size: 18px">提交后委托方将不可修改</p><p style="margin-top: 30px">点击确定后将跳转到交接单详情页</p>',
                    type:'warning',
                    html: true,
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    closeOnConfirm: true
                },
                function () {
                    _basic.post($host.api_url + "/user/" + userId + "/settleHandover", {
                        serialNumber: $scope.addNumberId,
                        entrustId: $scope.addEntrustId,
                        receivedDate: $scope.addHandoverReceiveStartTime,
                        remark: $scope.newRemark
                    }).then(function (data) {
                        if (data.success == true) {
                           $scope.settleHandoverId = data.result.settleHandoverId;
                            $('#addSettlementItem').modal('close');
                            getSettlementData();
                            $state.go('settlement_management_detail', {
                                reload: true,
                                id:$scope.settleHandoverId,
                                from: 'settlement_management'
                            });

                          /*  window.location.href = "/index_home.html#!/settlement_management_detail/id/"+ $scope.settleHandoverId;*/

                        } else {
                            swal(data.msg, "", "error");
                        }
                    })
                });
        }
        else {
            swal("请填写完整信息！", "", "warning");
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

    //获取数据
    function queryData() {
        getopUserId();
        getSettlementData();
        getCityInfo();
        getEntrustData();
    }
    queryData()
}])