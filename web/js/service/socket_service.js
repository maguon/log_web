/**
 * Created by lingxue on 2017/6/5.
 */
baseService.factory('_socket',['$http','$location','$q',"$cookies","$host",function($http,$location,$q,$cookies,$host){
    var _this = {};
    var ws = null ;
    _this.msgToJson = function (message) {
        try {
            return JSON.parse(message);
        } catch(error) {
            console.log('method:msgToJson,error:' + error);
            return null;
        }
    }
    _this.parseMsgContent = function (msg) {
        var msgObj = _this.msgToJson(msg)
        if(msgObj==null || msgObj.mcontent == null){
            return null;
        }else {
            return msgObj.mcontent;
        }
    }
    _this.processSystem = function(msgContentObj) {
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

    }
    _this.dispatchMsg = function (message){
        var msgObj = _this.msgToJson(message.data);
        console.log(msgObj);
        switch (msgObj.mtype){
            case 0 ://system leve message
                _this.processSystem(msgObj.mcontent);
                break;
            case 4 : //clients list
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
        }
        return msg;
    };
    _this.sendMsg = function(msgObj){
        var msgString = JSON.stringify(msgObj);
        if(msgString && msgString.length>0){
            ws.send(msgString);
        }
    }
    _this.connectSocket = function(user) {
        if(ws){
            return;
        }else{
            ws =  new WebSocket($host.socket_url);

            ws.onmessage = function(message){
                _this.dispatchMsg(message);

            }
            ws.onopen = function(event) {
                var msgObj = _this.getConnectMsg(user);
                _this.sendMsg(msgObj);
                return;
            }
            return;

        }
    };
    return _this;
}]);
