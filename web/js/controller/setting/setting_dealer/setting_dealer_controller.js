/**
 * Created by ASUS on 2017/6/7.
 */
app.controller("setting_dealer_controller",["$scope","_basic","_config","$host",function ($scope,_basic,_config,$host){
    $scope.contacts=[];
    $scope.addContacts=[];
    // $scope.city="";
    // 信息获取
    $scope.get_Msg=function () {
        // 城市
        _basic.get($host.api_url+"/city").then(function (data) {
            if(data.success==true){
                $scope.get_city=data.result;
            }
        });

    };

    $scope.get_Msg();
    // 城市-经销商联动
    $scope.get_dealer=function () {
        // 经销商下拉列表
        _basic.get($host.api_url+"/receive?cityId="+$scope.city).then(function (data) {
            if(data.success==true){
                $scope.get_receive=data.result;
            }
        });
    }
    // 搜索经销商
    $scope.search_dealer=function () {
        console.log($scope.s_dealer,$scope.city);
        // var obj;
        // if($scope.city){
             var obj={
                receiveId:$scope.s_dealer,
                cityId:$scope.city
            };
        // }else if($scope.s_dealer){
        //      obj={
        //         receiveId:$scope.s_dealer,
        //         cityId:null
        //     };
        // }else {
        //     obj={
        //         receiveId:null,
        //         cityId:null
        //     };
        // }

        _basic.get($host.api_url+"/receive?"+_basic.objToUrl(obj)).then(function (data) {
            if(data.success==true){
                $scope.setting_dealer=data.result;
                $scope.len=data.result.length;
                for(var i=0;i<data.result.length;i++){
                    $scope.contacts.push({
                        show:false
                    });
                    $scope.addContacts.push({
                        show:false
                    })
                }
            }
        })
    };
    // 电话号正则
    $scope.mobileReg=_config.mobileRegx;
    $scope.userId=_basic.getSession(_basic.USER_ID);
    $scope.contacts_name=[];
    // 初始数据
    _basic.get($host.api_url+"/receive").then(function (data) {
        if(data.success==true&&data.result.length>0){
                $scope.setting_dealer=data.result;
                $scope.len=data.result.length;
            for(var i=0;i<data.result.length;i++){
                $scope.contacts.push({
                    show:false
                });
                $scope.addContacts.push({
                    show:false
                })
            }

        }
    });
    $scope.get_contact=function (id,index) {
        _basic.get($host.api_url+"/receive/"+id+"/contacts").then(function (data) {
            if(data.success==true){
                $scope.setting_contacts=data.result;
                $scope.contacts_name="";
                $scope.duty="";
                $scope.phone="";
                $scope.addContacts[index]={
                    show:false
                };
            }
        });
    };
    // 打开选项卡
    $scope.view_contacts=function ($index,id) {

        if($scope.contacts[$index].show==false){
            for(var i=0;i<$scope.len;i++){
                $scope.contacts[i]={
                    show:false
                };
            }
            $scope.contacts[$index].show=true;
            $scope.get_contact(id);
        }else {
            $scope.contacts[$index].show=false;
        }


    };
    // 新增联系人卡片
    $scope.open_add_contacts=function ($index) {
        $scope.addContacts[$index]={
            show:true
        };
    };
    $scope.close_contacts=function ($index) {
        $scope.addContacts[$index]={
            show:false
        };
    };
    // 新增联系人
    $scope.add_contacts=function (iValid,id,index) {
        $scope.submitted=true;
        if(iValid){
            _basic.post($host.api_url+"/user/"+$scope.userId+"/receive/"+id+"/contacts",{
                "contactsName":$scope.contacts_name,
                "position": $scope.duty,
                "tel":$scope.phone
            }).then(function (data) {
                if(data.success==true){
                    $scope.get_contact(id);
                    $scope.submitted=false;
                }
            });
        }
    };
    // 删除联系人
    $scope.delete_contact=function (id,con_id) {
        _basic.delete($host.api_url+"/user/"+$scope.userId+"/receiveContacts/"+id).then(function (data) {
            if(data.success==true){
                $scope.get_contact(con_id);
            }
        });
    }
}]);