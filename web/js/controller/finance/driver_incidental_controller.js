
/**
 * 主菜单：财务管理 -> 司机杂费 控制器
 */

app.controller("driver_incidental_controller", ["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {

    $scope.start = 0;
    $scope.size = 11;

    var userId = _basic.getSession(_basic.USER_ID);

    $scope.otherFlag=true;
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
    $scope.lookDriverIncidentalFile = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.lookDriverIncidentalFile ').addClass("active");
        $("#lookDriverIncidentalFile").addClass("active");
        $("#lookDriverIncidentalFile").show();
    };
    $scope.lookDriverIncidentalFile();

    $("#pre").hide();
    $("#next").hide();

    // 过滤条件数据
    var colObjs = [
        {name: '司机姓名', type: 'string',require: true},
        {name: '电话', type: 'number',require: true},
        {name: '月份', type: 'number', require: true},
        {name: '个人借款', type: 'number', require: true},
        {name: '社保费', type: 'number', require: true},
        {name: '伙食费', type: 'number', require: true}];




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
        $("#buttonImport").attr("disabled",true);

        _basic.formPost($("#file_upload_form"), $host.api_url + '/user/' + userId +  '/driveSundryFeeFile' , function (data) {
            if (data.success == true) {
                $scope.$apply(function () {
                    $scope.upload_error_array_num =data.result.failedCase;
                    $scope.orginData_Length=data.result.failedCase+data.result.successedInsert;
                    $scope.num=data.result.successedInsert;
                    $scope.local_isSuccesss = false;
                    $scope.upload_isSuccesss = true;
                    $("#file_upload_form").disabled=true;
                    $("#buttonImport").attr("disabled",false);
                    swal('正确:'+$scope.num+'错误:'+$scope.upload_error_array_num,"", "success")
                });

            }
            else {
                $("#buttonImport").attr("disabled",false);
                swal(data.msg, "", "error");
            }
        });
    };

    // 展示上传的错误数据
    $scope.show_error_msg = function () {
        $scope.error_msg = !$scope.error_msg;
    };

    $scope.fileChange = function (file) {
        $scope.otherFlag=true;
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






    // 过滤条件数据
    var colObjsOther = [
        {name: '司机姓名', type: 'string',require: true},
        {name: '电话', type: 'number',require: true},
        {name: '月份', type: 'number', require: true},
        {name: '其他扣款', type: 'number', require: true}];
    // 头部条件判断
    $scope.titleFilterOther = function (headerArray) {
        if (colObjsOther.length != headerArray.length) {
            return false;
        } else {
            for (var i in headerArray) {
                if (colObjsOther[i].name != headerArray[i]) {
                    return false
                }
            }
        }
    };

    // 主体条件判断
    $scope.ContentFilterOther = function (contentArray) {

        for (var i = 0; i < contentArray.length; i++) {
            var flag = true;
            var isNumber;
            for (var j = 0; j < colObjsOther.length; j++) {
                if (colObjsOther[j].require) {
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
                if (colObjsOther[j].type != isNumber && contentArray[i][j] != '' &&colObjsOther[j].require ) {
                    $scope.errorNumber = $scope.errorNumber + 1;
                    $scope.tableContentErrorFilter.push(contentArray[i]);
                    flag = false;
                    break;
                }
                if (colObjsOther[j].type=='string'&&(colObjsOther[j].length && colObjsOther[j].length != contentArray[i][j].length)) {
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

    $scope.fileUploadOther = function () {
        $("#buttonImportOther").attr("disabled",true);
        _basic.formPost($("#file_upload_form1"), $host.api_url + '/user/' + userId + '/driveSundryOtherFeeFile' , function (data) {
            if (data.success == true) {
                $scope.$apply(function () {
                    $scope.upload_error_array_num =data.result.failedCase;
                    $scope.orginData_Length=data.result.failedCase+data.result.successedInsert;
                    $scope.num=data.result.successedInsert;
                    $scope.local_isSuccesss = false;
                    $scope.upload_isSuccesss = true;
                    $("#file_upload_form1").disabled=true;
                    $("#buttonImportOther").attr("disabled",false);
                    swal('正确:'+$scope.num+'错误:'+$scope.upload_error_array_num,"", "success")
                });

            }
            else {
                $("#buttonImportOther").attr("disabled",false);
                swal(data.msg, "", "error");
            }
        });
    };

    // 展示上传的错误数据
    $scope.show_error_msg = function () {
        $scope.error_msg = !$scope.error_msg;
    };



    $scope.fileChangeOther = function (file){
        $scope.otherFlag=false;
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
                            if ($scope.titleFilterOther($scope.tableHeadeArray) != false) {
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
                                $scope.ContentFilterOther(con_line);
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
    }
    /*
    * 查询页面
    * */

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

    //月份格式
    $('#start_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });
    $('#add_start_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });
    $('#put_start_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });


    //获取上个月年月
    function getLastMonth(){//获取上个月日期
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        if(month<10){
            month ='0'+month;
        }

        if(month == 0){
            year = year -1;
            month = 12;
        }
        $scope.startMonth = year.toString()+month.toString();
        $scope.addYMonth = year.toString()+month.toString();
    }
    getLastMonth();




    //查询功能
    $scope.getIncidental = function (){
        $scope.start = 0;
        getIncidentalData();
    }

    //获取查询数据
    function getIncidentalData(){
        if($('#start_month').val()!==''){
            $scope.startMonth = $('#start_month').val();
        }

        _basic.get($host.api_url + "/driveSundryFee?" + _basic.objToUrl({
            driveId:$scope.driverId,
            yMonth: $scope.startMonth,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.incidentalList = $scope.boxArray.slice(0, 10);
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
        if($('#start_month').val()!==''){
            $scope.startMonth = $('#start_month').val();
        }

        var obj = {
            driveId:$scope.driverId,
            yMonth: $scope.startMonth
        };
        window.open($host.api_url + "/driveSundryFee.csv?" + _basic.objToUrl(obj));
    };







    //打开新增模态框
    $scope.addIncidental = function (){
        $scope.addDrivderId='';
        $scope.driveNameList =[];
        $scope.addPersonalLoan =0;
        $scope.addSocialFee =0;
        $scope.addMealsFee =0;
        $scope.addOtherFee =0;
        getDriveNameList ();
        $('#addItem').modal('open');
    }


    //点击确定 增加完成
    $scope.addIncidentalItem = function (){

        if($('#add_start_month').val()!==''){
            $scope.addYMonth = $('#add_start_month').val();
        }
        else {
            swal("月份必填！", "", "warning")
        }


        if ($scope.addYMonth !== "" && $scope.addDrivderId !== ''&&$scope.addYMonth !== undefined&& $scope.addDrivderId !== undefined
        && $scope.addPersonalLoan !== ""
        &&$scope.addSocialFee !== ""
        &&$scope.addMealsFee  !== ""
       &&$scope.addOtherFee !== "") {
            _basic.post($host.api_url + "/user/" + userId + "/driveSundryFee", {
                "userId": userId,
                "driveId": $scope.addDrivderId,
                "yMonth":  $scope.addYMonth,
                "personalLoan": $scope.addPersonalLoan.toFixed(2),
                "socialFee":$scope.addSocialFee.toFixed(2),
                "mealsFee":$scope.addMealsFee.toFixed(2),
                "otherFee":$scope.addOtherFee.toFixed(2)
            }).then(function (data) {
                if (data.success === true) {
                    $('#addItem').modal('close');
                    swal("新增成功", "", "success");
                    getIncidentalData();
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
    $scope.putIncidental = function (id){
        $scope.id = id;
        $scope.driveList =[];
        $('#putItem').modal('open');
        _basic.get($host.api_url + "/driveSundryFee?driveSundryFeeId=" +id).then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.putIncidentalList = [];
                }
                else{
                    $scope.putIncidentalList = data.result[0];
                    $scope.putIncidentalList.drive_id = data.result[0].drive_id;
                    getDriveList($scope.putIncidentalList.drive_id);

                }
            }
        })
    }



    $scope.putIncidentalItem = function (){
        if($scope.putIncidentalList.y_month!== "" &&$scope.putIncidentalList.drive_id!==""&&
            $scope.putIncidentalList.y_month!== undefined &&$scope.putIncidentalList.drive_id!==undefined&&
            $scope.putIncidentalList.personal_loan!== "" &&$scope.putIncidentalList.social_fee!== ""
            &&$scope.putIncidentalList.meals_fee!== "" &&$scope.putIncidentalList.other_fee!== "" ){
            var obj = {
                "userId": userId,
                "driveId":$scope.putIncidentalList.drive_id,
                "yMonth": $scope.putIncidentalList.y_month,
                "personalLoan": $scope.putIncidentalList.personal_loan,
                "socialFee": $scope.putIncidentalList.social_fee,
                "mealsFee": $scope.putIncidentalList.meals_fee,
                "otherFee": $scope.putIncidentalList.other_fee
            };
            _basic.put($host.api_url + "/user/" + userId+"/driveSundryFee/" +  $scope.id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    $('#putItem').modal('close');
                    getIncidentalData();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    }






    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getIncidentalData();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getIncidentalData();
    };


    //获取数据
    function queryData() {
        getDriveNameList();
        getIncidentalData();
    }
    queryData()




}])