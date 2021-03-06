app.controller("insurance_compensation_controller", ["$scope", "$rootScope","$state","$stateParams","$host", "_basic", function ($scope,$rootScope,$state,$stateParams, $host, _basic) {

    $scope.start = 0;
    $scope.size = 21;
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.handler = _basic.getSession(_basic.USER_NAME);
    $scope.handleStatus = "1";
   /* $scope.hasLoanType = true;*/
    $scope.damageInfoDetailsList = [];

    //出险城市
    function getCityList(){
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.cityList = cityData.result;
                $('#cityName').select2({
                    placeholder: '出险城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
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

    // 获取所有保险公司
    $scope.getInsuranceCompany = function () {
        _basic.get($host.api_url + "/truckInsure").then(function (data) {
            if (data.success === true) {
                $scope.insureCompanyList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取保险赔偿列表
    $scope.getInsurancePaymentList = function () {
        // 基本检索URL
        var url = $host.api_url + "/damageInsure?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "insurance_compensation",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.boxArray = data.result;
                $scope.damageInsurancePaymentList = $scope.boxArray.slice(0, 20);
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
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击按钮进行查询
    $scope.searchInsurancePaymentList = function () {
        $scope.start = 0;
        $scope.getInsurancePaymentList();
    };

    // 下载csv
    $scope.downloadCsvFile = function () {
        // 基本检索URL
        var url = $host.api_url + "/damageInsureRel.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };

    // 开启增加质损保险模态框并初始化所有信息
    $scope.addClaimInfo = function () {
        $scope.insuranceCompanyMod = "";
        $scope.insurePlanMod = "";
      /*  $scope.hasLoan = "";*/
      /*  $scope.hasLoanType = true;*/
       /* $scope.loanMoneyNum = 0;*/
        $scope.paymentExplain = "";
        $scope.damageMoney ='';
        $scope.cityName ='';
        $scope.cityList =[];
        $scope.liabilityType ='';
        $scope.derateMoney ='';
        $scope.carValuation ='';
        $scope.invoiceMoney ='';
        $scope.declareDate ='';
        $scope.refRemark ='';
        $scope.damageNumMod = "";
        $scope.damageInfoDetailsList = [];
        getCityList();
        $('#addDamageInfoModel').modal('open');
    };

   /* // 判断是否允许输入财务借款
    $scope.checkHasLoan = function () {
        if($scope.hasLoan == 1){
            $scope.hasLoanType = false;
        }
        else{
            $scope.loanMoneyNum = 0;
            $scope.hasLoanType = true;
        }
    };*/

    // 根据质损编号查询质损详细信息
    $scope.searchDamageDetails = function () {
        $scope.damageInfoCardArr=[];
        $scope.damageInfoCardArray=[];
        if($scope.damageNumMod !== ""){
            _basic.get($host.api_url + "/damage?damageId=" + $scope.damageNumMod).then(function (data) {
                if (data.success === true) {
                    if(data.result.length !== 0){
                        if($scope.damageInfoDetailsList.length === 0){
                            $scope.damageInfoDetailsList.push(data.result[0]);
                            _basic.get($host.api_url +'/damageCheckIndemnity?damageId='+ $scope.damageNumMod).then(function (data) {
                                if (data.success === true) {
                                    $scope.damageCheckIndemnitArray = data.result;
                                    getActualMoney();
                                }
                                else {
                                    swal(data.msg, "", "error");
                                }
                            });

                        }
                        else{
                            // 检测数组中是否有和返回结果相同的id
                            function checkDamageId(obj) {
                                return obj.id === data.result[0].id;
                            }
                            if($scope.damageInfoDetailsList.some(checkDamageId)){
                                swal("不能重复添加相同质损！", "", "warning");
                            }
                            else{
                                $scope.damageInfoDetailsList.push(data.result[0]);
                                _basic.get($host.api_url +'/damageCheckIndemnity?damageId='+ $scope.damageNumMod).then(function (data) {
                                    if (data.success === true) {
                                        $scope.damageCheckIndemnitArray = data.result;
                                        getActualMoney();
                                    }
                                    else {
                                        swal(data.msg, "", "error");
                                    }
                                });
                            }
                        }
                    }
                    else{
                        swal("查无此编号信息", "", "warning");
                    }
                }
                else {
                    swal(data.msg, "", "error");
                }
                $scope.damageNumMod == ""
            });
        }
        else{
            swal("请填写质损编号！", "", "error");
        }
    };

    //获取实际金额
    function getActualMoney(){
        for (var i = 0; i < $scope.damageInfoDetailsList.length; i++) {
            for(var j=0;j<$scope.damageCheckIndemnitArray.length;j++){
                if($scope.damageInfoDetailsList[i].id==$scope.damageCheckIndemnitArray[j].damage_id){
                    let tempData = $scope.damageInfoDetailsList[i];
                    tempData.actualMoney = $scope.damageCheckIndemnitArray[j].actual_money;
                    $scope.damageInfoDetailsList[i]= tempData;
                }
                else{

                }
            }
        }
    }


    // 提交新增质损信息
    $scope.addDamageRecord =  function () {
        if($scope.insuranceCompanyMod !== ""
            && $scope.insurePlanMod !== ""
          /*  && $scope.hasLoan !== ""*/
            && $scope.damageInfoDetailsList.length !== 0
            && $scope.damageMoney!==''
            && $scope.cityName!==''
            && $scope.liabilityType!==''
            && $scope.derateMoney!==''
            && $scope.carValuation!==''
            && $scope.invoiceMoney!==''
            && $scope.declareDate!==''
        ){
            var damageIdArr = [];
            for (var i = 0; i < $scope.damageInfoDetailsList.length; i++) {
                damageIdArr.push($scope.damageInfoDetailsList[i].id);
            }
            _basic.post($host.api_url + "/user/" + userId + "/damageInsure",{
                cityId: $scope.cityName.id,
                cityName:$scope.cityName.city_name,
                declareDate: moment($scope.declareDate).format('YYYY-MM-DD'),
                liabilityType: $scope.liabilityType,
                refRemark: $scope.refRemark,
                derateMoney: $scope.derateMoney,
                carValuation: $scope.carValuation,
                invoiceMoney: $scope.invoiceMoney,
                insureId: $scope.insuranceCompanyMod,
                damageMoney:$scope.damageMoney,
                insurePlan: $scope.insurePlanMod,
                /*financialLoanStatus: $scope.hasLoan,
                financialLoan: $scope.loanMoneyNum,*/
                paymentExplain: $scope.paymentExplain,
                damageIds: damageIdArr
            }).then(function (data) {
                if (data.success === true) {
                    swal("新增成功", "", "success");
                    $('#addDamageInfoModel').modal('close');
                    $scope.getInsurancePaymentList();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("保险公司或关联质损不能为空！", "", "error");
        }
    };



    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.getInsurancePaymentList();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.getInsurancePaymentList();
    };


    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.compensateNum=conditions.damageInsureId;
        $scope.damageNum=conditions.damageId;
        $scope.insuranceCompany=conditions.insureId;
        $scope.claimStartTimeStart=conditions.createdOnStart;
        $scope.claimStartTimeEnd=conditions.createdOnEnd;
        $scope.loanStatus=conditions.financialLoanStatus;
        $scope.paymentMoneyStart=conditions.insurePlanStart;
        $scope.paymentMoneyEnd=conditions.insurePlanEnd;
        $scope.handleStatus=conditions.insureStatus;
        $scope.vin=conditions.vin;
        $scope.agentName=conditions.insureUserName;
        $scope.getCityName=conditions.cityId;
        $scope.declareDateStart=conditions.declareDateStart;
        $scope.declareDateEnd=conditions.declareDateEnd;
        $scope.getLiabilityType=conditions.liabilityType;
        $scope.completedDateStart=conditions.completedDateStart;
        $scope.completedDateEnd=conditions.completedDateEnd;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        // 当vin码 大于等于6位时，才作为检索条件
        let vin = '';
        if ($scope.vin != undefined && $scope.vin != null && $scope.vin.length > 5) {
            vin = $scope.vin;
        }
        return {
            damageInsureId: $scope.compensateNum,
            cityId:$scope.getCityName,
            liabilityType:$scope.getLiabilityType,
            damageId: $scope.damageNum,
            insureId: $scope.insuranceCompany,
            createdOnStart: $scope.claimStartTimeStart,
            createdOnEnd: $scope.claimStartTimeEnd,
            financialLoanStatus: $scope.loanStatus,
            insurePlanStart: $scope.paymentMoneyStart,
            insurePlanEnd: $scope.paymentMoneyEnd,
            declareDateStart:$scope.declareDateStart,
            declareDateEnd:$scope.declareDateEnd,
            insureStatus: $scope.handleStatus,
            vinCode: vin,
            insureUserName: $scope.agentName,
            completedDateStart: $scope.completedDateStart,
            completedDateEnd:  $scope.completedDateEnd,
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "add_damage_insurance_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "insurance_compensation") {
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
        // 查询数据
        $scope.getInsurancePaymentList();
    }
    initData();
    // 获取数据
    $scope.queryData = function () {
        $scope.getInsurancePaymentList();
        $scope.getInsuranceCompany();
        getCityList();
    };
    $scope.queryData();
}]);