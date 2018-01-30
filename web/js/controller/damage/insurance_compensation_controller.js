app.controller("insurance_compensation_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 获取保险赔偿列表
    $scope.getInsurancePaymentList = function () {
        _basic.get($host.api_url + "/damageInsure?" + _basic.objToUrl({
            damageInsureId:$scope.paymentNum,
            damageId:$scope.damageNum,
            insureStatus:$scope.processingStatus,
            insureActualStart:$scope.insurancePaymentStart,
            insureActualEnd:$scope.insurancePaymentEnd,
            insureUserName:$scope.handlerName
        })).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.damageInsurancePaymentList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };


    // 获取数据
    $scope.queryData = function () {
        $scope.getInsurancePaymentList();
    };
    $scope.queryData();
}]);