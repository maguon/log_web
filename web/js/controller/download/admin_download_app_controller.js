app.controller("admin_download_app_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    // 初始值
    $scope.storage = false;
    $scope.vehicle = false;
    $scope.dispatch = false;
    $scope.driver = false;
    $scope.damage = false;

    // 控制显示隐藏
    $scope.showStorage = function () {
        $scope.storage = true;
        $scope.vehicle = false;
        $scope.dispatch = false;
        $scope.driver = false;
        $scope.damage = false;
    };

    $scope.showVehicle = function () {
        $scope.storage = false;
        $scope.vehicle = true;
        $scope.dispatch = false;
        $scope.driver = false;
        $scope.damage = false;
    };

    $scope.showDispatch = function () {
        $scope.storage = false;
        $scope.vehicle = false;
        $scope.dispatch = true;
        $scope.driver = false;
        $scope.damage = false;
    };

    $scope.showDriver = function () {
        $scope.storage = false;
        $scope.vehicle = false;
        $scope.dispatch = false;
        $scope.driver = true;
        $scope.damage = false;
    };

    $scope.showDamage = function () {
        $scope.storage = false;
        $scope.vehicle = false;
        $scope.dispatch = false;
        $scope.driver = false;
        $scope.damage = true;
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.showStorage();
    };
    $scope.queryData();
}]);