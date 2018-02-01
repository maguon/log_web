app.controller("damage_management_details_controller", ["$scope", "$stateParams", "$host", "_basic", function ($scope, $stateParams, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    var damageId = $stateParams.id;
    $scope.userName = _basic.getSession(_basic.USER_NAME);
    $scope.userDepartment = parseInt(_basic.getSession(_basic.USER_TYPE));
    $scope.damageImageList = [];
    var recordId;
    var damageCheckId;


    // tab切换
    $scope.showDamageImage = function () {
        $scope.getCurrentDamageImage();
    };
    $scope.showDamageHandleInfo = function () {
        $scope.getBeforeDamageInfo();
    };
    $scope.showInsuranceInfo = function () {
        $scope.getInsuranceInfo();
        $scope.getInsurePaymentCard();
    };

    // 根据当前damageId查询当前质损信息和质损状态
    $scope.getCurrentDamageInfo = function () {
        _basic.get($host.api_url + "/damage?damageId=" + damageId).then(function (data) {
            if (data.success === true) {
                $scope.currentDamageStatus = data.result[0].damage_status;
                $scope.currentDamageInfo = data.result[0];
                // console.log("currentDamageInfo",$scope.currentDamageInfo);
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
                    // console.log("imageData",$scope.damageImageList);
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
                "url": imageId
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

    // 获取当前damageId下之前保存的信息
    $scope.getBeforeDamageInfo = function () {
        _basic.get($host.api_url + "/damageCheck?damageId=" + damageId).then(function (data) {
            if (data.success === true) {
                // console.log("beforeData",data);
                if(data.result.length !== 0){
                    if(data.result[0].damage_type === 0){
                        data.result[0].damage_type = ""
                    }
                    else{
                        data.result[0].damage_type = data.result[0].damage_type.toString();
                    }
                    if(data.result[0].damage_link_type === 0 || data.result[0].damage_link_type == null){
                        data.result[0].damage_link_type = ""
                    }
                    else{
                        data.result[0].damage_link_type = data.result[0].damage_link_type.toString();
                    }
                    damageCheckId = data.result[0].id;
                }
                $scope.damageInfoBefore = data.result[0];
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 保存当前处理信息修改
    $scope.saveHandleInfoModify = function () {
        _basic.put($host.api_url + "/user/" + userId + "/damageCheck/" + damageCheckId + "?damageId=" + damageId + "&checkButton=2",{
            underUserId: $scope.damageInfoBefore.under_user_id,
            underUserName:$scope.damageInfoBefore.under_user_name,
            damageType: parseInt($scope.damageInfoBefore.damage_type),
            damageLinkType: parseInt($scope.damageInfoBefore.damage_link_type),
            refundUserId: $scope.damageInfoBefore.refund_user_id,
            refundUserName: $scope.damageInfoBefore.refund_user_name,
            reductionCost: $scope.damageInfoBefore.reduction_cost,
            penaltyCost: $scope.damageInfoBefore.penalty_cost,
            profit: $scope.damageInfoBefore.profit,
            repairId: $scope.damageInfoBefore.repair_id,
            repairCost: $scope.damageInfoBefore.repair_cost,
            transportCost: $scope.damageInfoBefore.transport_cost,
            underCost: $scope.damageInfoBefore.under_cost,
            companyCost: $scope.damageInfoBefore.company_cost,
            remark: $scope.damageInfoBefore.remark
        }).then(function (data) {
            if (data.success === true) {
                // console.log("postData",data);
                swal("保存成功", "", "success");
                $scope.getBeforeDamageInfo();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
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
                // console.log("data",data);
                $scope.getCurrentDamageInfo();// 刷新质损状态
                $scope.getBeforeDamageInfo();// 获取默认信息
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 填写完后提交处理信息，变为已处理
    $scope.submitHandleInfo = function () {
        if($scope.damageInfoBefore.damage_type !== "" && $scope.damageInfoBefore.damage_link_type !== ""){
            _basic.put($host.api_url + "/user/" + userId + "/damageCheck/" + damageCheckId + "?damageId=" + damageId + "&checkButton=3",{
                underUserId: $scope.damageInfoBefore.under_user_id,
                underUserName:$scope.damageInfoBefore.under_user_name,
                damageType: parseInt($scope.damageInfoBefore.damage_type),
                damageLinkType: parseInt($scope.damageInfoBefore.damage_link_type),
                refundUserId: $scope.damageInfoBefore.refund_user_id,
                refundUserName: $scope.damageInfoBefore.refund_user_name,
                reductionCost: $scope.damageInfoBefore.reduction_cost,
                penaltyCost: $scope.damageInfoBefore.penalty_cost,
                profit: $scope.damageInfoBefore.profit,
                repairId: $scope.damageInfoBefore.repair_id,
                repairCost: $scope.damageInfoBefore.repair_cost,
                transportCost: $scope.damageInfoBefore.transport_cost,
                underCost: $scope.damageInfoBefore.under_cost,
                companyCost: $scope.damageInfoBefore.company_cost,
                remark: $scope.damageInfoBefore.remark
            }).then(function (data) {
                if (data.success === true) {
                    // console.log("postData",data);
                    swal("提交成功", "", "success");
                    $scope.getBeforeDamageInfo();
                    $scope.getCurrentDamageInfo();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("质损类型和环节不能为空", "", "warning");
        }
    };

    // 点击图片查看大图
    var viewer;
    $scope.damageFinish = function () {
        viewer = new Viewer(document.getElementById('damage_image'), {
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
                // console.log("data", data);
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
                // console.log("insuranceListData",$scope.insuranceList)
            }
            else {
                swal(insuranceListData.msg, "", "error");
            }
        });
    };

    // 点击确定新增理赔信息
    $scope.saveInsuranceInfo = function () {
        if($scope.insuranceCompanyId !== "" && $scope.insuranceCompensation !== 0){
            _basic.post($host.api_url + "/user/" + userId + "/insure",{
                insureId: $scope.insuranceCompanyId,
                insurePlan: $scope.insuranceCompensation,
                insureActual: $scope.insurancePay,
                damageId: damageId
            }).then(function (data) {
                if (data.success === true) {
                    swal("添加成功", "", "success");
                    $('#carInfoModel').modal('close');
                    $scope.getInsurePaymentCard();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("保险公司和待赔金额不能为空！", "", "warning");
        }

    };

    // 点击删除当前理赔信息
    $scope.deletePaymentInfo = function (damageCardId) {
        swal({
                title: "确定删除当前理赔信息吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                _basic.delete($host.api_url + "/user/" + userId + "/damageInsure/" + damageCardId + "/damage/" + damageId).then(function (data) {
                    if (data.success === true) {
                        // console.log("data", data);
                        $scope.getInsurePaymentCard();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getCurrentDamageInfo();
    };
    $scope.queryData();
}]);