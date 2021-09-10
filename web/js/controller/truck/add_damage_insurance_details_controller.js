app.controller("add_damage_insurance_details_controller", ["$scope", "$state","$stateParams", "$host", "_basic", function ($scope,$state, $stateParams, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    var damageInsureId = $stateParams.id;
    var recordId;
    $scope.damageNum = "";
    $scope.damageCheckIndemnitArray=[];
    $scope.damageInfoCardList=[];
    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"add_damage_insurance_details"}, {reload: true})
    };
    // 获取所有保险公司
    $scope.getInsuranceCompany = function () {
        _basic.get($host.api_url + "/truckInsure").then(function (data) {
            if (data.success === true) {
                $scope.insuranceCompanyList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    //出险城市
    function getCityList(){
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.cityList = cityData.result;
                $('#getCityName').select2({
                    placeholder: '出险城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });

            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
    }

    // 根据质损id查询详细信息
    $scope.getCurrentDamageInfo = function () {
        // 保险公司及赔付信息
        _basic.get($host.api_url + "/damageInsure?damageInsureId=" + damageInsureId).then(function (data) {
            if (data.success === true) {
                $scope.currentInsurInfo = data.result[0];
                if(data.result[0].declare_date==null){
                    $scope.declareDate='';
                }
                else {
                    $scope.declareDate = moment(data.result[0].declare_date).format("YYYY-MM-DD");
                }
                $scope.insuranceCompany = data.result[0].insure_id;
                $scope.damageMoney = data.result[0].damage_money;
                $scope.insuranceCompensation = data.result[0].insure_plan;
                $scope.insurancePayment = data.result[0].insure_actual;
                $scope.insureStatus = data.result[0].insure_status;
                getCityList();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取当前关联质损信息卡片
    $scope.getCurrentDamageCard = function () {
        _basic.get($host.api_url + "/damageBase?damageInsureId=" + damageInsureId).then(function (data) {
            if (data.success === true) {
                $scope.damageInfoCardList = data.result;
                for(let i = 0; i < $scope.damageInfoCardList.length; i++){
                    _basic.get($host.api_url +'/damageCheckIndemnity?damageId='+ $scope.damageInfoCardList[i].id).then(function (data) {
                        if (data.success === true&&data.result.length>0) {
                            $scope.damageCheckIndemnitArray = data.result;
                            let tempData = $scope.damageInfoCardList[i];
                            tempData.actualMoney = $scope.damageCheckIndemnitArray[0].actual_money;
                            $scope.damageInfoCardList[i]= tempData;

                        }
                    })
                }

              /*  _basic.get($host.api_url +'/damageCheckIndemnity?damageId=='+ ).then(function (data) {
                    if (data.success === true) {
                        $scope.damageCheckIndemnitArray = data.result;
                        console.log('实际金额',  $scope.damageCheckIndemnitArray,'质损list',  $scope.damageInfoCardList)
                        for (var i = 0; i < $scope.damageInfoCardList.length; i++) {
                            for(var j=0;j<$scope.damageCheckIndemnitArray.length;j++){
                                if($scope.damageInfoCardList[i].id==$scope.damageCheckIndemnitArray[j].damage_id){
                                    let tempData = $scope.damageInfoCardList[i];
                                    tempData.actualMoney = $scope.damageCheckIndemnitArray[j].actual_money;
                                    $scope.damageInfoCardList[i]= tempData;
                                }
                                else{

                                }
                            }
                        }
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });*/

            }
            else {
                swal(data.msg, "", "error");
            }
        });

    };

    // 根据质损编号查询质损详细信息
    $scope.searchDamageDetails = function () {
        if ($scope.damageNum !== "") {
            _basic.get($host.api_url + "/damage?damageId=" + $scope.damageNum).then(function (data) {
                if (data.success === true) {
                    if (data.result.length !== 0) {
                        // 检测数组中是否有和返回结果相同的id
                        function checkDamageId(obj) {
                            return obj.id === data.result[0].id;
                        }

                        if ($scope.damageInfoCardList.some(checkDamageId)) {
                            swal("不能重复添加相同质损！", "", "warning");
                        }
                        else {
                            _basic.post($host.api_url + "/user/" + userId + "/damageInsureRel", {
                                damageInsureId: damageInsureId,
                                damageId: $scope.damageNum
                            }).then(function (data) {
                                if (data.success === true) {
                                    swal("添加成功", "", "success");
                                    $scope.getCurrentDamageCard();
                                }
                                else {
                                    swal(data.msg, "", "error");
                                }
                            });
                            $scope.damageNum = "";
                        }
                        // console.log("damageInfoCardList",$scope.damageInfoCardList);
                    }
                    else {
                        swal("查无此编号信息", "", "warning");
                    }
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else {
            swal("请填写质损编号！", "", "error");
        }
    };

    // 删除选中的质损信息
    $scope.deleteDamageInfo = function (damageCardId) {
        if($scope.damageInfoCardList.length > 1) {
            swal({
                title: "确定删除当前质损信息吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
            }).then(function (result) {
                if (result.value) {
                    _basic.delete($host.api_url + "/user/" + userId + "/damageInsure/" + damageInsureId + "/damage/" + damageCardId).then(function (data) {
                        if (data.success === true) {
                            // console.log("data",data);
                            $scope.getCurrentDamageCard();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            })
        }

        else{
                swal("至少保留一条质损信息！", "", "warning");
            }
        }


    // 保存修改后的质损信息
    $scope.saveDamageInfo = function () {
        $scope.damageIdArr = [];
        for (var i = 0; i < $scope.damageInfoCardList.length; i++) {
            $scope.damageIdArr.push($scope.damageInfoCardList[i].id);
        }
        if($scope.currentInsurInfo.city_id==null||$scope.declareDate==''||$scope.declareDate==undefined||$scope.currentInsurInfo.liability_type==undefined||
            $scope.currentInsurInfo.derate_money==null||$scope.currentInsurInfo.car_valuation==null||$scope.currentInsurInfo.invoice_money==null||
        $scope.insuranceCompany==null||$scope.insuranceCompensation==null||$scope.damageMoney==null||
        $scope.insurancePayment==null){
            swal('请输入完整信息!', "", "error");
        }
        else {
            _basic.get($host.api_url +'/city?cityId='+$scope.currentInsurInfo.city_id).then(function (data) {
                if (data.success == true) {
                    $scope.cityName=data.result[0].city_name;
                    putSingleData();
                }
                else {
                    swal(data.msg, "", "error")
                }
            });
        }
    };

    function putSingleData(){
        _basic.put($host.api_url + "/user/" + userId + "/damageInsure/" + damageInsureId, {
            cityId: $scope.currentInsurInfo.city_id,
            cityName:$scope.cityName,
            declareDate: moment($scope.declareDate).format('YYYY-MM-DD'),
            liabilityType:$scope.currentInsurInfo.liability_type,
            refRemark: $scope.currentInsurInfo.ref_remark,
            derateMoney: $scope.currentInsurInfo.derate_money,
            carValuation:$scope.currentInsurInfo.car_valuation,
            invoiceMoney: $scope.currentInsurInfo.invoice_money,
            insureId: $scope.insuranceCompany,
            insurePlan: $scope.insuranceCompensation,
            damageMoney: $scope.damageMoney,
           /* financialLoan: $scope.currentInsurInfo.financial_loan,*/
            insureActual: $scope.insurancePayment,
            paymentExplain: $scope.currentInsurInfo.payment_explain,
            checkExplain: $scope.currentInsurInfo.check_explain,
            detailExplain:$scope.currentInsurInfo.detail_explain,
            damageIds: $scope.damageIdArr
        }).then(function (data) {
            if (data.success === true) {
                swal("保存成功", "", "success");
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    // 点击完成按钮
    $scope.completeDamageList = function () {
        if($scope.currentInsurInfo.city_id==null||$scope.declareDate==''||$scope.declareDate==undefined||$scope.currentInsurInfo.liability_type==undefined||
            $scope.currentInsurInfo.derate_money==null||$scope.currentInsurInfo.car_valuation==null||$scope.currentInsurInfo.invoice_money==null||
            $scope.insuranceCompany==null||$scope.insuranceCompensation==null||$scope.damageMoney==null||
            $scope.insurancePayment==null){
            swal('请输入完整信息!', "", "error");
        }else {
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
                        _basic.put($host.api_url + "/user/" + userId + "/damageInsure/" + damageInsureId + "/insureStatus/2", {}).then(function (data) {
                            if (data.success === true) {
                                $scope.getCurrentDamageInfo();
                                $scope.getCurrentDamageCard();
                            }
                            else {
                                swal(data.msg, "", "error");
                            }
                        });
                    }
                });
        }

    };

    var viewer;
    $scope.insuranceFinish = function () {
        viewer = new Viewer(document.getElementById('insurance_image'), {
            url: 'data-original'
        });
    };
    $scope.showPaymentVoucherImage = function () {
        viewer = new Viewer(document.getElementsByClassName('payment_voucher'), {
            url: 'data-original'
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
    $scope.openVideo =function (){
        $(".modal").modal();
        $("#video").modal("open");
        var videoJs=document.querySelector('.video-js');
        var player = videojs(videoJs,{
            muted: false
        });
        player.fluid(true);
    };
    //理赔凭证查询
    function getInsuranceImg(){
        _basic.get($host.record_url + "/insure?type=2&insureId=" + damageInsureId).then(function (data) {
            if (data.success === true) {
                $scope.insuranceImageList = data.result[0].insure_image;
                recordId = data.result[0]._id;
                for (var i = 0; i < $scope.insuranceImageList.length; i++) {
                    $scope.insuranceImageList[i].url = $host.file_url + '/image/' + $scope.insuranceImageList[i].url
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    $scope.uploadInsuranceImage = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            _basic.post($host.record_url + "/user/" + userId + "/insure/" + damageInsureId + "/image", {
                "username": _basic.getSession(_basic.USER_NAME),
                "userId": userId,
                "userType": _basic.getSession(_basic.USER_TYPE),
                "url": imageId,
                "type": 2
            }).then(function (data) {
                if (data.success == true) {
                   getInsuranceImg();
                    if ($scope.insuranceImageList.length != 0) {
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
                _basic.delete($host.record_url + "/user/" + userId + "/record/" + recordId + "/insureImage/" + realUrl).then(function (data) {
                    if (data.success === true) {
                        swal("删除成功", "", "success");
                        getInsuranceImg();
                        if ($scope.insuranceImageList.length != 0) {
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

    // 获取数据
    $scope.queryData = function () {
        $scope.getInsuranceCompany();
        $scope.getCurrentDamageInfo();
        $scope.getCurrentDamageCard();
        getInsuranceImg()
    };
    $scope.queryData();
}]);