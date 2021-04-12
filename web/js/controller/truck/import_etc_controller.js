app.controller("import_etc_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var userType = _basic.getSession(_basic.USER_TYPE);
    $scope.importedFilesList=[];
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

    // 过滤条件数据
    var colObjs = [
        {name: '编号', type: 'string',require: false},
        {name: '车牌号', type: 'string',require: true},
        {name: '费用', type: 'number', require: true},
        {name: '时间', type: 'string', require: true},
        {name: '描述', type: 'string', require: true}];
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
        _basic.formPost($("#file_upload_form"), $host.file_url + '/user/' + userId + '/file?fileType=2&&userType=' + userType, function (data) {
            if (data.success == true) {
                $scope.file_id = data.result.id;
                getLocalFile($scope.file_id);
            }
        });
    };
    function  getLocalFile(id){
        _basic.formPost($("#file_upload_form"), $host.api_url + '/user/' + userId + '/truckEtcFile?uploadId='+id , function (data) {
            if (data.success == true) {
                $scope.$apply(function () {
                    $scope.upload_error_array_num =data.result.failedCase;
                    $scope.orginData_Length=data.result.failedCase+data.result.successedInsert;
                    $scope.num=data.result.successedInsert;
                    $scope.local_isSuccesss = false;
                    $scope.upload_isSuccesss = true;
                  $("#buttonImport").attr("disabled",true);
                    swal('正确:'+$scope.num+'错误:'+$scope.upload_error_array_num,"", "success")
                });

            }
            else {
              $("#buttonImport").attr("disabled",true);
                swal(data.msg, "", "error");
            }
        });
    }

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

    function getDriveNameList () {
        _basic.get($host.api_url + "/drive?driveName=").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#driveName').select2({
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

    //获取货车牌号
    function getTruckNum() {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAllList = data.result;
                $('#truckId').select2({
                    placeholder: "货车牌号",
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $('#truckNum').select2({
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



    //查询按钮相关
    function getETCList () {
        if (( $scope.createdOnStart == undefined && $scope.createdOnEnd == undefined&&$scope.startDate == undefined && $scope.endDate == undefined)||
            ( $scope.createdOnStart == '' && $scope.createdOnEnd == ''&&$scope.startDate == '' && $scope.endDate == '')){
            swal('请输入完整的时间范围', "", "error");
        }
        else{
            _basic.get($host.api_url + "/truckEtc?"+ _basic.objToUrl({
                truckId:  $scope.truckId,
                driveId:  $scope.driveName,
                etcDateStart: $scope.startDate,
                etcDateEnd: $scope.endDate,
                createdOnStart:$scope.createdOnStart,
                createdOnEnd:$scope.createdOnEnd,
                paymentType:$scope.paymentType,
                paymentStatus:$scope.paymentStatus,
                start:$scope.start,
                size:$scope.size
            })).then(function (data) {
                if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.importedFilesList = $scope.boxArray.slice(0, 10);
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


            _basic.get($host.api_url + "/truckEtcFeeCount?"+ _basic.objToUrl({
                truckId:  $scope.truckId,
                driveId:  $scope.driveName,
                paymentType:$scope.paymentType,
                paymentStatus:$scope.paymentStatus,
                etcDateStart: $scope.startDate,
                etcDateEnd: $scope.endDate,
                createdOnStart:$scope.createdOnStart,
                createdOnEnd:$scope.createdOnEnd
            })).then(function (data) {
                if (data.success === true) {

                    $scope.boxArrayEtc = data.result[0].etc_fee;
                }

            })
        }
    };

    // 点击搜索
    $scope.searchETCList = function () {
        $scope.start=0;
        getETCList();
    };


    $scope.export = function () {

        if (($scope.createdOnStart == undefined && $scope.createdOnEnd == undefined && $scope.startDate == undefined && $scope.endDate == undefined) ||
            ($scope.createdOnStart == '' && $scope.createdOnEnd == '' && $scope.startDate == '' && $scope.endDate == '')) {
            swal('请输入完整的时间范围', "", "error");
        }
        else {

            // 基本检索URL
            var url = $host.api_url + "/truckEtc.csv?";
            // 检索条件

            var conditions = _basic.objToUrl({
                paymentType:$scope.paymentType,
                paymentStatus:$scope.paymentStatus,
                truckId: $scope.truckId,
                driveId: $scope.driveName,
                etcDateStart: $scope.startDate,
                etcDateEnd: $scope.endDate,
                createdOnStart: $scope.createdOnStart,
                createdOnEnd: $scope.createdOnEnd
            });
            // 检索URL
            url = conditions.length > 0 ? url + "&" + conditions : url;
            window.open(url);
        }

    }
      $scope.changeDriver = function (driver) {
          $scope.truckNumListAllList=[];
          $scope.truckNum='';
           _basic.get($host.api_url + "/drive?driveId=" + driver).then(function (data) {
               if (data.success == true) {
                   if(data.result.length==0){
                       $scope.truckNum='';
                   }
                   else {
                       if(data.result[0].truck_id!==undefined||data.result[0].truck_id!==null||data.result[0].truck_id!==''){
                           $scope.truckNum = data.result[0].truck_id;
                           getTruckNum();
                       }
                       else {
                           $scope.truckNum = data.result[0].truck_id='';
                       }
                   }

               }
               else {
                   swal(data.msg, "", "error");
               }
           });
       }
    // 单条数据录入
    $scope.new_data_list = function () {
        $scope.addDrivderId = null;
        $scope.driveNameList=[];
        $scope.truckNumListAllList=[];
        $scope.truckNum='';
        $scope.addCount='';
        $scope.addnumber='';
        $scope.hasLoan ='';
        $scope.happenTime='';
        $scope.remark='';
        getDriveNameList();
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

        if ($scope.addDrivderId!==''&&$scope.truckNum!==''&&$scope.addCount!==''&&
            $scope.addCount!==null&&$scope.happenTime!==''&&$scope.happenTime!==undefined&&$scope.hasLoan!=='') {
            var obj = {
                "number":$scope.addnumber,
                "driveId": $scope.addDrivderId.id,
                "driveName": $scope.addDrivderId.drive_name,
                "truckId": $scope.truckNum,
                "truckNum": $scope.truckNumberName,
                "etcFee": $scope.addCount,
                "etcDate": $scope.happenTime,
                "remark":   $scope.remark,
                "paymentType":$scope.hasLoan
            };
            _basic.post($host.api_url + "/user/" + userId + "/truckEtc", obj).then(function (data) {
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
   /*  // 判断是否允许输入财务借款
      $scope.checkHasLoan = function () {
          if($scope.hasLoan == 1){
              $scope.hasLoanType = false;
          }
          else{
              $scope.addCount = 0;
              $scope.hasLoanType = true;
          }
      };
*/

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getETCList();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getETCList();
    };


    getTruckNum();
    getDriveNameList ();
}])