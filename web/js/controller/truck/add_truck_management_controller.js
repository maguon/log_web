app.controller("add_truck_management_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host",
    function ($scope, $state, $stateParams, _basic, _config, $host) {
        $scope.return = function () {
            $state.go($stateParams.from, {reload: true})
        };
       // 图片--绑定事故信息
        $scope.next = function () {
            $(".ui-tabs li").addClass("disabled");
            $(".ui-tabs li>a").removeClass("active");
            $(".tabs .indicator").css({
                right: 0 + "px",
                left: 1256 + "px"
            });
            $(".test").hide();
            $(".test").removeClass("active");
        };
}]);