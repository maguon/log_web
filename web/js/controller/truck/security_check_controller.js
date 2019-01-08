app.controller("security_check_controller", ["$scope", "$state", "_basic", "_config", "$host", function ($scope, $state, _basic, _config, $host) {

    $scope.start = 0;
    $scope.size = 11;
    var userId = _basic.getSession(_basic.USER_ID);

    //获取货车牌号
    function getTruckNum(selectText) {
        if(selectText==''||selectText==undefined){
            _basic.get($host.api_url + "/truckBase").then(function (data) {
                if (data.success === true) {
                    $scope.truckNumListAllList = data.result;
                    $('#addTruckId').select2({
                        placeholder: '货车牌号',
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
      else {
            _basic.get($host.api_url + "/truckBase").then(function (data) {
                if (data.success == true) {
                    $scope.truckNumList = data.result;
                    $('#putTruckId').select2({
                        placeholder: selectText,
                        containerCssClass : 'select2_dropdown'
                    })
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }

    //获取货车牌号
    function getTruckId() {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAll = data.result;
                $('#truckId').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    }
    //查询功能
    $scope.getInspect = function (){
        $scope.start = 0;
        getInspectData();
    }

    //获取查询数据
    function getInspectData(){
        _basic.get($host.api_url + "/truckSecurityCheck?" + _basic.objToUrl({
            truckId:$scope.truckId,
            checkDateStart:$scope.getStartTime,
            checkDateEnd:$scope.getEndTime,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.InspectList = $scope.boxArray.slice(0, 10);
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
    }

    // 数据导出

    $scope.export = function () {
        var obj = {
            truckId:$scope.truckId,
            checkDateStart:$scope.getStartTime,
            checkDateEnd:$scope.getEndTime
        };
        window.open($host.api_url + "/truckSecurityCheck.csv?" + _basic.objToUrl(obj));
    };

    //打开新增模态框
    $scope.addInspect = function (){
        $scope.addTruckId ='';
        $scope.addTurn ='';
        $scope.addBraking ='';
        $scope.addLighting ='';
        $scope.addTransmission ='';
        $scope.addTyre ='';
        $scope.addStructure ='';
        $scope.addFacilities ='';
        $scope.addLinkDevice ='';
        $scope.addStartTime ='';
        $scope.addNewRemark ='';
        $scope.truckNumListAllList =[];
        getTruckNum();
        $('#addItem').modal('open');
    }


    //点击确定 增加完成
    $scope.addInspectItem = function (){
        if ($scope.addTruckId !== "" && $scope.addTurn !== "" && $scope.addBraking !== ""
            &&$scope.addLighting !== "" &&$scope.addTransmission !== ""&&$scope.addTyre!==""&&$scope.addStructure!==""&&$scope.addFacilities!==""
        &&$scope.addLinkDevice!==""&& $scope.addStartTime!=='') {
            _basic.post($host.api_url + "/user/" + userId + "/truckSecurityCheck", {
                truckId:$scope.addTruckId.id,
                truckType: $scope.addTruckId.truck_type,
                turn:$scope.addTurn,
                braking: $scope.addBraking,
                lighting: $scope.addLighting,
                transmission: $scope.addTransmission,
                tyre:$scope.addTyre,
                structure: $scope.addStructure,
                facilities: $scope.addFacilities,
                linkDevice: $scope.addLinkDevice,
                checkDate: $scope.addStartTime,
                remark: $scope.addNewRemark
            }).then(function (data) {
                if (data.success === true) {
                    $('#addItem').modal('close');
                    swal("新增成功", "", "success");
                    getInspectData();
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写完整信息！", "", "warning");
        }
    }


    //打开修改模态框
    $scope.putInspect = function (id){
        $scope.id = id;
        $scope.driveList =[];
        $('#putItem').modal('open');
        _basic.get($host.api_url + "/truckSecurityCheck?securityCheckId=" +id).then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.putInspectList = [];
                }
                else{
                    $scope.putInspectList = data.result[0];
                    $scope.putInspectList.check_date = moment(data.result[0].check_date).format('YYYY-MM-DD');
                    getTruckNum($scope.putInspectList.truck_num)
                }
            }
        })
    }


    //点击确定 修改完成
    $scope.putInspectItem = function (){
        if ($scope.putInspectList.turn !== null
            &&$scope.putInspectList.braking!== null &&$scope.putInspectList.lighting !== null&&$scope.putInspectList.transmission!==null
            &&$scope.putInspectList.tyre!==null
            &&$scope.putInspectList.structure!== null
            &&$scope.putInspectList.facilities!==null
            &&$scope.putInspectList.link_device!==null
            &&$scope.putInspectList.check_date!=='') {
            _basic.put($host.api_url + "/user/" + userId + "/truckSecurityCheck/"+$scope.id, {
                turn:$scope.putInspectList.turn,
                braking:$scope.putInspectList.braking,
                lighting: $scope.putInspectList.lighting,
                transmission: $scope.putInspectList.transmission,
                tyre:$scope.putInspectList.tyre,
                structure: $scope.putInspectList.structure,
                facilities: $scope.putInspectList.facilities,
                linkDevice: $scope.putInspectList.link_device,
                checkDate: $scope.putInspectList.check_date,
                remark: $scope.putInspectList.remark
            }).then(function (data) {
                if (data.success === true) {
                    swal("修改成功", "", "success");
                    $('#putItem').modal('close');
                    getInspectData();
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写完整信息！", "", "warning");
        }
    }


    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getInspectData();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getInspectData();
    };

    //获取数据
    function queryData() {
        getInspectData();
        getTruckId();
    }
    queryData()
}]);
