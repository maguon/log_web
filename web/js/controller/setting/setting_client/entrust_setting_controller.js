app.controller("entrust_setting_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {

    $scope.start = 0;
    $scope.size = 11;

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
        })
    };

    //点击查询按钮
    $scope.getEntrustSetting = function (){
        $scope.start = 0;
        getEntrustSetting();
    }

    //获取列表详情
    function getEntrustSetting() {
        var obj = {
                entrustId:$scope.client,
                start:$scope.start.toString(),
                size:$scope.size
        };
        _basic.get($host.api_url + "/entrustRoute?"+ _basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.entrustSettingArray = $scope.boxArray.slice(0, 10);
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
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 分页
    $scope.previousPage = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getEntrustSetting();
    };
    $scope.nextPage = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getEntrustSetting();
    };


    getEntrust();
    getEntrustSetting();

}]);