/**
 * Created by ASUS on 2017/8/23.
 */
app.controller("instruction_need_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_config", "_basic", function ($scope, $rootScope,$state,$stateParams,$host, _config, _basic) {
    // 指令任务状态
    $scope.taskStatusList = _config.taskStatus;
    $scope.start = 0;
    $scope.size = 11;
    $scope.startTransfer = 0;
    $scope.sizeTransfer = 11;
    $scope.instructionStatus = "1";

    // 需求路线跳转
    $scope.originalDemantd = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.originalDemantd ').addClass("active");
        $("#originalDemantd").addClass("active");
        $("#originalDemantd").show();
    };
    $scope.ransferDemand = function ( ) {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.ransferDemand ').addClass("active");
        $("#ransferDemand").addClass("active");
        $("#ransferDemand").show();
    }

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
            });
            $('#transferCity').select2({
                placeholder: '中转城市',
                containerCssClass: 'select2_dropdown',
                allowClear: true
            });
            $('#end_city_list_t').select2({
                placeholder: '目的城市',
                containerCssClass: 'select2_dropdown',
                allowClear: true
            });
            $('#start_city_list_t').select2({
                placeholder: '原始起始城市',
                containerCssClass: 'select2_dropdown',
                allowClear: true
            });

        }
    });

    // 获取装车地点
    $scope.getAddres = function (id) {
        if (id == undefined || id == "" || id == null) {
            $scope.receiveList = [];
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
        if (id == undefined || id == "" || id == null) {
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
                $('#add_dealer').select2({
                    placeholder: '送达地点',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    };

    $scope.add_need = function () {
        $scope.receiveListMod=[];
        $('#add_dealer').select2({
            placeholder: '送达地点',
            containerCssClass: 'select2_dropdown',
            allowClear: true
        });
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

    // 点击查询按钮
    $scope.search_all = function (){
        $scope.start = 0;
        seachAllInfo();
    }
    $scope.searchTransfer = function (){
        $scope.startTransfer = 0;
        seachTransferInfo();
    };
    function seachAllInfo() {
        // 基本检索URL
        var url = $host.api_url + "/dpDemand?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "instruction_need",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
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
    function seachTransferInfo(){
        // 基本检索URL
        var url = $host.api_url + "/dpTransferDemand?start=" + $scope.startTransfer + "&size=" + $scope.sizeTransfer;
        // 检索条件
        var conditionsObj = makeConditions2();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "instruction_need",
                    start: $scope.startTransfer,
                    size: $scope.sizeTransfer,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj2 = {pageArray: []};
                $rootScope.refObj2.pageArray.push(pageItems);
                for (var i = 0; i < data.result.length; i++) {
                    data.result[i].date_id = moment(data.result[i].date_id.toString()).format("YYYY-MM-DD");
                }
                $scope.instructionBoxArray = data.result;
                $scope.instruction_neee_list_t = $scope.instructionBoxArray.slice(0,10);

                if ($scope.startTransfer > 0) {
                    $("#preTransfer").show();
                }
                else {
                    $("#preTransfer").hide();
                }
                if (data.result.length < $scope.sizeTransfer) {
                    $("#nextTransfer").hide();
                }
                else {
                    $("#nextTransfer").show();
                }
            } else {
                $scope.instruction_neee_list_t = [];
            }
        })
    };

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.instructionNum=conditions.dpDemandId;
        $scope.instructionStatus=conditions.demandStatus;
        $scope.instruct_need_startTime=conditions.createOnStart;
        $scope.instruct_need_endTime=conditions.createOnEnd;
        $scope.instruct_start_time=conditions.dateIdStart;
        $scope.instruct_endTime=conditions.dateIdEnd;
        $scope.instruct_need_man=conditions.realName;
        $scope.car_num_start=conditions.preCountStart;
        $scope.car_num_end=conditions.preCountEnd;
        $scope.start_city=conditions.routeStartId;
        $scope.dispatch_car_position=conditions.baseAddrId;
        $scope.arrive_city=conditions.routeEndId;
        $scope.dealer=conditions.receiveId;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
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
            receiveId: $scope.dealer
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "look_instruction_need_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "instruction_need") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
                $scope.baseAddrId = pageItems.conditions.routeStartId;
                $scope.receiveId = pageItems.conditions.routeEndId;

            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }
        $scope.getAddres( $scope.baseAddrId);
        $scope.getRecive( $scope.receiveId);
        // 查询数据
        seachAllInfo();

    }
    initData();


    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions2(conditions) {
        $scope.start_city2=conditions.routeStartId;
        $scope.dispatch_car_position2=conditions.baseAddrId;
        $scope.transferCity=conditions.transferCityId;
        $scope.transferPlace=conditions.transferAddrId;
        $scope.arrive_city2=conditions.routeEndId;
        $scope.dealer2=conditions.receiveId;
        $scope.instruct_start_time2=conditions.dateIdStart;
        $scope.instruct_endTime2=conditions.dateIdEnd;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions2() {
        return {
            routeStartId: $scope.start_city2,
            baseAddrId: $scope.dispatch_car_position2,
            transferCityId: $scope.transferCity,
            transferAddrId: $scope.transferPlace,
            routeEndId: $scope.arrive_city2,
            receiveId: $scope.dealer2,
            dateIdStart: $scope.instruct_start_time2,
            dateIdEnd: $scope.instruct_endTime2,
            transferStatus:1
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData2() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "look_instruction_need_transfer_detail" && $rootScope.refObj2 !== undefined && $rootScope.refObj2.pageArray.length > 0) {
            var pageItems = $rootScope.refObj2.pageArray.pop();
            if (pageItems.pageId === "instruction_need") {
                // 设定画面翻页用数据
                $scope.startTransfer = pageItems.start;
                $scope.sizeTransfer = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions2(pageItems.conditions);
                $scope.ransferDemand();
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};

        }
        $scope.getAddres($scope.baseAddrId);
        $scope.getRecive($scope.receiveId);
        // 查询数据
        seachTransferInfo();

    }
    initData2();

    // 新增需求
    $scope.add_need_instruct = function (inValid) {
        $scope.submitted = true;
        if (inValid) {
            var obj = {
                routeStartId: $scope.add_start_city.id,
                routeStart: $scope.add_start_city.city_name,
                baseAddrId: $scope.add_dispatch_car_position.id,
                addrName:$scope.add_dispatch_car_position.addr_name,
                routeEndId: $scope.add_end_city.id,
                routeEnd: $scope.add_end_city.city_name,
                receiveId: $scope.add_dealer.id,
                shortName:$scope.add_dealer.short_name,
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

    $scope.preTransferBtn = function () {
        $scope.startTransfer = $scope.startTransfer - ($scope.sizeTransfer - 1) ;
        seachTransferInfo();
    };

    /**
     * 下一页
     */
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1) ;
        seachAllInfo();
    };
    $scope.nextTransferBtn = function () {
        $scope.startTransfer = $scope.startTransfer + ($scope.sizeTransfer - 1) ;
        seachTransferInfo();
    };
    $scope.originalDemantd();
}]);