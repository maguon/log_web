app.controller("setting_settlement_controller", ["_basic", "_config", "$host", "$scope", function (_basic, _config, $host, $scope) {

    // 委托方
    function getEntrust(){
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.get_entrust = data.result;
                $('#client').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        // 车辆品牌
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.get_carMake = data.result;
            }
        });
        //城市
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.cityList = data.result;
                $('#startCity').select2({
                    placeholder: '始发城市',
                    containerCssClass : 'select2_dropdown'
                });
                $('#endCity').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
        });
    };

    // 发运地名称
    $scope.getAddrData = function () {
        if($scope.startCity == 0 || $scope.startCity == "" || $scope.startCity == null){
            $scope.startCity = null;
            $scope.locateList = [];
        }
        else{
            _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.startCity).then(function (data) {
                if (data.success === true) {
                    $scope.locateList = data.result;
                }
                else {
                    swal(addrData.msg, "", "error");
                }
            });
        }
    };

    //获取经销商
    $scope.getReceiveMod = function (id) {
        _basic.get($host.api_url + "/receive?cityId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.receiveList = data.result;
            }
        });
    };

    getEntrust();
}])
