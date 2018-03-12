app.controller("truck_payment_loan_details_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var indemnityId = $stateParams.id;
    var paymentId = $stateParams.paymentId;
    $scope.hasRepayment = false;
    // 获取当前打款数据
    function getCurrentLoanInfo() {
        _basic.get($host.api_url + "/damageCheckIndemnity?damageId=" + paymentId).then(function (data) {
            if (data.success === true) {
                if(data.result[0].actual_money !== null && data.result[0].indemnity_explain !== null){
                    $scope.hasRepayment = true;
                }
                $scope.loanInfo = data.result[0];
                $scope.indemnityStatus = data.result[0].indemnity_status;
                $scope.urlImg = $host.file_url + '/image/' + data.result[0].voucher_image;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    //获取质损信息
     function getCurrentDamageInfo () {
        _basic.get($host.api_url + "/damageBase?damageId=" + paymentId).then(function (data) {
            if (data.success === true) {
                $scope.damageInfoCardList = data.result[0];
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
     //显示或隐藏质损卡片
    $scope.showDamageList=function(){
        if($('#damageList').is(':hidden')){//如果当前隐藏
            $('#damageList').show();//那么就显示div
        }else{//否则
            $('#damageList').hide();//就隐藏div
        }
    }
    // 照片上传函数
    function uploadImage(filename,dom_obj,callback) {
        if(filename){
            if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename))
            {
                var max_size_str = dom_obj.attr('max_size');
                var max_size = 4 * 1024 * 1024; //default: 4M
                var re = /\d+m/i;
                if (re.test(max_size_str)) {
                    max_size = parseInt(max_size_str.substring(0, max_size_str.length - 1)) * 1024 * 1024;
                    _basic.formPost(dom_obj.parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=2', function (data) {
                        if (data.success==true) {
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
    };
    //点击更新凭证相片
    $scope.uploadVoucherImage = function (dom) {
        var dom_obj=$(dom);
        var filename = $(dom).val();
        uploadImage(filename,dom_obj,function (imageId) {
            var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
            $scope.$apply(function () {
                $scope.voucher_img = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
            });
            var obj={
                "voucherImage": imageId
            };
            _basic.put($host.api_url+"/user/"+userId+"/damageCheckIndemnity/"+indemnityId+"/image",obj).then(function (data) {
                if(data.success==true){
                    swal("上传成功", "", "success");
                }else {
                    swal(data.msg,"","error")
                }
            })

        });
    };
    // 点击打款按钮
    $scope.updateLoanInfo = function () {
        if($scope.loanInfo.actual_money == null || $scope.loanInfo.actual_money === "" || $scope.loanInfo.indemnity_explain == null || $scope.loanInfo.indemnity_explain === ""){
            swal("打款金额或打款描述不能为空！", "", "warning");
        }
        else{
            _basic.put($host.api_url + "/user/" + userId + "/indemnity/" + indemnityId,{
                actualMoney: $scope.loanInfo.actual_money,
                indemnityExplain: $scope.loanInfo.indemnity_explain
            }).then(function (data) {
                if (data.success === true) {
                    swal("保存成功", "", "success");
                     getCurrentLoanInfo();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    };
    // 点击打款保存按钮
    $scope.savePaymentInfo = function () {
        if($scope.loanInfo.actual_money == null || $scope.loanInfo.actual_money === "" || $scope.loanInfo.indemnity_explain == null || $scope.loanInfo.indemnity_explain === ""){
            swal("打款金额或打款描述不能为空！", "", "warning");
        }
        else{
            _basic.put($host.api_url + "/user/" + userId + "/indemnity/" + indemnityId,{
                actualMoney: $scope.loanInfo.actual_money,
                indemnityExplain: $scope.loanInfo.indemnity_explain
            }).then(function (data) {
                if (data.success === true) {
                    _basic.put($host.api_url + "/user/" + userId + "/indemnity/" + indemnityId + "/indemnityStatus/1",{}).then(function (data) {
                        if (data.success === true) {
                            swal("保存成功", "", "success");
                            getCurrentLoanInfo();
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
    };
    // 点击完结修改状态
    $scope.finishPayment = function () {
        if($scope.hasRepayment){
            swal({
                    title: "确定完结吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    closeOnConfirm: true
                },
                function(){
                    _basic.put($host.api_url + "/user/" + userId + "/indemnity/" + indemnityId + "/indemnityStatus/2",{}).then(function (data) {
                        if (data.success === true) {
                            getCurrentLoanInfo();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                });
        }
        else{
            swal("请先填写还款信息并保存！", "", "warning");
        }
    };
    $scope.queryData = function () {
        getCurrentLoanInfo();
        getCurrentDamageInfo();
    };
    $scope.queryData();
}])