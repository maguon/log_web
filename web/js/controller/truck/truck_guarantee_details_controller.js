/**
 * Created by ASUS on 2017/7/26.
 */
app.controller("truck_guarantee_details_controller", ["$scope","$state","$stateParams","_basic", "_config", "$host", function ($scope,$state,$stateParams,_basic, _config, $host) {
    var userId=_basic.getSession(_basic.USER_ID);
    $scope.nowDate=moment(new Date()).format("YYYY-MM-DD");
    $scope.truck_guarantee_id=$stateParams.id;
    $scope.truck_type=$stateParams.type;
    console.log($scope.truck_type);
    $scope.return=function() {
        $state.go($stateParams.from,{reload:true});
    };
    $scope.add_insure=function (){
        $(".modal").modal();
        $("#add_insure").modal("open");
        $stateParams.id="";
        $scope.insurance_company="";
        $scope.insurance_list="";
        $scope.insurance_num="";
        $scope.insurance_money="";
        $scope.effective_date_start="";
        $scope.effective_date_end="";
    };
    // 关闭增加保单
    $scope.close_insure=function () {
        $("#add_insure").modal("close");
        $scope.submitted = false;
    };

    if($scope.truck_type==1){
        _basic.get($host.api_url+"/truckFirst?truckId="+$scope.truck_guarantee_id).then(function (data) {
            if(data.success==true){
                $scope.truck_msg=data.result[0];
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

    var get_guarantee=function () {
        _basic.get($host.api_url+"/truckInsureRel?truckId="+$scope.truck_guarantee_id).then(function (data) {
            if(data.success==true){
                $scope.truck_guarantee=data.result;
            }else {
                swal(data.msg,"","error")
            }
        });
        _basic.get($host.api_url+"/truckInsure").then(function (data) {
            if(data.success==true){
                $scope.truckInsure_company=data.result;
            }else {
                swal(data.msg,"","error")
            }
        });
    };
    get_guarantee();

    $scope.insuranceForm=function (isValid) {
        $scope.submitted = true;

        if (isValid) {
            var obj={
                "truckId":$stateParams.id,
                "insureId":$scope.insurance_company,
                "insureType":$scope.insurance_list,
                "insureNum":$scope.insurance_num,
                "insureMoney":$scope.insurance_money,
                "startDate":$scope.effective_date_start,
                "endDate":$scope.effective_date_end
            };
            _basic.post($host.api_url+"/user/"+userId+"/truckInsureRel",obj).then(function (data) {
                if(data.success==true){
                    swal("新增成功","","success");
                    get_guarantee();
                    $("#add_insure").modal("close");
                    $scope.submitted = false;
                }else {
                    swal(data.msg,"","error")
                }
            });
        }
    }

}]);