app.controller("app_version_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    $scope.size = 10;
    // 获取app筛选列表
    function getAppSystemList () {
        _basic.get($host.api_url + "/app?" + _basic.objToUrl({
            app: $scope.appType,
            type:$scope.systemType,
            forceUpdate:$scope.forceUpdate
        })).then(function (data) {
            if (data.success === true) {
                console.log(data)
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
                $scope.appSystemList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 点击搜索
    $scope.searchAppSystem = function () {
        $scope.start=0;
        getAppSystemList();
    };
    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - $scope.size;
        getManagementRecordList();
    };
    $scope.next_page = function () {
        $scope.start = $scope.start + $scope.size;
        getManagementRecordList();
    };
    // 获取数据
    function queryData () {
        getAppSystemList();
    };
    queryData();
}])