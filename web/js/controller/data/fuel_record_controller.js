/*
  Created by star on 2019/4/11
 */
app.controller("fuel_record_controller", ["$scope", "$rootScope", "$host", "_basic", function ($scope, $rootScope, $host, _basic) {
    $scope.start = 0;
    $scope.size = 11;

    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive?driveName=").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#getDrivderId').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取货车牌号
    function getTruckNum(selectText) {
        if(selectText==''||selectText==undefined){
            _basic.get($host.api_url + "/truckBase").then(function (data) {
                if (data.success === true) {
                    $scope.truckNumListAllList = data.result;
                    $('#getTruckId').select2({
                        placeholder: "货车牌号",
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
            _basic.get($host.api_url + "/truckBase").then(function (data) {
                if (data.success == true) {
                    $scope.truckNumListList = data.result;
                    $('#getTruckId').select2({
                        placeholder: selectText,
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    })
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }
    // 点击查询
    $scope.searchItem = function () {
        $scope.start = 0;
        searchFuelRecord();
    };



    // 根据条件搜索文件
    function searchFuelRecord() {
            _basic.get($host.api_url + '/driveExceedOilRel?' + _basic.objToUrl({
                driveId:$scope.getDrivderId ,
                truckId: $scope.getTruckId,
                oilDateStart: $scope.getStartTime,
                oilDateEnd: $scope.handleDate,
                start:$scope.start,
                size:$scope.size
            })).then(function (data) {
                if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.responseData = $scope.boxArray.slice(0, 10);
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
    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        searchFuelRecord();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        searchFuelRecord();
    };
    searchFuelRecord();
    getTruckNum();
    getDriveNameList ();
}]);