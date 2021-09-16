/**
 * Created by star on 2018/6/11.
 */
app.controller("peccancy_withhold_controller", ["$scope", "$state", "_basic", "_config", "$host", function ($scope, $state, _basic, _config, $host) {
    $scope.start = 0;
    $scope.size = 11;
    var userType = _basic.getSession(_basic.USER_TYPE);
    var userId = _basic.getSession(_basic.USER_ID);


    $scope.num = 0;
    $scope.flag=false;
    $scope.tableBox = true;
    $scope.success_data_box = false;
    $scope.dataBox = false;
    $scope.local_isSuccesss = false;
    $scope.upload_isSuccesss = false;
    $scope.show_error = false;
    $scope.error_msg = false;
    $scope.rightNumber = 0;
    $scope.errorNumber = 0;
    $scope.tableHeader = [];
    $scope.fileType = "";
    // 表头原始数据
    $scope.tableHeadeArray = [];
    // 主体原始错误数据
    $scope.tableContentErrorFilter = [];
    // 主体原始成功数据
    $scope.tableContentFilter = [];
    $scope.ImportedFilesList = [];
    // 跳转
    $scope.importFile = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.importFile ').addClass("active");
        $("#importFile").addClass("active");
        $("#importFile").show();
    };
    $scope.lookMyselfFile = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.lookMyselfFile ').addClass("active");
        $("#lookMyselfFile").addClass("active");
        $("#lookMyselfFile").show();
    };
    $scope.lookMyselfFile();

    $("#pre").hide();
    $("#next").hide();

    // 过滤条件数据
    var colObjs = [
        {name: '司机', type: 'string',require: true},
        {name: '货车牌号', type: 'string',require: true},
        {name: '扣分', type: 'number', require: true},
        {name: '买分金额', type: 'number', require: true},
        {name: '交通罚款', type: 'number', require: true},
        {name: '处理金额', type: 'number', require: true},
        {name: '个人承担金额', type: 'number', require: true},
        {name: '公司承担金额', type: 'number', require: true},
        {name: '违章时间', type: 'string', require: true},
        {name: '处理时间', type: 'string', require: true},
        {name: '城市ID', type: 'number', require: true},
        {name: '违章地点', type: 'string', require: true},
        {name: '编号', type: 'string', require: false},
        {name: '备注', type: 'string', require: false}];
    // 头部条件判断
    $scope.titleFilter = function (headerArray) {
        if (colObjs.length != headerArray.length) {
            return false;
        } else {
            for (var i in headerArray) {
                if (colObjs[i].name != headerArray[i]) {
                    return false
                }
            }
        }
    };
    // 主体条件判断
    $scope.ContentFilter = function (contentArray) {

        for (var i = 0; i < contentArray.length; i++) {
            var flag = true;
            var isNumber;
            for (var j = 0; j < colObjs.length; j++) {
                if (colObjs[j].require) {
                    if (contentArray[i][j] == null && contentArray[i][j].length == 0) {
                        $scope.errorNumber = $scope.errorNumber + 1;
                        $scope.tableContentErrorFilter.push(contentArray[i]);
                        flag = false;
                        break;
                    }
                }
                if (contentArray[i][j] == '' || isNaN(contentArray[i][j])) {
                    isNumber = "string"
                } else {
                    isNumber = "number"
                }
                if (colObjs[j].type != isNumber && contentArray[i][j] != '' &&colObjs[j].require ) {
                    $scope.errorNumber = $scope.errorNumber + 1;
                    $scope.tableContentErrorFilter.push(contentArray[i]);
                    flag = false;
                    break;
                }
                if (colObjs[j].type=='string'&&(colObjs[j].length && colObjs[j].length != contentArray[i][j].length)) {
                    $scope.errorNumber = $scope.errorNumber + 1;
                    $scope.tableContentErrorFilter.push(contentArray[i]);
                    flag = false;
                    break;
                }
            }
            if (flag == true) {
                $scope.rightNumber = $scope.rightNumber + 1;
                $scope.tableContentFilter.push(contentArray[i]);
            }
        }
    };

    $scope.fileUpload = function () {
        $("#buttonImport").removeAttr("disabled");
        _basic.formPost($("#file_upload_form"), $host.api_url + '/user/' + userId + '/drivePeccancyFile' , function (data) {
            if (data.success == true) {
                $scope.$apply(function () {
                    $scope.upload_error_array_num =data.result.failedCase;
                    $scope.orginData_Length=data.result.failedCase+data.result.successedInsert;
                    $scope.num=data.result.successedInsert;
                    $scope.local_isSuccesss = false;
                    $scope.upload_isSuccesss = true;
                    $("#file_upload_form").disabled=true;
                    $("#buttonImport").attr("disabled",true);
                    swal('正确:'+$scope.num+'错误:'+$scope.upload_error_array_num,"", "success")
                });

            }
            else {
                $("#buttonImport").attr("disabled",true);
                swal(data.msg, "", "error");
            }
        });
    };

    // 展示上传的错误数据
    $scope.show_error_msg = function () {
        $scope.error_msg = !$scope.error_msg;
    };

    $scope.fileChange = function (file) {
        // 表头原始数据
        $scope.tableHeadeArray = [];
        // 主体原始错误数据
        $scope.tableContentErrorFilter = [];
        // 主体原始成功数据
        $scope.tableContentFilter = [];
        $scope.rightNumber = 0;
        $scope.errorNumber = 0;
        $(file).parse({
            config: {
                complete: function (result) {
                    $scope.$apply(function () {
                        if(result==null ||result.data==null ||result.data.length ==0){
                            swal("文件类型错误");
                        } else {
                            $scope.tableHeadeArray = result.data[0];
                            $scope.tableBox = false;
                            // 表头校验
                            if ($scope.titleFilter($scope.tableHeadeArray) != false) {
                                // 主体内容校验
                                var content_filter_array = result.data.slice(1, result.data.length);
                                var con_line = [];
                                // excel换行过滤
                                for (var i = 0; i < content_filter_array.length; i++) {
                                    if (content_filter_array[i].length == 1 && content_filter_array[i][0] == "") {
                                        break;
                                    } else {
                                        con_line.push(content_filter_array[i]);
                                    }
                                }
                                $scope.ContentFilter(con_line);
                                if ($scope.tableContentErrorFilter.length == 0) {
                                    $scope.success_data_box = true;
                                    $scope.dataBox = false;
                                    swal("数据格式正确"+ $scope.tableContentFilter.length+"条" );
                                    // 总条数
                                    $scope.orginData_Length = $scope.tableContentFilter.length;
                                    $scope.local_isSuccesss = true;
                                } else {
                                    $scope.success_data_box = false;
                                    $scope.dataBox = true;
                                    swal("错误条数" + $scope.tableContentErrorFilter.length);
                                }
                                $scope.tableHeader = result.data[0];
                            }
                            else {
                                swal("表头格式错误", "", "error");
                                $scope.tableBox = true;
                            }

                        }

                    });

                }
            },
            before: function (file, inputElem) {
                $scope.fileType = file.type;
            },
            error: function (err, file, inputElem, reason) {
                console.log(err)
            },
            complete: function (val) {
            }
        })
    };





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
                        placeholder: '违章城市',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });
                    $('#putCity').select2({
                        placeholder: '违章城市',
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
            truckType:$scope.truckType,
            startDateStart:$scope.getStartTime,
            startDateEnd:$scope.getEndTime,
            handleDateStart:$scope.dealStartTime,
            handleDateEnd:$scope.dealEndTime,
            createdOnStart:$scope.creatStartTime,
            createdOnEnd:$scope.creatEndTime,
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


  /*  $scope.putPeccancyItem2 = function (){
        $('#putPeccancyItem').modal('close');
    }*/

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