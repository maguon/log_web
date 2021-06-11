app.controller("add_damage_insurance_details_controller", ["$scope", "$state","$stateParams", "$host", "_basic", function ($scope,$state, $stateParams, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    var damageInsureId = $stateParams.id;
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
        if($scope.currentInsurInfo.city_id==undefined||$scope.declareDate==undefined||$scope.currentInsurInfo.liability_type==undefined||
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
                $scope.getCurrentDamageInfo();
                $scope.getCurrentDamageCard();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    // 点击完成按钮
    $scope.completeDamageList = function () {
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
                            $scope.saveDamageInfo();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getInsuranceCompany();
        $scope.getCurrentDamageInfo();
        $scope.getCurrentDamageCard();
    };
    $scope.queryData();
}]);