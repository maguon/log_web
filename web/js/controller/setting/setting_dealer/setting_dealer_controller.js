/**
 * Created by ASUS on 2017/6/7.
 */
app.controller("setting_dealer_controller", ["$scope","$rootScope","$state","$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope,$state,$stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.addContacts = [];
    $scope.receiveTypeList=_config.receiveType;
    $scope.get_receive =[];
    $scope.mobileReg = _config.mobileRegx;
    $scope.contacts_name = [];
    $scope.contacts = [];
    $scope.start = 0;
    $scope.size = 11;


    $scope.get_Msg = function () {
        // 城市信息获取
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.get_city = data.result;
                $('#start_city_list').select2({
                    placeholder: '选择城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
        });
        // 车辆品牌
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.get_carMake = data.result;
            }
        });

    };

    // 城市-经销商联动
    $scope.get_dealer = function () {
        if($scope.city == 0 || $scope.city == "" || $scope.city == null){
            $scope.city = null;
            $scope.get_receive = [];
        }
        else{
            // 经销商下拉列表
            _basic.get($host.api_url + "/receive?cityId=" + $scope.city).then(function (data) {
                if (data.success === true) {
                    $scope.get_receive = data.result;
                    $('#s_dealer').select2({
                        placeholder: '经销商',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });
                }
            });
        }
    };

    // 搜索经销商
    $scope.search_dealer = function () {
        $scope.start = 0;
        $scope.search_all_dealer();
    };

    $scope.search_all_dealer = function () {
        // 基本检索URL
        if($scope.receive_flag==undefined){
            var url = $host.api_url + "/receive?start=" + $scope.start + "&size=" + $scope.size;
        }
        else {
            var url = $host.api_url + "/receive?receiveFlag="+ $scope.receive_flag +"&start=" + $scope.start + "&size=" + $scope.size;
                }

        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        _basic.get(url).then(function (data) {
            if (data.success === true) {
                // 当前画面的检索信息
                var pageItems = {
                    pageId: "setting_dealer",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.len = data.result.length;
                for (var i = 0; i < data.result.length; i++) {
                    $scope.contacts.push({
                        show: false
                    });
                    $scope.addContacts.push({
                        show: false
                    })
                }

                $scope.setting_dealer_box = data.result;
                $scope.setting_dealer = $scope.setting_dealer_box.slice(0, 10);
                if ($scope.start > 0) {
                    $scope.pre = true;
                }
                else {
                    $scope.pre = false;
                }

                if ($scope.setting_dealer_box.length < $scope.size) {
                    $scope.next = false;
                }
                else {
                    $scope.next = true;
                }
            }
        })
    };



    $scope.get_contact = function (id, index) {
        _basic.get($host.api_url + "/receive/" + id + "/contacts").then(function (data) {
            if (data.success == true) {
                $scope.setting_contacts = data.result;
                $scope.contacts_name = "";
                $scope.duty = "";
                $scope.phone = "";
                $scope.addContacts[index] = {
                    show: false
                };
            }
        });
    };

    // 打开选项卡
    $scope.view_contacts = function ($index, id) {
        if ($scope.contacts[$index].show == false) {
            for (var i = 0; i < $scope.len; i++) {
                $scope.contacts[i] = {
                    show: false
                };
            }
            $scope.contacts[$index].show = true;
            $scope.get_contact(id);
        }
        else {
            $scope.contacts[$index].show = false;
        }
    };

    // 新增联系人卡片
    $scope.open_add_contacts = function ($index) {
        $scope.addContacts[$index] = {
            show: true
        };
    };

    $scope.close_contacts = function ($index) {
        $scope.addContacts[$index] = {
            show: false
        };
    };

    // 新增联系人
    $scope.add_contacts = function (iValid, id, index) {
        $scope.submitted = true;
        if (iValid) {
            _basic.post($host.api_url + "/user/" + userId + "/receive/" + id + "/contacts", {
                "contactsName": $scope.contacts_name,
                "position": $scope.duty,
                "tel": $scope.phone
            }).then(function (data) {
                if (data.success == true) {
                    $scope.get_contact(id);
                    $scope.submitted = false;
                }
            });
        }
    };

    // 删除联系人
    $scope.delete_contact = function (id, con_id) {
        swal({
                title: "确认删除?",
                text: "确认删除该联系人?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
                _basic.delete($host.api_url + "/user/" + userId + "/receiveContacts/" + id).then(function (data) {
                    if (data.success == true) {
                        swal("删除成功!", "", "success");
                        $scope.get_contact(con_id);
                    }
                });
            }
        })
    }

    // 显示洗车费模态框
    $scope.showCarWashFeeModel = function (item) {
        $scope.currentReceiveId = item.id;
        $scope.carWashFeeCount = item.clean_fee;
        $scope.bigCleanFee = item.big_clean_fee;
        $scope.trailerFee = item.trailer_fee;
        $scope.runFee = item.run_fee;
        $scope.leadFee = item.lead_fee;
        $scope.monthFlag =item.month_flag;
        $scope.trailerMonthFlag =item.trailer_month_flag;
        $scope.runMonthFlag =item.run_month_flag;
        $scope.leadMonthFlag =item.lead_month_flag;
      /*  $scope.guardFeeCount = item.guard_fee;*/
        $('#carWashFeeModel').modal('open');
    };

    // 修改洗车费金额
    $scope.changeWashFee = function () {
        _basic.put($host.api_url + "/user/" + userId + "/receive/" + $scope.currentReceiveId + "/cleanFee",{
            cleanFee:($scope.carWashFeeCount).toFixed(2),
            bigCleanFee: ($scope.bigCleanFee).toFixed(2),
            trailerFee: ($scope.trailerFee).toFixed(2),
            runFee: ($scope.runFee).toFixed(2),
            leadFee: ($scope.leadFee).toFixed(2),
            monthFlag:$scope.monthFlag,
            trailerMonthFlag:$scope.trailerMonthFlag,
            runMonthFlag:$scope.runMonthFlag,
            leadMonthFlag:$scope.leadMonthFlag
        }).then(function (data) {
            if (data.success === true) {
                swal("修改成功", "", "success");
                $('#carWashFeeModel').modal('close');
                $scope.search_all_dealer();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }


    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        if(conditions.makeId==''){
            $scope.car_brand={};
            $scope.car_brand.id='';
        }
        if(conditions.makeName==''){
            $scope.car_brand={};
            $scope.car_brand.make_name=''
        }
        $scope.s_dealer=conditions.receiveId;
        $scope.receive_type=conditions.receiveType;
        $scope.city=conditions.cityId;
        $scope.car_brand.id=conditions.makeId;
        $scope.car_brand.make_name=conditions.makeName;
        $scope.receive_flag = conditions.receiveFlag;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        if( $scope.car_brand==undefined){
            return{
                receiveId: $scope.s_dealer,
                receiveType:$scope.receive_type,
                cityId: $scope.city,
               /* receiveFlag:$scope.receive_flag,*/
                makeId: '',
                makeName: ''
            }
        }else {
            return {
                receiveId: $scope.s_dealer,
                receiveType:$scope.receive_type,
                cityId: $scope.city,
               /* receiveFlag:$scope.receive_flag,*/
                makeId: $scope.car_brand.id,
                makeName: $scope.car_brand.make_name
            }
        }
    }



    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "setting_dealer__details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "setting_dealer") {
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
        // 初始数据
        $scope.search_all_dealer();

    }
    initData();



    // 分页
    // 上一页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        $scope.search_all_dealer();
    };
    // 下一页
    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        $scope.search_all_dealer();
    };



    $scope.get_Msg();

}]);