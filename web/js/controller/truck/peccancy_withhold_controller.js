/**
 * Created by star on 2018/6/11.
 */
app.controller("peccancy_withhold_controller", ["$scope", "$state", "_basic", "_config", "$host", function ($scope, $state, _basic, _config, $host) {
    $scope.start = 0;
    $scope.size = 11;
    var userId = _basic.getSession(_basic.USER_ID);
    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#driver').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#addDrivderId').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    function getCityEvery(id,text){
        if(id==''||id==undefined){
            // 城市
            _basic.get($host.api_url + "/city").then(function (data) {
                if (data.success == true) {
                    $scope.get_city = data.result;
                    $('#addCity').select2({
                        placeholder: '城市',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });
                    $('#putCity').select2({
                        placeholder: '城市',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });
                }
            });
        }
      else{
            // 城市
            _basic.get($host.api_url + "/city?").then(function (data) {
                if (data.success == true) {
                    $scope.get_city = data.result;
                    $('#addCity').select2({
                        placeholder: '城市',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });
                    $('#putCity').select2({
                        placeholder: '城市',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });
                }
            });
        }

    }
    //获取司机
    function getDriveList(selectText){
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveList = data.result;
                $('#putDrivderId').select2({
                    placeholder: selectText,
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                })
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取货车牌号
    function getTruckNum(selectText) {
        if(selectText==''||selectText==undefined){
            _basic.get($host.api_url + "/truckBase").then(function (data) {
                if (data.success === true) {
                    $scope.truckNumListAllList = data.result;
                    $('#addPeccancyTruckId').select2({
                        placeholder: "货车牌号",
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
      else{
            _basic.get($host.api_url + "/truckBase").then(function (data) {
                if (data.success == true) {
                    $scope.truckNumListList = data.result;
                    $('#putTruckNum').select2({
                        placeholder: selectText,
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            });


        }
    }


    //获取货车牌号
    $scope.changtruckType = function (truckType) {
        if(truckType==1){
            _basic.get($host.api_url + "/truckFirst?truckType=1").then(function (data) {
                if (data.success === true) {
                    $scope.truckNum = data.result;
                    $('#truckId').select2({
                        placeholder: "货车牌号",
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
            _basic.get($host.api_url + "/truckTrailer?truckType=2").then(function (data) {
                if (data.success === true) {
                    $scope.truckNum = data.result;
                    $('#truckId').select2({
                        placeholder: "货车牌号",
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }

    }

    function getCityList(selectText){
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.cityList = data.result;
                $('#putCity').select2({
                    placeholder: selectText,
                    containerCssClass : 'select2_dropdown'
                })
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }


    //查询功能
    $scope.getPeccancy = function (){
        $scope.start = 0;
        getPeccancyData();
    }

    //获取查询数据
    function getPeccancyData(){
        _basic.get($host.api_url + "/drivePeccancy?" + _basic.objToUrl({
            driveId:$scope.driverId,
            statStatus:$scope.peccancyStu,
            truckType:$scope.truckType,
            startDateStart:$scope.getStartTime,
            startDateEnd:$scope.getEndTime,
            handleDateStart:$scope.dealStartTime,
            handleDateEnd:$scope.dealEndTime,
            createdOnStart:$scope.creatStartTime,
            createdOnEnd:$scope.creatEndTime,
            truckId:$scope.truckId,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.peccancyList = $scope.boxArray.slice(0, 10);
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
            driveId:$scope.driverId,
            fineStatus:$scope.peccancyStu,
            truckType:$scope.truckType,
            startDateStart:$scope.getStartTime,
            startDateEnd:$scope.getEndTime,
            headleDateStart:$scope.deal_start_time,
            headleDateEnd:$scope.deal_end_time,
            createdOnStart:$scope.creat_start_time,
            createdOnEnd:$scope.creat_end_time,
            truckId:$scope.truckId,
        };
        window.open($host.api_url + "/drivePeccancy.csv?" + _basic.objToUrl(obj));
    };

    $scope.changeAddDealMoney =function (addPeccancyMoney,addDealMoney){
        $scope.addCompanyMoney=addPeccancyMoney-addDealMoney;
    }
    $scope.changeAddSingDealMoney =function (addPeccancyMoney,addDealMoney){
        $scope.addCompanyMoney=addPeccancyMoney-addDealMoney;
    }

    //打开新增模态框
    $scope.addPeccancy = function (){
        $scope.addDrivderId='';
        $scope.driveNameList =[];
        $scope.addPeccancyTruckId='';
        $scope.addPeccancyScore='';
        $scope.addPeccancyMoney='';
        $scope.addStartTime='';
        $scope.addDealMoney='';
        $scope.handleDate='';
        $scope.addPlce='';
        $scope.newRemark='';
        $scope.addSingeDealMoney ='';
        $scope.addCompanyMoney = '';
        $scope.addScoreMoney='';
        $scope.addCity ='';
        $scope.get_city =[];
        getCityEvery();
        getDriveNameList ();
        getTruckNum();
        $('#addPeccancyItem').modal('open');
    }


    //点击确定 增加完成
    $scope.addPeccancyItem = function (){
        if ($scope.addDrivderId !== "" && $scope.addPeccancyTruckId !== '' && $scope.addPeccancyScore !== ''
            &&$scope.addPeccancyMoney !== '' &&$scope.addStartTime !== ""&&
            $scope.addDealMoney!==''&&$scope.handleDate!==''&&$scope.addScoreMoney!== ""&& $scope.addCity!==''&&$scope.addSingeDealMoney!==''&&$scope.addCompanyMoney!=='') {
            _basic.post($host.api_url + "/user/" + userId + "/drivePeccancy", {
                driveId: $scope.addDrivderId,
                truckId: $scope.addPeccancyTruckId.id,
                truckType: $scope.addPeccancyTruckId.truck_type,
                fineScore: $scope.addPeccancyScore,
                buyScore:$scope.addScoreMoney,
                trafficFine: $scope.addPeccancyMoney,
                fineMoney: $scope.addDealMoney,
                underMoney:$scope.addSingeDealMoney,
                companyMoney:$scope.addCompanyMoney,
                startDate: $scope.addStartTime,
                handleDate:$scope.handleDate,
                cityId: $scope.addCity.id,
                cityName: $scope.addCity.city_name,
                address: $scope.addPlce,
                remark: $scope.newRemark
            }).then(function (data) {
                if (data.success === true) {
                    $('#addPeccancyItem').modal('close');
                    swal("新增成功", "", "success");
                    getPeccancyData();
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
    $scope.putPeccancy = function (id){
        $scope.id = id;
        $scope.driveList =[];
        $scope.cityList =[];
        $scope.truckNumListList =[];
        $('#putPeccancyItem').modal('open');
        _basic.get($host.api_url + "/drivePeccancy?peccancyId=" +id).then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.putPeccancyList = [];
                }
                else{
                    $scope.putPeccancyList = data.result[0];
                    $scope.putPeccancyList.start_date = moment(data.result[0].start_date).format('YYYY-MM-DD');
                    $scope.putPeccancyList.handle_date = moment(data.result[0].handle_date).format('YYYY-MM-DD');
                    $scope.putPeccancyList.drive_id = data.result[0].drive_id;
                    getCityList($scope.putPeccancyList.city_id);
                    getDriveList($scope.putPeccancyList.drive_id);
                    getTruckNum($scope.putPeccancyList.truck_num)
                }
            }
        })
    }

    $scope.changePutDealMoney =function (putPeccancyMoney,putDealMoney){
        $scope.putPeccancyList.company_money=putPeccancyMoney-putDealMoney;
    }
    $scope.changePutFineMoney =function (putPeccancyMoney,putDealMoney){
        $scope.putPeccancyList.company_money=putPeccancyMoney-putDealMoney;
    }



    //点击确定 修改完成
    $scope.putPeccancyItem = function () {
        if ($scope.putPeccancyList.drive_id !== null && $scope.putPeccancyList.truck_id !== null && $scope.putPeccancyList.fine_score !== null
            && $scope.putPeccancyList.fine_money !== null && $scope.putPeccancyList.start_date !== '' && $scope.putPeccancyList.handle_date !== ''
            && $scope.putPeccancyList.truck_type !== null && $scope.putPeccancyList.traffic_fine !== null
            && $scope.putPeccancyList.buy_score !== null&&$scope.putPeccancyList.city_id!==null&&$scope.putPeccancyList.company_money!==null) {
            getTruckType()
        }
        else {
            swal("请填写完整信息！", "", "warning");
        }
    }

    function  putPeccancyItem(){
        _basic.put($host.api_url + "/user/" + userId + "/peccancy/"+$scope.id, {
            driveId: $scope.putPeccancyList.drive_id,
            truckId:$scope.putPeccancyList.truck_id,
            truckType: $scope.putPeccancyList.truck_type,
            fineScore: $scope.putPeccancyList.fine_score,
            buyScore:$scope.putPeccancyList.buy_score,
            trafficFine: $scope.putPeccancyList.traffic_fine,
            fineMoney: $scope.putPeccancyList.fine_money,
            underMoney:$scope.putPeccancyList.under_money,
            companyMoney:$scope.putPeccancyList.company_money,
            startDate: $scope.putPeccancyList.start_date,
            handleDate:$scope.putPeccancyList.handle_date,
            cityId: $scope.putPeccancyList.city_id,
            cityName: $scope.putPeccancyList.city_name,
            address: $scope.putPeccancyList.address,
            remark: $scope.putPeccancyList.remark
        }).then(function (data) {
            if (data.success === true) {
                swal("修改成功", "", "success");
                $('#putPeccancyItem').modal('close');
                getPeccancyData();
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    }
    function getTruckType(){

        _basic.get($host.api_url + "/truckBase?truckId=" +$scope.putPeccancyList.truck_id).then(function (data) {
            if (data.success === true) {
                $scope.putPeccancyList.truck_type =data.result[0].truck_type;
            }
            else {
                swal(data.msg, "", "error");
            }
        })


        _basic.get($host.api_url + "/city?cityId=" +$scope.putPeccancyList.city_id).then(function (data) {
            if (data.success === true) {
                $scope.putPeccancyList.city_name =data.result[0].city_name;
                putPeccancyItem();
            }
            else {
                swal(data.msg, "", "error");
            }
        })


    }


    $scope.putPeccancyItem2 = function (){
        $('#putPeccancyItem').modal('close');
    }

    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getPeccancyData();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getPeccancyData();
    };

    //获取数据
    function queryData() {
        getDriveNameList();
        getPeccancyData();
        getCityEvery();
    }
    queryData()
}])