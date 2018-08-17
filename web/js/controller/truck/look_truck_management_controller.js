app.controller("look_truck_management_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var truckAccId = $stateParams.id;
    var relId;
    $scope.truckAccidentCheckId = '';
    $scope.accientImageList = [];
    $scope.car_image_i = [];
    $scope.userList = _config.userTypes;
    $scope.underUserName = '';
    $scope.nowDate = new Date().getTime();
    var user_info_obj = _config.userTypes;
    // 点击返回按钮返回之前页面
    $scope.return = function () {
        $state.go($stateParams.from, {reload: true});
    };

    //获取信息
    function getDetailTruckData() {
        _basic.get($host.api_url + "/truckAccident?truckAccidentId=" + truckAccId).then(function (data) {
            if (data.success === true) {
                $scope.vId = data.result[0].id;
                $scope.truckId = data.result[0].truck_id;
                $scope.driveId = data.result[0].drive_id;
                $scope.dpRouteTaskId = data.result[0].dp_route_task_id;
                $scope.accidentDate = data.result[0].accident_date;
                $scope.cityRouteStart = data.result[0].city_route_start;
                $scope.cityRouteEnd = data.result[0].city_route_end;
                $scope.accidentDateDetail = moment($scope.accidentDate).format("YYYY-MM-DD");
                $scope.lineStartTime = moment($scope.accidentDate).format("HH:mm");
                $scope.truckNum = data.result[0].truck_num;
                $scope.truckType = data.result[0].truck_type;
                $scope.driveName = data.result[0].drive_name;
                $scope.accidentStatus = data.result[0].accident_status;
                $scope.address = data.result[0].address;
                $scope.lng = data.result[0].lng;
                $scope.lat = data.result[0].lat;
                $scope.remark = data.result[0].accident_explain;
                $scope.truckTel = data.result[0].mobile;
                $scope.operateType = data.result[0].operate_type;
                $scope.companyName = data.result[0].company_name;

                $scope.showMarkerPosition($scope.lng, $scope.lat);
            }
        })
    }

    // 显示marker位置
    $scope.showMarkerPosition = function (lon, lat) {
        var marker, map = new AMap.Map("a_map_location", {
            resizeEnable: true,
            center: [lon, lat],
            zoom: 17
        });
        if (marker) {
            return;
        }
        marker = new AMap.Marker({
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [lon, lat]
        });
        marker.setMap(map);
    };

    // 高德autocomplete
    $scope.amapAutocomplete = function () {
        AMap.plugin(['AMap.Autocomplete'],function(){
            var autoOptions = {
                city: "中国", //城市，默认全国
                input: "amapAddress"//使用联想输入的input的id
            };
            var autocomplete = new AMap.Autocomplete(autoOptions);
            AMap.event.addListener(autocomplete, "select", function(e){
                // console.log(e);
                if(e.poi.location === undefined){
                    swal("无法获取该位置地理信息", "请重新输入", "warning")
                }
                else{
                    $scope.$apply(function () {
                        $scope.lng = e.poi.location.lng;
                        $scope.lat = e.poi.location.lat;
                    });
                    $scope.showMarkerPosition(e.poi.location.lng,e.poi.location.lat);
                }
            });
        });
    };

    //事故信息
    $scope.createTruckAccident = function (valid) {
        if (valid) {
            var managementInfo = {
                driveId: $scope.driveId,
                truckId: $scope.truckId,
                dpRouteTaskId: $scope.dpRouteTaskId,
                accidentDate: $scope.accidentDateDetail + " " + $scope.lineStartTime,
                address: $("#amapAddress").val(),
                lng: $scope.lng,
                lat: $scope.lat,
                accidentExplain: $scope.remark
            };
            _basic.put($host.api_url + "/user/" + userId + "/truckAccident/" + truckAccId, managementInfo).then(function (data) {
                if (data.success === true) {
                    $state.go($stateParams.from, {reload: true})
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    };

    $scope.showDamageImage = function () {
        $scope.getCurrentAccientImage();
    };

    // 获取当前车辆事故照片
    $scope.getCurrentAccientImage = function () {
        _basic.get($host.record_url + "/truckDamage?truckDamageId=" + truckAccId).then(function (data) {
            if (data.success === true) {
                if (data.result.length !== 0) {
                    $scope.id = data.result[0]._id;
                    $scope.accientImageList = data.result[0].damage_image;
                    for (var i = 0; i < $scope.accientImageList.length; i++) {
                        $scope.accientImageList[i].url = $host.file_url + '/image/' + $scope.accientImageList[i].url
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 照片上传函数
    function uploadBrandImage(filename, dom_obj, callback) {
        if (filename) {
            if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
                var max_size_str = dom_obj.attr('max_size');
                var max_size = 4 * 1024 * 1024; //default: 4M
                var re = /\d+m/i;
                if (re.test(max_size_str)) {
                    max_size = parseInt(max_size_str.substring(0, max_size_str.length - 1)) * 1024 * 1024;
                    _basic.formPost(dom_obj.parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=5', function (data) {
                        if (data.success) {
                            var imageId = data.imageId;
                            callback(imageId);
                        } else {
                            swal('上传图片失败', "", "error");
                        }
                    }, function (error) {
                        swal('服务器内部错误', "", "error");
                    })
                }

                if (dom_obj[0].files[0].size > max_size) {
                    swal('图片文件最大: ' + max_size_str, "", "error");
                    return false;
                }
            }
            else if (filename && filename.length > 0) {
                dom_obj.val('');
                swal('支持的图片类型为. (jpeg,jpg,png,gif,svg,bmp,tiff)', "", "error");
            } else {

            }
        }
    }

    // 照片上传
    $scope.uploadAccientImage = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            _basic.post($host.record_url + "/user/" + userId + "/truckDamage/" + truckAccId + "/image", {
                username: _basic.getSession(_basic.USER_NAME),
                userId: userId,
                userType: _basic.getSession(_basic.USER_TYPE),
                url: imageId,
                vheNo: $scope.truckNum
            }).then(function (data) {
                if (data.success == true) {
                    if ($scope.accientImageList.length != 0) {
                        viewer.destroy();
                    }
                    var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
                    $scope.car_image_i.push($host.file_url + '/image/' + imageId);
                    $scope.accientImageList.push({
                        url: $host.file_url + '/image/' + imageId,
                        time: nowDate,
                        user: _basic.getSession(_basic.USER_NAME)
                    });
                    $scope.getCurrentAccientImage();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        });
    };

    // 删除照片
    $scope.delete_img = function (src) {
        swal({
                title: "确认删除该照片？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
            function () {
                var url_array = src.split("/");
                var url = url_array[url_array.length - 1];
                _basic.delete($host.record_url + "/user/" + userId + "/record/" + $scope.id + "/truckDamageImage/" + url).then(function (data) {
                    if (data.success === true) {
                        var i = $scope.car_image_i.indexOf(src);
                        $scope.accientImageList.splice(i, 1);
                        $scope.car_image_i.splice(i, 1);
                        swal("删除成功!", "", "success");
                        $scope.getCurrentAccientImage();
                        if ($scope.accientImageList.length != 0) {
                            viewer.destroy();
                        }
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                })
            }
        )
    };

    // 点击图片查看大图
    var viewer;
    $scope.accientFinish = function () {
        viewer = new Viewer(document.getElementById('accient_image'), {
            url: 'data-original'
        });
    };

    $scope.getCurrentAccInfo = function () {
        getLiablePersonList();
    };

    // 获取责任人列表
    function getLiablePersonList() {
        _basic.get($host.api_url + "/user?status=1").then(function (data) {
            if (data.success === true) {
                var responsibilityDataList = [];
                for (var i = 0; i < data.result.length; i++) {
                    for (var j = 0; j < $scope.userList.length; j++) {
                        if (data.result[i].type == $scope.userList[j].type) {
                            data.result[i].job = $scope.userList[j].name
                        }
                    }
                    responsibilityDataList[i + 1] = {
                        id: data.result[i].uid,
                        text: data.result[i].real_name + " " + data.result[i].job
                    };
                }
                $('#fined').select2({
                    placeholder: '责任人',
                    containerCssClass: 'select2_dropdown',
                    data: responsibilityDataList,
                    allowClear: true
                });
                getBeforeAccList();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    function getBeforeAccList() {
        if ($scope.accidentStatus !== 1) {
            _basic.get($host.api_url + "/truckAccidentCheck?truckAccidentId=" + truckAccId).then(function (data) {
                if (data.success === true) {
                    if (data.result.length == 0) {
                        return;
                    }
                    else {
                        $scope.currentAccInfo = data.result[0];
                        if (data.result[0].truck_accident_type !== undefined && data.result[0].truck_accident_type !== null) {
                            $scope.currentAccInfo.truck_accident_type = data.result[0].truck_accident_type + '';
                        }
                        else {
                            $scope.currentAccInfo.truck_accident_type = '';
                        }
                        $scope.truckAccidentCheckId = data.result[0].id;
                        $scope.underUserName = data.result[0].under_user_name;
                        $scope.underUserType = data.result[0].type;
                        for (var i = 0; i < user_info_obj.length; i++) {
                            if( $scope.underUserType == user_info_obj[i].type){
                                $scope.underUserNameType = user_info_obj[i].name;
                            }
                        }
                        var underUse = $scope.underUserName +' '+  $scope.underUserNameType;
                        if ($scope.underUserName !== null) {
                            $("#fined").val(data.result[0].under_user_id),
                            $("#select2-liable_person-container").html($("#fined").find("option:selected").text(underUse));
                        }
                        else {
                            $("#fined").val(0);
                            $("#select2-liable_person-container").html($("#fined").find("option:selected").text('责任人'));
                        }
                        if ($scope.currentAccInfo.truck_accident_type == null || $scope.currentAccInfo.truck_accident_type == 0 || $scope.currentAccInfo.truck_accident_type == undefined) {
                            $scope.currentAccInfo.truck_accident_type = "";
                        }
                    }
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else {
            $('#fined').val(0);
        }
    }

    $scope.saveHandleInfoModify = function () {
        if ($scope.currentAccInfo.truck_accident_type == 1 || $scope.currentAccInfo.truck_accident_type == 2) {
            _basic.put($host.api_url + "/user/" + userId + "/truckAccidentCheck/" + $scope.truckAccidentCheckId, {
                truckAccidentId: truckAccId,
                truckAccidentType: $scope.currentAccInfo.truck_accident_type,
                underUserId: $("#fined").val(),
                underUserName: $("#fined").find("option:selected").text().split(" ")[0],
                underCost: $scope.currentAccInfo.under_cost,
                companyCost: $scope.currentAccInfo.company_cost,
                profit: $scope.currentAccInfo.profit,
                remark: $scope.currentAccInfo.remark
            }).then(function (data) {
                if (data.success === true) {
                    swal("提交成功", "", "success");
                    $scope.getCurrentAccInfo();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else {
            swal('请输入完整信息', "", "error");
        }
    };

    // 点击开始处理，变为处理中状态并初始化处理信息
    $scope.beginProcessing = function () {
        _basic.post($host.api_url + "/user/" + userId + "/truckAccidentCheck", {
            truckAccidentId: truckAccId,
            truckAccidentType: 0,
            underUserId: 0,
            underUserName: '',
            underCost: 0,
            companyCost: 0,
            profit: 0,
            remark: ""
        }).then(function (data) {
            if (data.success === true) {
                $scope.accidentStatus = 2;
                $scope.getCurrentAccInfo();
                getLiablePersonList();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    $scope.submitHandleInfo = function () {
        swal({
                title: "确定处理结束吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                if ($scope.currentAccInfo.truck_accident_type == 1 || $scope.currentAccInfo.truck_accident_type == 2) {
                    _basic.put($host.api_url + "/user/" + userId + "/truckAccidentCheck/" + $scope.truckAccidentCheckId, {
                        truckAccidentId: truckAccId,
                        truckAccidentType: $scope.currentAccInfo.truck_accident_type,
                        underUserId: $("#fined").val(),
                        underUserName: $("#fined").find("option:selected").text().split(" ")[0],
                        underCost: $scope.currentAccInfo.under_cost,
                        companyCost: $scope.currentAccInfo.company_cost,
                        profit: $scope.currentAccInfo.profit,
                        remark: $scope.currentAccInfo.remark
                    }).then(function (data) {
                        if (data.success === true) {
                            _basic.put($host.api_url + "/user/" + userId + "/truckAccident/" + truckAccId + "/accidentStatus/3?truckAccidentCheckId=" + $scope.truckAccidentCheckId, {}).then(function (data) {
                                if (data.success === true) {
                                    swal("处理成功", "", "success");
                                    $scope.accidentStatus = 3;
                                    $scope.getCurrentAccInfo();
                                }
                                else {
                                    swal(data.msg, "", "error");
                                }
                            });
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
                else {
                    swal('请输入完整信息', "", "error");
                }
            })
    };

    //查询维修信息
    $scope.getRepairInfo = function () {
        $scope.repairingInfo = [];
        $scope.repairedInfo = [];
        _basic.get($host.api_url + "/truckRepairRel?truckId=" + $scope.truckId + "&accidentId=" + $scope.vId).then(function (data) {
            if (data.success === true) {
                for (var i = 0; i < data.result.length; i++) {
                    if(data.result[i].repair_status == 0){
                        // 正在维修信息
                        $scope.repairingInfo.push(data.result[i])
                    }
                    else{
                        // 维修结束信息
                        $scope.repairedInfo.push(data.result[i])
                    }
                }
                if($scope.repairingInfo.length != 0){
                    $scope.repairReason = $scope.repairingInfo[0].repair_reason;
                    relId = $scope.repairingInfo[0].id;
                }
                // console.log("repairingInfo",$scope.repairingInfo);
                // console.log("repairedInfo",$scope.repairedInfo);
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };

    // 开启维修结束模态框
    $scope.openRepairReasonMod = function () {
        $scope.repairInfo = "";
        $("#repairReasonMod").modal("open");
    };

    // 维修模态框内点击确定
    $scope.createRepairInfo = function () {
        // console.log("truckAccId",truckAccId);
        if($scope.repairReason !== ""){
            _basic.post($host.api_url + "/user/" + userId + "/truck/" + $scope.truckId + "/truckRepairRel",{
                repairType: 1,
                accidentId: truckAccId,
                repairReason: $scope.repairInfo
            }).then(function (data) {
                if (data.success === true) {
                    // console.log("data", data);
                    relId = data.result.truckRepairRelId;
                    // console.log("relId",relId);
                    $scope.getRepairInfo();
                    $("#repairReasonMod").modal("close");
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请填写维修描述信息！", "", "warning");
        }
    };

    // 正在维修卡片点击保存
    $scope.saveRepairInfo = function () {
        _basic.put($host.api_url + "/user/" + userId + "/truckRepairRelBase/" + relId,{
            repairType: 1,
            accidentId: truckAccId,
            repairReason: $scope.repairReason
        }).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.getRepairInfo();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 正在维修卡片点击维修结束获取维修站信息并开启模态框
    $scope.finishRepairInfo = function () {
        $scope.repairStationMod = "";
        $scope.repairMoneyMod = "";
        $scope.repairExplainMod = "";
        _basic.get($host.api_url + "/repairStation?repairSationStatus=1").then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.repairStationList = data.result;
                $('#repairFinishMod').modal('open');
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 模态框内点击维修完成
    $scope.completeRepairInfo = function () {
        if($scope.repairStationMod != "" && $scope.repairMoneyMod != "" && $scope.repairExplainMod != ""){
            swal({
                    title: "确定维修结束吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    closeOnConfirm: true
                },
                function(){
                    _basic.put($host.api_url + "/user/" + userId + "/truckRepairRel/" + relId,{
                        repairType: 1,
                        accidentId: truckAccId,
                        repairReason: $scope.repairReason,
                        repairStationId: $scope.repairStationMod,
                        repairMoney: $scope.repairMoneyMod,
                        remark: $scope.repairExplainMod
                    }).then(function (data) {
                        if (data.success === true) {
                            // console.log("data", data);
                            $('#repairFinishMod').modal('close');
                            $scope.getRepairInfo();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                });
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    };

    // 获取理赔信息
    $scope.accidentInsure = function () {
        _basic.get($host.api_url + "/truckAccidentInsure?accidentId=" + truckAccId).then(function (data) {
            if (data.success === true) {
                $scope.accidentDetails = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 查询关联事故列表
    $scope.getConnectedAccidentList = function (accidentId) {
        _basic.get($host.api_url + "/truckAccident?accidentInsureId=" + accidentId).then(function (data) {
            if (data.success === true) {
                $scope.accidentClaimList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    $scope.beginAccidentInsure = function () {
        // 初始化所有信息
        $scope.modRecordTruckType = "";
        $scope.modTruckNum = "";
        $scope.insurePlan = "";
        $scope.truckType = "";
        $scope.financialLoan = "";
        $scope.finanlReason = "";
        $scope.hasLoanType = true;
        $('#addInfoModel').modal('open');
        _basic.get($host.api_url + '/truckInsure').then(function (data) {
            if (data.success === true) {
                $scope.insureCompanyList = data.result;
            }
        })
    };

    // 判断是否允许输入财务借款
    $scope.checkHasLoan = function () {
        if ($scope.truckType == 1) {
            $scope.hasLoanType = false;
        }
        else {
            $scope.financialLoan = "";
            $scope.hasLoanType = true;
        }
    };

    // 提交新增的记录
    $scope.addRepairRecord = function () {
        if ($scope.modTruckNum !== undefined && $scope.insurePlan !== undefined && $scope.modRecordTruckType !== undefined) {
            if ($scope.financialLoan == "" || $scope.financialLoan == null) {
                $scope.financialLoan = 0;
            }
            _basic.post($host.api_url + "/user/" + userId + "/truckAccidentInsureBase", {
                insureId: $scope.modRecordTruckType,
                insureType: $scope.modTruckNum,
                insurePlan: $scope.insurePlan,
                financialLoanStatus: $scope.truckType,
                financialLoan: $scope.financialLoan,
                paymentExplain: $scope.finanlReason,
                accidentId: $scope.vId
            }).then(function (data) {
                if (data.success === true) {
                    swal("新增成功", "", "success");
                    $('#addInfoModel').modal('close');
                    $scope.accidentInsure();
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写完整信息！", "", "warning");
        }
    };

    // 删除当前信息
    $scope.deleteAccidentInfo = function (currentAccidentId) {
        if($scope.accidentClaimList.length === 1){
            swal("至少保留一条关联事故！", "", "warning");
        }
        else{
            swal({
                    title: "确定删除当前事故吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    closeOnConfirm: true
                },
                function () {
                    _basic.delete($host.api_url + "/user/" + userId + "/accidentInsure/" + currentAccidentId + "/accident/" + truckAccId).then(function (data) {
                        if (data.success === true) {
                            $scope.getConnectedAccidentList(currentAccidentId);
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                });
        }
    };

    // 获取数据
    $scope.queryData = function () {
        getDetailTruckData();
        getLiablePersonList();
        $scope.getCurrentAccInfo();
    };
    $scope.queryData();
}]);