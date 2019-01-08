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

    $scope.changeTruck =function (id){
        if(id==null){
            $scope.truckType=0
        }else{
            $scope.truckType=id.truck_type;
        }

    }

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
        if ($scope.addTruckId !== "" && $scope.addStartTime!=='') {
            $scope.addTurn= ($scope.addTurn=="")?0:1;
            $scope.addBraking=($scope.addBraking== true) ? 1 : 0;
            $scope.addLighting=($scope.addLighting== true) ? 1 : 0;
            $scope.addTransmission=($scope.addTransmission== true) ? 1 : 0;
            $scope.addTyre=($scope.addTyre== true) ? 1 : 0;
            $scope.addStructure=($scope.addStructure== true) ? 1 : 0;
            $scope.addFacilities=($scope.addFacilities== true) ? 1 : 0;
            $scope.addLinkDevice=($scope.addLinkDevice== true) ? 1 : 0;
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
                    $scope.putInspectList.truck_type = data.result[0].truck_type;
                    $scope.putInspectList.turn = (data.result[0].turn==1)?true:'';
                    $scope.putInspectList.braking =( data.result[0].braking==1)?true:'';
                    $scope.putInspectList.lighting = (data.result[0].lighting==1)?true:'';
                    $scope.putInspectList.transmission = (data.result[0].transmission==1)?true:'';
                    $scope.putInspectList.tyre = (data.result[0].tyre==1)?true:'';
                    $scope.putInspectList.structure = (data.result[0].structure==1)?true:'';
                    $scope.putInspectList.facilities = (data.result[0].facilities==1)?true:'';
                    $scope.putInspectList.link_device = (data.result[0].link_device==1)?true:'';
                    $scope.putInspectList.check_date = moment(data.result[0].check_date).format('YYYY-MM-DD');
                    getTruckNum($scope.putInspectList.truck_num)
                }
            }
        })
    }

    //点击确定 修改完成
    $scope.putInspectItem = function (){
        $scope.putInspectList.turn = ($scope.putInspectList.turn==true)?1:0;
        $scope.putInspectList.braking = ($scope.putInspectList.braking==true)?1:0;
        $scope.putInspectList.lighting = ( $scope.putInspectList.lighting==true)?1:0;
        $scope.putInspectList.transmission = ( $scope.putInspectList.transmission==true)?1:0;
        $scope.putInspectList.tyre = ( $scope.putInspectList.tyre==true)?1:0;
        $scope.putInspectList.structure = ( $scope.putInspectList.structure==true)?1:0;
        $scope.putInspectList.facilities = ( $scope.putInspectList.facilities==true)?1:0;
        $scope.putInspectList.link_device = ( $scope.putInspectList.link_device==true)?1:0;
        if ($scope.putInspectList.turn !== null&&$scope.putInspectList.check_date!=='') {
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
