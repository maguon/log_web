app.controller("route_fee_controller", ["$scope", "$state","$stateParams", "$host", "_basic",  "_config",function ($scope, $state,$stateParams, $host, _basic,_config) {
    var userId = _basic.getSession(_basic.USER_ID);
        $scope.start = 0;
        $scope.size = 11;



        //通过
        $scope.carHave = function(id){
            swal({
                title: "确定领取吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
            }).then(
                function(result){
                    if (result.value) {
                        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskFee/" + id + "/status/2", {}).then(function (data) {
                            if (data.success === true) {
                                searchCost()
                            }
                            else {
                                swal(data.msg, "", "error");
                            }
                        });
                    }
                });
        }

        //拒绝
        $scope.carNotHave = function(id){
            swal({
                title: "确定驳回吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
            }).then(
                function(result){
                    if (result.value) {
                        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskFee/" + id + "/status/0", {}).then(function (data) {
                            if (data.success === true) {
                                searchCost();
                            }
                            else {
                                swal(data.msg, "", "error");
                            }
                        });
                    }
                });

        }


        //司机
        function getDriveNameList () {
            _basic.get($host.api_url + "/drive?").then(function (data) {
                if (data.success == true) {
                    $scope.driveNameList = data.result;
                    $('#driveName').select2({
                        placeholder: '司机',
                        containerCssClass : 'select2_dropdown'
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        };

        //获取货车牌号
        function getTruckNum() {
            _basic.get($host.api_url + "/truckBase").then(function (data) {
                if (data.success === true) {
                    $scope.truckNumListAllList = data.result;
                    $('#truckNum').select2({
                        placeholder: '货车牌号',
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }


        //查询
        $scope.getCost = function () {
            $scope.start = 0;
            searchCost();
        }

        // 根据条件搜索
        function searchCost() {
            _basic.get($host.api_url+ '/dpRouteTaskFee?' + _basic.objToUrl({
                driveId: $scope.drivderId,
                truckId: $scope.truckNum,
                createdOnStart:$scope.instruct_starTime,
                createdOnEnd:$scope.instruct_endTime,
                status:$scope.getStatus,
                start:$scope.start,
                size:$scope.size
            })).then(function (data) {
                if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.costList = $scope.boxArray.slice(0, 10);
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

        $scope.export = function (){
            // 基本检索URL
            var url = $host.api_url + "/dpRouteTaskFee.csv?" ;
            // 检索条件
            var conditionsObj = {
                driveId: $scope.drivderId,
                truckId: $scope.truckNum,
                createdOnStart:$scope.instruct_starTime,
                createdOnEnd:$scope.instruct_endTime,
                status:$scope.getStatus
            };
            var conditions = _basic.objToUrl(conditionsObj);
            // 检索URL
            url = conditions.length > 0 ? url + "&" + conditions : url;
            window.open(url);
        }


        getDriveNameList ();
        getTruckNum();
        searchCost();
}]);