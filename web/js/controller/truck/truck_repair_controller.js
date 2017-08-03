/**
 * Created by ASUS on 2017/8/2.
 */
app.controller("truck_repair_controller", ["$scope","$state","$stateParams","_basic", "_config", "$host", function ($scope,$state,$stateParams,_basic, _config, $host) {
    var userId=_basic.getSession(_basic.USER_ID);
    $scope.truck_guarantee_id=$stateParams.id;
    $scope.truck_type=$stateParams.type;
    $scope.truck_status=$stateParams.status;
    $scope.repair_btn=true;

    $scope.return=function() {
        $state.go($stateParams.from,{reload:true});
    };
    $scope.over_repair=function (repair_reason,id) {
        $(".modal").modal();
        $("#put_repair_details").modal("open");
        $scope.repair_remark="";
        $scope.repair_money="";
        $stateParams.id="";

        $scope.repair_reason=repair_reason;
        $scope.relId=id;

    };
    $scope.add_maintain=function (){
        $scope.nowDate=moment(new Date()).format("YYYY-MM-DD");
        $(".modal").modal();
        $("#add_maintain").modal("open");
        $stateParams.id="";
        $scope.maintain_msg="";
    };

    $scope.search_maintain=function () {
        _basic.get($host.api_url+"/truckRepairRel?truckId="+$scope.truck_guarantee_id).then(function (data) {
            if(data.success==true&&data.result.length>0){
                $scope.main_now_reason=data.result[0];
                if($scope.main_now_reason.repair_status==0){
                    $scope.now_maintain_show=true;
                    $scope.repaire_btn=false;
                    $scope.main_reason=data.result.slice(1,data.result.length);
                }else {
                    $scope.main_reason=data.result;
                    $scope.now_maintain_show=false;
                    $scope.repaire_btn=true;
                }
                // if(data.result[0].repair_type==0){
                //     $scope.repaire_btn=false;
                // }else {
                //     $scope.repaire_btn=true;
                // }
            }else {
                $scope.repaire_btn=true;
            }
        });
    };
    $scope.search_maintain();
    // 增加维修原因
    $scope.maintainForm=function (iValid) {
        $scope.main_submitted=true;
        var obj={
            "driveId":  $scope.drive_id,
            "driveName":  $scope.drive_name,
            "repairReason": $scope.maintain_msg,
        };

        if(iValid){
            _basic.post($host.api_url+"/user/"+userId+"/truck/"+$scope.truck_guarantee_id+"/truckRepairRel",_basic.removeNullProps(obj)).then(function (data) {
                if(data.success==true){
                    $("#add_maintain").modal("close");
                    $scope.main_submitted = false;
                    $scope.search_maintain();
                }else {
                    swal(data.msg,"","error")
                }
            });
        }

    };
    // 增加维修描述
    $scope.repair_remarkForm=function (iValid) {
        $scope.put_repair_submitted=true;
        if(iValid){
            _basic.put($host.api_url+"/user/"+userId+"/truckRepairRel/"+ $scope.relId,{
                "remark": $scope.repair_remark,
                "repairMoney":$scope.repair_money
            }).then(function (data) {
                if(data.success==true){
                    $("#put_repair_details").modal("close");
                    $scope.put_repair_submitted = false;
                    $scope.search_maintain();
                }else {
                    swal(data.msg,"","error")
                }
            });
        }
    };
    // 关闭增加维修记录
    $scope.close_insure=function () {
        $("#add_maintain").modal("close");
        $scope.main_submitted = false;
    };
    // 关闭维修描述
    $scope.close_put_repair_details=function () {
        $("#put_repair_details").modal("close");
        $scope.put_repair_submitted = false;
    };
    
    if($scope.truck_type==1){
        _basic.get($host.api_url+"/truckFirst?truckId="+$scope.truck_guarantee_id).then(function (data) {
            if(data.success==true){
                $scope.truck_msg=data.result[0];
                $scope.drive_name=$scope.truck_msg.drive_name;
                $scope.drive_id=$scope.truck_msg.drive_id;
            }else {
                swal(data.msg,"","error")
            }
        });
    }else if($scope.truck_type==2){
        _basic.get($host.api_url+"/truckTrailer?truckId="+$scope.truck_guarantee_id).then(function (data) {
            if(data.success==true){
                $scope.truck_msg=data.result[0];
            }else {
                swal(data.msg,"","error")
            }
        });
    }


}]);