

app.controller("driver_exceed_oil_month_detail_controller", ["$scope", "$state","$stateParams", "_basic", "_config", "$host", function ($scope, $state,$stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var exceedOilId = $stateParams.id;
    var driveId = $stateParams.driveId;
    var truckId = $stateParams.truckId;
    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"driver_exceed_oil_month_detail"}, {reload: true})
    };

    // 获取任务信息
    function getOilRel() {
        var obj={
            exceedOilDateId:exceedOilId,
            driveId:driveId,
            truckId:truckId,
            oilStatus:2
        }
        //司机  核油日期
        _basic.get($host.api_url + "/driveExceedOilDate?"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true&&data.result.length>=0) {
                if(data.result.length==0){
                    $scope.exceedOilItem =[];
                }
                else {
                    $scope.exceedOilItem = data.result[0];
                    $scope.exceedOilItem.month_date_id=data.result[0].month_date_id;
                    $scope.exceedOilItem.drive_name= data.result[0].drive_name;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        //
        _basic.get($host.api_url + "/driveExceedOilTotal?"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.totalOil =data.result[0].plan_oil;
                $scope.totalUrea =data.result[0].plan_urea;
                $scope.totalOilActal=data.result[0].actual_oil;
                $scope.totalUreaActal=data.result[0].actual_urea;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 扣款任务
        _basic.get($host.api_url + "/driveExceedOil?"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.OilRelList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };


    $scope.updateActualMoney = function(){
        //添加实际用油量  实际尿素量   实际金额
        _basic.put($host.api_url + "/user/" + userId + "/exceedOilDateId/" + exceedOilId,{
            monthDateId:$scope.exceedOilItem.month_date_id,
            driveId: driveId,
            truckId: truckId,
            planOilTotal: $scope.totalOil,
            planUreaTotal: $scope.totalUrea,
            actualOilTotal: $scope.totalOilActal,
            actualUreaTotal: $scope.totalUreaActal,
            actualMoney:$scope.exceedOilItem.actual_money,
            remark:$scope.exceedOilItem.remark
        }).then(function (data) {
            if (data.success === true) {
                swal("保存成功", "", "success");
                getOilRel();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    getOilRel();

}]);