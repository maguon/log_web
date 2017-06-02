/**
 * Created by jiangsen on 2017/4/11.
 */
var common_login_controller=angular.module("common_login_controller",[]);
common_login_controller.controller("common_login_controller", ['$rootScope','$scope','$location','$q',"_basic","$host","_config",

    function($rootScope,$scope,$location,$q,_basic,$host,_config){
            $scope.username='';
            $scope.password='';
            $scope.login = function(){

            if($scope.username==''||$scope.username==''){
                swal("账号或密码不能为空", "", "error");
            } else {
                $(".shadeDowWrap").show();
                _basic.post($host.api_url+"/userLogin", {
                    "mobile": $scope.username,
                    "password": $scope.password
                }).then(function(data){
                    $(".shadeDowWrap").hide();
                    if(data.success==true){
                        _basic.setSession(_basic.USER_AUTH_NAME,data.result.accessToken);
                        _basic.setSession(_basic.USER_ID,data.result.userId);
                        _basic.setSession(_basic.USER_STATUS,data.result.userStatus);
                        _basic.setSession(_basic.USER_TYPE,data.result.type);
                        _basic.setHeader(_basic.USER_TYPE, data.result.type);
                        _basic.setHeader(_basic.COMMON_AUTH_NAME, data.result.accessToken);
                        // 判断user_type控制页面调到某个模块
                        if(data.result.type==_config.userTypes.storageUser.type){
                            window.location.href="storage_home.html";
                        }
                        if(data.result.type==_config.userTypes.dispatch.type){
                            window.location.href="dispatch_home.html";
                        }
                        if(data.result.type==_config.userTypes.international_trade.type){
                            window.location.href="trade_home.html";
                        }
                    }else {
                        swal(data.msg,"","error");
                    }
                }).catch(function(error){
                    swal("登录异常", "", "error");
                    console.log(error)
                });
            }

        };
        console.log('Login Controller Init !');
    }]);
