/**
 * Created by ASUS on 2017/6/5.
 */
app.controller("setting_city_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);

    //城市
    function getCity() {
        _basic.get($host.api_url + "/city").then(function (data) {
            _basic.callBackDate(data, function () {
                $scope.city_model = data.result;
            })
        });
    };
    // 省份
    function getProvince(){
        _basic.get($host.api_url + "/cityProvince").then(function (data) {
            if (data.success == true) {
                $scope.get_province = data.result;
                $('#province').select2({
                    placeholder: '省份',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });

            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };
    $scope.city_box = function(){
        getCity();
        getProvince();
        $(".modal").modal();
        $("#openCityModal").modal("open");


    }
    $scope.province_box = function(){
        $(".modal").modal();
        $("#openProvinceModal").modal("open");

    }
    $scope.add_city = function () {
        var obj = {
            cityName: $scope.cityText,
            cityProvinceId: $scope.province
        };
        _basic.post($host.api_url + "/user/" + userId + "/city", obj).then(function (data) {
            if (data.success === true) {
                $("#openCityModal").modal("close");
                swal("添加成功", "", "success");
                getCity();
                $scope.cityText = "";
                $scope.province='';

            }
            else{
                swal(data.msg, "", "error")
            }
        });

    }
    $scope.add_province = function () {
        var obj = {
            provinceName: $scope.provinceText
        };
        _basic.post($host.api_url + "/user/" + userId + "/cityProvince", obj).then(function (data) {
            if (data.success === true) {
                $("#openProvinceModal").modal("close");
                swal("添加成功", "", "success");
               getCity();
                $scope.provinceText = "";
            }
            else{
                swal(data.msg, "", "error")
            }
        });

    }



    getCity();
    getProvince();

    $scope.openCity =function (id,status,index){
        if (status == 1) {
            status = 0
            swal({
                title: "确定取消此经销商油补城市吗?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(
                function (result) {
                    if (result.value) {
                        _basic.put($host.api_url + "/user/" + userId + '/city/' + id + "/cityOilFlag/" + status
                            , {}).then(function (data) {
                            if (data.success !== true) {
                                swal(data.msg, "", "error");
                            }else{
                                getCity()
                            }
                        })
                    }else {
                        event.target.checked =!event.target.checked;
                    }
                })
        } else {
            status = 1
            swal({
                title: "确定添加此经销商油补城市吗?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(
                function (result) {
                    if (result.value) {
                        _basic.put($host.api_url + "/user/" + userId + '/city/' + id + "/cityOilFlag/" + status
                            , {}).then(function (data) {
                            if (data.success !== true) {
                                swal(data.msg, "", "error");
                            }else{
                               getCity()
                            }
                        })
                    }else {
                        event.target.checked =!event.target.checked;
                    }
                })

        }
    }

    $scope.openProvince =function (id,pid,index) {
        $scope.id=id;
        $scope.pid=pid;
        $scope.putProvinceList=[];
        $("#openPutProvinceModal").modal("open");

        _basic.get($host.api_url + "/city?cityId="+id).then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.cityList = [];
                }
                else {
                    $scope.cityList = data.result[0];
                    getProvinceList($scope.cityList.province_id)


                }
            }
            else{
                swal(data.msg, "", "error")
            }
        });
    }

    $scope.put_city = function (){
        if ($scope.cityList.province_id !== null) {
            _basic.put($host.api_url + "/user/" + userId + "/city/"+$scope.id+'/cityProvince', {
                cityProvinceId: $scope.cityList.province_id
            }).then(function (data) {
                if (data.success === true) {
                    swal("修改成功", "", "success");
                    $('#openPutProvinceModal').modal('close');

                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写完整信息！", "", "warning");
        }
    }


    //获取省份
    function getProvinceList(selectText){
        _basic.get($host.api_url + "/cityProvince").then(function (data) {
            if (data.success == true) {
                $scope.putProvinceList = data.result;
                $('#putProvince').select2({
                    placeholder: selectText,
                    containerCssClass : 'select2_dropdown'
                })
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

}]);