
app.controller("setting_vin_match_controller", ["$scope","$state","$stateParams", "$host", "_basic", function ($scope,$state,$stateParams,$host, _basic) {
    var userId = _basic.getSession(_basic.USER_TYPE);
    $scope.start = 0;
    $scope.size = 21;



    function getCarMake(){
        // 车辆品牌
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.get_carMake = data.result;
            }
        });

    }

    // 搜索所有查询
   function searchAll() {
        var obj={
            vin:$scope.search_vin,
            makeId:$scope.car_brand,
            start:$scope.start,
            size:$scope.size
       }
        _basic.get($host.api_url + "/carVinMatch?"+_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.vinList = $scope.boxArray.slice(0, 20);
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

            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    $scope.clickAdd = function (){
        $scope.addVin='';
        $scope.addMakeId='';
        $scope.addRemark='';
        $(".modal").modal();
        $("#clickAdd").modal("open");
    }

    $scope.addItem = function(){
        if( $scope.addVin==''|| $scope.addMakeId==''){
            swal("请填写完整信息！", "", "warning");
        }
        else {
            var obj = {
                "vin":  $scope.addVin,
                "makeId":  $scope.addMakeId.id,
                "makeName": $scope.addMakeId.make_name,
                "remark":  $scope.addRemark
            };
            _basic.post($host.api_url + "/user/" + userId + "/carVinMatch", obj).then(function (data) {
                if (data.success === true) {
                    $("#clickAdd").modal("close");
                    searchAll();
                    swal("新增成功", "", "success");
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }


    $scope.readItem = function (id){
        $scope.id = id;
        $("#clickLook").modal("open");
        _basic.get($host.api_url + "/carVinMatch?carVinMatchId="+id).then(function (data) {
            if (data.success === true) {
                $scope.boxItem = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        });

    }

    $scope.putItem = function (){
        if( $scope.boxItem.vin==''|| $scope.boxItem.make_id==''){
            swal("请填写完整信息！", "", "warning");
        }
        else {
            // 车辆品牌
            _basic.get($host.api_url + "/carMake?makeId="+$scope.boxItem.make_id).then(function (data) {
                if (data.success == true) {
                    $scope.carMakeName = data.result[0].make_name;
                    putItem()
                }
            });

        }

    }

    function putItem(){
        var obj = {
            "vin": $scope.boxItem.vin,
            "makeId": $scope.boxItem.make_id,
            "makeName": $scope.carMakeName,
            "remark": $scope.boxItem.remark
        };
        _basic.put($host.api_url + "/user/" + userId + "/carVinMatch/"+$scope.id, obj).then(function (data) {
            if (data.success === true) {
                $("#clickLook").modal("close");
                searchAll();
                swal("修改成功", "", "success");
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    $scope.deleteCar = function (id){
        swal({
            title: "确定删除当前车辆吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
                _basic.delete($host.api_url + "/user/" + userId + "/carVinMatch/" + id).then(function (data) {
                    if (data.success === true) {
                        searchAll();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
        })
    }

    $scope.searchData =function(){
        $scope.start = 0;
        searchAll();
    }


    // 分页
    $scope.previousPage = function () {
        $scope.start = $scope.start - ($scope.size-1);
        searchAll();
    };

    $scope.nextPage = function () {
        $scope.start = $scope.start + ($scope.size-1);
        searchAll();
    };



    getCarMake();
    searchAll();
}]);

