/**
 * Created by ASUS on 2017/6/9.
 */

app.controller("car_to_data_controller", ['$rootScope','$scope','$location','$q',"$host",'_basic',

    function($rootScope,$scope,$location,$q,$host,_basic ) {
        var userId = _basic.getSession(_basic.USER_ID);
        var userType = _basic.getSession(_basic.USER_TYPE);
        $scope.x=1;




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
        var colObjs =[{name:'VIN',type:'string',length:17,require:true},{name:'制造商ID',type:'number',length:2,require:true},{name:'起始地ID',type:'number',length:2,require:true},{name:'目的地ID',type:'number',length:2},{name:'经销商ID',type:'number',length:3},{name:'委托方(结算公司ID)',type:'number',length:2},{name:'指令时间',type:'string'}];
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
            swal("错误条数"+ $scope.tableContentErrorFilter.length);

        };

        $scope.fileUpload=function ($event) {
            _basic.formPost($event.target.parentElement.parentElement, $host.file_url + '/user/'+ userId + '/file?fileType=1&&userType='+userType, function (data) {
                if(data.success==true){
                    $scope.file_id=data.result.id;
                    var length=$scope.tableContentFilter.length;
                    for(var i=0;i<length;i++){
                        console.log($scope.tableContentFilter[i]);
                            $scope.x = $scope.x + 100 /length;
                            $scope.$apply(function () {
                                $scope.obj = {
                                    "width": $scope.x + "%"
                                };
                            });
                                if( $scope.x==101){
                                    swal("上传成功","","success")
                                }
                            }
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
                                console.log($scope.tableHeadeArray);
                                // console.log(result.data.slice(1,result.data.length));
                                // console.log(result.data[0]);

                                // 表头校验
                                 if($scope.titleFilter($scope.tableHeadeArray)!=false){
                                     // 主体内容校验
                                     var content_filter_array=result.data.slice(1, result.data.length);
                                     var con_len=[];
                                     console.log(content_filter_array);
                                     for(var i=0;i<content_filter_array.length;i++) {
                                         if (content_filter_array[i].length == 1 && content_filter_array[i][0] == "") {
                                           break;
                                         }else{
                                             con_len.push(content_filter_array[i]);
                                         }
                                     }
                                     $scope.ContentFilter(con_len);
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

        console.log('Data Controller Init !')
    }]);