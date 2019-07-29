
/**
 * 主菜单：结算管理 -> 开票结算 控制器
 */

app.controller("invoice_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_config", "_basic",'_socket', function ($scope, $rootScope,$state,$stateParams,$host, _config, _basic,_socket) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);



    // 翻页用
    $scope.start = 0;
    $scope.size = 11;




    //获取委托方
    function getEntrust(){
        _basic.get($host.api_url + "/entrust").then(function (entrustData) {
            if (entrustData.success === true) {
                $scope.entrustList = entrustData.result;
                $('#client').select2({
                    placeholder: '委托方',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(entrustData.msg, "", "error");
            }
        });
    }




    /**
     * 查询按钮
     */
    $scope.getInvoice = function () {
        $scope.start = 0;
        searchInvoiceList();
    }




    /**
     * 根据条件搜索
     */
    function searchInvoiceList() {


        // 基本检索URL
        var url = $host.api_url + "/entrustInvoice?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "invoice",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);

                $scope.boxArray = data.result;
                $scope.invoiceList = $scope.boxArray.slice(0, 10);


      /*  _basic.get($host.api_url + "/entrustInvoice?"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.invoiceList = $scope.boxArray.slice(0, 10);*/
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

            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };








    /*
    * 删除
    * */
    $scope.delete = function(id){
        swal({
            title: "确定删除当前信息吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
                _basic.delete($host.api_url + "/user/" + userId + "/entrustInvoice/" + id).then(function (data) {
                    if (data.success === true) {
                        searchInvoiceList();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
        })
    }

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.conEntrust=conditions.entrustId;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            entrustId:$scope.conEntrust
        };
    }


    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "invoice_detail" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "invoice") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);


            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};

        }

        // 查询数据
        searchInvoiceList();

    }
    initData();









    // 分页
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        searchInvoiceList();
    };

    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        searchInvoiceList();
    };

    getEntrust();
    searchInvoiceList()

}])