app.controller("insurance_compensation_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    $scope.start = 0;
    $scope.size = 20;

    // 获取保险赔偿列表
    $scope.getInsurancePaymentList = function () {
        _basic.get($host.api_url + "/damageInsure?" + _basic.objToUrl({
            damageInsureId:$scope.paymentNum,
            damageId:$scope.damageNum,
            insureStatus:$scope.processingStatus,
            insureActualStart:$scope.insurancePaymentStart,
            insureActualEnd:$scope.insurancePaymentEnd,
            insureUserName:$scope.handlerName,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
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
                $scope.damageInsurancePaymentList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击按钮进行查询
    $scope.searchInsurancePaymentList = function () {
        $scope.start = 0;
        $scope.getInsurancePaymentList();
    };

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - $scope.size;
        $scope.getInsurancePaymentList();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + $scope.size;
        $scope.getInsurancePaymentList();
    };


    // 获取数据
    $scope.queryData = function () {
        $scope.searchInsurancePaymentList();
    };
    $scope.queryData();
}]);