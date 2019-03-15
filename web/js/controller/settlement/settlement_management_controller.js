/**
 * Created by star  on 2018/6/5.
 */

//结算管理
app.controller("settlement_management_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_basic", function ($scope,$rootScope,$state,$stateParams,$host, _basic) {
    $scope.start = 0;
    $scope.size = 11;
    $scope.addNumberId = 0;
    var userId = _basic.getSession(_basic.USER_ID);

    //提交人
    function  getopUserId(){
        _basic.get($host.api_url + "/user?typeArr=61%2C69").then(function (data) {
            if (data.success === true) {
                $scope.opUserNameList = data.result;
                $('#opUserName').select2({
                    placeholder: '提交人',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
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
        // 基本检索URL
        var url = $host.api_url + "/settleHandover.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };

    //查询功能
    $scope.getSettlement = function (){
        $scope.start = 0;
        getSettlementData();
    }

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.handover=conditions.number;
        $scope.VIN=conditions.vinCode;
        $scope.numberId=conditions.serialNumber;
        $scope.opUserName=conditions.opUserId;
        $scope.startCity=conditions.routeStartId;
        $scope.entrustId=conditions.entrustId;
        $scope.endCity=conditions.routeEndId;
        $scope.receiveId=conditions.receiveId;
        $scope.handoverReceiveStartTime=conditions.receivedDateStart;
        $scope.handoverReceiveEndTime=conditions.receivedDateEnd;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
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
    }


    //获取查询数据
    function getSettlementData(){

        // 基本检索URL
        var url = $host.api_url + "/settleHandover?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "settlement_management",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);

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
                    text:'' ,
                    type:'warning',
                    html: '<p style="color:red;font-size: 18px">提交后委托方将不可修改</p><p style="margin-top: 30px">点击确定后将跳转到交接单详情页</p>',
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消"
            }).then(
                function (result) {
                    if (result.value) {
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
                                    id: $scope.settleHandoverId,
                                    from: 'settlement_management'
                                });

                                /*  window.location.href = "/index_home.html#!/settlement_management_detail/id/"+ $scope.settleHandoverId;*/

                            } else {
                                swal(data.msg, "", "error");
                            }
                        })
                    }
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


    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "settlement_management_detail" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "settlement_management") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);

                /*委托方*/
                $scope.entrustNm = pageItems.conditions.entrustNm;
                /*始发城市*/
                $scope.routeStartNm = pageItems.conditions.routeStartNm;
                /*目的城市*/
                $scope.routeEndNm = pageItems.conditions.routeEndNm;
                $scope.routeEndId = pageItems.conditions.routeEndId;
                /*提交人*/
                $scope.opUserNm = pageItems.conditions.opUserNm;
                /*经销商*/
                $scope.receiveNm = pageItems.conditions.receiveNm;


            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};

            $scope.routeEndNm = "目的城市";
            $scope.routeStartNm = "始发城市";
            $scope.entrustNm = "委托方";
            $scope.opUserNm = "提交人";
            $scope.receiveNm = "经销商";
            $scope.routeStartId='';
        }
        $scope.getReceiveMod($scope.routeEndId);
        // 查询数据
        getSettlementData();

    }
    initData();



    //获取数据
    function queryData() {
        getopUserId();
        getSettlementData();
        getCityInfo();
        getEntrustData();
    }
    queryData()
}])