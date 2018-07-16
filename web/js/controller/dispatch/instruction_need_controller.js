/**
 * Created by ASUS on 2017/8/23.
 */
app.controller("instruction_need_controller", ["$scope", "$host", "_config", "_basic", function ($scope, $host, _config, _basic) {
    // 指令任务状态
    $scope.taskStatusList = _config.taskStatus;
    $scope.start = 0;
    $scope.size = 11;
    $scope.instructionStatus = "1";
    _basic.get($host.api_url + "/city").then(function (data) {
        if (data.success == true) {
            $scope.startCityList = data.result;
            $('#start_city_list').select2({
                placeholder: '起始城市',
                containerCssClass: 'select2_dropdown',
                allowClear: true
            })
            $('#end_city_list').select2({
                placeholder: '目的城市',
                containerCssClass: 'select2_dropdown',
                allowClear: true
            })
            $('#add_start_city').select2({
                placeholder: '起始城市',
                containerCssClass: 'select2_dropdown',
                allowClear: true
            });
            $('#add_end_city').select2({
                placeholder: '目的城市',
                containerCssClass: 'select2_dropdown',
                allowClear: true
            })

        }
    });

    // 获取装车地点
    $scope.getAddres = function (id) {
        if ($scope.start_city == 0 || $scope.start_city == "" || $scope.start_city == null) {
            $scope.start_city = null;
            $scope.baseAddrList = [];
        }
        else {
            _basic.get($host.api_url + "/baseAddr?cityId=" + id).then(function (data) {
                if (data.success == true) {
                    $scope.baseAddrList = data.result;
                }
            });
        }
    };

    // 模态框内获取装车地点
    $scope.getAddressMod = function (cityId) {
        _basic.get($host.api_url + "/baseAddr?cityId=" + cityId).then(function (data) {
            if (data.success == true) {
                $scope.baseAddrListMod = data.result;
            }
        });
    };


    // 获取经销商
    $scope.getRecive = function (id) {
        if ($scope.arrive_city == 0 || $scope.arrive_city == "" || $scope.arrive_city == null) {
            $scope.arrive_city = null;
            $scope.receiveList = [];
        }
        else {
            _basic.get($host.api_url + "/receive?cityId=" + id).then(function (data) {
                if (data.success == true) {
                    $scope.receiveList = data.result;
                }
            });
        }
    };
    
    // 模态框内获取经销商
    $scope.getReceiveMod = function (id) {
        _basic.get($host.api_url + "/receive?cityId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.receiveListMod = data.result;
            }
        });
    };

    $scope.add_need = function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.startCityList = data.result;
                $('#add_start_city').select2({
                    placeholder: '起始城市',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $('#add_end_city').select2({
                    placeholder: '目的城市',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                })

            }
        });
        var data = new Date();
        $scope.time = moment(data).format('YYYY-MM-DD');
        $scope.user = _basic.getSession(_basic.USER_NAME);
        $scope.submitted = false;
        $scope.add_start_city = {};
        $scope.add_dispatch_car_position = '';
        $scope.add_end_city = {};
        $scope.add_dealer = '';
        $scope.add_car_num = '';
        $scope.add_instruct_Time = '';
        $('.modal').modal();
        $('#newNeed').modal('open');

    };
    /**
     * 点击查询按钮
     * */
    $scope.search_all = function (){
        $scope.start = 0;
        seachAllInfo();
    }


   function seachAllInfo() {
        var obj = {
            dpDemandId: $scope.instructionNum,
            demandStatus: $scope.instructionStatus,
            createOnStart: $scope.instruct_need_startTime,
            createOnEnd: $scope.instruct_need_endTime,
            dateIdStart: $scope.instruct_start_time,
            dateIdEnd: $scope.instruct_endTime,
            realName: $scope.instruct_need_man,
            preCountStart: $scope.car_num_start,
            preCountEnd: $scope.car_num_end,
            routeStartId: $scope.start_city,
            baseAddrId: $scope.dispatch_car_position,
            routeEndId: $scope.arrive_city,
            receiveId: $scope.dealer,
            start: $scope.start.toString(),
            size: $scope.size
        };
        _basic.get($host.api_url + "/dpDemand?" + _basic.objToUrl(obj)).then(function (data) {
            if (data.success == true && data.result.length >= 0) {
                for (var i = 0; i < data.result.length; i++) {
                    data.result[i].date_id = moment(data.result[i].date_id.toString()).format("YYYY-MM-DD");
                }
                $scope.instructionBoxArray = data.result;
                $scope.instruction_neee_list = $scope.instructionBoxArray.slice(0,10);

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
                $scope.instruction_list = [];
            }
        })
    };
    seachAllInfo();

    // 新增需求
    $scope.add_need_instruct = function (inValid) {
        $scope.submitted = true;
        if (inValid) {
            var obj = {
                routeStartId: $scope.add_start_city.id,
                routeStart: $scope.add_start_city.city_name,
                baseAddrId: $scope.add_dispatch_car_position,
                routeEndId: $scope.add_end_city.id,
                routeEnd: $scope.add_end_city.city_name,
                receiveId: $scope.add_dealer,
                preCount: $scope.add_car_num,
                dateId: $scope.add_instruct_Time
            };
            _basic.post($host.api_url + "/user/" + _basic.getSession(_basic.USER_ID) + "/dpDemand", obj).then(function (data) {
                if (data.success == true) {
                    $scope.submitted = false;
                    swal("新增成功", "", "success");
                    $('#newNeed').modal('close');
                    $scope.search_all();
                }
            })
        }
    }
    /**
     * 上一页
     */
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1) ;
        seachAllInfo();
    };

    /**
     * 下一页
     */
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1) ;
        seachAllInfo();
    };
}]);