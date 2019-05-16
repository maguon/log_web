/**
 * Restructure by zcy on 2018/2/5.
 */

app.controller("truck_repair_list_controller", ['$rootScope', "$rootScope","$state","$stateParams",'$scope', '_basic', '$host', function ($rootScope,$rootScope,$state,$stateParams, $scope, _basic, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.record_repair_start = 0;
    $scope.record_repair_size = 10;
    $scope.hasNotAccident = true;
    $scope.forbidSelect = true;
    $scope.num=0;

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
    $scope.repairRecord = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.repairRecord ').addClass("active");
        $("#repairRecord").addClass("active");
        $("#repairRecord").show();

    };
    $scope.importFile  ();

    $("#pre").hide();
    $("#next").hide();





    // 过滤条件数据
    var colObjs = [
        {name: '车号', type: 'string',require: true},
        {name: '司机', type: 'string',require: true},
        {name: '维修类型', type: 'string', require: true},
        {name: '维修开始时间', type: 'string', require: true},
        {name: '维修结束时间', type: 'string', require: true},
        {name: '配件费', type: 'number', require: true},
        {name: '维修费', type: 'number', require: true},
        {name: '保养费', type: 'number', require: true},
        {name: '维修内容', type: 'string', require: true},
        {name: '备注', type: 'string', require: true}];
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
        _basic.formPost($("#file_upload_form"), $host.api_url + '/user/' + userId + '/truckRepairRelFile' , function (data) {
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
                                    swal("正确条数" + $scope.tableContentFilter.length);
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
















    //車牌号
    function getTruckNumList () {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumList = data.result;
                $('#record_truck_name').select2({
                    placeholder: '车牌号',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    // 获取所有公司列表
    function getCompanyList() {
        _basic.get($host.api_url + "/company").then(function (data) {
            if (data.success === true) {
                $scope.companyList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 数据导出
    $scope.export = function () {
        if ($scope.repair_status == 0) {
            $scope.repair_status_tx = "0";
        }
        else {
            $scope.repair_status_tx = $scope.repair_status;
        }
        // 基本检索URL
        var url = $host.api_url + "/truckRepair.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };

    // 获取维修记录列表
    $scope.getRepairRecordList = function () {
        // 基本检索URL
        var url = $host.api_url + "/truckRepairRel?start=" + $scope.record_repair_start + "&size=" + $scope.record_repair_size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "truck_repair_list",
                    start: $scope.record_repair_start ,
                    size: $scope.record_repair_size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                if ($scope.record_repair_start > 0) {
                    $("#record_pre").show();
                }
                else {
                    $("#record_pre").hide();
                }
                if (data.result.length < $scope.record_repair_size) {
                    $("#record_next").hide();
                }
                else {
                    $("#record_next").show();
                }
                $scope.repairRecordList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 搜索维修记录
    $scope.searchRepairRecordList = function () {
        $scope.record_repair_start = 0;
        $scope.getRepairRecordList();
    };

    // 分页
    $scope.record_pre_btn = function () {
        $scope.record_repair_start = $scope.record_repair_start - $scope.record_repair_size;
        $scope.getRepairRecordList();
    };

    $scope.record_next_btn = function () {
        $scope.record_repair_start = $scope.record_repair_start + $scope.record_repair_size;
        $scope.getRepairRecordList();
    };

    // 开启新增维修记录模态框，并查询所有货车牌号
    $scope.addRepairInfo = function () {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumList = data.result;
                $('#truck_num_mod').select2({
                    placeholder: '车牌号',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $scope.modTruckNum = "";
        $scope.modRecordTruckType = "";
        $scope.associatedAccident = "";
        $scope.repairReason = "";
        $scope.hasNotAccident = true;
        $scope.forbidSelect = true;
        $('#addRepairInfoModel').modal('open');
    };

    // 根据选择的车牌号获取关联事故列表
    $scope.searchMatchAccident = function () {
        $scope.associatedAccident = "";
        _basic.get($host.api_url + "/truckAccident?truckId=" + $scope.modTruckNum).then(function (data) {
            if (data.success === true) {
                if(data.result.length === 0){
                    $scope.hasNotAccident = true;
                }
                else{
                    $scope.hasNotAccident = false;
                }
                $scope.accidentNumList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 检查是否允许关联事故
    $scope.isCheckAssociatedAccident = function () {
        if($scope.modRecordTruckType === "1"){
            $scope.forbidSelect = false;
        }
        else{
            $scope.associatedAccident = "";
            $scope.forbidSelect = true;
        }
    };

    // 提交新增的维修记录
    $scope.addRepairRecord = function () {
        var paramObj;
        var condition;
        // 根据不同的事故状态传不同的参数走不同的判断条件
        if($scope.forbidSelect){
            paramObj = {
                repairType: $scope.modRecordTruckType,
                repairReason: $scope.repairReason
            };
            condition = ($scope.modTruckNum !== "" && $scope.modRecordTruckType !== "" && $scope.repairReason !== "");
        }
        else{
            paramObj = {
                repairType: $scope.modRecordTruckType,
                accidentId: $scope.associatedAccident,
                repairReason: $scope.repairReason
            };
            condition = ($scope.modTruckNum !== "" && $scope.modRecordTruckType !== "" && $scope.repairReason !== "" && $scope.associatedAccident !== "");
        }
        if(condition){
            _basic.post($host.api_url + "/user/" + userId + "/truck/" + $scope.modTruckNum + "/truckRepairRel",paramObj).then(function (data) {
                if (data.success === true) {
                    swal("新增成功", "", "success");
                    $('#addRepairInfoModel').modal('close');
                    $scope.searchRepairRecordList();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    };

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.repairNum=conditions.relId;
        $scope.recordTruckType=conditions.truckType;
        $scope.repair_status=conditions.repairStatus;
        $scope.recordRepairType=conditions.repairType;
        $scope.record_startTime_start=conditions.repairDateStart;
        $scope.record_startTime_end=conditions.repairDateEnd;
        $scope.recordTruckNum=conditions.truckNum;
        $scope.record_endTime_start=conditions.endDateStart;
        $scope.record_endTime_end=conditions.endDateEnd;
        $scope.insureCompany=conditions.companyId;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            relId: $scope.repairNum,
            truckType: $scope.recordTruckType,
            repairStatus: $scope.repair_status,
            repairType: $scope.recordRepairType,
            repairDateStart: $scope.record_startTime_start,
            repairDateEnd: $scope.record_startTime_end,
            truckNum: $scope.recordTruckNum,
            endDateStart: $scope.record_endTime_start,
            endDateEnd: $scope.record_endTime_end,
            companyId: $scope.insureCompany
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "truck_repair" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "truck_repair_list") {
                // 设定画面翻页用数据
                $scope.record_repair_start = pageItems.start;
                $scope.record_repair_size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);

            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }
        // 查询数据
        $scope.getRepairRecordList();

    }
    initData();

    // 获取数据
    $scope.queryData = function () {
        $scope.getRepairRecordList();
        getTruckNumList ();
        getCompanyList();
    };
    $scope.queryData()

}]);