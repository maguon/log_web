/**
 * Created by ASUS on 2017/7/26.
 */
app.controller("add_truck_guarantee_controller", ["$scope","$state","$stateParams","_basic", "_config", "$host", function ($scope,$state,$stateParams,_basic, _config, $host) {
    var userId=_basic.getSession(_basic.USER_ID);
    $scope.nowDate=moment(new Date()).format("YYYY-MM-DD");
    $scope.return=function () {

        $state.go($stateParams.from,{id:$stateParams.id,from:$stateParams._from})
    };
    _basic.get($host.api_url+"/truckInsure").then(function (data) {
        if(data.success==true){
            $scope.truckInsure_company=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });
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
                   $state.go($stateParams.from,{id:$stateParams.id,from:$stateParams._from})
                }else {
                    swal(data.msg,"","error")
                }
            });
        }
    }

}]);