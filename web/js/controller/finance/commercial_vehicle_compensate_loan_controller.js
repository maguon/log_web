app.controller("commercial_vehicle_compensate_loan_controller", ["$scope","$rootScope", "$state", "$stateParams",  "$host", "_basic", function ($scope,$rootScope, $state, $stateParams, $host, _basic) {

    $scope.start = 0;
    $scope.size = 11;

    // 获取所有保险公司
    $scope.getInsuranceCompany = function () {
        _basic.get($host.api_url + "/truckInsure").then(function (data) {
            if (data.success === true) {
                $scope.insuranceCompanyList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取商品车理赔借款管理列表
    $scope.getCommercialLoanList = function () {

        // 基本检索URL
        var url = $host.api_url + "/damageInsureLoan?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success === true) {
                // 当前画面的检索信息
                var pageItems = {
                    pageId: "commercial_vehicle_compensate_loan",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.boxArray = data.result;
                $scope.commercialLoanList = $scope.boxArray.slice(0, 10);
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
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.paymentNum=conditions.damageInsureId;
        $scope.insureCompany=conditions.insureId;
        $scope.agentPerson=conditions.insureUserName;
        $scope.handleStatus=conditions.loanStatus;
        $scope.loanMoneyStart=conditions.loanMoneyStart;
        $scope.loanMoneyEnd=conditions.loanMoneyEnd;
        $scope.loanStartTime=conditions.loanDateStart;
        $scope.loanEndTime=conditions.loanDateEnd;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            damageInsureId: $scope.paymentNum,
            insureId: $scope.insureCompany,
            insureUserName: $scope.agentPerson,
            loanStatus: $scope.handleStatus,
            loanMoneyStart: $scope.loanMoneyStart,
            loanMoneyEnd: $scope.loanMoneyEnd,
            loanDateStart: $scope.loanStartTime,
            loanDateEnd: $scope.loanEndTime
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "commercial_vehicle_compensate_loan_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "commercial_vehicle_compensate_loan") {
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
        $scope.getCommercialLoanList();

    }
    initData();



    // 点击查询按钮
    $scope.searchCommercialLoanList = function () {
        $scope.start = 0;
        $scope.getCommercialLoanList();
    };

    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.getCompensateLoanList();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.getCompensateLoanList();
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getInsuranceCompany();
        $scope.getCommercialLoanList();
    };
    $scope.queryData();
}]);