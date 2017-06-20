/**
 * Created by lingxue on 2017/6/5.
 */
baseService.factory('_socket',['$http','$location','$q',"$cookies","$host","_basic",function($http,$location,$q,$cookies,$host,_basic){
    var _this = {};
    var ws = null ;
    var carArray = [];
    var carFileId = "";
    _this.msgToJson = function (message) {
        try {
            return JSON.parse(message);
        } catch(error) {
            console.log('method:msgToJson,error:' + error);
            return null;
        }
    };
    _this.parseMsgContent = function (msg) {
        var msgObj = _this.msgToJson(msg);
        if(msgObj==null || msgObj.mcontent == null){
            return null;
        }else {
            return msgObj.mcontent;
        }
    };
    _this.processSystem = function(msgContentObj) {
        // var type=_basic.getSession(_basic.USER_TYPE);
        if(msgContentObj.status ==0){
            swal({
                title: "错误",
                text: msgContentObj.msg,
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            },function(){
                window.location.href = '/common_login.html';
            });
            //
        }

    };
    _this.acknowledgeUpload = function(msgObj){
        var carLength = carArray.length;


        uploadCarList();
        /*if(carArray.length>0 ){
            if(msgObj.mcontent.success){
                uploadCarList();
            }else{
                swal(msgObj.mcontent.msg);
            }
        }*/
    }
    _this.dispatchMsg = function (message){
        var msgObj = _this.msgToJson(message.data);
        console.log(msgObj);
        switch (msgObj.mtype){
            case 0 ://system leve message
                _this.processSystem(msgObj.mcontent);
                break;
            case 4 : //upload repeat list
                _this.acknowledgeUpload(msgObj);
                break;
            default :
                break;
        }
    };
    _this.getConnectMsg = function(user) {
        /*user = {
            id : 10001,
            name: "user2",
            type :2
        }*/
        var msg ={
            mid : user.id+"_"+ new Date().getTime(),
            mtype : 2,
            mcontent : user
        };
        return msg;
    };

    _this.getUploadMsg = function(uploadObj,index) {
        var msg ={
            mid : carFileId+"_"+ index,
            mtype : 4,
            mcontent : uploadObj
        };
        return msg;
    }
    _this.initCarArray = function (carList,fileId){
        carArray = carList;
        carFileId = fileId;
        _this.uploadCarList({init:true});
    }
    _this.uploadCarList = function(msgRes){
        var carLength = carArray.length;

        if(msgRes.success){
            if(!msgRes.init&&carArray.length>0){
                carArray.splice(carArray.length-1,1);
            }
            if(ws && ws.readyState ==1){
                console.log(carLength)
                if(carLength>0){

                    var carParams ={
                        uploadId:carFileId,
                        vin : carArray[carLength-1][0],
                        makeId : carArray[carLength-1][1],
                        routeStartId : carArray[carLength-1][2],
                        routeEndId : carArray[carLength-1][3],
                        receiveId : carArray[carLength-1][4],
                        entrustId : carArray[carLength-1][5],
                        orderDate : carArray[carLength-1][6]
                    };

                    ws.send(JSON.stringify(getUploadMsg(carParams,carLength-1)));
                }else{
                    return {complete:true}
                }
            }else{
                swal("与服务器断开连接");
                return {complete:true};
            }
        }else{
            swal(msgRes.msg);
            return {complete:false}
        }


    }

    _this.sendMsg = function(msgObj){
        var msgString = JSON.stringify(msgObj);
        if(msgString && msgString.length>0){
            ws.send(msgString);
        }
    };
    _this.connectSocket = function(user) {
        if(ws){
            return;
        }else{
            ws =  new WebSocket($host.socket_url);

            ws.onmessage = function(message){
                _this.dispatchMsg(message);

            };
            ws.onopen = function(event) {
                var msgObj = _this.getConnectMsg(user);
                _this.sendMsg(msgObj);
                return;
            };
            return;

        }
    };
    return _this;
}]);
