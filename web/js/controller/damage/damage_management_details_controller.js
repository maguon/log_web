app.controller("damage_management_details_controller", ["$scope","$state", "$stateParams", "$host", "_config", "_basic", function ($scope,$state, $stateParams, $host, _config, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    var damageId = $stateParams.id;
    var recordId;
    var timeout;
    var damageCheckId;
    var indemnityStatus;
    var indemnityId = null;
    var paymentRemark;
    var damageInfoBeforeRemark;
    $scope.userList = _config.userTypes;
    $scope.damageTypeList = _config.damageType;
    $scope.damageLinkTypeList = _config.damageLinkType;
    $scope.damageImageList = [];
    $scope.showRadioButton = true;
    $scope.paymentFlag = "1";
    $scope.financeIndemnityStatus = 1; // 财务打款状态
    $scope.cityList = [];
    $scope.damageInfoBefore={};
    $scope.handler = _basic.getSession(_basic.USER_NAME);
    $scope.pageType = '';

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
        getInsuranceCompany();
        getCityList();
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
                getCarType( $scope.currentDamageInfo.make_id)
                $scope.currentOrderDate=moment(data.result[0].order_date).format("YYYY-MM-DD");
                $scope.currentDamageInfo.vin = data.result[0].vin;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    function  getCarType(makeName){
        _basic.get($host.api_url + "/carMake/" + makeName + "/carModel?modelStatus=1").then(function (data) {
            if (data.success == true) {

                $scope.carTypeList = data.result;

            } else {
                swal(data.msg, "", "error");
            }
        });

    }

    // 停启用
    $scope.changeStatus = function (st, id) {
        if (st == "1") {
            $scope.changeSt = "0"
        } else if (st == "0") {
            $scope.changeSt = "1"
        }

        _basic.put($host.api_url + "/user/" + userId + "/damage/" + id + "/hangStatus/" + $scope.changeSt, {}).then(function (data) {
            if (data.success == true) {
                $scope.getCurrentDamageInfo();

            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };


    //保存
    $scope.putBasicItem =function(){
        if($scope.currentDamageInfo.damage_explain==null||$scope.currentDamageInfo.damage_explain==undefined||$scope.currentDamageInfo.damage_explain==''){
            swal("请填写质损说明！","","error")
        }
        else {
            var remark = $scope.currentDamageInfo.damage_explain.replace(/，|,/g, ' ');
            if( $scope.currentDamageInfo.car_model_name==null|| $scope.currentDamageInfo.car_model_name==undefined||$scope.currentDamageInfo.car_model_name==''){
                swal("请填写车型！","","error")
            }
            else{
                _basic.put($host.api_url + "/user/" + userId + "/damage/" + damageId,{
                    carModelName: $scope.currentDamageInfo.car_model_name,
                    damageExplain:remark
                }).then(function (data) {
                    if (data.success === true) {

                        swal("修改成功", "", "success");
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
        }


    }

    // 获取当前质损照片
    $scope.getCurrentDamageImage = function () {
        _basic.get($host.record_url + "/damageRecord?damageId=" + damageId).then(function (data) {
            if (data.success === true) {
                if(data.result.length !== 0){
                    $scope.damageImageList = data.result[0].damage_image;
                    $scope.damageImagevideo = data.result[0].damage_video;
                    if($scope.damageImagevideo==null || $scope.damageImagevideo.length ==0 ){
                        $scope.filedId =[];
                        $scope.video=false;
                    }
                    else {
                        $scope.filedId =$scope.damageImagevideo[0].url;
                        $scope.videoUrl = $host.file_url+"/file/"+ $scope.filedId+"/video.mp4";
                        $scope.video=true;
                    }
                    recordId = data.result[0]._id;
                    for (var i = 0; i < $scope.damageImageList.length; i++) {
                        $scope.damageImageList[i].url = $host.file_url + '/image/' + $scope.damageImageList[i].url
                    }
                }
                else {
                    $scope.damageImageList=[];
                    $scope.filedId=[];
                }
            }
            else {
                swal(data.msg, "", "error");
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
                cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
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
            }
        })
    }

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
                if(data.result[0].sc_payment_date==null){
                    $scope.damageInfoBefore.sc_payment_date='';
                }
                else {
                    var q=data.result[0].sc_payment_date.toString().slice(0,4);
                    var w=data.result[0].sc_payment_date.toString().slice(4,6);
                    var e=data.result[0].sc_payment_date.toString().slice(6,8);
                    $scope.damageInfoBefore.sc_payment_date=q+'-'+w+'-'+e;
                }

                $scope.getRemittanceInfo();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    //改变前端赔付金额



    $scope.changeScPanment = function(scPayment) {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
             _basic.put($host.api_url + "/user/" + userId + "/damage/" + damageId+'/scPayment',{
                scPayment: scPayment
             }).then(function (data) {
                if (data.success === true) {
                    $scope.getBeforeDamageInfo();
                }
              /*  else {
                    swal(data.msg, "", "error");
                }*/
            });
        }, 3000);
    };



    // 获取打款信息
    $scope.getRemittanceInfo = function () {
        if(indemnityStatus === 2){
            _basic.get($host.api_url + "/damageCheckIndemnity?damageCheckId=" + damageCheckId).then(function (data) {
                if (data.success === true) {
                    $scope.paymentInfo = data.result[0];
                    $scope.bankAccount = data.result[0].bank_number;
                    $scope.banNumberAccount = data.result[0].bank_id;
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
   /* $scope.filter= function(value) {
        //因为当用户只输入一个“-”负号时候会被解析为字符串从而被过滤掉，所以需要分开判断
        if (value.length == 1) {
            var parttern = /[0-9\-]/;
            var matches = parttern.exec(value);
            $scope.bankAccount = Array.isArray(matches) ? matches[0] : '';
        } else {
            var parttern = /(-|\+)?\d+/g;
            var matches = parttern.exec(value);
            $scope.bankAccount = Array.isArray(matches) ? matches[0] : '';
        }
        console.log($scope.bankAccount)
    }*/

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
        if($scope.damageInfoBefore.remark==null||$scope.damageInfoBefore.remark==undefined){
            damageInfoBeforeRemark ='';
        }
        else {
            damageInfoBeforeRemark = $scope.damageInfoBefore.remark.replace(/，|,/g, ' ');
        }
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
                profit: 0,
                repairId: repairId,
                repairCost: $scope.damageInfoBefore.repair_cost,
                transportCost: $scope.damageInfoBefore.transport_cost,
                underCost: $scope.damageInfoBefore.under_cost,
                companyCost: $scope.damageInfoBefore.company_cost,
                scPaymentDate:  moment($scope.damageInfoBefore.sc_payment_date).format('YYYYMMDD'),
                remark: damageInfoBeforeRemark
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

        if( $scope.paymentRemark==''|| $scope.paymentRemark==undefined){
             paymentRemark ='';
        }
        else {
             paymentRemark =$scope.paymentRemark.replace(/，|,/g, ' ');
        }


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
                && $scope.banNumberAccount!== ""
                && $scope.banNumberAccount!==undefined
            ){
                $scope.getCityList();
                // 新增操作
                _basic.post($host.api_url + "/user/" + userId + "/damageCheckIndemnity",{
                    damageId: damageId,
                    damageCheckId: damageCheckId,
                    bankNumber: $scope.bankAccount,
                    bankId:$scope.banNumberAccount,
                    bankUserName: $scope.accountName,
                    bankName: $scope.openingBank,
                    cityId: $scope.locatedCity,
                    receiveName: $scope.distributor,
                    planMoney: $scope.paymentMoney,
                    contactsName:$scope.contactsName,
                    tel:$scope.contactsTel,
                    applyExplain:paymentRemark
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
                && $scope.banNumberAccount!== ""
                && $scope.banNumberAccount!==undefined
            ){
                // 修改操作
                _basic.put($host.api_url + "/user/" + userId + "/damageCheckIndemnity/" + indemnityId,{
                    damageId: damageId,
                    damageCheckId: damageCheckId,
                    bankNumber: $scope.bankAccount,
                    bankId:$scope.banNumberAccount,
                    bankUserName: $scope.accountName,
                    bankName: $scope.openingBank,
                    cityId: $scope.locatedCity,
                    receiveName: $scope.distributor,
                    planMoney: $scope.paymentMoney,
                    contactsName:$scope.contactsName,
                    tel:$scope.contactsTel,
                    applyExplain: paymentRemark
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
    };

    /*** 2020-08-12 添加代码开始部分 ***/

    // 获取所有保险公司
    function getInsuranceCompany() {
        _basic.get($host.api_url + "/truckInsure").then(function (data) {
            if (data.success === true) {
                $scope.insureCompanyList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //出险城市
    function getCityList() {
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.insureCityList = cityData.result;
                $('#cityName').select2({
                    placeholder: '出险城市',
                    containerCssClass: 'select2_dropdown',
                    allowClear: false
                }).on('change', function () {
                    // 委托方 下拉选中 内容
                    if ($("#cityName").val() != null && $("#cityName").val() !== "") {
                        $scope.selectedCityId = $("#cityName").select2("data")[0].id;
                        $scope.selectedCityNm = $("#cityName").select2("data")[0].text;
                    }
                });
            } else {
                swal(cityData.msg, "", "error");
            }
        });
    }

    // 1.打开【新增质损保险】
    $scope.newInsuranceModal = function () {
        // 保险公司
        $scope.insuranceCompanyMod = "";
        // 出险城市
        $scope.cityName ='';
        // 责任判定
        $scope.liabilityType ='';

        // 定损金额
        $scope.damageMoney ='';
        // 待赔金额
        $scope.insurePlanMod = "";
        // 免赔金额
        $scope.derateMoney ='';
        // 车辆估值
        $scope.carValuation ='';

        // 发票金额
        $scope.invoiceMoney ='';
        // 报案日期
        $scope.declareDate ='';
        // 定损员信息
        $scope.refRemark ='';
        // 赔付描述
        $scope.paymentExplain = "";

        // 画面区分
        $scope.pageType = 'new';
        $('#insuranceModel').modal('open');
    };

    // 1.新增质损信息 【确定】按钮，保存质损信息
    $scope.addDamageRecord = function () {
        if ($scope.insuranceCompanyMod !== ""
            && $scope.cityName !== ''
            && $scope.liabilityType !== ''
            && $scope.damageMoney !== ''
            && $scope.insurePlanMod !== ""
            && $scope.derateMoney !== ''
            && $scope.carValuation !== ''
            && $scope.invoiceMoney !== ''
            && $scope.declareDate !== ''
        ) {
            _basic.post($host.api_url + "/user/" + userId + "/damageInsure", {
                // 保险公司
                insureId: $scope.insuranceCompanyMod,
                // 城市
                cityId: $scope.cityName.id,
                cityName: $scope.cityName.city_name,
                // 责任判定
                liabilityType: $scope.liabilityType,
                // 定损金额
                damageMoney: $scope.damageMoney,
                // 待赔金额
                insurePlan: $scope.insurePlanMod,
                // 免赔金额
                derateMoney: $scope.derateMoney,
                // 车辆估值
                carValuation: $scope.carValuation,
                //发票金额
                invoiceMoney: $scope.invoiceMoney,
                // 报案日期
                declareDate: moment($scope.declareDate).format('YYYY-MM-DD'),
                // 定损员信息
                refRemark: $scope.refRemark,
                // 赔付描述
                paymentExplain: $scope.paymentExplain,
                // 质损编号
                damageIds: [damageId]
            }).then(function (data) {
                if (data.success === true) {
                    swal("新增成功", "", "success");
                    $('#insuranceModel').modal('close');
                    $scope.showInsuranceInfo();
                } else {
                    swal(data.msg, "", "error");
                }
            });
        } else {
            swal("请输入完成信息！", "", "error");
        }
    };

    // 2.打开【修改质损保险】
    $scope.editInsuranceModal = function (damageInsureId) {
        // 保险公司及赔付信息
        _basic.get($host.api_url + "/damageInsure?damageInsureId=" + damageInsureId).then(function (data) {
            if (data.success === true) {
                $scope.currentInsurInfo = data.result[0];

                // 保险公司
                $scope.insuranceCompanyMod = data.result[0].insure_id;
                // 出险城市
                $scope.cityName = data.result[0].city_id;
                $scope.selectedCityNm = data.result[0].city_name;
                // 责任判定
                $scope.liabilityType = data.result[0].liability_type + '';

                // 定损金额
                $scope.damageMoney = data.result[0].damage_money;
                // 待赔金额
                $scope.insurePlanMod = data.result[0].insure_plan;
                // 实际赔付
                $scope.insurancePayment = data.result[0].insure_actual;

                // 免赔金额
                $scope.derateMoney = data.result[0].derate_money;
                // 车辆估值
                $scope.carValuation = data.result[0].car_valuation;

                // 发票金额
                $scope.invoiceMoney = data.result[0].invoice_money;

                // 报案日期
                if (data.result[0].declare_date == null) {
                    $scope.declareDate = '';
                } else {
                    $scope.declareDate = moment(data.result[0].declare_date).format("YYYY-MM-DD");
                }

                // 定损员信息
                $scope.refRemark = data.result[0].ref_remark;
                // 赔付描述
                $scope.paymentExplain = data.result[0].payment_explain;

                // 处理描述
                $scope.checkExplain = data.result[0].check_explain;
                // 特殊说明
                $scope.detailExplain = data.result[0].detail_explain;

                // 画面区分
                $scope.pageType = 'edit';
                $('#insuranceModel').modal('open');
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 2.保存修改后的质损信息
    function saveDamageInfo(type) {
        if ($scope.damageMoney !== ''
            && $scope.insurePlanMod !== ""
            && $scope.derateMoney !== ''
            && $scope.carValuation !== ''
            && $scope.invoiceMoney !== ''
            && $scope.declareDate !== ''
            && $scope.insurancePayment !== ''
            && $scope.insurancePayment !== null
        ) {
            _basic.put($host.api_url + "/user/" + userId + "/damageInsure/" + $scope.currentInsurInfo.id, {
                // 保险公司
                insureId: $scope.insuranceCompanyMod,
                // 城市
                cityId: $scope.cityName,
                cityName: $scope.selectedCityNm,
                // 责任判定
                liabilityType: $scope.liabilityType,
                // 定损金额
                damageMoney: $scope.damageMoney,
                // 待赔金额
                insurePlan: $scope.insurePlanMod,
                // 免赔金额
                derateMoney: $scope.derateMoney,
                // 车辆估值
                carValuation: $scope.carValuation,
                //发票金额
                invoiceMoney: $scope.invoiceMoney,
                // 报案日期
                declareDate: moment($scope.declareDate).format('YYYY-MM-DD'),
                // 定损员信息
                refRemark: $scope.refRemark,
                // 赔付描述
                paymentExplain: $scope.paymentExplain,

                // 实际赔付
                insureActual: $scope.insurancePayment,
                // 处理描述
                checkExplain: $scope.checkExplain,
                // 特殊说明
                detailExplain: $scope.detailExplain,
                // 质损编号
                damageIds: [damageId]
            }).then(function (data) {
                if (data.success === true) {
                    if (type === 'complete') {
                        swal({
                            title: "确定完成当前质损吗？",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确认",
                            cancelButtonText: "取消"
                        }).then(
                            function(result){
                                if (result.value) {
                                    _basic.put($host.api_url + "/user/" + userId + "/damageInsure/" + $scope.currentInsurInfo.id + "/insureStatus/2", {}).then(function (data) {
                                        if (data.success) {
                                            swal("保存成功", "", "success");
                                            $('#insuranceModel').modal('close');
                                            $scope.showInsuranceInfo();
                                        } else {
                                            swal(data.msg, "", "error");
                                        }

                                    });
                                }
                            });
                    } else {
                        swal("保存成功", "", "success");
                        $('#insuranceModel').modal('close');
                        $scope.showInsuranceInfo();
                    }
                } else {
                    swal(data.msg, "", "error");
                }
            });
        } else {
            swal("请输入完成信息！", "", "error");
        }
    }

    // 2.【保存】按钮
    $scope.saveDamageInfo = function () {
        saveDamageInfo('save');
    };

    // 2.【处理结束】按钮
    $scope.completeDamageList = function () {
        saveDamageInfo('complete');
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getCurrentDamageInfo();
        $scope.getLiablePersonList();
    };
    $scope.queryData();
}]);