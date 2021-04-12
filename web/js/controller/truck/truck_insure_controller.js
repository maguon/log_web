app.controller("truck_insure_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    $scope.size = 11;
    $scope.start = 0;
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

    // 过滤条件数据  保险公司ID,保险种类ID,保单编号,保险金额,税金额,车牌号,生效日期起始,生效日期终止,保险备注
    var colObjs = [
        {name: '保险公司ID', type: 'number',require: true},
        {name: '保险种类ID', type: 'number',require: true},
        {name: '保单编号', type: 'number',require: true},
        {name: '保险金额', type: 'number',require: true},
        {name: '税金额', type: 'number',require: true},
        {name: '车牌号', type: 'string',require: true},
        {name: '生效日期起始', type: 'string', require: true},
        {name: '生效日期终止', type: 'string', require: true},
        {name: '保险备注', type: 'string', require: false}];
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
        _basic.formPost($("#file_upload_form"), $host.api_url + '/user/' + userId + '/truckInsureRelFile' , function (data) {
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

    // 获取所有保险公司
    function getInsuranceCompany() {
        _basic.get($host.api_url + "/truckInsure").then(function (data) {
            if (data.success === true) {
                $scope.insureCompanyNameList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
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
    //車牌号
    function getTruckNumList () {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumList = data.result;
                $('#truck_num').select2({
                    placeholder: '车牌号码',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    // 数据导出
    $scope.export = function () {
        var obj = {
            active:1,
            insureNum:$scope.InsureNum,
            insureId:$scope.truckInsureId,
            insureType:$scope.truckInsureType,
            insureUserId:$scope.insureUserName,
            truckNum:$scope.truckNum,
            truckType:$scope.truckType,
            companyId: $scope.insureCompany,
            endDateStart:$scope.startTimeStart,
            endDateEnd:$scope.startTimeEnd
        };
        window.open($host.api_url + "/truckInsureRel.csv?" + _basic.objToUrl(obj));
    };
    // 获取筛选列表
    function getTruckInsureList () {
        _basic.get($host.api_url + "/truckInsureRel?" + _basic.objToUrl({
            active:1,
            insureNum:$scope.InsureNum,
            insureId:$scope.truckInsureId,
            insureType:$scope.truckInsureType,
            insureUserName:$scope.insureUserName,
            truckNum:$scope.truckNum,
            truckType:$scope.truckType,
            endDateStart:$scope.startTimeStart,
            endDateEnd:$scope.startTimeEnd,
            companyId: $scope.insureCompany,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.truckInsureList = $scope.boxArray.slice(0, 10);
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
                for(var i = 0; i < $scope.truckInsureList.length; i++) {
                    var endDate = new Date($scope.truckInsureList[i].end_date).getTime();
                    var nowDate = new Date().getTime();
                    if(endDate - nowDate < (1000 * 60 * 60 * 24*30)&&(nowDate - endDate)<0){
                        $scope.truckInsureList[i].expiredStatus =0;
                    }else if(nowDate - endDate > 0){
                        $scope.truckInsureList[i].expiredStatus =1;
                    } else{
                        $scope.truckInsureList[i].expiredStatus =2;
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 点击搜索
    $scope.searchTruckInsure = function () {
        $scope.start=0;
        getTruckInsureList();
    };
    //添加模态框
    $scope.addTruckInsure=function () {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAll = data.result;
                $('#truck_number').select2({
                    placeholder: '车牌号',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        // 初始化所有信息
            $scope.addSystemType="";
            $scope.addtruckInsureName="";
            $scope.addtruckInsureType="";
            $scope.addInsureNum="";
            $scope.addinsureMoney="";
            $scope.addTaxCost="";
            $scope.startDate="";
           $scope.endDate="";
           $scope.addInsureExplain="";
        $('#addTruckInsure').modal('open');
    }
    $scope.createTruckInsureItem=function() {
        if ($scope.addSystemType !== undefined && $scope.addtruckInsureName !== undefined && $scope.addtruckInsureType!== undefined &&
            $scope.addInsureNum!== undefined&&$scope.addinsureMoney!== undefined&&$scope.addTaxCost!==undefined&&$scope.startDate!== undefined&& $scope.endDate!== undefined) {
            _basic.post($host.api_url + "/user/" + userId + "/truckInsureRel", {
                truckId: $scope.addSystemType,
                insureId:$scope.addtruckInsureName,
                insureType: $scope.addtruckInsureType,
                insureNum: $scope.addInsureNum,
                insureMoney: $scope.addinsureMoney,
                taxMoney: $scope.addTaxCost,
                totalMoney:$scope.addTaxCost +$scope.addinsureMoney,
                startDate: $scope.startDate,
                endDate: $scope.endDate,
                insureExplain: $scope.addInsureExplain
            }).then(function (data) {
                if (data.success == true) {
                    swal("新增成功", "", "success");
                    $('#addTruckInsure').modal('close');
                    $scope.searchTruckInsure();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    }
    //查看详情
    $scope.readTruckInsure=function (id) {
        $('.modal').modal();
        $('#showTruckInsure').modal('open');
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAllList = data.result;
            }
        })
        _basic.get($host.api_url + "/truckInsureRel?relId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.showTruckInsureList = data.result[0];
                $scope.showTruckInsureList.truck_id=data.result[0].truck_id;
            } else {
                swal(data.msg, "", "error");
            }
        })
    }
    //修改
    $scope.updateTruckInsureItem = function (id) {
        if($scope.showTruckInsureList.truck_id!== "" &&$scope.showTruckInsureList.insure_id!==""
            &&$scope.showTruckInsureList.insure_type!== ""&& $scope.showTruckInsureList.insure_num!== ""
            &&$scope.showTruckInsureList.insure_money!== ""  &&$scope.showTruckInsureList.tax_money!== ""&&$scope.showTruckInsureList.start_date!== "" &&$scope.showTruckInsureList.end_date!== ""){
            var obj = {
             truckId:  $scope.showTruckInsureList.truck_id,
             insureId:  $scope.showTruckInsureList.insure_id,
             insureType: $scope.showTruckInsureList.insure_type,
             insureNum:  $scope.showTruckInsureList.insure_num,
             insureMoney:  $scope.showTruckInsureList.insure_money,
             taxMoney: $scope.showTruckInsureList.tax_money,
             totalMoney:$scope.showTruckInsureList.tax_money+ $scope.showTruckInsureList.insure_money,
             startDate:  $scope.showTruckInsureList.start_date,
             endDate: $scope.showTruckInsureList.end_date,
             insureExplain: $scope.showTruckInsureList.insure_explain
            };
            _basic.put($host.api_url + "/user/" + userId+"/truckInsureRel/" +id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    $('#showTruckInsure').modal('close');
                    getTruckInsureList ();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    };
    $scope.deleteTruckInsure = function(id){
        swal({
                title: "确定删除当前货车保险信息吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
                _basic.delete($host.api_url + "/user/" + userId + "/truckInsureRel/"+id).then(function (data) {
                    if (data.success === true) {
                        getTruckInsureList ();
                        swal("删除成功", "", "success");
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
        })
    }

    // 分页
    $scope.getPrePage = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getTruckInsureList();
    };
    $scope.getNextPage = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getTruckInsureList();
    };
    // 获取数据
    function queryData () {
        getInsuranceCompany();
        getTruckNumList ();
        getCompanyList();
        $scope.searchTruckInsure();
    };
    queryData();
}])