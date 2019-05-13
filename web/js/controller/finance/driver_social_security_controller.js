app.controller("driver_social_security_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var userType = _basic.getSession(_basic.USER_TYPE);
    $scope.size = 11;
    $scope.start = 0;
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
    $scope.importFile  ();

    $("#pre").hide();
    $("#next").hide();
    // monthPicker控件
    $('#start_month').MonthPicker({
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
        $scope.addStartMonth = year.toString()+month.toString();
    }
    getLastMonth();
    // 过滤条件数据
    var colObjs = [
        {name: '司机姓名', type: 'string',require: true},
        {name: '货车牌号', type: 'string',require: true},
        {name: '电话', type: 'number', require: true},
        {name: '月份', type: 'number', require: true},
        {name: '出勤天数', type: 'number', require: true}];
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
        _basic.formPost($("#file_upload_form"), $host.api_url + '/user/' + userId + '/driveWorkFile' , function (data) {
            if (data.success == true) {
                $scope.$apply(function () {
                    $scope.upload_error_array_num =data.result.failedCase;
                    $scope.orginData_Length=data.result.failedCase+data.result.successedInsert;
                    $scope.num=data.result.successedInsert;
                    $scope.local_isSuccesss = false;
                    $scope.upload_isSuccesss = true;
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


    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive?driveName=").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#addDrivderId').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#driveName').select2({
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
    $scope.changeDriver = function (driver) {
        _basic.get($host.api_url + "/drive?driveId=" + driver).then(function (data) {
            if (data.success == true) {
                if(data.result[0].truck_id!==undefined||data.result[0].truck_id!==null||data.result[0].truck_id!==''){
                    $scope.truckNum = data.result[0].truck_id;
                    getTruckNum();
                }
               else {
                    $scope.truckNum = data.result[0].truck_id='';
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    //获取货车牌号
    function getTruckNum() {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAllList = data.result;
                $('#truckNum').select2({
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


    // 单条数据录入
    $scope.new_data_list = function () {
        $scope.addDrivderId = null;
        $scope.driveNameList=[];
        $scope.truckNumListAllList=[];
        $scope.truckNum='';
        $scope.addWorkCount='';
        getDriveNameList();
        // monthPicker控件
        $('#add_start_month').MonthPicker({
            Button: false,
            MonthFormat: 'yymm'
        });
        getLastMonth();
        $(".modal").modal({
            height: 500
        });
        $("#new_driver_social_security").modal("open");
    };


    // 新增车辆信息
    $scope.addCarItem = function () {
        if($scope.truckNum!==''){
            _basic.get($host.api_url + "/truckBase?truckId=" + $scope.truckNum).then(function (data) {
                if (data.success == true) {
                    $scope.truckNumberName = data.result[0].truck_num;
                    addItem();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请输入完整信息！", "", "warning");
        }
    };

    function addItem(){
        if ($scope.addDrivderId!==''&&$scope.addStartMonth!==''&&$scope.addWorkCount!=='') {
            var obj = {
                "driveId": $scope.addDrivderId.id,
                "driveName": $scope.addDrivderId.drive_name,
                "truckId": $scope.truckNum,
                "truckNum": $scope.truckNumberName,
                "mobile": $scope.addDrivderId.mobile,
                "workCount": $scope.addWorkCount,
                "yMonth": $scope.addStartMonth
            };
            _basic.post($host.api_url + "/user/" + userId + "/driveWork", obj).then(function (data) {
                if (data.success == true) {
                    $("#new_driver_social_security").modal("close");
                    swal("新增成功！", "", "success");
                }
                else{
                    swal(data.msg, "", "error")
                }
            })
        }
        else{
            swal("请输入完整信息！", "", "warning");
        }
    }

    //修改
    $scope.putSecurity = function(id){
        $scope.driveSocialSecurityId =id;
        _basic.get($host.api_url + "/driveWork?driveWorkId="+id).then(function (data) {
            if (data.success == true) {
                $scope.socialSecurity = data.result[0];
                $scope.socialSecurity.total=data.result[0].drive_name+"    "+data.result[0].mobile;

            } else {
                swal(data.msg, "", "error");
            }
        })
        $("#put_driver_social_security").modal("open");
    }
    $scope.putCarItem =function (){
        _basic.put($host.api_url + "/user/" + userId + "/driveWork/" + $scope.driveSocialSecurityId, {
            workCount:$scope.socialSecurity.work_count
        }).then(function (data) {
            if (data.success == true) {
                swal("修改成功", "", "success");
                $('#put_driver_social_security').modal('close');
                getData();
            } else {
                swal(data.msg, "", "error");
            }
        })
    }

    //查询功能
    $scope.searchList = function (){
        $scope.start = 0;
        getData();
    };

    //获取查询数据
    function getData(){
        $scope.startMonth = $('#start_month').val();
        // 基本检索URL
        var url = $host.api_url + "/driveWork?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditions = _basic.objToUrl({
            driveId:$scope.driveName,
            yMonth:$scope.startMonth
        });
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {
                $scope.boxArray = data.result;
                $scope.securityList = $scope.boxArray.slice(0, 10);
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
    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getData();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getData();
    };



    getDriveNameList ();
    getTruckNum();
}])