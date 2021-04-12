/**
 * 主菜单：结算管理 -> 未返还交接单 控制器
 */
app.controller("not_handover_controller", ["$scope", "$host",'_config', "_basic", function ($scope, $host,_config, _basic) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);
    var userType = _basic.getSession(_basic.USER_TYPE);
    // 翻页用
    $scope.start = 0;
    $scope.size = 11;

    // 状态列表
    $scope.handoverFlagList = _config.handoverFlag;


    // 状态 默认为未返还
    $scope.handoverFlag = "1";


    //临时数组
    $scope.ArrayList=[];


    //初始  隐藏翻页
    $("#pre").hide();
    $("#next").hide();


    $scope.num = 0;
    $scope.flag=false;
    $scope.templateBox = true;
    $scope.success_data_box = false;
    $scope.dataBox = false;
    $scope.Picture_carId = "";

    $scope.get_receive=[];

    $scope.local_isSuccesss = false;
    $scope.upload_isSuccesss = false;
    $scope.show_error = false;
    $scope.error_msg = false;
    $scope.csvFile = null;
    $scope.rightNumber = 0;
    $scope.errorNumber = 0;
    $scope.putStartCity='';
    $scope.putArriveCity='';
    $scope.putArriveReceive='';

    $scope.tableHeader = [];

    $scope.fileType = "";
    // 表头原始数据
    $scope.tableHeadeArray = [];
    // 主体原始错误数据
    $scope.tableContentErrorFilter = [];
    // 主体原始成功数据
    $scope.tableContentFilter = [];


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
    // $scope.filterArray=[1,2,3,4,5,6,7,8,9];
    var colObjs = [
        {name: 'VIN', type: 'string', length: 17, require: true},
        {name: '制造商ID', type: 'number', length: 3, require: true},
        {name: '委托方ID', type: 'number', length: 3, require: true},
        {name: '起始城市ID', type: 'number', length: 3, require: true},
        {name: '发运地址ID', type: 'number', length: 3, require: true},
        {name: '目的地ID', type: 'number', length: 3,require: true},
        {name: '经销商ID', type: 'number', length: 3,require: true},
        {name: '序列号', type: 'number', length: 50,require: false}];
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
                //check required
                if (colObjs[j].require) {
                    if (contentArray[i][j] == null && contentArray[i][j].length == 0) {
                        $scope.errorNumber = $scope.errorNumber + 1;
                        $scope.tableContentErrorFilter.push(contentArray[i]);
                        flag = false;
                        break;
                    }
                }
                //check type
                // console.log(isNaN(contentArray[i][j]));

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
                //check length
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

/*
    $scope.fileUpload = function () {
        $("#buttonImport").removeAttr("disabled");
        _basic.formPost($("#file_upload_form"), $host.file_url + '/user/' + userId + '/file?fileType=1&&userType=' + userType, function (data) {
            if (data.success == true) {
                $scope.file_id = data.result.id;
                uploadDataArray = $scope.tableContentFilter;
                if (uploadDataArray.length > 0) {
                    orginDataLength = $scope.tableContentFilter.length;
                  $("#buttonImport").attr("disabled",true);
                    swal('正确:'+$scope.num+'错误:'+$scope.upload_error_array_num,"", "success")
                }
            }
        });
    };

*/



    $scope.fileUpload = function () {
        $("#buttonImport").removeAttr("disabled");
        _basic.formPost($("#file_upload_form"), $host.api_url + '/user/' + userId + '/settleHandoverCarRelFile' , function (data) {
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
                            $scope.templateBox = false;
                            // 表头校验
                            if ($scope.titleFilter($scope.tableHeadeArray) != false) {
                                // 主体内容校验
                                var content_filter_array = result.data.slice(1, result.data.length);
                                var con_line = [];
                                // console.log(content_filter_array);
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
                                $scope.templateBox = true;
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
                // console.log(val)
            }
        })
    };












    // 信息获取
    function getMsg() {
        // 委托方
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.entrustList = data.result;
                $('#client').select2({
                    placeholder: '委托方',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });

            }
        })

        //  城市信息获取
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.cityList = data.result;
                $('#startCity').select2({
                    placeholder: '始发城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#endCity').select2({
                    placeholder: '目的地城市',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
        });

        //获取司机
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success === true) {
                $scope.driveList = data.result;
                $('#driver').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };


    // 目的地城市-经销商联动
    $scope.changeEndCity = function (id) {
        _basic.get($host.api_url + "/receive?cityId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.receiveList = data.result;
                $('#dealer').select2({
                    placeholder: '经销商',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });

            } else {
                swal(data.msg, "", "error")
            }
        })
    };


    //委托方-品牌联动
    $scope.changeClient = function (entrustId){
        _basic.get($host.api_url + "/entrustMakeRel?entrustId=" + entrustId).then(function (data) {
            if (data.success == true && data.result.length >= 0) {
                $scope.brandList = data.result;

            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }


    // 起始城市-发运地名称联动
    $scope.changeStartCity = function () {
        if($scope.conStartCity == 0 || $scope.conStartCity == "" || $scope.conStartCity == null){
            $scope.conStartCity = null;
            $scope.locateList = [];
        }
        else{
            _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.conStartCity).then(function (data) {
                if (data.success === true) {
                    $scope.locateList = data.result;
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    };



    /*
    * 数据导出
    * */
    $scope.export = function () {

        // 基本检索URL
        var url = $host.api_url + "/notSettleHandover.csv";
        var conditionsObj = makeConditions();
        // 检索条件
        var conditions = _basic.objNewToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "?" + conditions : url;


        if ($scope.conPlanTimeStart == undefined || $scope.conPlanTimeEnd == undefined) {
            swal('请输入完整的查询时间', "", "error");
        }
        else {
            swal({
                    title: "确定导出未返还交接单表？",
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
            }).then(
                function (result) {
                    if (result.value) {
                        window.open(url);
                    }
                })
        }
    }



    /*
    * 查询按钮
    * */
    $scope.getNotHandoverInfo = function () {
        $scope.start = 0;
        seachNotHandover();
    }


    /**
     * 根据条件搜索
     */
    function  seachNotHandover() {
        if ($scope.conPlanTimeStart == undefined || $scope.conPlanTimeEnd == undefined) {
            swal('请输入完整的查询时间', "", "error");
            $scope.notHandoverArray = [];
            $scope.getNum =0;
        }
        else {
            // 基本检索URL
            var url = $host.api_url + "/notSettleHandover?start=" + $scope.start + "&size=" + $scope.size;
            // 检索条件
            var conditionsObj = makeConditions();
            var conditions = _basic.objNewToUrl(conditionsObj);
            // 检索URL
            url = conditions.length > 0 ? url + "&" + conditions : url;
            _basic.get(url).then(function (data) {
                if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.notHandoverArray = $scope.boxArray.slice(0, 10);
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

            //未返还车辆总数
            _basic.get($host.api_url + "/notSettleHandoverCarCount?transferFlag=0&carLoadStatus=2&taskPlanDateStart="+$scope.conPlanTimeStart +"&taskPlanDateEnd="+ $scope.conPlanTimeEnd)
                .then(function (data) {
                    if (data.success === true) {
                        $scope.getNum=data.result[0].car_count;
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
        }
    }




    //打开详情模态框
    $scope.openNotHandOverDetail = function (id) {
        _basic.get($host.api_url + "/notSettleHandover?handoverFlag="+$scope.handoverFlag+"&dpRouteTaskDetailId=" + id).then(function (data) {
            if (data.success === true) {
                $scope.notHandOverDetailArray = data.result[0];
            }
        })
        $('#settlementItem').modal('open');
    }




    //点击加号 生成数组
    $scope.getArr = function (el){
        if($scope.ArrayList.length!==0){

            /*  //判断添加的vin是否与第一个vin品牌、委托方、起始城市、发运地、经销商一致
              if(
                  $scope.ArrayList[0].make_name==el.make_name&&
                  $scope.ArrayList[0].e_short_name==el.e_short_name&&
                  $scope.ArrayList[0].route_end==el.route_end&&
                  $scope.ArrayList[0].route_start==el.route_start&&
                  $scope.ArrayList[0].addr_name==el.addr_name&&
                  $scope.ArrayList[0].r_short_name==el.r_short_name
              ){*/
            for (var i = 0; i < $scope.ArrayList.length; i++) {
                if ($scope.ArrayList[i].vin === el.vin) {
                    swal('不能重复添加相同VIN!',"", "error");
                    return;
                }
            }
            $scope.ArrayList.push(el);
            /* }
             else{
                 swal('请保持与现有的VIN品牌、委托方、起始城市、发运地、经销商一致',"", "error");
             }*/
        }
        else{

            //生成数组
            $scope.ArrayList.push(el);
        }
     }


    //删除数据
    $scope.deleteSingle =function (_obj,_arr){
        var length = _arr.length;
        for (var i = 0; i < length; i++) {
            if (_arr[i] === _obj) {
                if (i === 0) {
                    _arr.shift(); //删除并返回数组的第一个元素
                    return _arr;
                }
                else if (i === length - 1) {
                    _arr.pop();  //删除并返回数组的最后一个元素
                    return _arr;
                }
                else {
                    _arr.splice(i, 1); //删除下标为i的元素
                    return _arr;
                }
            }
        }
        $scope.ArrayList =_arr;
    }


    //未交接到已交接按钮
    $scope.addArr = function (){
        $scope.carIds=[];
        for (var i = 0; i < $scope.ArrayList.length; i++) {
            $scope.carIds.push($scope.ArrayList[i].car_id)
        }

        swal({
            title: "确定交接这"+ $scope.carIds.length+"车辆吗？",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
                /*if($scope.addNumberId!== ''&&$scope.addHandoverReceiveStartTime!== ''){*/
                _basic.post($host.api_url + "/user/" + userId + "/settleHandoverAll", {
                    /* "serialNumber":  $scope.addNumberId,
                     "entrustId":   $scope.ArrayList[0].entrust_id,
                     "receivedDate": $scope.addHandoverReceiveStartTime,
                     "routeStartId":  $scope.ArrayList[0].route_start_id,
                     "routeEndId":  $scope.ArrayList[0].route_end_id,
                     "receiveId":  $scope.ArrayList[0].receive_id,
                     "carCount":$scope.ArrayList.length,
                     "remark":$scope.newRemark,*/
                    "carIds":$scope.carIds
                }).then(function (data) {
                    if (data.success == true) {
                        $scope.ArrayList=[];
                        /*$('#addSettlementArr').modal('close');*/
                        seachNotHandover();
                        swal("交接成功", "", "success");
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                })
                /*  }
                else {
                      swal("请填写完整信息！", "", "warning");
                  }*/

            }
        })


       /* $scope.addNumberId='';
        $scope.addHandoverReceiveStartTime = moment(new Date()).format("YYYY-MM-DD");
        $scope.newRemark='';*/

       /* $('#addSettlementArr').modal('open');*/
    }

/*

    /!*
    * 执行未交接到已交接操作
    * *!/
    $scope.addSettlementItem = function (){
        swal({
            title: "确定交接这些车辆吗？",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
                /!*if($scope.addNumberId!== ''&&$scope.addHandoverReceiveStartTime!== ''){*!/
                    _basic.post($host.api_url + "/user/" + userId + "/settleHandoverAll", {
                       /!* "serialNumber":  $scope.addNumberId,
                        "entrustId":   $scope.ArrayList[0].entrust_id,
                        "receivedDate": $scope.addHandoverReceiveStartTime,
                        "routeStartId":  $scope.ArrayList[0].route_start_id,
                        "routeEndId":  $scope.ArrayList[0].route_end_id,
                        "receiveId":  $scope.ArrayList[0].receive_id,
                        "carCount":$scope.ArrayList.length,
                        "remark":$scope.newRemark,*!/
                        "carIds":$scope.carIds
                    }).then(function (data) {
                        if (data.success == true) {
                            $scope.ArrayList=[];
                            $('#addSettlementArr').modal('close');
                            seachNotHandover();
                            swal("交接成功", "", "success");
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    })
              /!*  }
              else {
                    swal("请填写完整信息！", "", "warning");
                }*!/

            }
        })
    }
*/








    // 分页
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        seachNotHandover();
    };

    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        seachNotHandover();
    };


    /**
     * 组装检索条件。
     */
    function makeConditions() {
        var obj = {
            carLoadStatus: 2,
            vinCode: $scope.conVin,
            entrustId: $scope.conEntrust,
            routeEndId: $scope.conEndcity,
            receiveId: $scope.conReceive,
            dpRouteTaskId: $scope.condpId,
            driveId: $scope.conDriver,
            taskPlanDateStart: $scope.conPlanTimeStart,
            taskPlanDateEnd: $scope.conPlanTimeEnd,
            makeId: $scope.conBrand,
            routeStartId: $scope.conStartCity,
            baseAddrId: $scope.conLocate,
            handoverFlag:$scope.handoverFlag,
            transferFlag:0
        }
        return obj;
    }




    getMsg();

}])