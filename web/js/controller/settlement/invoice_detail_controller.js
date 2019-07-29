/**
 * 主菜单：结算管理 -> 开票结算详情 控制器
 */

app.controller("invoice_detail_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_config", "_basic",'_socket', function ($scope, $rootScope,$state,$stateParams,$host, _config, _basic,_socket) {

    //用户名
    var userId = _basic.getSession(_basic.USER_ID);


    var id = $stateParams.id;


    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"invoice_detail"}, {reload: true})
    };



    function getInvoice(){
        _basic.get($host.api_url+ '/entrustInvoice?entrustInvoiceId='+id).then(function (data) {
            if (data.success === true&&data.result.length > 0) {
                $scope.invoiceItem = data.result[0];

            }
            else {
                swal(data.msg, "", "error");
            }
        });
        _basic.get($host.api_url+ '/entrustInvoiceCarRel?entrustInvoiceId='+id).then(function (data) {
            if (data.success === true&&data.result.length > 0) {
                $scope.invoiceList= data.result;

            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }



    /**
     修改费用申请
    */
    $scope.saveInvoice = function (){
            //必填条件
            if($scope.invoiceItem.update_price !== null){
                _basic.put($host.api_url + "/user/" + userId + "/entrustInvoice/"+id,{
                    "updatePrice": $scope.invoiceItem.update_price,
                    "actualPrice": $scope.invoiceItem.plan_price-$scope.invoiceItem.update_price,
                    "remark":$scope.invoiceItem.remark
                }).then(function (data) {
                    if (data.success === true) {
                        swal("修改成功", "", "success");
                        getInvoice();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
            else{
                swal("请填写完整信息！", "", "warning");
            }
        }


    getInvoice();


}]);