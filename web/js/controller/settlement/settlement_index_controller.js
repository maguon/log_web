app.controller("settlement_index_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    // 当月日期
    var currentMonth = moment(new Date()).format('YYYYMM');
    // 当日日期
    var currentDay = moment(new Date()).format('YYYYMMDD');
    $scope.getMonthSettCount=0;
    $scope.getMonthCarCount=0;
    $scope.getDaySettCount=0;
    $scope.getDayCarCount=0;
    $scope.getNum=0;

    function getNum() {
        _basic.get($host.api_url + "/notSettleHandoverCarCount?carLoadStatus=2").then(function (data) {
            if (data.success === true) {
                $scope.getNum=data.result[0].car_count;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    function getMonthCount() {
        _basic.get($host.api_url + "/settleHandoverMonthCount?yearMonth=" +currentMonth).then(function (data) {
            if (data.success === true) {
                $scope.getMonthSettCount=data.result[0].settle_handover_count;
                $scope.getMonthCarCount=data.result[0].car_count;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    function getDayCount() {
        _basic.get($host.api_url + "/settleHandoverDayCount?dateId=" +currentDay).then(function (data) {
            if (data.success === true) {
                $scope.getDaySettCount=data.result[0].settle_handover_count;
                $scope.getDayCarCount=data.result[0].car_count;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    getNum();
    getMonthCount();
    getDayCount();

}])