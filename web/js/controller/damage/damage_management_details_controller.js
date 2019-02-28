app.controller("damage_management_details_controller", ["$scope","$state", "$stateParams", "$host", "_config", "_basic", function ($scope,$state, $stateParams, $host, _config, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    var damageId = $stateParams.id;
    var recordId;
    var damageCheckId;
    var indemnityStatus;
    var indemnityId = null;
    $scope.userList = _config.userTypes;
    $scope.damageTypeList = _config.damageType;
    $scope.damageLinkTypeList = _config.damageLinkType;
    $scope.damageImageList = [];
    $scope.showRadioButton = true;
    $scope.paymentFlag = "1";
    $scope.financeIndemnityStatus = 1; // 财务打款状态
    $scope.cityList = [];

    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"damage_management_details"}, {reload: true})
    };

    // tab切换
    $scope.showDamageImage = function () {
        $scope.getCurrentDamageImage();
        $scope.getBeforeDamageInfo();
    };
    $scope.showDamageHandleInfo = function () {
        $scope.getBeforeDamageInfo();
        $scope.getRepairStationList();
        $scope.cityList = [];
    };
    $scope.showInsuranceInfo = function () {
        $scope.getInsuranceInfo();
        $scope.getInsurePaymentCard();
    };

    // 获取责任人列表
    $scope.getLiablePersonList = function () {
        _basic.get($host.api_url + "/user?status=1").then(function (data) {
            if (data.success === true) {
                var responsibilityDataList = [];
                var reimbursementDataList = [];
                for (var i = 0; i < data.result.length; i++) {
                    for (var j = 0; j < $scope.userList.length; j++) {
                        if(data.result[i].type == $scope.userList[j].type){
                            data.result[i].job = $scope.userList[j].name
                        }
                    }
                    responsibilityDataList[0] = {
                        id: 0,
                        text: "责任人"
                    };
                    reimbursementDataList[0] = {
                        id: 0,
                        text: "报销人"
                    };
                    responsibilityDataList[i + 1] = {
                        id: data.result[i].uid,
                        text: data.result[i].real_name + " " + data.result[i].job
                    };
                    reimbursementDataList[i + 1] = {
                        id: data.result[i].uid,
                        text: data.result[i].real_name + " " + data.result[i].job
                    }
                }
                $('#liable_person').select2({
                    placeholder: '责任人',
                    containerCssClass : 'select2_dropdown',
                    data: responsibilityDataList
                });
                $('#reimbursement_person').select2({
                    placeholder: '报销人',
                    containerCssClass : 'select2_dropdown',
                    data: reimbursementDataList
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 根据当前damageId查询当前质损信息和质损状态
    $scope.getCurrentDamageInfo = function () {
        _basic.get($host.api_url + "/damage?damageId=" + damageId).then(function (data) {
            if (data.success === true) {
                $scope.currentDamageStatus = data.result[0].damage_status;
                $scope.currentDamageInfo = data.result[0];
                $scope.currentDamageInfo.vin = data.result[0].vin;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取当前质损照片
    $scope.getCurrentDamageImage = function () {
        _basic.get($host.record_url + "/damageRecord?damageId=" + damageId).then(function (data) {
            if (data.success === true) {
                if(data.result.length !== 0){
                    $scope.damageImageList = data.result[0].damage_image;
                    recordId = data.result[0]._id;
                    for (var i = 0; i < $scope.damageImageList.length; i++) {
                        $scope.damageImageList[i].url = $host.file_url + '/image/' + $scope.damageImageList[i].url
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });


        var filedId = "5b206c1953846c47541e22ca";
        _basic.get($host.file_url+'/user/'+userId+"/file?fileId="+filedId).then(function (data) {
            if (data.success == true) {
                if(data.result.length !== 0){
                    $scope.video=true;
                    $scope.videoUrl = $host.file_url+'/user/'+userId+"/file/"+filedId+"/video.mp4";
                }
            }
            else {
                $scope.video=false;
            }
        });
    };

    // 照片上传函数
    function uploadBrandImage(filename,dom_obj,callback) {
        if(filename){
            if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
                var max_size_str = dom_obj.attr('max_size');
                var max_size = 4 * 1024 * 1024; //default: 4M
                var re = /\d+m/i;
                if (re.test(max_size_str)) {
                    max_size = parseInt(max_size_str.substring(0, max_size_str.length - 1)) * 1024 * 1024;
                    _basic.formPost(dom_obj.parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=4', function (data) {
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
            }else {

            }
        }
    }

    // 质损照片上传
    $scope.uploadDamageImage = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            _basic.post($host.record_url + "/user/" + userId + "/damage/" + damageId + "/image", {
                "username": _basic.getSession(_basic.USER_NAME),
                "userId": userId,
                "userType": _basic.getSession(_basic.USER_TYPE),
                "url": imageId,
                "vin":  $scope.currentDamageInfo.vin
            }).then(function (data) {
                if (data.success == true) {
                    $scope.getCurrentDamageImage();
                    // 保证新增的图片也可以放大
                    if ($scope.damageImageList.length != 0) {
                        viewer.destroy();
                    }
                }
            });
        });
    };

    // 删除当前照片
    $scope.deleteImage = function (imageUrl) {
        var realUrl = imageUrl.split("/")[imageUrl.split("/").length - 1];
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
                _basic.delete($host.record_url + "/user/" + userId + "/record/" + recordId + "/damageImage/" + realUrl).then(function (data) {
                    if (data.success === true) {
                        swal("删除成功", "", "success");
                        $scope.getCurrentDamageImage();
                        if ($scope.damageImageList.length != 0) {
                            viewer.destroy();
                        }
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            })
    };

    // 获取维修站列表
    $scope.getRepairStationList = function () {
        _basic.get($host.api_url + "/repairStation?repairSationStatus=1").then(function (data) {
            if (data.success === true) {
                $scope.repairStationList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取城市列表
    $scope.getCityList = function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                $scope.cityList = data.result;
                $('#located_city').select2({
                    placeholder: '所在城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };


    // 获取当前damageId下之前保存的信息
    $scope.getBeforeDamageInfo = function () {
        _basic.get($host.api_url + "/damageCheck?damageId=" + damageId).then(function (data) {
            if (data.success === true) {
                if(data.result.length !== 0){
                    if(data.result[0].damage_type === 0 || data.result[0].damage_type == null){
                        data.result[0].damage_type = ""
                    }
                    if(data.result[0].damage_link_type === 0 || data.result[0].damage_link_type == null){
                        data.result[0].damage_link_type = ""
                    }
                    if(data.result[0].repair_id === 0 || data.result[0].repair_id == null){
                        data.result[0].repair_id = ""
                    }

                    if(data.result[0].under_user_id == null){
                        data.result[0].under_user_id = 0;
                    }
                    if(data.result[0].refund_user_id == null){
                        data.result[0].refund_user_id = 0;
                    }
                    damageCheckId = data.result[0].id;
                    if(data.result[0].damage_indemnity_status == 2){
                        $scope.showRadioButton = false;
                    }
                    // 无需赔款或需要赔款状态
                    indemnityStatus = data.result[0].damage_indemnity_status;
                    $scope.paymentFlag = data.result[0].damage_indemnity_status+'';
                }
                if($scope.currentDamageStatus == 1){
                    $('#liable_person').val(0);
                    $('#reimbursement_person').val(0);
                }
                else{
                    $('#liable_person').val(data.result[0].under_user_id);
                    $('#reimbursement_person').val(data.result[0].refund_user_id);
                    $("#select2-liable_person-container").html($("#liable_person").find("option:selected").text());
                    $("#select2-reimbursement_person-container").html($("#reimbursement_person").find("option:selected").text());
                }
                $scope.damageInfoBefore = data.result[0];
                $scope.getRemittanceInfo();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };


    // 获取打款信息
    $scope.getRemittanceInfo = function () {
        if(indemnityStatus === 2){
            _basic.get($host.api_url + "/damageCheckIndemnity?damageCheckId=" + damageCheckId).then(function (data) {
                if (data.success === true) {
                    $scope.paymentInfo = data.result[0];
                    $scope.bankAccount = data.result[0].bank_number;
                    $scope.accountName = data.result[0].bank_user_name;
                    $scope.openingBank = data.result[0].bank_name;
                    $scope.locatedCity = data.result[0].city_id;
                    $scope.getCityList();
                    $scope.distributor = data.result[0].receive_name;
                    $scope.paymentMoney = data.result[0].plan_money;
                    $scope.contactsName = data.result[0].contacts_name;
                    $scope.contactsTel = data.result[0].tel;
                    $scope.paymentRemark = data.result[0].apply_explain;
                    indemnityId = data.result[0].id;
                    $scope.financeIndemnityStatus = data.result[0].indemnity_status;
                    if(data.result[0].voucher_image != null){
                        $scope.realImageSrc = $host.file_url + '/image/' + data.result[0].voucher_image;
                    }
                    else{
                        $scope.realImageSrc = null;
                    }
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else {
            $scope.getCityList();
        }
    };


    // 点击开始处理，变为处理中状态并初始化处理信息
    $scope.beginProcessing = function () {
        _basic.post($host.api_url + "/user/" + userId + "/damageCheck?damageId=" + damageId,{
            underUserId: 0,
            underUserName: "",
            damageType: 0,
            damageLinkType: 0,
            refundUserId: 0,
            refundUserName: "",
            reductionCost: 0,
            penaltyCost: 0,
            profit: 0,
            repairId: 0,
            repairCost: 0,
            transportCost: 0,
            underCost: 0,
            companyCost: 0,
            remark: ""
        }).then(function (data) {
            if (data.success === true) {
                $scope.getCurrentDamageInfo();// 刷新质损状态
                $scope.getBeforeDamageInfo();// 获取默认信息
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    
    // 点击保存按钮
    $scope.saveInfo = function () {
        $scope.saveHandleInfoModify(false); // 保存基本信息
    };
    
    // 点击完成按钮
    $scope.finishInfo = function () {
        $scope.saveHandleInfoModify(true); // 保存基本信息
    };

    // 保存基本信息
    $scope.saveHandleInfoModify = function (finishFlag) {
        var liablePersonText = $("#liable_person").find("option:selected").text().split(" ")[0];
        if(liablePersonText=='责任人'){
            liablePersonText = '';
        }
        var repairId = $scope.damageInfoBefore.repair_id == "" ? 0 : $scope.damageInfoBefore.repair_id;
        if(
            $scope.damageInfoBefore.damage_type != ""
            && $scope.damageInfoBefore.damage_link_type != ""
            && $('#reimbursement_person').val() != 0
        ){
            _basic.put($host.api_url + "/user/" + userId + "/damageCheck/" + damageCheckId + "?damageId=" + damageId, {
                underUserId: $('#liable_person').val(),
                underUserName: liablePersonText,
                damageType: parseInt($scope.damageInfoBefore.damage_type),
                damageLinkType: parseInt($scope.damageInfoBefore.damage_link_type),
                refundUserId: $('#reimbursement_person').val(),
                refundUserName: $("#reimbursement_person").find("option:selected").text().split(" ")[0],
                reductionCost: $scope.damageInfoBefore.reduction_cost,
                penaltyCost: $scope.damageInfoBefore.penalty_cost,
                profit: $scope.damageInfoBefore.profit,
                repairId: repairId,
                repairCost: $scope.damageInfoBefore.repair_cost,
                transportCost: $scope.damageInfoBefore.transport_cost,
                underCost: $scope.damageInfoBefore.under_cost,
                companyCost: $scope.damageInfoBefore.company_cost,
                remark: $scope.damageInfoBefore.remark
            }).then(function (data) {
                if (data.success === true) {
                    $scope.savePaymentInfoModify(finishFlag);
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请填写完整基本信息！", "", "warning");
        }
    };

    // 保存打款信息
    $scope.savePaymentInfoModify = function (finishFlag) {
        // 根据借款状态判断是新增操作还是修改操作
        if($scope.paymentFlag == 2 && indemnityId == null){
            if(
                $scope.bankAccount !== ""
                && $scope.bankAccount !== undefined
                && $scope.accountName !== ""
                && $scope.accountName !== undefined
                && $scope.openingBank !== ""
                && $scope.openingBank !== undefined
                && $scope.locatedCity !== ""
                && $scope.locatedCity !==undefined
                && $scope.distributor !== ""
                && $scope.distributor !==undefined
                && $scope.paymentMoney!== ""
                && $scope.paymentMoney!==undefined
            ){
                $scope.getCityList();
                // 新增操作
                _basic.post($host.api_url + "/user/" + userId + "/damageCheckIndemnity",{
                    damageId: damageId,
                    damageCheckId: damageCheckId,
                    bankNumber: $scope.bankAccount,
                    bankUserName: $scope.accountName,
                    bankName: $scope.openingBank,
                    cityId: $scope.locatedCity,
                    receiveName: $scope.distributor,
                    planMoney: $scope.paymentMoney,
                    contactsName:$scope.contactsName,
                    tel:$scope.contactsTel,
                    applyExplain: $scope.paymentRemark
                }).then(function (data) {
                    if (data.success === true) {
                        // 判断是否需要更新处理状态
                        if(finishFlag){
                            $scope.updateDamageStatus();
                        }
                        else{
                            $scope.cityList = [];
                            $scope.locatedCity ='';
                            $scope.getBeforeDamageInfo();
                        }
                        // 修改借款状态
                        _basic.put($host.api_url + "/user/" + userId + "/damageCheck/" + damageCheckId + "/damageIndemnityStatus/2", {}).then(function (data) {
                            if (data.success === true) {
                                swal("保存成功", "", "success");

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
            else{
                swal("请填写完整打款信息！", "", "warning");
            }
        }
        else if($scope.paymentFlag == 2 && indemnityId != null){
            if(
                $scope.bankAccount !== ""
                && $scope.bankAccount !== undefined
                && $scope.accountName !== ""
                && $scope.accountName !== undefined
                && $scope.openingBank !== ""
                && $scope.openingBank !== undefined
                && $scope.locatedCity !== ""
                && $scope.locatedCity !==undefined
                && $scope.distributor !== ""
                && $scope.distributor !==undefined
                && $scope.paymentMoney!== ""
                && $scope.paymentMoney!==undefined
            ){
                // 修改操作
                _basic.put($host.api_url + "/user/" + userId + "/damageCheckIndemnity/" + indemnityId,{
                    damageId: damageId,
                    damageCheckId: damageCheckId,
                    bankNumber: $scope.bankAccount,
                    bankUserName: $scope.accountName,
                    bankName: $scope.openingBank,
                    cityId: $scope.locatedCity,
                    receiveName: $scope.distributor,
                    planMoney: $scope.paymentMoney,
                    contactsName:$scope.contactsName,
                    tel:$scope.contactsTel,
                    applyExplain: $scope.paymentRemark
                }).then(function (data) {
                    if (data.success === true) {
                        // 判断是否需要更新状态
                        if(finishFlag){
                            $scope.updateDamageStatus();
                        }
                        else{
                            swal("保存成功", "", "success");
                        }
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
            else{
                swal("请填写完整打款信息！", "", "warning");
            }
        }
        else{
            if(finishFlag){
                $scope.updateDamageStatus();
            }
            else{
                swal("保存成功", "", "success");
            }
        }
    };
    
    // 改变处理状态
    $scope.updateDamageStatus = function () {
        _basic.put($host.api_url + "/user/" + userId + "/damage/" + damageId + "/damageStatus/3",{
            damageCheckId : damageCheckId
        }).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                swal("质损信息完成", "", "success");
                $scope.getCurrentDamageInfo();
                $scope.getBeforeDamageInfo();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击图片查看大图
    var viewer;
    $scope.damageFinish = function () {
        viewer = new Viewer(document.getElementById('damage_image'), {
            url: 'data-original'
        });
    };
    $scope.showPaymentVoucherImage = function () {
        viewer = new Viewer(document.getElementsByClassName('payment_voucher'), {
            url: 'data-original'
        });
    };

    // 开启添加理赔信息model
    $scope.showInsuranceModel = function () {
        $scope.insuranceCompanyId = "";
        $scope.insuranceCompensation = 0;
        $scope.insurancePay = 0;
        $('#carInfoModel').modal('open');
    };

    // 获取理赔信息卡片
    $scope.getInsurePaymentCard = function () {
        _basic.get($host.api_url + "/damageInsure?damageId=" + damageId).then(function (data) {
            if (data.success === true) {
                $scope.damageInsureCardList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取保险公司
    $scope.getInsuranceInfo = function () {
        // 获取折线图的保险公司列表
        _basic.get($host.api_url + "/truckInsure").then(function (insuranceListData) {
            if (insuranceListData.success === true) {
                $scope.insuranceList = insuranceListData.result;
            }
            else {
                swal(insuranceListData.msg, "", "error");
            }
        });
    };

    $scope.openVideo =function (){
        $(".modal").modal();
        $("#video").modal("open");
        var videoJs=document.querySelector('.video-js');
        var player = videojs(videoJs,{
            muted: false
        });
        player.fluid(true);
    }
    // 获取数据
    $scope.queryData = function () {
        $scope.getCurrentDamageInfo();
        $scope.getLiablePersonList();
    };
    $scope.queryData();
}]);