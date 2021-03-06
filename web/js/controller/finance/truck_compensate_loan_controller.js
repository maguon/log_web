app.controller("truck_compensate_loan_controller", ["$scope", "$rootScope","$state","$stateParams","$host", "_basic", function ($scope,$rootScope,$state,$stateParams, $host, _basic) {

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

    // 获取货车理赔借款管理列表
    $scope.getCompensateLoanList = function () {

        // 基本检索URL
        var url = $host.api_url + "/truckAccidentInsureLoan?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success === true) {
                // 当前画面的检索信息
                var pageItems = {
                    pageId: "truck_compensate_loan",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);

                $scope.boxArray = data.result;
                $scope.compensateLoanList = $scope.boxArray.slice(0, 10);
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
    $scope.searchCompensateLoanList = function () {
        $scope.start = 0;
        $scope.getCompensateLoanList();
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


    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.paymentNum=conditions.accidentInsureId;
        $scope.insureStatus=conditions.insureType;
        $scope.insureCompany=conditions.insureId;
        $scope.loanStartTime=conditions.loanDateStart;
        $scope.loanEndTime=conditions.loanDateEnd;
        $scope.handleStatus=conditions.loanStatus;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            accidentInsureId: $scope.paymentNum,
            insureType: $scope.insureStatus,
            insureId: $scope.insureCompany,
            loanDateStart: $scope.loanStartTime,
            loanDateEnd: $scope.loanEndTime,
            loanStatus: $scope.handleStatus
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "truck_compensate_loan_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "truck_compensate_loan") {
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
        $scope.getCompensateLoanList();

    }
    initData();


    // 获取数据
    $scope.queryData = function () {
        $scope.getInsuranceCompany();
        $scope.getCompensateLoanList();
    };
    $scope.queryData();
}]);