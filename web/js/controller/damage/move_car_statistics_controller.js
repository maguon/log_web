
app.controller("move_car_statistics_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    //管理员
    function getManagerList() {
        _basic.get($host.api_url + "/user").then(function (data) {
            if (data.success === true) {
                $scope.settingManagerList = data.result;
                $("#manager").select2({
                    placeholder: '操作员',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    };
    //查询功能
    $scope.searchMoveCarList= function (){
        getMoveCar();
    }

    function getMoveCar(){
        if($scope.ops==undefined){
            var obj ={
                ops:[11,12,13],
                userId: $scope.manager,
                startDate:$scope.dateStart,
                endDate:$scope.dateEnd
            };
        }
        else{
            var obj ={
                op:$scope.ops,
                userId: $scope.manager,
                startDate:$scope.dateStart,
                endDate:$scope.dateEnd
            };
        }
        if($scope.dateStart==undefined||$scope.dateEnd==undefined){
            swal('请输入完整的时间范围', "", "error");
            $scope.moveCarList=[];
        }
        else {
            _basic.get($host.record_url + "/opRecordStat?"+_basic.objToUrl(obj)).then(function (data) {
                if (data.success === true) {
                    $scope.moveCarList = data.result;
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }

    }

    getManagerList();
}]);