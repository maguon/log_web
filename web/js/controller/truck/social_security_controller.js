
/**
 * 主菜单：车辆管理 -> 司机社保 控制器
 */

app.controller("social_security_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_basic", "_config", function ($scope,$rootScope,$state,$stateParams, $host, _basic,_config) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 翻页用
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



    //司机社保信息
    $scope.newSocialSecurity ={};


    //新增司机社保  默认数据
    var defaultSocialSecurity = {
        //司机ID
        driveId:  '',
        //司机名字
        driveName: '',
        //电话号
        mobile: '',
        //年月
        yMonth: '',
        //金额
        socialSecurityFee:0
    };



    //月份格式
    $('#start_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });



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
    }




    /**
     * 获取司机
     */
    function getDriver () {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#driveName').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#newDriver').select2({
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



    // 过滤条件数据
    var colObjs = [
        {name: '司机姓名', type: 'string',require: true},
        {name: '电话', type: 'number',require: true},
        {name: '月份', type: 'number', require: true},
        {name: '社保费', type: 'number', require: true}];
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
        _basic.formPost($("#file_upload_form"), $host.api_url + '/user/' + userId + '/driveSocialSecurityFile' , function (data) {
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




    //查询功能
    $scope.searchList = function (){
        $scope.start = 0;
        getData();
    };

    //获取查询数据
    function getData(){
        if( $('#start_month').val()!==''){
            $scope.startMonth = $('#start_month').val();
        }

        // 基本检索URL
        var url = $host.api_url + "/driveSocialSecurity?start=" + $scope.start + "&size=" + $scope.size;
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


    /**
     * 数据导出
     */
    $scope.export = function (){
        // 基本检索URL
        var url = $host.api_url + "/driveSocialSecurity.csv";
        // 检索条件
        var conditions = _basic.objToUrl({
            driveId:$scope.driveName,
            yMonth:$scope.startMonth
        });
        // 检索URL
        url = conditions.length > 0 ? url + "?" + conditions : url;
        // 调用接口下载
        window.open(url);
    }

    /**
     *
     * 点击添加按钮
     */
    $scope.openSocialSecurity = function (){

        //清除缓存数据
        $scope.driveNameList=[];
        getDriver();

        $('#add_start_month').MonthPicker({
            Button: false,
            MonthFormat: 'yymm'
        });
        getLastMonth();

        $('.modal').modal();
        $('#newCost').modal('open');

        // 初期化数据
        angular.copy(defaultSocialSecurity, $scope.newSocialSecurity);

    }



    /*
    * 提交新增信息
    * */
    $scope.addCostItem = function () {
        if($('#add_start_month').val()!==''){
            $scope. newSocialSecurity.yMonth = $('#add_start_month').val();
        }

        if( $scope.newSocialSecurity.yMonth==''|| $scope.newSocialSecurity.driver==undefined|| $scope.newSocialSecurity.driver==''||
           $scope.newSocialSecurity.socialSecurityFee==null){
            swal('请输入完整信息', "", "error")
        }
        else {
            _basic.post($host.api_url + "/user/" + userId + "/driveSocialSecurity", {
                driveId: $scope.newSocialSecurity.driver.id,
                driveName:$scope.newSocialSecurity.driver.drive_name,
                mobile:$scope.newSocialSecurity.driver.mobile,
                yMonth:$scope.newSocialSecurity.yMonth,
                socialSecurityFee: $scope.newSocialSecurity.socialSecurityFee
            }).then(function (data) {
                if (data.success == true) {
                    $('#newCost').modal('close');
                    swal("新增成功", "", "success");
                    getData();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };




    /**
     * 打开画面【修改费用申请】模态框。
     *
     */
    $scope.openEditSocial = function (id){
        $scope.socialSecurityId=id;
        _basic.get($host.api_url+ '/driveSocialSecurity?socialSecurityId='+id).then(function (data) {
            if (data.success === true&&data.result.length > 0) {

                $(".modal").modal();
                $('#editCost').modal('open');

                $scope.putList = data.result[0];
            }
            else {
                swal(data.msg, "", "error");
            }
        });

    }



    /**
     * 修改社保金额
     */
    $scope.saveSocial = function (){

        //必填条件
        if($scope.putList.social_security_fee !== null&&$scope.putList.social_security_fee !=='' ){

            _basic.put($host.api_url + "/user/" + userId + "/socialSecurity/"+$scope.socialSecurityId,{
                "socialSecurityFee": $scope.putList.social_security_fee
            }).then(function (data) {
                if (data.success === true) {
                    $('#editCost').modal('close');
                    swal("修改成功", "", "success");
                    getData();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    }









    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getData();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getData();
    };

    getLastMonth();
    getDriver ();
    getData();



}]);