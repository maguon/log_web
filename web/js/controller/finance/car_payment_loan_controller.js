app.controller("car_payment_loan_controller", ["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {
    $scope.start = 0;
    $scope.size = 11;
    // 获取所有经销商car
     function getreceiveName () {
        _basic.get($host.api_url + "/receive").then(function (receiveData) {
            if (receiveData.success === true) {
                $scope.receiveNameList = receiveData.result;
            }
            else {
                swal(receiveData.msg, "", "error");
            }
        })
    };
    // 获取商品车理赔打款管理列表
    $scope.getPaymentLoanList = function () {


        // 基本检索URL
        var url = $host.api_url + "/damageCheckIndemnity?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success === true) {
                // 当前画面的检索信息
                var pageItems = {
                    pageId: "car_payment_loan",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.boxArray = data.result;
                $scope.paymentLoanList = $scope.boxArray.slice(0, 10);
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

    // 点击搜索按钮
    $scope.searchPaymentLoanList = function () {
        $scope.start = 0;
        $scope.getPaymentLoanList();
    };

    // 下载csv
    $scope.downloadCsvFile = function () {
        // 基本检索URL
        var url = $host.api_url + "/damageCheckIndemnity.csv?";
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.damageId=conditions.damageId;
        $scope.indemnityStatus=conditions.indemnityStatus;
        $scope.applyUserName=conditions.applyUserName;
        $scope.planMoneyStart=conditions.planMoneyStart;
        $scope.planMoneyEnd=conditions.planMoneyEnd;
        $scope.receiveName=conditions.receiveName;
        $scope.applyDateStart=conditions.applyDateStart;
        $scope.applyDateEnd=conditions.applyDateEnd;
        $scope.indemnityDateStart=conditions.indemnityDateStart;
        $scope.indemnityDateEnd=conditions.indemnityDateEnd;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            damageId: $scope.damageId,
            indemnityStatus: $scope.indemnityStatus,
            applyUserName: $scope.applyUserName,
            planMoneyStart: $scope.planMoneyStart,
            planMoneyEnd: $scope.planMoneyEnd,
            receiveName: $scope.receiveName,
            applyDateStart: $scope.applyDateStart,
            applyDateEnd: $scope.applyDateEnd,
            indemnityDateStart: $scope.indemnityDateStart,
            indemnityDateEnd: $scope.indemnityDateEnd
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "car_payment_loan_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "car_payment_loan") {
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
        $scope.getPaymentLoanList();

    }
    initData();



    // 分页
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.getPaymentLoanList();
    };

    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.getPaymentLoanList();
    };

    // 获取数据
    $scope.queryData = function () {
        getreceiveName();
        $scope.searchPaymentLoanList();
    };
    $scope.queryData();

}])