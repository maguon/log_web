/**
 * Created by star  on 2018/6/5.
 */

//结算管理
app.controller("settlement_management_detail_controller", ["$scope","$state","$stateParams", "$host", "_basic", function ($scope,$state,$stateParams,$host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    var settlementId = $stateParams.id;
    $scope.carId = undefined;
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

    //修改交接单信息
    $scope.putDataItem = function(id){
        var obj = {
            number: $scope.settlementList.created_on,
            remark: $scope.settlementList.remark
        };
        _basic.put($host.api_url + "/user/" + id, obj).then(function (data) {
            if (data.success == true) {
                swal("修改成功", "", "success");
                getDetailItem()
            } else {
                swal(data.msg, "", "error");
            }

        })
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


    //模糊查询
    var vinObjs ={}
    $('#autocomplete-input').autocomplete({
        data: vinObjs,
        limit: 10,
        onAutocomplete: function(val) {
        },
        minLength: 6,
    });
    $scope.shortSearch=function () {
        if($scope.carVin!==""&&$scope.carVin!==undefined) {
            if ($scope.carVin.length >= 6) {
                _basic.get($host.api_url + "/carList?vinCode=" + $scope.carVin, {}).then(function (data) {
                    if (data.success == true&& data.result.length > 0) {
                        $scope.vinMsg = data.result;
                        $scope.carId= data.result[0].id;
                        vinObjs = {};
                        for (var i in $scope.vinMsg) {
                            vinObjs[$scope.vinMsg[i].vin] = null;
                        }
                        return vinObjs;
                    }

                    else {
                        return {};
                    }
                }).then(function (vinObjs) {
                    $('#autocomplete-input').autocomplete({
                        data: vinObjs,
                        minLength: 6
                    });
                    $('#autocomplete-input').focus();
                })
            } else {
                $('#autocomplete-input').autocomplete({minLength: 6});
                $scope.vinMsg = {}
            }
        }
    };

    // 查询本委托方下得所有关联车辆
    function seachLinkCar(){

    }

    //添加关联车辆
    $scope.addLinkCar=function () {
        _basic.get($host.api_url+"/car?vin="+$scope.carVin+"&active=1").then(function (data) {
            if(data.success=true){
                if(data.result.length==0){
                    swal('数据库中没有这条数据！','','error')
                }else {
                    $scope.car_details=data.result;
                }
            }
        })
    };


    getDetailItem();
}])