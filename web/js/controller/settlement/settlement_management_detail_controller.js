/**
 * Created by star  on 2018/6/5.
 */

//结算管理
app.controller("settlement_management_detail_controller", ["$scope","$state","$stateParams", "$host", "_basic", function ($scope,$state,$stateParams,$host, _basic) {

    var settlementId = $stateParams.id;
    // 点击返回按钮返回之前页面
    $scope.return = function () {
        $state.go($stateParams.from, {reload: true});
    };


    //获取详细信息
    function getDetailItem(){
        _basic.get($host.api_url + "/settleHandover?settleHandoverId="+settlementId).then(function (data) {
            if (data.success === true) {
                $scope.settlementList = data.result[0];
                $scope.lookBaseMsg();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }



    // 车辆照片跳转
    $scope.lookBaseMsg = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.lookBaseMsg ').addClass("active");
        $("#lookBaseMsg").addClass("active");
        $("#lookBaseMsg").show();
    };
    $scope.lookImg = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.lookImg ').addClass("active");
        $("#lookImg").addClass("active");
        $("#lookImg").show();
    };



    getDetailItem();
}])