app.controller("admin_download_app_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    // 初始值
    $scope.storage = false;
    $scope.vehicle = false;
    $scope.dispatch = false;
    $scope.driver = false;
    $scope.damage = false;
    $scope.settlement = false;

    // 控制显示隐藏
    $scope.showStorage = function () {
        $scope.storage = true;
        $scope.vehicle = false;
        $scope.dispatch = false;
        $scope.driver = false;
        $scope.damage = false;
        $scope.settlement = false;
        QRCode.toDataURL($host.domain_name+"/download/storage_download.html", function (err, url) {
            $scope.srcStorage=url;
        })
    };

    $scope.showVehicle = function () {
        $scope.storage = false;
        $scope.vehicle = true;
        $scope.dispatch = false;
        $scope.driver = false;
        $scope.damage = false;
        $scope.settlement = false;
        QRCode.toDataURL($host.domain_name+"/download/tm_download.html", function (err, url) {
            $scope.srcVehicle=url;
        })
    };

    $scope.showDispatch = function () {
        $scope.storage = false;
        $scope.vehicle = false;
        $scope.dispatch = true;
        $scope.driver = false;
        $scope.damage = false;
        $scope.settlement = false;
        QRCode.toDataURL($host.domain_name+"/download/dispatch_download.html", function (err, url) {
            $scope.srcDispatch=url;
        })
    };

    $scope.showDriver = function () {
        $scope.storage = false;
        $scope.vehicle = false;
        $scope.dispatch = false;
        $scope.driver = true;
        $scope.damage = false;
        $scope.settlement = false;
        QRCode.toDataURL($host.domain_name+"/download/driver_download.html", function (err, url) {
            $scope.srcDriver=url;
        })
    };

    $scope.showDamage = function () {
        $scope.storage = false;
        $scope.vehicle = false;
        $scope.dispatch = false;
        $scope.driver = false;
        $scope.damage = true;
        $scope.settlement = false;
        QRCode.toDataURL($host.domain_name+"/download/qa_download.html", function (err, url) {
            $scope.srcDamage=url;
        })
    };

    $scope.showSettlement = function () {
        $scope.storage = false;
        $scope.vehicle = false;
        $scope.dispatch = false;
        $scope.driver = false;
        $scope.damage = false;
        $scope.settlement = true;
        QRCode.toDataURL($host.domain_name+"/download/account_download.html", function (err, url) {
            $scope.srcSettlement=url;
        })
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.showStorage();
    };
    $scope.queryData();
}]);