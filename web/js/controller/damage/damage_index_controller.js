app.controller("damage_index_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    // 当月日期
    var currentMonth = moment(new Date()).format('YYYYMM');
    $scope.generalDamageCount = 0;
    $scope.seriousDamageCount = 0;
    $scope.waitingHandleDamageCount = 0;
    $scope.handlingDamageCount = 0;

    // 获取当月质损数量信息
    // $scope.getFinishDamageCount = function () {
    //     _basic.get($host.api_url + "/damageCheckCount?dateIdStart=" + currentMonth + "&dateIdEnd=" + currentMonth + "&damageStatus=3").then(function (data) {
    //         if (data.success === true) {
    //             console.log("finishDamage",data);
    //             for (var i = 0; i < data.result.length; i++) {
    //                 if(data.result[i].damage_type === 1){
    //                     $scope.generalDamageCount += data.result[i].damage_count;
    //                 }
    //                 else{
    //                     $scope.seriousDamageCount += data.result[i].damage_count;
    //                 }
    //             }
    //         }
    //         else {
    //             swal(data.msg, "", "error");
    //         }
    //     });
    // };

    // 获取当月待完成处理质损信息
    $scope.getHangDamageCount = function () {
        _basic.get($host.api_url + "/damageNotCheckCount?dateIdStart=" + currentMonth + "&dateIdEnd=" + currentMonth).then(function (data) {
            if (data.success === true) {
                console.log("notFinishDamage",data);
                for (var i = 0; i < data.result.length; i++) {
                    if(data.result[i].damage_status === 1){
                        $scope.waitingHandleDamageCount += data.result[i].damage_count
                    }
                    if(data.result[i].damage_status === 2){
                        $scope.handlingDamageCount += data.result[i].damage_count
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取数据
    $scope.queryData = function () {
        // $scope.getFinishDamageCount();
        $scope.getHangDamageCount();
    };
    $scope.queryData();
}]);