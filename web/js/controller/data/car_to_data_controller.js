/**
 * Created by ASUS on 2017/6/9.
 */

app.controller("car_to_data_controller", ['$rootScope','$scope','$location','$q',"$host",'_basic','_socket',

    function($rootScope,$scope,$location,$q,$host,_basic ,_socket ) {
        var userId = _basic.getSession(_basic.USER_ID);
        var userType = _basic.getSession(_basic.USER_TYPE);
        $scope.x=0;
        $scope.templateBox=true;
        $scope.success_data_box=false;
        $scope.dataBox=false;


        // $scope.$apply(function () {
        //     $scope.obj={
        //         "width":$scope.x+"%"
        //     };
        // });

        $scope.csvFile = null;
        $scope.rightNumber = 0;
        $scope.errorNumber = 0;
        // $scope.upload = function(dom,val){
        //     console.log($scope.csvFile);
        // };
        $scope.update = function(){
            _basic.setCookie('url',"jiangsen");
        };
        $scope.update();
        $scope.tableHeader =[];

        $scope.fileType="";
        // 表头原始数据
        $scope.tableHeadeArray=[];
        // 主体原始错误数据
        $scope.tableContentErrorFilter=[];
        // 主体原始成功数据
        $scope.tableContentFilter=[];
        // 过滤条件数据
        // $scope.filterArray=[1,2,3,4,5,6,7,8,9];
        var colObjs =[{name:'VIN',type:'string',length:16,require:true},{name:'制造商ID',type:'number',length:2,require:true},{name:'起始地ID',type:'number',length:2,require:true},{name:'目的地ID',type:'number',length:2},{name:'经销商ID',type:'number',length:3},{name:'委托方(结算公司ID)',type:'number',length:2},{name:'指令时间',type:'string'}];
        // 头部条件判断
        $scope.titleFilter=function (headerArray){
            if(colObjs.length!=headerArray.length){
                return false;
            }else {
                for(var i in headerArray){
                    if(colObjs[i].name!=headerArray[i]){
                        return false
                    }
                }
            }
        };
        // 主体条件判断
        $scope.ContentFilter=function (contentArray){

            for(var i=0;i<contentArray.length;i++){
                var flag=true;
                var isNumber;
                for(var j=0;j<colObjs.length;j++){
                    //check required
                    if(colObjs[j].require){
                        if(contentArray[i][j]==null &&contentArray[i][j].length==0){
                            $scope.errorNumber=$scope.errorNumber+1;
                            $scope.tableContentErrorFilter.push(contentArray[i]);
                            flag=false;
                            break;
                        }
                    }
                    //check type
                    // console.log(isNaN(contentArray[i][j]));
                    if(isNaN(contentArray[i][j])){
                        isNumber="string"
                    }else {
                        isNumber="number"
                    }
                    if(colObjs[j].type!=isNumber){
                        $scope.errorNumber=$scope.errorNumber+1;
                        $scope.tableContentErrorFilter.push(contentArray[i]);
                        flag=false;
                        break;
                    }
                    //check length
                    if((colObjs[j].length&&colObjs[j].length!=contentArray[i][j].length)){
                        $scope.errorNumber=$scope.errorNumber+1;
                        $scope.tableContentErrorFilter.push(contentArray[i]);
                        flag=false;
                        break;
                    }

                }
                if(flag==true){
                    $scope.rightNumber=$scope.rightNumber+1;
                    $scope.tableContentFilter.push(contentArray[i]);
                }

            }



            // }
            // swal("错误条数"+ $scope.tableContentErrorFilter.length);

        };

        $scope.fileUpload=function () {
            _basic.formPost($("#file_upload_form"), $host.file_url + '/user/'+ userId + '/file?fileType=1&&userType='+userType, function (data) {
                if(data.success==true){
                    $scope.file_id=data.result.id;
                    var originArrayLength = $scope.tableContentFilter.length;
                    var soket_data=function () {
                        if( $scope.tableContentFilter &&  $scope.tableContentFilter.length>0){
                            var carItem =  $scope.tableContentFilter[ $scope.tableContentFilter.length-1];
                            _socket.uploadCarInfo($scope.file_id,carItem,$scope.tableContentFilter.length-1,function(msg){
                                var msgContent =msg.mcontent;
                                if(msgContent.success){
                                    $scope.tableContentFilter.splice($scope.tableContentFilter.length-1,1);
                                    // console.log(originArrayLength)
                                    $scope.x = $scope.x + 100/originArrayLength;
                                    $scope.$apply(function () {
                                        $scope.obj = {
                                            "width": $scope.x + "%"
                                        };
                                    });
                                    soket_data();

                                }else{
                                    swal(msgContent.msg);
                                    return;
                                }
                            })
                        }else{
                            swal("上传成功","","success");
                            return;
                        }
                    };
                    soket_data();

                }
            });
        };
        $scope.fileChange = function(file){
            // 表头原始数据
            $scope.tableHeadeArray=[];
            // 主体原始错误数据
            $scope.tableContentErrorFilter=[];
            // 主体原始成功数据
            $scope.tableContentFilter=[];
            $scope.rightNumber=0;
            $scope.errorNumber=0;
            $(file).parse({
                config: {
                    complete: function(result){
                        $scope.$apply(function (){

                            if($scope.fileType!="application/vnd.ms-excel"){
                                swal("文件类型错误");
                            }else {
                                $scope.tableHeadeArray=result.data[0];
                                // console.log($scope.tableHeadeArray);
                                // console.log(result.data.slice(1,result.data.length));
                                // console.log(result.data[0]);

                                $scope.templateBox=false;
                                // 表头校验
                                 if($scope.titleFilter($scope.tableHeadeArray)!=false){
                                     // 主体内容校验
                                     var content_filter_array=result.data.slice(1, result.data.length);
                                     var con_line=[];
                                     // console.log(content_filter_array);
                                     // excel换行过滤
                                     for(var i=0;i<content_filter_array.length;i++){
                                         if (content_filter_array[i].length == 1 && content_filter_array[i][0] == "") {
                                           break;
                                         }else{
                                             con_line.push(content_filter_array[i]);
                                         }
                                     }
                                     $scope.ContentFilter(con_line);
                                     if($scope.tableContentErrorFilter.length==0){
                                         $scope.success_data_box=true;
                                         $scope.dataBox=false;
                                         swal("正确条数"+ $scope.tableContentFilter.length);
                                     }else {
                                         $scope.success_data_box=false;
                                         $scope.dataBox=true;
                                         swal("错误条数"+ $scope.tableContentErrorFilter.length);
                                     }
                                     $scope.tableHeader = result.data[0];
                                     }
                                else {
                                    swal("表头格式错误","","error")
                                }

                            }

                        });

                    }
                },
                before: function(file, inputElem)
                {
                    $scope.fileType=file.type;
                    // executed before parsing each file begins;
                    // what you return here controls the flow
                },
                error: function(err, file, inputElem, reason)
                {
                    console.log(err)
                },
                complete: function(val)
                {
                    // console.log(val)
                }
            })
        };
        // 单条数据录入
        $scope.new_data_list=function () {
            $scope.submitted = false;
            $('.tabWrap .tab').removeClass("active");
            $(".tab_box ").removeClass("active");
            $(".tab_box ").hide();
            $('.tabWrap .test1').addClass("active");
            $("#test1").addClass("active");
            $("#test1").show();
            // $scope.vin = "";
            // $scope.make_name = "";
            // $scope.model_name = "";
            // $scope.create_time = "";
            // $scope.car_color = "";
            // $scope.engineNum = "";
            // $scope.remark = "";
            // $scope.storage_name = "";
            // // 照片清空
            // $scope.imgArr = [];
            // // 车辆型号清空
            // $scope.carModelName = "";
            // // 存放位置清空
            // $scope.parkingArray = "";
            // $scope.colArr = "";
            // // "enterTime":$scope.enter_time,
            // $scope.parking_id = "";
            // $scope.plan_out_time = "";
            $(".modal").modal({
                height: 500
            });
            $("#newStorage_car").modal("open");
        };
        
        // 信息获取
        $scope.get_Msg=function () {
            // 城市
            _basic.get($host.api_url+"/city").then(function (data) {
                if(data.success==true){
                    $scope.get_city=data.result;
                }
            });
            // 车辆品牌
            _basic.get($host.api_url+"/carMake").then(function (data) {
                if(data.success==true){
                    $scope.get_carMake=data.result;
                }
            });
            // 经销商
            _basic.get($host.api_url+"/receive").then(function (data) {
                if(data.success==true){
                    $scope.get_receive=data.result;
                }
            });
            // 委托方
            _basic.get($host.api_url+"/entrust").then(function (data) {
                if(data.success==true){
                    $scope.get_entrust=data.result;
                }
            })
        };
        $scope.get_Msg();
        
        // 新增车辆信息
        $scope.new_submitForm=function (invalid) {
            var obj={
                "vin": $scope.vin,
                "makeId": $scope.car_brand.id,
                "makeName": $scope.car_brand.make_name,
                // "modelId": 0,
                // "modelName": "string",
                "routeStartId": $scope.start_city.id,
                "routeStart": $scope.start_city.short_name,
                "routeEndId": $scope.arrive_city.id,
                "routeEnd": $scope.arrive_city.short_name,
                "receiveId": $scope.client,
                "entrustId": $scope.dealer,
                "orderDate": $scope.arrival_time,
                // "colour": "string",
                // "engineNum": "string",
                "remark": "string"
            };
            console.log(obj);
            $scope.submitted=true;
            if(invalid){

                _basic.post($host.api_url+"/entrust",obj).then(function (data) {
                    if(data.success==true){

                    }
                })
            }
        }
    }]);