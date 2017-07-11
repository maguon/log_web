/**
 * Created by ASUS on 2017/7/10.
 */
app.controller("truck_details_controller", ["$scope","$state","$stateParams","_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    $('ul.tabWrap li').removeClass("active");
    $(".tab_box").removeClass("active");
    $(".tab_box").hide();
    $('ul.tabWrap li.header_car').addClass("active");
    $("#header_car").addClass("active");
    $("#header_car").show();
    // 头车挂车跳转
    $scope.header_car = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.header_car ').addClass("active");
        $("#header_car").addClass("active");
        $("#header_car").show();
    };
    $scope.hand_car = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.hand_car ').addClass("active");
        $("#hand_car").addClass("active");
        $("#hand_car").show();
    };


}])